import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      fullName, 
      phone, 
      email, 
      businessType, 
      organizationName, 
      city, 
      panNumber, 
      bankAccountNo, 
      bankIfsc, 
      upiId 
    } = body;

    if (!fullName || !phone) {
      return NextResponse.json({ success: false, error: 'Full name and phone are required' }, { status: 400 });
    }

    const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
    const generatedCode = (organizationName || fullName).slice(0, 4).toUpperCase().replace(/[^A-Z]/g, '') + '_' + cleanPhone.slice(-4);

    const { rows } = await pool.query(
      `INSERT INTO affiliate_partners (
        full_name, phone, email, business_type, organization_name, city, 
        pan_number, bank_account_no, bank_ifsc, upi_id, referral_code, kyc_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'PENDING')
      RETURNING *`,
      [
        fullName,
        cleanPhone,
        email || null,
        businessType || 'CLINIC',
        organizationName || fullName,
        city || 'Greater Noida',
        panNumber || null,
        bankAccountNo || null,
        bankIfsc || null,
        upiId || null,
        generatedCode
      ]
    );

    return NextResponse.json({ success: true, partner: rows[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
