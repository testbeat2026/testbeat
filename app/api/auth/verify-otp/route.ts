import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();
    if (!otp || otp.length !== 6) {
      return NextResponse.json({ error: 'Invalid 6-digit OTP' }, { status: 400 });
    }
    return NextResponse.json({
      success: true,
      message: 'Verified successfully',
      patient: {
        name: 'Shubhranshu Kumar',
        phone: phone,
        address: 'Flat 402, Green Avenue, Greater Noida'
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
