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

export async function PUT(
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
    const body = await request.json();
    const { name, dosage, time, frequency, startDate, endDate } = body;

    // Check if medicine belongs to user
    const existingMedicine = await db.medicine.findFirst({
      where: { id, userId: authUser.userId },
    });

    if (!existingMedicine) {
      return NextResponse.json(
        { error: 'Medicine not found' },
        { status: 404 }
      );
    }

    const medicine = await db.medicine.update({
      where: { id },
      data: {
        name: name || existingMedicine.name,
        dosage: dosage || existingMedicine.dosage,
        time: time || existingMedicine.time,
        frequency: frequency || existingMedicine.frequency,
        startDate: startDate || existingMedicine.startDate,
        endDate: endDate !== undefined ? endDate : existingMedicine.endDate,
      },
    });

    return NextResponse.json({
      message: 'Medicine updated successfully',
      medicine,
    });
  } catch (error) {
    console.error('Update medicine error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Check if medicine belongs to user
    const existingMedicine = await db.medicine.findFirst({
      where: { id, userId: authUser.userId },
    });

    if (!existingMedicine) {
      return NextResponse.json(
        { error: 'Medicine not found' },
        { status: 404 }
      );
    }

    // Delete associated status records first
    await db.medicineStatus.deleteMany({
      where: { medicineId: id },
    });

    // Delete the medicine
    await db.medicine.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Medicine deleted successfully',
    });
  } catch (error) {
    console.error('Delete medicine error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
