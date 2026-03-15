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

    const contacts = await db.emergencyContact.findMany({
      where: { userId: authUser.userId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(
      contacts.map((contact) => ({
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
        relationship: contact.relationship,
      }))
    );
  } catch (error) {
    console.error('Get emergency contacts error:', error);
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
    const { name, phone, relationship } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      );
    }

    const contact = await db.emergencyContact.create({
      data: {
        userId: authUser.userId,
        name,
        phone,
        relationship: relationship || null,
      },
    });

    return NextResponse.json(
      { message: 'Emergency contact added successfully', contact },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add emergency contact error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
