import { auth } from "@/lib/auth";
import { getCheckupReports, upsertCheckupReport } from "@/lib/store";
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
  return NextResponse.json(getCheckupReports(userId));
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = getUserId(session);

  const body = (await request.json()) as {
    checkupDate: string;
    notes: string;
  };
  if (!body.checkupDate?.trim())
    return NextResponse.json(
      { error: "Checkup date required" },
      { status: 400 },
    );

  const record = upsertCheckupReport({
    id: uuid(),
    userId,
    checkupDate: body.checkupDate.trim(),
    notes: body.notes ?? "",
  });
  return NextResponse.json(record, { status: 201 });
}
