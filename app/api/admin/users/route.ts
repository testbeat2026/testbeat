import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

// Get all portal users
export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT id, full_name, phone, email, role, status, permissions, created_at 
       FROM portal_users 
       ORDER BY id ASC`
    );
    return NextResponse.json({ success: true, users: rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// Create new portal user
export async function POST(req: Request) {
  try {
    const { fullName, phone, email, role, passcode } = await req.json();

    if (!fullName || !phone || !role || !passcode) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);

    const { rows } = await pool.query(
      `INSERT INTO portal_users (full_name, phone, email, role, passcode, status)
       VALUES ($1, $2, $3, $4, $5, 'ACTIVE')
       RETURNING id, full_name, phone, role, status`,
      [fullName, cleanPhone, email || '', role, passcode]
    );

    return NextResponse.json({ success: true, user: rows[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// Block / Unblock / Update Role
export async function PATCH(req: Request) {
  try {
    const { userId, status, role } = await req.json();

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    const { rows } = await pool.query(
      `UPDATE portal_users 
       SET status = COALESCE($1, status),
           role = COALESCE($2, role)
       WHERE id = $3
       RETURNING id, full_name, phone, role, status`,
      [status, role, userId]
    );

    return NextResponse.json({ success: true, user: rows[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
