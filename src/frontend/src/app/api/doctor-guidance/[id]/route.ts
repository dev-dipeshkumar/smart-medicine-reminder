import { auth } from "@/lib/auth";
import {
  deleteDoctorGuidance,
  getDoctorGuidance,
  upsertDoctorGuidance,
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

  const all = getDoctorGuidance(userId);
  const existing = all.find((g) => g.id === params.id);
  if (!existing)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = (await request.json()) as {
    doctorName?: string;
    prescribedTreatment?: string;
  };
  const updated = upsertDoctorGuidance({
    ...existing,
    doctorName: body.doctorName?.trim() ?? existing.doctorName,
    prescribedTreatment:
      body.prescribedTreatment ?? existing.prescribedTreatment,
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

  const all = getDoctorGuidance(userId);
  const existing = all.find((g) => g.id === params.id);
  if (!existing)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  deleteDoctorGuidance(params.id);
  return NextResponse.json({ ok: true });
}
