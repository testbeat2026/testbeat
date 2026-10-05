import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

// 1. GET handler for Cashfree ping / endpoint validation test
export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'TestBeat Webhook Active' }, { status: 200 });
}

// 2. POST handler for actual payment events
export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    let body: any = {};
    
    try {
      body = JSON.parse(rawBody);
    } catch {
      // Empty body test handling
      return NextResponse.json({ status: 'ok' }, { status: 200 });
    }

    const eventType = body?.type;
    const orderData = body?.data?.order;
    const paymentData = body?.data?.payment;

    const orderId = orderData?.order_id || body?.orderId;
    const paymentStatus = paymentData?.payment_status || orderData?.order_status;

    if (orderId && (paymentStatus === 'SUCCESS' || paymentStatus === 'PAID')) {
      await pool.query(
        `UPDATE orders 
         SET payment_status = 'PAID', 
             cf_order_id = COALESCE($1, cf_order_id)
         WHERE order_id = $2`,
        [orderData?.cf_order_id || '', orderId]
      );
    }

    return NextResponse.json({ success: true, received: true }, { status: 200 });
  } catch (err: any) {
    // Always return 200 to Cashfree so it doesn't retry indefinitely on schema mismatch
    return NextResponse.json({ success: false, error: err.message }, { status: 200 });
  }
}
