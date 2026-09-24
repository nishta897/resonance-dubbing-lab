import { NextResponse } from "next/server";
import { AppError, jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await prisma.session.findUnique({
      where: { id: params.id },
      include: {
        transactions: { orderBy: { createdAt: "desc" }, take: 8 },
        dubbingJobs: { orderBy: { createdAt: "desc" }, take: 8 },
      },
    });
    if (!session) throw new AppError("Guest session not found.", 404, "SESSION_NOT_FOUND");

    return NextResponse.json({
      sessionId: session.id,
      creditBalance: session.credits,
      transactions: session.transactions,
      jobs: session.dubbingJobs,
    });
  } catch (error) {
    return jsonError(error);
  }
}
