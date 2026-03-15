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

    // Check if contact belongs to user
    const existingContact = await db.emergencyContact.findFirst({
      where: { id, userId: authUser.userId },
    });

    if (!existingContact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    await db.emergencyContact.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Emergency contact deleted successfully',
    });
  } catch (error) {
    console.error('Delete emergency contact error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
