import { NextResponse } from 'next/server';
import { activeOtpStore } from '@/lib/otpStore';
import { query } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();
    if (!phone || !otp) {
      return NextResponse.json({ success: false, error: 'Phone and OTP required' }, { status: 400 });
    }

    const storedData = activeOtpStore[phone];
    if (!storedData) {
      return NextResponse.json({ success: false, error: 'No active OTP found. Please request new OTP.' }, { status: 400 });
    }

    if (Date.now() > storedData.expiresAt) {
      delete activeOtpStore[phone];
      return NextResponse.json({ success: false, error: 'OTP expired. Please try again.' }, { status: 400 });
    }

    if (storedData.otp !== otp.trim()) {
      return NextResponse.json({ success: false, error: 'Galat OTP enter kiya hai. Kripya sahi code dalein.' }, { status: 400 });
    }

    delete activeOtpStore[phone];

    // Ensure customer exists in Neon
    await query(
      `INSERT INTO customers (id, name, phone) VALUES ($1, $2, $3) ON CONFLICT (phone) DO NOTHING`,
      [`CUST-${phone}`, 'Patient User', phone]
    );

    return NextResponse.json({
      success: true,
      message: 'Verified successfully',
      customer: { phone, name: 'Patient User' }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 });
  }
}
