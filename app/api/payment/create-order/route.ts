import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const customerPhone = body.customerPhone || body.phone;
    const customerName = body.customerName || body.name || 'Valued Patient';
    const customerEmail = body.customerEmail || body.email;
    const amount = Number(body.amount) || 999;
    const labAssigned = body.labAssigned || 'Redcliffe Labs';

    if (!customerPhone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    const appId = process.env.CASHFREE_APP_ID?.trim();
    const secretKey = process.env.CASHFREE_SECRET_KEY?.trim();
    const env = (process.env.CASHFREE_ENV || 'SANDBOX').trim().toUpperCase();

    if (!appId || !secretKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'Cashfree credentials missing in Vercel Environment Variables' 
      }, { status: 500 });
    }

    const cleanPhone = customerPhone.replace(/\D/g, '').slice(-10);
    const orderId = `TB_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    const baseUrl = env === 'PRODUCTION' 
      ? 'https://api.cashfree.com/pg/orders' 
      : 'https://sandbox.cashfree.com/pg/orders';

    const orderPayload = {
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: `CUST_${cleanPhone}`,
        customer_name: customerName,
        customer_phone: cleanPhone,
        customer_email: customerEmail || `${cleanPhone}@testbeat.in`
      },
      order_meta: {
        return_url: `https://testbeat.in/payment/status?order_id=${orderId}`
      }
    };

    const cfRes = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2023-08-01',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(orderPayload)
    });

    const cfData = await cfRes.json();

    if (!cfRes.ok || !cfData.payment_session_id) {
      return NextResponse.json({
        success: false,
        error: cfData.message || 'Cashfree Order Failed',
        details: cfData
      }, { status: 400 });
    }

    // Save into Neon DB
    await pool.query(
      `INSERT INTO orders (order_id, customer_name, customer_phone, customer_email, amount, cf_order_id, payment_session_id, lab_assigned)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        orderId, 
        customerName, 
        cleanPhone, 
        customerEmail || '', 
        amount, 
        cfData.cf_order_id || '', 
        cfData.payment_session_id,
        labAssigned
      ]
    );

    // Direct Cashfree Web Checkout Link Builder
    const checkoutHost = env === 'PRODUCTION'
      ? 'https://api.cashfree.com/pg/view/sessions/checkout'
      : 'https://sandbox.cashfree.com/pg/view/sessions/checkout';

    const paymentUrl = `${checkoutHost}?payment_session_id=${cfData.payment_session_id}`;

    return NextResponse.json({
      success: true,
      orderId,
      paymentSessionId: cfData.payment_session_id,
      paymentUrl: paymentUrl,
      env: env
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
