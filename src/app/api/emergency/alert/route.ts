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
    const { message, location } = body;

    // Get user and their emergency contacts
    const user = await db.user.findUnique({
      where: { id: authUser.userId },
      include: {
        emergencyContacts: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // In a production app, this would send SMS/emails to emergency contacts
    // For now, we'll log it and return success
    console.log('EMERGENCY ALERT:', {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      message: message || 'Emergency! I need immediate help!',
      location: location || 'Location not available',
      contacts: user.emergencyContacts.map((c) => ({
        name: c.name,
        phone: c.phone,
      })),
    });

    return NextResponse.json({
      message: 'Emergency alert sent successfully',
      alertSent: true,
      contactsNotified: user.emergencyContacts.length,
    });
  } catch (error) {
    console.error('Emergency alert error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
