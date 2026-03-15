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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthenticatedUser(request);
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    // Verify medicine belongs to user
    const medicine = await db.medicine.findFirst({
      where: { id, userId: authUser.userId },
    });

    if (!medicine) {
      return NextResponse.json(
        { error: 'Medicine not found' },
        { status: 404 }
      );
    }

    if (date) {
      // Get status for specific date
      const statusRecord = await db.medicineStatus.findUnique({
        where: {
          medicineId_date: {
            medicineId: id,
            date,
          },
        },
      });

      return NextResponse.json({
        status: statusRecord?.status || null,
      });
    } else {
      // Get all statuses for this medicine
      const statusRecords = await db.medicineStatus.findMany({
        where: {
          medicineId: id,
          userId: authUser.userId,
        },
        orderBy: {
          date: 'desc',
        },
      });

      return NextResponse.json(
        statusRecords.map((record) => ({
          date: record.date,
          status: record.status,
        }))
      );
    }
  } catch (error) {
    console.error('Get medicine status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
