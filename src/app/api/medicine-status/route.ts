import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';

async function getAuthenticatedUser(request: NextRequest) {
  const token = getTokenFromHeaders(request.headers);
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request);
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { medicineId, date, status } = body;

    if (!medicineId || !date || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify medicine belongs to user
    const medicine = await db.medicine.findFirst({
      where: { id: medicineId, userId: authUser.userId },
    });

    if (!medicine) {
      return NextResponse.json(
        { error: 'Medicine not found' },
        { status: 404 }
      );
    }

    // Upsert status
    const statusRecord = await db.medicineStatus.upsert({
      where: {
        medicineId_date: {
          medicineId,
          date,
        },
      },
      update: {
        status,
      },
      create: {
        medicineId,
        userId: authUser.userId,
        date,
        status,
      },
    });

    return NextResponse.json({
      message: 'Status updated successfully',
      status: statusRecord,
    });
  } catch (error) {
    console.error('Update medicine status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
