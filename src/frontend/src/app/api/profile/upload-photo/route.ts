import fs from "node:fs";
import path from "node:path";
import { auth } from "@/lib/auth";
import { updateUser } from "@/lib/store";
import { NextResponse } from "next/server";

const UPLOADS_DIR = "/tmp/uploads";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId =
      (session.user as { username?: string })?.username?.toLowerCase() ??
      session.user.email ??
      "";

    const formData = await request.formData();
    const photo = formData.get("photo") as File | null;
    if (!photo) {
      return NextResponse.json({ error: "No photo provided" }, { status: 400 });
    }

    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    const ext = photo.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const filename = `${userId}-${Date.now()}.${ext}`;
    const filepath = path.join(UPLOADS_DIR, filename);

    const buffer = Buffer.from(await photo.arrayBuffer());
    fs.writeFileSync(filepath, buffer);

    const photoUrl = `/api/profile/photo/${userId}`;
    updateUser(userId, { photoUrl });

    return NextResponse.json({ photoUrl });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
