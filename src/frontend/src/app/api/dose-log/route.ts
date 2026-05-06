import { auth } from "@/lib/auth";
import { createDoseLog, getDoseLogs } from "@/lib/store";
import { NextResponse } from "next/server";

function getUserId(session: Awaited<ReturnType<typeof auth>>): string {
  return (
    (session?.user as { username?: string })?.username?.toLowerCase() ??
    session?.user?.email ??
    ""
  );
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = getUserId(session);

    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    let logs = getDoseLogs(userId);
    if (from || to) {
      const fromMs = from ? new Date(from).getTime() : 0;
      const toMs = to
        ? new Date(`${to}T23:59:59`).getTime()
        : Number.POSITIVE_INFINITY;
      logs = logs.filter((l) => l.actionTime >= fromMs && l.actionTime <= toMs);
    }

    return NextResponse.json(logs);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = getUserId(session);

    const body = await request.json();
    const { reminderId, medicineName, scheduledTime, status } = body;
    if (!reminderId || !status) {
      return NextResponse.json(
        { error: "reminderId and status are required" },
        { status: 400 },
      );
    }

    const log = createDoseLog({
      id: crypto.randomUUID(),
      userId,
      reminderId: String(reminderId),
      medicineName: String(medicineName ?? ""),
      scheduledTime: String(scheduledTime ?? ""),
      status,
      actionTime: Date.now(),
    });

    return NextResponse.json(log, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
