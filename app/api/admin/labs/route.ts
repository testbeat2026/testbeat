import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

// 1. GET ALL LABS
export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT id, lab_code, lab_name, tagline, api_endpoint, api_key, api_secret, webhook_secret, status, default_discount_pct, pickup_tat_mins, report_tat_hours, created_at
       FROM lab_partners
       ORDER BY id ASC`
    );
    return NextResponse.json({ success: true, labs: rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, labs: [] }, { status: 500 });
  }
}

// 2. ADD NEW LAB PARTNER
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { labName, labCode, tagline, apiEndpoint, apiKey, apiSecret, defaultDiscount, pickupTat, reportTat } = body;

    if (!labName || !labCode) {
      return NextResponse.json({ success: false, error: 'Lab Name and Lab Code are required' }, { status: 400 });
    }

    const cleanCode = labCode.toUpperCase().replace(/\s+/g, '_');

    const { rows } = await pool.query(
      `INSERT INTO lab_partners (lab_code, lab_name, tagline, api_endpoint, api_key, api_secret, status, default_discount_pct, pickup_tat_mins, report_tat_hours)
       VALUES ($1, $2, $3, $4, $5, $6, 'LIVE', $7, $8, $9)
       RETURNING *`,
      [
        cleanCode,
        labName,
        tagline || 'Diagnostic Partner',
        apiEndpoint || '',
        apiKey || '',
        apiSecret || '',
        Number(defaultDiscount) || 20,
        Number(pickupTat) || 60,
        Number(reportTat) || 24
      ]
    );

    return NextResponse.json({ success: true, lab: rows[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// 3. TOGGLE LIVE / UNLIVE & UPDATE API KEYS
export async function PATCH(req: Request) {
  try {
    const { id, status, apiKey, apiSecret, apiEndpoint, defaultDiscount } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Lab ID is required' }, { status: 400 });
    }

    const { rows } = await pool.query(
      `UPDATE lab_partners 
       SET status = COALESCE($1, status),
           api_key = COALESCE($2, api_key),
           api_secret = COALESCE($3, api_secret),
           api_endpoint = COALESCE($4, api_endpoint),
           default_discount_pct = COALESCE($5, default_discount_pct)
       WHERE id = $6
       RETURNING *`,
      [status, apiKey, apiSecret, apiEndpoint, defaultDiscount, id]
    );

    return NextResponse.json({ success: true, lab: rows[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
