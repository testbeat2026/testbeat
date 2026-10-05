import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { page, phone, name } = await req.json().catch(() => ({}));
    
    // Extract Client IP and Geolocation headers
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Unknown Device';
    const city = req.headers.get('x-vercel-ip-city') || 'NCR / Local';

    const cleanPhone = phone ? String(phone).replace(/\D/g, '').slice(-10) : null;

    const { rows } = await pool.query(
      `INSERT INTO visitor_logs (ip_address, city, user_agent, page_visited, captured_phone, captured_name)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, session_time`,
      [ip, city, userAgent, page || '/', cleanPhone, name || null]
    );

    return NextResponse.json({ success: true, logId: rows[0].id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT id, ip_address, city, user_agent, page_visited, captured_phone, captured_name, session_time
       FROM visitor_logs
       ORDER BY id DESC
       LIMIT 100`
    );
    return NextResponse.json({ success: true, visitors: rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
