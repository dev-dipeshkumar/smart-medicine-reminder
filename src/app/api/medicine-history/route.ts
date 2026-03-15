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

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request);
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const history = await db.medicineStatus.findMany({
      where: {
        userId: authUser.userId,
      },
      include: {
        medicine: {
          select: {
            name: true,
            dosage: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
      take: 100,
    });

    return NextResponse.json(
      history.map((record) => ({
        date: record.date,
        status: record.status,
        medicineName: record.medicine.name,
        dosage: record.medicine.dosage,
      }))
    );
  } catch (error) {
    console.error('Get medicine history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
