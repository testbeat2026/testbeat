import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const res = await query(`SELECT * FROM orders ORDER BY created_at DESC LIMIT 50`);
    if (res && res.rows) {
      return NextResponse.json({ success: true, orders: res.rows });
    }
    return NextResponse.json({ success: true, orders: [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
