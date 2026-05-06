import { auth } from "@/lib/auth";
import {
  getCheckupReports,
  getDoctorGuidance,
  getMedicalRecord,
  getUser,
  updateUser,
  upsertMedicalRecord,
} from "@/lib/store";
import { NextResponse } from "next/server";

function getUserId(session: Awaited<ReturnType<typeof auth>>): string {
  return (
    (session?.user as { username?: string })?.username?.toLowerCase() ??
    session?.user?.email ??
    ""
  );
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = getUserId(session);

    const user = getUser(userId);
    const medical = getMedicalRecord(userId);
    const doctorGuidances = getDoctorGuidance(userId);
    const checkupReports = getCheckupReports(userId);

    const profile = {
      username: userId,
      email: user?.email,
      fullName: user?.fullName,
      age: user?.age,
      gender: user?.gender,
      locality: user?.locality,
      profilePhotoUrl: user?.photoUrl,
      doctorName: medical?.doctorName,
      prescribedTreatment: medical?.prescribedTreatment,
      checkupDate: medical?.checkupDate,
      checkupNotes: medical?.checkupNotes,
      doctorGuidances,
      checkupReports,
    };

    return NextResponse.json(profile);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = getUserId(session);

    const body = await request.json();
    const {
      email,
      fullName,
      age,
      gender,
      locality,
      profilePhotoUrl,
      doctorName,
      prescribedTreatment,
      checkupDate,
      checkupNotes,
    } = body;

    // Update user profile fields
    const profileFields: Record<string, unknown> = {};
    if (email !== undefined) profileFields.email = String(email);
    if (fullName !== undefined) profileFields.fullName = String(fullName);
    if (age !== undefined) profileFields.age = Number(age);
    if (gender !== undefined) profileFields.gender = String(gender);
    if (locality !== undefined) profileFields.locality = String(locality);
    if (profilePhotoUrl !== undefined)
      profileFields.photoUrl = String(profilePhotoUrl);
    if (Object.keys(profileFields).length > 0) {
      updateUser(userId, profileFields as Parameters<typeof updateUser>[1]);
    }

    // Update medical record
    const medicalFields: Record<string, unknown> = {};
    if (doctorName !== undefined) medicalFields.doctorName = String(doctorName);
    if (prescribedTreatment !== undefined)
      medicalFields.prescribedTreatment = String(prescribedTreatment);
    if (checkupDate !== undefined)
      medicalFields.checkupDate = String(checkupDate);
    if (checkupNotes !== undefined)
      medicalFields.checkupNotes = String(checkupNotes);
    if (Object.keys(medicalFields).length > 0) {
      upsertMedicalRecord(
        userId,
        medicalFields as Parameters<typeof upsertMedicalRecord>[1],
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
