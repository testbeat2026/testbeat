import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();

    // Cashfree Webhook structure check
    const orderData = rawBody?.data?.order;
    const paymentData = rawBody?.data?.payment;

    if (orderData && paymentData && paymentData.payment_status === 'SUCCESS') {
      const orderId = orderData.order_id;
      const paymentId = paymentData.cf_payment_id;

      // 1. Update status in Neon PostgreSQL
      const updateRes = await pool.query(
        `UPDATE bookings 
         SET payment_status = 'PAID', 
             booking_status = 'ASSIGNED', 
             cashfree_payment_id = $1 
         WHERE booking_code = $2 
         RETURNING id, patient_id, total_amount, collection_slot`,
        [paymentId.toString(), orderId]
      );

      if (updateRes.rows.length > 0) {
        const booking = updateRes.rows[0];
        
        // 2. Fetch patient phone number for SMS
        const patientRes = await pool.query(
          `SELECT full_name, phone FROM patients WHERE id = $1`,
          [booking.patient_id]
        );

        if (patientRes.rows.length > 0 && process.env.MSG91_AUTH_KEY) {
          const patient = patientRes.rows[0];

          // Trigger MSG91 SMS
          try {
            await fetch('https://api.msg91.com/api/v5/flow/', {
              method: 'POST',
              headers: {
                'authkey': process.env.MSG91_AUTH_KEY,
                'content-type': 'application/json'
              },
              body: JSON.stringify({
                template_id: process.env.MSG91_TEMPLATE_ID || '',
                sender: process.env.MSG91_SENDER_ID || 'TSTBET',
                short_url: '0',
                recipients: [
                  {
                    mobiles: `91${patient.phone}`,
                    name: patient.full_name,
                    order_id: orderId,
                    slot: booking.collection_slot
                  }
                ]
              })
            });
          } catch (smsErr) {
            console.error('SMS notification error:', smsErr);
          }
        }
      }
    }

    return NextResponse.json({ status: 'ok', message: 'Webhook processed' });
  } catch (err: any) {
    console.error('Webhook processing exception:', err);
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}
