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

    const medicines = await db.medicine.findMany({
      where: { userId: authUser.userId },
      orderBy: { time: 'asc' },
      select: {
        id: true,
        name: true,
        dosage: true,
        time: true,
        frequency: true,
        startDate: true,
        endDate: true,
      },
    });

    return NextResponse.json(medicines);
  } catch (error) {
    console.error('Get medicines error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
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
    const { name, dosage, time, frequency, startDate, endDate } = body;

    if (!name || !dosage || !time || !frequency || !startDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const medicine = await db.medicine.create({
      data: {
        userId: authUser.userId,
        name,
        dosage,
        time,
        frequency,
        startDate,
        endDate: endDate || null,
      },
    });

    return NextResponse.json(
      { message: 'Medicine added successfully', medicine },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add medicine error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
