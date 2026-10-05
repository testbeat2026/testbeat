import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { phone, passcode, role } = await req.json();

    if (!phone || !passcode || !role) {
      return NextResponse.json({ success: false, error: 'Phone, passcode aur role zaroori hai.' }, { status: 400 });
    }

    const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);

    const { rows } = await pool.query(
      `SELECT id, full_name, phone, role, status, permissions 
       FROM portal_users 
       WHERE phone = $1 AND passcode = $2`,
      [cleanPhone, String(passcode).trim()]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid Mobile Number ya Passcode.' }, { status: 401 });
    }

    const user = rows[0];

    if (user.status === 'BLOCKED') {
      return NextResponse.json({ success: false, error: 'Aapka account Super Admin dwara suspend/block kar diya gaya hai.' }, { status: 403 });
    }

    // Role check
    if (user.role !== 'SUPER_ADMIN' && user.role !== role) {
      return NextResponse.json({ 
        success: false, 
        error: `Aapka account is portal (${role}) ke liye authorized nahi hai.` 
      }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.full_name,
        phone: user.phone,
        role: user.role,
        permissions: user.permissions
      }
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
