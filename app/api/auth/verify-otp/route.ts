import { NextResponse } from 'next/server';
import { activeOtpStore } from '@/lib/otpStore';

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json({ success: false, error: 'Mobile number aur OTP zaroori hai' }, { status: 400 });
    }

    const storedData = activeOtpStore[phone];

    if (!storedData) {
      return NextResponse.json({
        success: false,
        error: 'Is number par koi active OTP nahi mila. Kripya dobara OTP mangwayein.'
      }, { status: 400 });
    }

    if (Date.now() > storedData.expiresAt) {
      delete activeOtpStore[phone];
      return NextResponse.json({
        success: false,
        error: 'OTP expire ho chuka hai. Kripya naya OTP generate karein.'
      }, { status: 400 });
    }

    // Strict validation: OTP must match the exact real OTP sent to phone
    if (storedData.otp !== otp.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Galat OTP enter kiya hai. Kripya SMS me aaya hua sahi OTP dalein.'
      }, { status: 400 });
    }

    // Verified! Clean up store
    delete activeOtpStore[phone];

    return NextResponse.json({
      success: true,
      message: 'Mobile number safaltapoorvak verify ho gaya!',
      customer: {
        phone: phone,
        name: 'Patient User'
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'Verification fail ho gaya' }, { status: 500 });
  }
}
