import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT id, patient_name, patient_phone, patient_address, file_url, status, extracted_tests, selected_lab, quoted_amount, created_at
       FROM prescriptions
       ORDER BY id DESC
       LIMIT 50`
    );
    return NextResponse.json({ success: true, prescriptions: rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, prescriptions: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { prescriptionId, testNames, quoteAmount, labAssigned } = await req.json();

    const { rows } = await pool.query(`SELECT * FROM prescriptions WHERE id = $1`, [prescriptionId]);
    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Prescription not found' }, { status: 404 });
    }
    const item = rows[0];

    const cleanPhone = item.patient_phone.replace(/\D/g, '').slice(-10);
    const orderId = `TB_RX_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;

    // Update status
    await pool.query(
      `UPDATE prescriptions 
       SET status = 'QUOTED', extracted_tests = $1, quoted_amount = $2, selected_lab = $3
       WHERE id = $4`,
      [testNames, quoteAmount, labAssigned, prescriptionId]
    );

    const waText = `Hello ${item.patient_name || 'Patient'},\nHumne aapka prescription review kiya hai:\n\n📋 *Tests:* ${testNames}\n🔬 *Lab:* ${labAssigned}\n💰 *Discounted Total:* ₹${quoteAmount} (Free Home Pickup)\n\nBook karein: https://testbeat.in/cart?test_id=6\n\n- TestBeat Diagnostics`;
    const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(waText)}`;

    return NextResponse.json({ success: true, waUrl });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
