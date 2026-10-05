import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { action, phone, otp, role } = await req.json();

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    // 1. ACTION: SEND OTP VIA MSG91 ONEAPI FLOW
    if (action === 'send') {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Save in Neon DB
      await pool.query(
        `INSERT INTO otp_verifications (phone, otp, role, expires_at)
         VALUES ($1, $2, $3, $4)`,
        [cleanPhone, generatedOtp, role || 'ADMIN', expiresAt]
      );

      const msg91Auth = process.env.MSG91_AUTH_KEY;
      const slug = process.env.MSG91_OTP_TEMPLATE_ID || 'testbeat-otp';

      let msg91Status = 'Skipped (No Key)';
      let msg91Response = null;

      if (msg91Auth) {
        try {
          const oneApiUrl = `https://control.msg91.com/api/v5/oneapi/api/flow/${slug}/run`;
          
          const payload = {
            data: {
              otp: generatedOtp,
              OTP: generatedOtp,
              code: generatedOtp,
              var1: generatedOtp
            },
            sendTo: [
              {
                to: `91${cleanPhone}`,
                variables: {
                  otp: generatedOtp,
                  OTP: generatedOtp,
                  code: generatedOtp
                }
              }
            ]
          };

          const res = await fetch(oneApiUrl, {
            method: 'POST',
            headers: {
              'authkey': msg91Auth,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          msg91Response = await res.json();
          msg91Status = msg91Response?.status || msg91Response?.type || 'requested';
        } catch (apiErr: any) {
          msg91Status = 'Error: ' + apiErr.message;
        }
      }

      return NextResponse.json({
        success: true,
        message: 'OTP initiated successfully',
        dev_otp: generatedOtp, // Screen pop-up backup
        msg91_status: msg91Status,
        msg91_response: msg91Response
      });
    }

    // 2. ACTION: VERIFY OTP
    if (action === 'verify') {
      // Founder Master Override
      if (otp === '999888') {
        return NextResponse.json({
          success: true,
          message: 'Master Super Admin Access Granted',
          role: 'SUPER_ADMIN'
        });
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
    console.error('OTP Route Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
