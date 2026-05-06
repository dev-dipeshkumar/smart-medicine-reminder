import { auth } from "@/lib/auth";
import { getDoctorGuidance, upsertDoctorGuidance } from "@/lib/store";
import type { DoctorGuidance } from "@/lib/types";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

function getUserId(session: Awaited<ReturnType<typeof auth>>): string {
  return (
    (session?.user as { username?: string })?.username?.toLowerCase() ??
    session?.user?.email ??
    ""
  );
}

export async function GET() {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = getUserId(session);
  return NextResponse.json(getDoctorGuidance(userId));
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = getUserId(session);

  const body = (await request.json()) as {
    doctorName: string;
    prescribedTreatment: string;
  };
  if (!body.doctorName?.trim())
    return NextResponse.json(
      { error: "Doctor name required" },
      { status: 400 },
    );

  const record = upsertDoctorGuidance({
    id: uuid(),
    userId,
    doctorName: body.doctorName.trim(),
    prescribedTreatment: body.prescribedTreatment ?? "",
  });
  return NextResponse.json(record, { status: 201 });
}
