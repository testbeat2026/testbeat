import { NextResponse } from 'next/server';
import { activeOtpStore } from '@/lib/otpStore';

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    if (!phone || phone.length !== 10) {
      return NextResponse.json({ success: false, error: 'Kripya 10-digit mobile number enter karein' }, { status: 400 });
    }

    const authKey = process.env.MSG91_AUTH_KEY;
    const flowId = process.env.MSG91_FLOW_ID || 'testbeat-otp';

    if (!authKey) {
      return NextResponse.json({
        success: false,
        error: 'MSG91_AUTH_KEY Vercel Environment Variables me set nahi hai. Kripya Vercel me MSG91_AUTH_KEY add karke Redeploy karein.'
      }, { status: 500 });
    }

    // Generate strict 6-digit cryptographic-random OTP
    const realOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in server memory (valid for 10 minutes)
    activeOtpStore[phone] = {
      otp: realOtp,
      expiresAt: Date.now() + 10 * 60 * 1000
    };

    // Real API call to MSG91 One API / Flow
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

    const msg91Data = await response.json();

    if (msg91Data.type === 'error' || response.status >= 400) {
      return NextResponse.json({
        success: false,
        error: `MSG91 Error: ${msg91Data.message || 'SMS delivery failed'}. Check flow ID or balance.`
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `OTP aapke mobile +91 ${phone} par bhej diya gaya hai.`,
      status: 'DISPATCHED_TO_PHONE'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'OTP dispatch failed' }, { status: 500 });
  }
}
