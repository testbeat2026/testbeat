import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, mobile, city, testNeeded } = body;

    if (!name || !mobile) {
      return NextResponse.json(
        { error: 'Name and mobile number are required.' },
        { status: 400 }
      );
    }

    const lead = {
      bookingId: `TB-LEAD-${Date.now().toString().slice(-6)}`,
      name: String(name).trim(),
      mobile: String(mobile).trim(),
      city: String(city || '').trim(),
      testNeeded: String(testNeeded || '').trim(),
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({ success: true, lead });
  } catch {
    return NextResponse.json(
      { error: 'Server could not process request.' },
      { status: 500 }
    );
  }
}
