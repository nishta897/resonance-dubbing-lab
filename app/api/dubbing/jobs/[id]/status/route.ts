import { NextResponse } from "next/server";
import { refundJob } from "@/lib/credits";
import { AppError, jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { getDubbingExports, getDubbingStatus } from "@/lib/sarvam";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TERMINAL_FAILURES = new Set(["failed", "deleted"]);

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const sessionId = new URL(request.url).searchParams.get("sessionId");
    if (!sessionId) throw new AppError("A guest session is required.", 400, "SESSION_REQUIRED");

    let job = await prisma.dubbingJob.findFirst({
      where: { id: params.id, sessionId },
    });
    if (!job) throw new AppError("Dubbing job not found.", 404, "JOB_NOT_FOUND");

    if (["COMPLETED", "FAILED"].includes(job.status)) {
      const session = await prisma.session.findUnique({ where: { id: sessionId } });
      return NextResponse.json({ job, creditBalance: session?.credits ?? 0 });
    }
    if (!job.remoteJobId) {
      throw new AppError("Dubbing job has not reached Sarvam yet.", 409, "JOB_NOT_STARTED");
    }

    const live = await getDubbingStatus(job.remoteJobId);
    if (TERMINAL_FAILURES.has(live.status)) {
      job = (await refundJob(
        job.id,
        live.error_message || "Sarvam could not complete this dub.",
      )) as typeof job;
    } else if (live.status === "completed" || live.status === "partial_failure") {
      const exports = await getDubbingExports(job.remoteJobId);
      const video = exports.find(
        (item) =>
          item.target_language === job?.targetLanguage &&
          item.export_type === "video" &&
          item.status === "completed" &&
          !item.is_stale &&
          item.download_url,
      );
      const targetExports = exports.filter(
        (item) => item.target_language === job?.targetLanguage && item.export_type === "video",
      );
      const exportFailed = targetExports.some((item) => item.status === "failed");

      if (video?.download_url) {
        job = await prisma.dubbingJob.update({
          where: { id: job.id },
          data: {
            status: "COMPLETED",
            progress: 100,
            currentStep: "Dub ready",
            outputUrl: video.download_url,
            completedAt: new Date(),
          },
        });
      } else if (exportFailed) {
        job = (await refundJob(job.id, "Sarvam finished processing, but the video export failed.")) as typeof job;
      } else {
        job = await prisma.dubbingJob.update({
          where: { id: job.id },
          data: {
            status: "EXPORTING",
            progress: Math.max(92, live.progress || 0),
            currentStep: "Rendering final video",
          },
        });
      }
    } else {
      job = await prisma.dubbingJob.update({
        where: { id: job.id },
        data: {
          status: "PROCESSING",
          progress: Math.max(job.progress, Math.min(90, live.progress || 20)),
          currentStep: live.current_step_label || "Processing dub",
          errorMessage: live.error_message || null,
        },
      });
    }

    const session = await prisma.session.findUnique({ where: { id: sessionId } });
    return NextResponse.json({ job, creditBalance: session?.credits ?? 0 });
  } catch (error) {
    return jsonError(error);
  }
}
