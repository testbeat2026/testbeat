import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT id, order_id, customer_name, customer_phone, amount, payment_status, cf_order_id, lab_assigned, created_at
       FROM orders
       ORDER BY id DESC
       LIMIT 50`
    );

    return NextResponse.json({ success: true, orders: rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { orderId, labAssigned, paymentStatus } = await req.json();

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    const { rows } = await pool.query(
      `UPDATE orders 
       SET lab_assigned = COALESCE($1, lab_assigned),
           payment_status = COALESCE($2, payment_status)
       WHERE order_id = $3
       RETURNING *`,
      [labAssigned, paymentStatus, orderId]
    );

    return NextResponse.json({ success: true, updated: rows[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
