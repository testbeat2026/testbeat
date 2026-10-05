import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT id, order_id, customer_name, customer_phone, customer_email, amount, lab_assigned, 
              payment_status, fulfillment_status, lab_rider_name, lab_rider_phone, 
              report_pdf_url, report_dispatched_at, dispatch_channel, created_at
       FROM orders
       ORDER BY id DESC
       LIMIT 100`
    );
    return NextResponse.json({ success: true, orders: rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, orders: [] }, { status: 500 });
  }
}

// Manual Report Upload or Status Update Trigger
export async function POST(req: Request) {
  try {
    const { orderId, reportUrl, action } = await req.json();

    if (action === 'DISPATCH_NOW' && reportUrl) {
      const { rows } = await pool.query(
        `SELECT customer_name, customer_phone, lab_assigned FROM orders WHERE order_id = $1`,
        [orderId]
      );
      if (rows.length === 0) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });

      const ord = rows[0];
      const cleanPhone = String(ord.customer_phone).replace(/\D/g, '').slice(-10);

      await pool.query(
        `UPDATE orders 
         SET report_pdf_url = $1, 
             fulfillment_status = 'REPORT_READY', 
             report_dispatched_at = NOW(), 
             dispatch_channel = 'WHATSAPP_MANUAL_DISPATCH'
         WHERE order_id = $2`,
        [reportUrl, orderId]
      );

      const waMsg = `Namaste ${ord.customer_name},\nAapki test report ready hai:\n${reportUrl}\n\n- TestBeat Diagnostics`;
      const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(waMsg)}`;

      return NextResponse.json({ success: true, waUrl });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
