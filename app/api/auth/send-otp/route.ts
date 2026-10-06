import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { mobile } = await req.json();

    if (!mobile || mobile.length < 10) {
      return NextResponse.json({ error: 'Valid mobile number is required' }, { status: 400 });
    }

    // Number ko 91 prefix ke sath format karein (agar user ne nahi lagaya)
    const formattedMobile = mobile.startsWith('91') ? mobile : `91${mobile}`;

    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;

    // MSG91 SendOTP API call
    const res = await fetch(
      `https://control.msg91.com/api/v5/otp?template_id=${templateId}&mobile=${formattedMobile}`,
      {
        method: 'POST',
        headers: {
          authkey: authKey!,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await res.json();

    if (data.type === 'success') {
      return NextResponse.json({ success: true, message: 'OTP sent successfully' });
    } else {
      return NextResponse.json({ error: data.message || 'Failed to send OTP' }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
