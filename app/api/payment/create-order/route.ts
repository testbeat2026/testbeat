import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { customerName, customerPhone, customerEmail, amount, labAssigned } = await req.json();

    if (!customerPhone || !amount) {
      return NextResponse.json({ success: false, error: 'Phone and Amount are required' }, { status: 400 });
    }

    const appId = process.env.CASHFREE_APP_ID?.trim();
    const secretKey = process.env.CASHFREE_SECRET_KEY?.trim();
    const env = process.env.CASHFREE_ENV || 'SANDBOX'; // 'PRODUCTION' or 'SANDBOX'

    if (!appId || !secretKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'Cashfree credentials missing in environment variables' 
      }, { status: 500 });
    }

    const orderId = `TB_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const cleanPhone = customerPhone.replace(/\D/g, '').slice(-10);

    const baseUrl = env === 'PRODUCTION' 
      ? 'https://api.cashfree.com/pg/orders' 
      : 'https://sandbox.cashfree.com/pg/orders';

    const orderPayload = {
      order_id: orderId,
      order_amount: Number(amount),
      order_currency: 'INR',
      customer_details: {
        customer_id: `CUST_${cleanPhone}`,
        customer_name: customerName || 'Valued Patient',
        customer_phone: cleanPhone,
        customer_email: customerEmail || 'patient@testbeat.in'
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderPayload)
    });

    const cfData = await cfRes.json();

    if (!cfRes.ok || !cfData.payment_session_id) {
      return NextResponse.json({
        success: false,
        error: cfData.message || 'Cashfree Order Creation Failed',
        details: cfData
      }, { status: 400 });
    }

    // Save into Neon DB
    await pool.query(
      `INSERT INTO orders (order_id, customer_name, customer_phone, customer_email, amount, cf_order_id, payment_session_id, lab_assigned)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        orderId, 
        customerName || 'Patient', 
        cleanPhone, 
        customerEmail || '', 
        amount, 
        cfData.cf_order_id || '', 
        cfData.payment_session_id,
        labAssigned || 'Redcliffe Labs'
      ]
    );

    return NextResponse.json({
      success: true,
      orderId,
      paymentSessionId: cfData.payment_session_id,
      cfOrderId: cfData.cf_order_id
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
