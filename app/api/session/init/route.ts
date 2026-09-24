import { NextResponse } from "next/server";
import { env } from "@/lib/config";
import { jsonError, readJson } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await readJson<{ sessionId?: string | null }>(request);
    if (body.sessionId && body.sessionId.length <= 64) {
      const existing = await prisma.session.findUnique({ where: { id: body.sessionId } });
      if (existing) {
        return NextResponse.json({
          sessionId: existing.id,
          creditBalance: existing.credits,
          isNew: false,
        });
      }
    }

    const session = await prisma.$transaction(async (tx) => {
      const created = await tx.session.create({
        data: {
          credits: env.initialGuestCredits,
          initialGrant: env.initialGuestCredits,
        },
      });
      await tx.creditLog.create({
        data: {
          sessionId: created.id,
          amount: env.initialGuestCredits,
          description: "Welcome credit grant",
        },
      });
      return created;
    });

    return NextResponse.json(
      { sessionId: session.id, creditBalance: session.credits, isNew: true },
      { status: 201 },
    );
  } catch (error) {
    return jsonError(error);
  }
}
