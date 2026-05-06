import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

const UPLOADS_DIR = "/tmp/uploads";

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
};

type Params = { params: Promise<{ userId: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { userId } = await params;
    if (!userId)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (!fs.existsSync(UPLOADS_DIR)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Find the most recent upload for this userId
    const files = fs
      .readdirSync(UPLOADS_DIR)
      .filter((f) => f.startsWith(`${userId}-`))
      .sort()
      .reverse();

    if (files.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const latest = files[0];
    const filepath = path.join(UPLOADS_DIR, latest);
    const ext = latest.split(".").pop()?.toLowerCase() ?? "jpg";
    const contentType = MIME[ext] ?? "application/octet-stream";

    const buffer = fs.readFileSync(filepath);
    return new NextResponse(buffer, {
      status: 200,
      headers: { "Content-Type": contentType },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
