import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    const appId = process.env.CASHFREE_APP_ID?.trim();
    const secretKey = process.env.CASHFREE_SECRET_KEY?.trim();
    const env = process.env.CASHFREE_ENV || 'SANDBOX';

    const baseUrl = env === 'PRODUCTION'
      ? `https://api.cashfree.com/pg/orders/${orderId}`
      : `https://sandbox.cashfree.com/pg/orders/${orderId}`;

    const cfRes = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'x-client-id': appId || '',
        'x-client-secret': secretKey || '',
        'x-api-version': '2023-08-01'
      }
    });

    const cfData = await cfRes.json();
    const paymentStatus = cfData.order_status; // PAID, ACTIVE, EXPIRED

    if (paymentStatus === 'PAID') {
      await pool.query(
        `UPDATE orders SET payment_status = 'PAID' WHERE order_id = $1`,
        [orderId]
      );
    }

    return NextResponse.json({
      success: true,
      orderStatus: paymentStatus,
      data: cfData
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
