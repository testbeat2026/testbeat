import { NextResponse } from 'next/server';

export async function GET() {
  const authKey = process.env.MSG91_AUTH_KEY || '';
  const templateId = process.env.MSG91_OTP_TEMPLATE_ID || '';

  const diagnosis = {
    auth_key_present: !!authKey,
    auth_key_length: authKey.length,
    auth_key_preview: authKey ? `${authKey.slice(0, 4)}...${authKey.slice(-4)}` : 'MISSING',
    template_id_present: !!templateId,
    template_id_value: templateId || 'MISSING',
    node_env: process.env.NODE_ENV
  };

  if (!authKey || !templateId) {
    return NextResponse.json({
      status: 'FAILED',
      message: 'Vercel environment variables are NOT loaded. You must REDEPLOY in Vercel.',
      diagnosis
    });
  }

  // Live ping test to MSG91 balance API
  try {
    const res = await fetch('https://api.msg91.com/api/v5/balance', {
      method: 'GET',
      headers: { authkey: authKey }
    });
    const data = await res.json();
    return NextResponse.json({
      status: 'CONNECTED',
      msg91_balance_response: data,
      diagnosis
    });
  } catch (err: any) {
    return NextResponse.json({
      status: 'NETWORK_ERROR',
      error: err.message,
      diagnosis
    });
  }
}
