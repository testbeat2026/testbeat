import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { mobile, otp } = await req.json();

    if (!mobile || !otp) {
      return NextResponse.json({ error: 'Mobile and OTP are required' }, { status: 400 });
    }

    const formattedMobile = mobile.startsWith('91') ? mobile : `91${mobile}`;
    const authKey = process.env.MSG91_AUTH_KEY;

    // MSG91 Verify OTP API call
    const res = await fetch(
      `https://control.msg91.com/api/v5/otp/verify?otp=${otp}&mobile=${formattedMobile}`,
      {
        method: 'GET',
        headers: {
          authkey: authKey!,
        },
      }
    );

    const data = await res.json();

    if (data.type === 'success' || data.message === 'OTP verified success') {
      // Yahan user ko database me find/create karein aur session/JWT set karein
      return NextResponse.json({ success: true, message: 'OTP verified successfully' });
    } else {
      return NextResponse.json({ error: data.message || 'Invalid or expired OTP' }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Verification failed' }, { status: 500 });
  }
}
