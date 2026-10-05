import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();

    // Cashfree PG v3 Webhook structure
    const data = rawBody.data || rawBody;
    const orderData = data.order || {};
    const paymentData = data.payment || {};

    const orderId = orderData.order_id || rawBody.orderId;
    const paymentStatus = paymentData.payment_status || orderData.order_status || rawBody.txStatus;

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'No order ID in webhook' }, { status: 400 });
    }

    if (paymentStatus === 'SUCCESS' || paymentStatus === 'PAID') {
      // 1. Update Neon DB Order to PAID
      const { rows } = await pool.query(
        `UPDATE orders 
         SET payment_status = 'PAID',
             cf_order_id = COALESCE($1, cf_order_id)
         WHERE order_id = $2
         RETURNING customer_name, customer_phone, amount, lab_assigned`,
        [paymentData.cf_payment_id ? String(paymentData.cf_payment_id) : null, orderId]
      );

      if (rows.length > 0) {
        const order = rows[0];
        const phone = order.customer_phone;
        const patientName = order.customer_name || 'Patient';
        const lab = order.lab_assigned || 'Partner Lab';
        const amount = order.amount;

        // 2. Dispatch MSG91 / WhatsApp notification (Non-blocking)
        const msg91AuthKey = process.env.MSG91_AUTH_KEY?.trim();
        if (msg91AuthKey && phone) {
          const smsPayload = {
            sender: process.env.MSG91_SENDER_ID || 'TSTBET',
            route: '4',
            country: '91',
            sms: [
              {
                message: `Dear ${patientName}, your test booking ${orderId} of Rs.${amount} is confirmed with ${lab}. Sample collector will arrive soon. - TestBeat`,
                to: [phone]
              }
            ]
          };

          fetch('https://api.msg91.com/api/v2/sendsms', {
            method: 'POST',
            headers: {
              'authkey': msg91AuthKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(smsPayload)
          }).catch(e => console.error('Notification dispatch log:', e.message));
        }
      }
    }

    return NextResponse.json({ status: 'OK' }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
