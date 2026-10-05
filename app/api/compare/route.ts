import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Fetch only LIVE labs configured by admin
    const labsRes = await pool.query(
      `SELECT lab_code, lab_name, tagline, default_discount_pct, pickup_tat_mins, report_tat_hours
       FROM lab_partners
       WHERE status = 'LIVE'
       ORDER BY id ASC`
    );

    // 2. Fetch all pathology tests
    const testsRes = await pool.query(
      `SELECT id, test_code, test_name, category, fasting_required, redcliffe_price, lalpath_price, thyrocare_price, sample_type
       FROM lab_tests
       ORDER BY id ASC`
    );

    return NextResponse.json({
      success: true,
      activeLabs: labsRes.rows,
      tests: testsRes.rows
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
