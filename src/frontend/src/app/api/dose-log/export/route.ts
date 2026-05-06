import { auth } from "@/lib/auth";
import { getDoseLogs, getReminders } from "@/lib/store";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId =
      (session.user as { username?: string })?.username?.toLowerCase() ??
      session.user.email ??
      "";

    const logs = getDoseLogs(userId);

    const header = "date,time,medicine,dosage,status\n";
    const rows = logs
      .map((l) => {
        const d = new Date(l.actionTime);
        const date = d.toLocaleDateString("en-CA"); // YYYY-MM-DD
        const time = d.toLocaleTimeString("en-GB", { hour12: false }); // HH:MM:SS
        const medicine = `"${(l.medicineName ?? "").replace(/"/g, '""')}"`;
        const reminder = getReminders(userId).find(
          (r) => r.id === l.reminderId,
        );
        const dosage = `"${(reminder?.dosage ?? "").replace(/"/g, '""')}"`;
        const status = l.status ?? "";
        return `${date},${time},${medicine},${dosage},${status}`;
      })
      .join("\n");

    const csv = header + rows;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="dose-log.csv"',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
