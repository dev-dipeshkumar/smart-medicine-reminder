import { auth } from "@/lib/auth";
import { createReminder, getReminders } from "@/lib/store";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId =
      (session.user as { username?: string }).username?.toLowerCase() ??
      session.user.email ??
      "";
    const data = getReminders(userId);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId =
      (session.user as { username?: string }).username?.toLowerCase() ??
      session.user.email ??
      "";

    const body = (await request.json()) as {
      medicineName: string;
      dosage?: string;
      frequency?: string;
      scheduledTime?: string;
      times?: string[];
    };
    const { medicineName, dosage, frequency, scheduledTime, times } = body;
    if (!medicineName) {
      return NextResponse.json(
        { error: "medicineName is required" },
        { status: 400 },
      );
    }

    const reminder = createReminder({
      id: crypto.randomUUID(),
      userId,
      medicineName: String(medicineName),
      dosage: String(dosage ?? ""),
      frequency: String(frequency ?? "daily"),
      scheduledTime: String(
        scheduledTime ?? (Array.isArray(times) ? times[0] : ""),
      ),
      isActive: true,
    });

    return NextResponse.json(reminder, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
