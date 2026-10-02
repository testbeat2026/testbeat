import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    if (!phone || phone.length !== 10) {
      return NextResponse.json({ error: 'Valid 10-digit mobile number required' }, { status: 400 });
    }

    const authKey = process.env.MSG91_AUTH_KEY;
    const flowId = process.env.MSG91_FLOW_ID || 'testbeat-otp';

    // Generate random 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    if (authKey) {
      // Call MSG91 One API Flow endpoint
      const response = await fetch(`https://control.msg91.com/api/v5/flow/`, {
        method: 'POST',
        headers: {
          'authkey': authKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          flow_id: flowId,
          sender: 'TSTBET',
          mobiles: `91${phone}`,
          OTP: generatedOtp
        })
      });

      const resData = await response.json();
      return NextResponse.json({
        success: true,
        message: 'OTP dispatched via MSG91',
        mockOtp: generatedOtp,
        providerResponse: resData
      });
    } else {
      // Development fallback if environment variable is deploying
      return NextResponse.json({
        success: true,
        message: 'OTP simulated (set MSG91_AUTH_KEY in Vercel to dispatch real SMS)',
        mockOtp: generatedOtp
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to dispatch OTP' }, { status: 500 });
  }
}
