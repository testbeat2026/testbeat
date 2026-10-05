import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { action, phone, otp, role } = await req.json();

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    // 1. ACTION: SEND REAL LIVE OTP VIA MSG91
    if (action === 'send') {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Save in Neon Database
      await pool.query(
        `INSERT INTO otp_verifications (phone, otp, role, expires_at)
         VALUES ($1, $2, $3, $4)`,
        [cleanPhone, generatedOtp, role || 'ADMIN', expiresAt]
      );

      const msg91Auth = process.env.MSG91_AUTH_KEY;
      const slug = process.env.MSG91_OTP_TEMPLATE_ID || 'testbeat-otp';

      if (!msg91Auth) {
        return NextResponse.json({ success: false, error: 'MSG91_AUTH_KEY is not configured in Vercel' }, { status: 500 });
      }

      // MSG91 OneAPI Flow Standard Payload
      const oneApiUrl = `https://control.msg91.com/api/v5/oneapi/api/flow/${slug}/run`;
      
      const payload = {
        data: {
          OTP: generatedOtp,
          otp: generatedOtp,
          code: generatedOtp,
          var1: generatedOtp
        },
        sendTo: [
          {
            to: `91${cleanPhone}`,
            variables: {
              OTP: generatedOtp,
              otp: generatedOtp,
              code: generatedOtp,
              var1: generatedOtp
            }
          }
        ]
      };

      const res = await fetch(oneApiUrl, {
        method: 'POST',
        headers: {
          'authkey': msg91Auth.trim(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const msg91Response = await res.json();

      // Agar MSG91 ne koi error diya (e.g., Template variables missing ya balance khatam)
      if (msg91Response?.hasError || msg91Response?.type === 'error' || msg91Response?.status === 'error') {
        return NextResponse.json({
          success: false,
          error: `MSG91 Live Rejection: ${msg91Response.message || JSON.stringify(msg91Response.errors || msg91Response)}`
        }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: 'Live OTP sent successfully to your mobile number!',
        msg91_status: msg91Response
      });
    }

    // 2. ACTION: VERIFY REAL OTP
    if (action === 'verify') {
      const res = await pool.query(
        `SELECT * FROM otp_verifications 
         WHERE phone = $1 AND otp = $2 AND is_verified = FALSE AND expires_at > NOW() 
         ORDER BY id DESC LIMIT 1`,
        [cleanPhone, otp]
      );

      if (res.rows.length === 0) {
        return NextResponse.json({ success: false, error: 'Galat ya Expired OTP. Dobara check karein.' }, { status: 400 });
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
