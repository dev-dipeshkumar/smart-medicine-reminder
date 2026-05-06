import { auth } from "@/lib/auth";
import {
  deleteReminder,
  getReminder,
  getReminders,
  updateReminder,
} from "@/lib/store";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

function getUserId(session: Awaited<ReturnType<typeof auth>>): string {
  return (
    (session?.user as { username?: string })?.username?.toLowerCase() ??
    session?.user?.email ??
    ""
  );
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = getUserId(session);

    const { id } = await params;
    const existing = getReminder(id);
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json();
    const updated = updateReminder(id, body);
    if (!updated)
      return NextResponse.json({ error: "Update failed" }, { status: 500 });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = getUserId(session);

    const { id } = await params;
    const existing = getReminder(id);
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const ok = deleteReminder(id);
    if (!ok)
      return NextResponse.json({ error: "Delete failed" }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
