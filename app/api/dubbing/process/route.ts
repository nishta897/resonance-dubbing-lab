import path from "node:path";
import { NextResponse } from "next/server";
import {
  ACCEPTED_EXTENSIONS,
  ACCEPTED_VIDEO_TYPES,
  env,
  LANGUAGE_CODES,
} from "@/lib/config";
import { creditsForDuration, refundJob } from "@/lib/credits";
import { AppError, jsonError } from "@/lib/http";
import { extractDetectionClip, probeDuration, withTempVideo } from "@/lib/media";
import { prisma } from "@/lib/prisma";
import {
  createDubbingJob,
  detectLanguage,
  startDubbingJob,
  uploadDubbingMedia,
} from "@/lib/sarvam";

export const runtime = "nodejs";
export const maxDuration = 300;

function formString(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function validateFile(value: FormDataEntryValue | null) {
  if (!(value instanceof File)) throw new AppError("Choose a video to upload.", 400, "FILE_REQUIRED");
  const extension = path.extname(value.name).slice(1).toLowerCase();
  if (!ACCEPTED_EXTENSIONS.has(extension) || (value.type && !ACCEPTED_VIDEO_TYPES.has(value.type))) {
    throw new AppError("Only MP4, MOV, and WebM videos are supported.", 415, "UNSUPPORTED_MEDIA_TYPE");
  }
  if (value.size <= 0) throw new AppError("The selected file is empty.", 422, "EMPTY_FILE");
  if (value.size > env.uploadLimitBytes) {
    throw new AppError(
      `The local demo limit is ${Math.round(env.uploadLimitBytes / 1024 / 1024)} MB.`,
      413,
      "FILE_TOO_LARGE",
    );
  }
  return value;
}

export async function POST(request: Request) {
  let localJobId: string | undefined;
  try {
    if (!env.sarvamApiKey) {
      throw new AppError(
        "Sarvam is not configured. Add SARVAM_API_KEY to .env and restart the app.",
        503,
        "SARVAM_NOT_CONFIGURED",
      );
    }
    const contentLength = Number(request.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > env.uploadLimitBytes + 1024 * 1024) {
      throw new AppError(
        `The local demo limit is ${Math.round(env.uploadLimitBytes / 1024 / 1024)} MB.`,
        413,
        "FILE_TOO_LARGE",
      );
    }
    const form = await request.formData();
    const file = validateFile(form.get("file"));
    const sessionId = formString(form, "sessionId");
    const requestedSource = formString(form, "sourceLanguage") || "auto";
    const targetLanguage = formString(form, "targetLanguage");
    const voiceMode = formString(form, "voiceMode") || "clone";

    if (!sessionId) throw new AppError("A guest session is required.", 400, "SESSION_REQUIRED");
    if (!LANGUAGE_CODES.has(targetLanguage as never)) {
      throw new AppError("Choose a supported target language.", 422, "INVALID_TARGET_LANGUAGE");
    }
    if (requestedSource !== "auto" && !LANGUAGE_CODES.has(requestedSource as never)) {
      throw new AppError("Choose a supported source language.", 422, "INVALID_SOURCE_LANGUAGE");
    }
    if (!new Set(["clone", "male", "female"]).has(voiceMode)) {
      throw new AppError("Choose a supported voice option.", 422, "INVALID_VOICE_MODE");
    }

    const result = await withTempVideo(file, async (inputPath, dir) => {
      const durationSec = await probeDuration(inputPath);
      const requiredCredits = creditsForDuration(durationSec);
      const sourceLanguage =
        requestedSource === "auto"
          ? await detectLanguage(await extractDetectionClip(inputPath, dir))
          : requestedSource;

      if (sourceLanguage === targetLanguage) {
        throw new AppError(
          "Source and target languages must be different.",
          422,
          "SAME_SOURCE_AND_TARGET",
        );
      }

      const job = await prisma.$transaction(async (tx) => {
        const debited = await tx.session.updateMany({
          where: { id: sessionId, credits: { gte: requiredCredits } },
          data: { credits: { decrement: requiredCredits } },
        });
        if (debited.count === 0) {
          const exists = await tx.session.count({ where: { id: sessionId } });
          throw new AppError(
            exists ? "Add credits to process this video." : "Guest session not found.",
            exists ? 402 : 404,
            exists ? "INSUFFICIENT_CREDITS" : "SESSION_NOT_FOUND",
          );
        }

        const created = await tx.dubbingJob.create({
          data: {
            sessionId,
            sourceLanguage,
            targetLanguage,
            voiceMode,
            fileName: file.name.slice(0, 180),
            fileSize: file.size,
            durationSec,
            creditsCharged: requiredCredits,
            status: "UPLOADING",
            progress: 8,
            currentStep: "Preparing secure upload",
          },
        });
        await tx.creditLog.create({
          data: {
            sessionId,
            jobId: created.id,
            amount: -requiredCredits,
            description: `Dubbed ${file.name} to ${targetLanguage}`,
          },
        });
        return created;
      });
      localJobId = job.id;

      const remote = await createDubbingJob({
        sourceLanguage,
        targetLanguage,
        fileName: file.name,
        voiceMode,
      });
      await prisma.dubbingJob.update({
        where: { id: job.id },
        data: {
          remoteJobId: remote.job_id,
          progress: 12,
          currentStep: "Uploading video to Sarvam",
        },
      });
      await uploadDubbingMedia(remote.upload_url, file);
      await startDubbingJob(remote.job_id);
      const updated = await prisma.dubbingJob.update({
        where: { id: job.id },
        data: {
          status: "PROCESSING",
          progress: 18,
          currentStep: "Queued for neural dubbing",
        },
      });
      const session = await prisma.session.findUnique({ where: { id: sessionId } });
      return { updated, sourceLanguage, session };
    });

    return NextResponse.json(
      {
        job: result.updated,
        detectedSourceLanguage: requestedSource === "auto" ? result.sourceLanguage : null,
        creditBalance: result.session?.credits ?? 0,
      },
      { status: 202 },
    );
  } catch (error) {
    if (localJobId) {
      const message = error instanceof Error ? error.message : "Dubbing could not be started.";
      await refundJob(localJobId, message).catch((refundError) => console.error(refundError));
    }
    return jsonError(error);
  }
}
