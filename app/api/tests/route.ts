import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT id, test_code, test_name, category, fasting_required, redcliffe_price, lalpath_price, thyrocare_price, sample_type, report_tat_hours
       FROM lab_tests
       ORDER BY id ASC`
    );

    return NextResponse.json({ success: true, tests: rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, tests: [] }, { status: 500 });
  }
}
