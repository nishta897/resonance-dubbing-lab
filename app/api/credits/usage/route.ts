import { NextResponse } from "next/server";
import { AppError, jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const sessionId = new URL(request.url).searchParams.get("sessionId");
    if (!sessionId) throw new AppError("Session ID is required.", 400, "SESSION_REQUIRED");
    const session = await prisma.session.findUnique({ where: { id: sessionId }, include: { transactions: { orderBy: { createdAt: "desc" }, take: 100 } } });
    if (!session) throw new AppError("Guest session not found.", 404, "SESSION_NOT_FOUND");
    const added = session.transactions.filter((item) => item.amount > 0).reduce((sum, item) => sum + item.amount, 0);
    const used = Math.abs(session.transactions.filter((item) => item.amount < 0 && !item.description.toLowerCase().includes("refund")).reduce((sum, item) => sum + item.amount, 0));
    return NextResponse.json({ creditBalance: session.credits, summary: { added, used }, transactions: session.transactions });
  } catch (error) { return jsonError(error); }
}
