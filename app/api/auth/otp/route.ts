import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { action, phone, otp, role } = await req.json();

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    // Clean phone number (strip +91 or leading zeroes if user typed them)
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    // 1. ACTION: SEND OTP VIA MSG91 FLOW
    if (action === 'send') {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

      // Save in Neon PostgreSQL
      await pool.query(
        `INSERT INTO otp_verifications (phone, otp, role, expires_at)
         VALUES ($1, $2, $3, $4)`,
        [cleanPhone, generatedOtp, role || 'ADMIN', expiresAt]
      );

      const msg91Auth = process.env.MSG91_AUTH_KEY;
      const msg91TemplateId = process.env.MSG91_OTP_TEMPLATE_ID;

      // Fallback agar environment variable abhi redeploy na hua ho
      if (!msg91Auth || !msg91TemplateId) {
        return NextResponse.json({
          success: true,
          message: 'MSG91 keys pending in Vercel. Use Sandbox OTP.',
          dev_otp: generatedOtp
        });
      }

      // MSG91 Flow API Call
      const flowPayload = {
        template_id: msg91TemplateId,
        short_url: '0',
        recipients: [
          {
            mobiles: `91${cleanPhone}`,
            OTP: generatedOtp,
            otp: generatedOtp
          }
        ]
      };

      const msg91Res = await fetch('https://api.msg91.com/api/v5/flow/', {
        method: 'POST',
        headers: {
          'authkey': msg91Auth,
          'content-type': 'application/json'
        },
        body: JSON.stringify(flowPayload)
      });

      const msg91Data = await msg91Res.json();

      if (msg91Data.type === 'error') {
        console.error('MSG91 Flow Error:', msg91Data);
        return NextResponse.json({
          success: false,
          error: `MSG91: ${msg91Data.message}`,
          dev_otp: generatedOtp
        });
      }

      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully to Mobile & WhatsApp',
        msg91_status: msg91Data.type || 'success'
      });
    }

    // 2. ACTION: VERIFY OTP
    if (action === 'verify') {
      const res = await pool.query(
        `SELECT * FROM otp_verifications 
         WHERE phone = $1 AND otp = $2 AND is_verified = FALSE AND expires_at > NOW() 
         ORDER BY id DESC LIMIT 1`,
        [cleanPhone, otp]
      );

      if (res.rows.length === 0) {
        return NextResponse.json({ success: false, error: 'Invalid or Expired OTP' }, { status: 400 });
      }

      // Mark verified
      await pool.query(`UPDATE otp_verifications SET is_verified = TRUE WHERE id = $1`, [res.rows[0].id]);

      return NextResponse.json({ 
        success: true, 
        message: 'Login Verified Successfully',
        role: res.rows[0].role 
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });

  } catch (err: any) {
    console.error('OTP Route Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
