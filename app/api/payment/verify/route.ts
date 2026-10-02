import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const env = process.env.CASHFREE_ENV || 'PROD';

    const baseUrl = env === 'PROD' 
      ? `https://api.cashfree.com/pg/orders/${orderId}` 
      : `https://sandbox.cashfree.com/pg/orders/${orderId}`;

    if (!appId || !secretKey) {
      return NextResponse.json({ success: false, error: 'Credentials missing' }, { status: 400 });
    }

    const cfRes = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'x-client-id': appId.trim(),
        'x-client-secret': secretKey.trim(),
        'x-api-version': '2023-08-01'
      }
    });

    const orderData = await cfRes.json();

    if (orderData.order_status === 'PAID') {
      // Update in Neon PostgreSQL
      await query(
        `UPDATE orders SET payment_status = 'PAID', status = 'PHLEBO_ASSIGNED' WHERE id = $1`,
        [orderId]
      );

      return NextResponse.json({ success: true, status: 'PAID' });
    }

    return NextResponse.json({ success: false, status: orderData.order_status });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
