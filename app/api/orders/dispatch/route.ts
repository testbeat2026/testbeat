import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { orderId, phleboName, phleboPhone } = await req.json();

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    // 1. Fetch order details from DB
    const { rows } = await pool.query(
      `SELECT * FROM orders WHERE order_id = $1`,
      [orderId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const order = rows[0];

    // 2. Pre-formatted WhatsApp Message for Patient
    const patientMsg = `Hello ${order.customer_name || 'Patient'},\nYour diagnostic test booking (${order.order_id}) has been confirmed with ${order.lab_assigned || 'Redcliffe Labs'}.\nCollection Partner: ${phleboName || 'Assigned Phlebotomist'}\nAmount Paid: ₹${order.amount}\n- TestBeat Diagnostics`;

    const encodedPatientUrl = `https://wa.me/91${order.customer_phone}?text=${encodeURIComponent(patientMsg)}`;

    // 3. Pre-formatted WhatsApp Dispatch Lead for Phlebotomist / Lab Field Executive
    const phleboMsg = `🚨 *NEW SAMPLE COLLECTION LEAD*\nOrder: ${order.order_id}\nPatient: ${order.customer_name}\nPhone: +91${order.customer_phone}\nLab: ${order.lab_assigned}\nCollect: Home Sample Collection in 60 Mins\n- TestBeat Operations`;

    const targetPhleboNumber = phleboPhone ? phleboPhone.replace(/\D/g, '').slice(-10) : '7666953705';
    const encodedPhleboUrl = `https://wa.me/91${targetPhleboNumber}?text=${encodeURIComponent(phleboMsg)}`;

    return NextResponse.json({
      success: true,
      orderId,
      patientWhatsAppUrl: encodedPatientUrl,
      phleboWhatsAppUrl: encodedPhleboUrl
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
