import { NextResponse } from 'next/server';
import { activeOtpStore } from '@/lib/otpStore';

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    if (!phone || phone.length !== 10) {
      return NextResponse.json({ success: false, error: '10-digit mobile number required' }, { status: 400 });
    }

    const authKey = process.env.MSG91_AUTH_KEY;
    const flowId = process.env.MSG91_FLOW_ID || 'testbeat-otp';

    const realOtp = Math.floor(100000 + Math.random() * 900000).toString();
    activeOtpStore[phone] = { otp: realOtp, expiresAt: Date.now() + 10 * 60 * 1000 };

    if (authKey) {
      const response = await fetch(`https://control.msg91.com/api/v5/flow/`, {
        method: 'POST',
        headers: {
          'authkey': authKey.trim(),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          flow_id: flowId.trim(),
          sender: 'TSTBET',
          mobiles: `91${phone}`,
          OTP: realOtp
        })
      });

      const resData = await response.json();
      if (resData.type === 'error' || response.status >= 400) {
        return NextResponse.json({
          success: false,
          error: `MSG91 Error: ${resData.message || 'SMS delivery failed'}`
        }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: `OTP dispatched to +91 ${phone}`
      });
    }

    return NextResponse.json({
      success: false,
      error: 'MSG91_AUTH_KEY missing in Vercel environment variables'
    }, { status: 500 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
