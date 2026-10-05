import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { action, phone, otp, role } = await req.json();

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    // 1. ACTION: SEND OTP VIA MSG91
    if (action === 'send') {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

      // Save in Neon PostgreSQL
      await pool.query(
        `INSERT INTO otp_verifications (phone, otp, role, expires_at)
         VALUES ($1, $2, $3, $4)`,
        [phone, generatedOtp, role || 'ADMIN', expiresAt]
      );

      // Trigger MSG91 API
      const msg91Auth = process.env.MSG91_AUTH_KEY;
      const msg91TemplateId = process.env.MSG91_OTP_TEMPLATE_ID;

      if (msg91Auth && msg91TemplateId) {
        try {
          await fetch(`https://api.msg91.com/api/v5/otp?template_id=${msg91TemplateId}&mobile=91${phone}&otp=${generatedOtp}`, {
            method: 'GET',
            headers: {
              authkey: msg91Auth
            }
          });
        } catch (smsErr) {
          console.error('MSG91 Dispatch Error:', smsErr);
        }
      }

      return NextResponse.json({ 
        success: true, 
        message: 'OTP sent successfully',
        // Agar environment key set na ho toh testing fallback
        dev_otp: !msg91Auth ? generatedOtp : undefined 
      });
    }

    // 2. ACTION: VERIFY OTP
    if (action === 'verify') {
      const res = await pool.query(
        `SELECT * FROM otp_verifications 
         WHERE phone = $1 AND otp = $2 AND is_verified = FALSE AND expires_at > NOW() 
         ORDER BY id DESC LIMIT 1`,
        [phone, otp]
      );

      if (res.rows.length === 0) {
        return NextResponse.json({ success: false, error: 'Invalid or Expired OTP' }, { status: 400 });
      }

      // Mark OTP as verified
      await pool.query(`UPDATE otp_verifications SET is_verified = TRUE WHERE id = $1`, [res.rows[0].id]);

      return NextResponse.json({ 
        success: true, 
        message: 'Login Verified Successfully',
        role: res.rows[0].role 
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action specified' }, { status: 400 });

  } catch (err: any) {
    console.error('OTP API exception:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
