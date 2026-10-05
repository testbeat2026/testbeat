import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      patient_name, 
      phone, 
      email, 
      address, 
      pincode, 
      test_id, 
      test_name, 
      lab_id, 
      amount, 
      collection_date, 
      collection_slot 
    } = body;

    if (!patient_name || !phone || !address || !amount) {
      return NextResponse.json({ success: false, error: 'Patient name, phone, address and amount are required' }, { status: 400 });
    }

    // 1. Insert or update patient record
    const patientRes = await pool.query(
      `INSERT INTO patients (full_name, phone, email, address, pincode)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (phone) DO UPDATE SET full_name = $1, address = $4, pincode = $5
       RETURNING id`,
      [patient_name, phone, email || 'customer@testbeat.in', address, pincode || '201310']
    );
    const patientId = patientRes.rows[0].id;

    // 2. Generate unique booking code
    const bookingCode = `TB-${Date.now().toString().slice(-6)}`;

    // 3. Save booking in Neon (Status: PENDING)
    await pool.query(
      `INSERT INTO bookings (
        booking_code, patient_id, lab_id, test_ids, total_amount, 
        collection_date, collection_slot, payment_status, booking_status
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'PENDING', 'INITIATED')`,
      [bookingCode, patientId, lab_id || 1, [Number(test_id) || 1], Number(amount), collection_date, collection_slot]
    );

    // 4. Cashfree API Call
    const cashfreeEndpoint = process.env.CASHFREE_ENV === 'PRODUCTION'
      ? 'https://api.cashfree.com/pg/orders'
      : 'https://sandbox.cashfree.com/pg/orders';

    const cashfreeRes = await fetch(cashfreeEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': process.env.CASHFREE_APP_ID || '',
        'x-client-secret': process.env.CASHFREE_SECRET_KEY || '',
      },
      body: JSON.stringify({
        order_id: bookingCode,
        order_amount: Number(amount),
        order_currency: 'INR',
        customer_details: {
          customer_id: `CUST_${patientId}`,
          customer_name: patient_name,
          customer_email: email || 'billing@testbeat.in',
          customer_phone: phone,
        },
        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://testbeat.in'}/orders?order_id={order_id}`,
        }
      })
    });

    const cfData = await cashfreeRes.json();

    if (!cashfreeRes.ok) {
      console.error('Cashfree Error:', cfData);
      return NextResponse.json({ success: false, error: cfData.message || 'Payment initiation failed' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      order_id: bookingCode,
      payment_session_id: cfData.payment_session_id,
    });

  } catch (err: any) {
    console.error('Checkout API exception:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
