import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT id, patient_name, patient_phone, patient_address, file_url, status, extracted_tests, quoted_amount, created_at
       FROM prescriptions
       ORDER BY id DESC
       LIMIT 50`
    );
    return NextResponse.json({ success: true, prescriptions: rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { prescriptionId, testNames, quoteAmount, labAssigned } = await req.json();

    if (!prescriptionId || !quoteAmount) {
      return NextResponse.json({ success: false, error: 'Prescription ID and Quote Amount are required' }, { status: 400 });
    }

    // 1. Fetch prescription
    const { rows } = await pool.query(`SELECT * FROM prescriptions WHERE id = $1`, [prescriptionId]);
    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Prescription not found' }, { status: 404 });
    }
    const item = rows[0];

    // 2. Create Order in Neon orders table for direct payment
    const orderId = `TB_RX_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;
    const cleanPhone = item.patient_phone.replace(/\D/g, '').slice(-10);

    const appId = process.env.CASHFREE_APP_ID?.trim();
    const secretKey = process.env.CASHFREE_SECRET_KEY?.trim();
    const env = (process.env.CASHFREE_ENV || 'SANDBOX').trim().toUpperCase();

    const baseUrl = env === 'PRODUCTION'
      ? 'https://api.cashfree.com/pg/orders'
      : 'https://sandbox.cashfree.com/pg/orders';

    const orderPayload = {
      order_id: orderId,
      order_amount: Number(quoteAmount),
      order_currency: 'INR',
      customer_details: {
        customer_id: `CUST_${cleanPhone}`,
        customer_name: item.patient_name || 'Patient',
        customer_phone: cleanPhone,
        customer_email: `${cleanPhone}@testbeat.in`
      },
      order_meta: {
        return_url: `https://testbeat.in/payment/status?order_id=${orderId}`
      }
    };

    let paymentUrl = `https://testbeat.in/cart?test_id=6`;

    if (appId && secretKey) {
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
      if (cfData.payment_session_id) {
        const checkoutHost = env === 'PRODUCTION'
          ? 'https://api.cashfree.com/pg/view/sessions/checkout'
          : 'https://sandbox.cashfree.com/pg/view/sessions/checkout';
        paymentUrl = `${checkoutHost}?payment_session_id=${cfData.payment_session_id}`;

        await pool.query(
          `INSERT INTO orders (order_id, customer_name, customer_phone, customer_email, amount, cf_order_id, payment_session_id, lab_assigned)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [orderId, item.patient_name, cleanPhone, `${cleanPhone}@testbeat.in`, quoteAmount, cfData.cf_order_id || '', cfData.payment_session_id, labAssigned || 'Redcliffe Labs']
        );
      }
    }

    // 3. Update prescription status
    await pool.query(
      `UPDATE prescriptions 
       SET status = 'QUOTED', extracted_tests = $1, quoted_amount = $2, payment_link = $3
       WHERE id = $4`,
      [testNames, quoteAmount, paymentUrl, prescriptionId]
    );

    // 4. WhatsApp message with quote & payment link
    const waText = `Hello ${item.patient_name || 'Sir/Madam'},\nHumne aapka doctor prescription review kar liya hai.\n\n📋 *Tests:* ${testNames}\n🔬 *Lab:* ${labAssigned || 'Redcliffe Labs'}\n💰 *Discounted Total:* ₹${quoteAmount} (Home Pickup Free)\n\n💳 *Direct Payment Link:* ${paymentUrl}\n\n- TestBeat Diagnostic Aggregator`;
    const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(waText)}`;

    return NextResponse.json({ success: true, waUrl, paymentUrl });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
