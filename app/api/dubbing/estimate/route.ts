import { NextResponse } from "next/server";
import { creditsForDuration } from "@/lib/credits";
import { AppError, jsonError, readJson } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { sessionId, durationSec } = await readJson<{
      sessionId?: string;
      durationSec?: number;
    }>(request);
    if (!sessionId) throw new AppError("A guest session is required.", 400, "SESSION_REQUIRED");
    if (!Number.isFinite(durationSec) || Number(durationSec) <= 0) {
      throw new AppError("Video duration must be greater than zero.", 422, "INVALID_DURATION");
    }

    const session = await prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) throw new AppError("Guest session not found.", 404, "SESSION_NOT_FOUND");
    const requiredCredits = creditsForDuration(Number(durationSec));

    return NextResponse.json({
      durationSec: Math.ceil(Number(durationSec)),
      billedMinutes: Math.ceil(Number(durationSec) / 60),
      requiredCredits,
      priceInr: requiredCredits,
      creditBalance: session.credits,
      hasSufficientCredits: session.credits >= requiredCredits,
    });
  } catch (error) {
    return jsonError(error);
  }
}
