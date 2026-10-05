import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { patientName, patientPhone, patientAddress, fileBase64, selectedLab, selectedTests, totalAmount } = await req.json();

    if (!patientPhone || !fileBase64 || !selectedLab || !totalAmount) {
      return NextResponse.json({ success: false, error: 'Incomplete booking details' }, { status: 400 });
    }

    const cleanPhone = String(patientPhone).replace(/\D/g, '').slice(-10);
    const amountNum = Number(totalAmount);
    const orderId = `TB_RX_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    const appId = process.env.CASHFREE_APP_ID?.trim();
    const secretKey = process.env.CASHFREE_SECRET_KEY?.trim();
    const env = (process.env.CASHFREE_ENV || 'SANDBOX').trim().toUpperCase();

    if (!appId || !secretKey) {
      return NextResponse.json({ success: false, error: 'Cashfree credentials missing in env' }, { status: 500 });
    }

    const baseUrl = env === 'PRODUCTION'
      ? 'https://api.cashfree.com/pg/orders'
      : 'https://sandbox.cashfree.com/pg/orders';

    // 1. Create real order on Cashfree
    const cfPayload = {
      order_id: orderId,
      order_amount: amountNum,
      order_currency: 'INR',
      customer_details: {
        customer_id: `CUST_${cleanPhone}`,
        customer_name: patientName || 'Patient',
        customer_phone: cleanPhone,
        customer_email: `${cleanPhone}@testbeat.in`
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
      body: JSON.stringify(cfPayload)
    });

    const cfData = await cfRes.json();

    if (!cfRes.ok || !cfData.payment_session_id) {
      return NextResponse.json({ success: false, error: cfData.message || 'Cashfree Order Failed', details: cfData }, { status: 400 });
    }

    const testsStr = Array.isArray(selectedTests) ? selectedTests.join(', ') : selectedTests;

    // 2. Insert into Neon Prescriptions
    const rxInsert = await pool.query(
      `INSERT INTO prescriptions (patient_name, patient_phone, patient_address, file_url, selected_lab, selected_tests, total_amount, cf_order_id, payment_session_id, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'PENDING')
       RETURNING id`,
      [patientName, cleanPhone, patientAddress, fileBase64, selectedLab, testsStr, amountNum, cfData.cf_order_id || '', cfData.payment_session_id]
    );

    // 3. Also record in Orders table for unified admin dispatch
    await pool.query(
      `INSERT INTO orders (order_id, customer_name, customer_phone, customer_email, amount, cf_order_id, payment_session_id, lab_assigned, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDING')`,
      [orderId, patientName, cleanPhone, `${cleanPhone}@testbeat.in`, amountNum, cfData.cf_order_id || '', cfData.payment_session_id, selectedLab]
    );

    return NextResponse.json({
      success: true,
      orderId,
      prescriptionId: rxInsert.rows[0].id,
      paymentSessionId: cfData.payment_session_id,
      env: env
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
