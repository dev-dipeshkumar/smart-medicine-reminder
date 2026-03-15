import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';
import ZAI from 'z-ai-web-dev-sdk';

async function getAuthenticatedUser(request: NextRequest) {
  const token = getTokenFromHeaders(request.headers);
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

const SYSTEM_PROMPT = `You are a helpful AI Health Assistant specialized in medicine and health-related topics. Your role is to:

1. Provide general information about medicines, their uses, dosages, and potential side effects
2. Offer health tips and wellness advice
3. Help users understand their medication schedules and the importance of adherence
4. Provide general guidance on common health concerns
5. Remind users to consult healthcare professionals for specific medical advice

Important guidelines:
- Always recommend consulting a healthcare professional for specific medical advice, diagnosis, or treatment
- Be empathetic and supportive in your responses
- Provide accurate, evidence-based general information
- Never prescribe medications or give definitive medical diagnoses
- If a situation sounds serious or emergency-related, advise the user to seek immediate medical attention
- Be clear when information is general vs. specific to the user's situation

Respond in a friendly, helpful manner while being professional and accurate.`;

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
    const { question } = body;

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    // Use z-ai-web-dev-sdk for AI responses
    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: question,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const answer = completion.choices[0]?.message?.content || 
      'I apologize, but I was unable to process your question. Please try again or consult your healthcare provider.';

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('AI assistant error:', error);
    return NextResponse.json(
      { error: 'Failed to process your question. Please try again.' },
      { status: 500 }
    );
  }
}
