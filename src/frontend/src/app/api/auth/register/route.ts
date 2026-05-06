import { randomUUID } from "node:crypto";
import { createUser, getUser } from "@/lib/store";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      username?: string;
      password?: string;
      email?: string;
      fullName?: string;
      age?: number;
      gender?: string;
      locality?: string;
    };

    const { username, password, email, fullName, age, gender, locality } = body;

    if (!username?.trim() || !password?.trim()) {
      return NextResponse.json(
        { success: false, error: "Username and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    if (getUser(username.trim())) {
      return NextResponse.json(
        { success: false, error: "Username already taken" },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = createUser({
      id: randomUUID(),
      username: username.trim(),
      passwordHash,
      email: email?.trim() || undefined,
      fullName: fullName?.trim() || undefined,
      age: age !== undefined ? Number(age) : undefined,
      gender: gender?.trim() || undefined,
      locality: locality?.trim() || undefined,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (err) {
    console.error("[register] error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
