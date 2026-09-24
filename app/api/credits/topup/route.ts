import { NextResponse } from "next/server";
import { TOP_UP_AMOUNTS } from "@/lib/config";
import { AppError, jsonError, readJson } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { sessionId, amount } = await readJson<{ sessionId?: string; amount?: number }>(request);
    if (!sessionId) throw new AppError("A guest session is required.", 400, "SESSION_REQUIRED");
    if (!TOP_UP_AMOUNTS.includes(amount as (typeof TOP_UP_AMOUNTS)[number])) {
      throw new AppError("Choose a supported credit pack.", 422, "INVALID_TOPUP");
    }

    const session = await prisma.$transaction(async (tx) => {
      const updated = await tx.session.update({
        where: { id: sessionId },
        data: { credits: { increment: Number(amount) } },
      });
      await tx.creditLog.create({
        data: {
          sessionId,
          amount: Number(amount),
          description: `Credit top-up · ₹${Number(amount).toLocaleString("en-IN")}`,
        },
      });
      return updated;
    }).catch(() => null);

    if (!session) throw new AppError("Guest session not found.", 404, "SESSION_NOT_FOUND");
    return NextResponse.json({
      creditBalance: session.credits,
      addedCredits: amount,
      mock: true,
    });
  } catch (error) {
    return jsonError(error);
  }
}
