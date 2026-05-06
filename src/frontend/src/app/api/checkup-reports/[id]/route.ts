import { auth } from "@/lib/auth";
import {
  deleteCheckupReport,
  getCheckupReports,
  upsertCheckupReport,
} from "@/lib/store";
import { NextResponse } from "next/server";

function getUserId(session: Awaited<ReturnType<typeof auth>>): string {
  return (
    (session?.user as { username?: string })?.username?.toLowerCase() ??
    session?.user?.email ??
    ""
  );
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = getUserId(session);

  const all = getCheckupReports(userId);
  const existing = all.find((r) => r.id === params.id);
  if (!existing)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = (await request.json()) as {
    checkupDate?: string;
    notes?: string;
  };
  const updated = upsertCheckupReport({
    ...existing,
    checkupDate: body.checkupDate?.trim() ?? existing.checkupDate,
    notes: body.notes ?? existing.notes,
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = getUserId(session);

  const all = getCheckupReports(userId);
  const existing = all.find((r) => r.id === params.id);
  if (!existing)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  deleteCheckupReport(params.id);
  return NextResponse.json({ ok: true });
}
