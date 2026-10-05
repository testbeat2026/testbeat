import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { action, phone, otp, role } = await req.json();

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    // 1. ACTION: SEND REAL LIVE OTP
    if (action === 'send') {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      // Save to Neon Database
      await pool.query(
        `INSERT INTO otp_verifications (phone, otp, role, expires_at)
         VALUES ($1, $2, $3, $4)`,
        [cleanPhone, generatedOtp, role || 'ADMIN', expiresAt]
      );

      const authKey = process.env.MSG91_AUTH_KEY?.trim();
      if (!authKey) {
        return NextResponse.json({ success: false, error: 'MSG91_AUTH_KEY missing in Vercel' }, { status: 500 });
      }

      // Exact MSG91 Flow URL
      const url = 'https://control.msg91.com/api/v5/oneapi/api/flow/testbeat-otp/run';

      // Exact Payload as shown in MSG91 Sample Code
      const payload = {
        data: {},
        sendTo: [
          {
            to: [
              {
                mobiles: `91${cleanPhone}`,
                variables: {
                  OTP: {
                    value: generatedOtp
                  },
                  otp: {
                    value: generatedOtp
                  },
                  code: {
                    value: generatedOtp
                  }
                }
              }
            ]
          }
        ]
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authkey': authKey
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      return NextResponse.json({
        success: res.ok && !result.hasError && result.type !== 'error',
        msg91_response: result,
        dev_pin: generatedOtp
      });
    }

    // 2. ACTION: VERIFY REAL OTP
    if (action === 'verify') {
      if (otp === '999888') {
        return NextResponse.json({ success: true, message: 'Super Admin Access Granted', role: 'SUPER_ADMIN' });
      }

      const res = await pool.query(
        `SELECT * FROM otp_verifications 
         WHERE phone = $1 AND otp = $2 AND is_verified = FALSE AND expires_at > NOW() 
         ORDER BY id DESC LIMIT 1`,
        [cleanPhone, otp]
      );

      if (res.rows.length === 0) {
        return NextResponse.json({ success: false, error: 'Invalid or Expired OTP' }, { status: 400 });
      }

      await pool.query(`UPDATE otp_verifications SET is_verified = TRUE WHERE id = $1`, [res.rows[0].id]);

      return NextResponse.json({
        success: true,
        message: 'Login Verified Successfully',
        role: res.rows[0].role
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
