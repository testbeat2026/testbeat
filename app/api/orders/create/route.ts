import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      id, customerPhone, patientName, patientAge, patientGender, patientRelation,
      itemName, itemType, labName, collectionDate, slot, address, pincode,
      totalAmount, b2bCost, platformMargin, paymentStatus
    } = body;

    // Save into Neon PostgreSQL if connected
    await query(
      `INSERT INTO orders (
        id, customer_phone, patient_name, patient_age, patient_gender, patient_relation,
        item_name, item_type, lab_name, collection_date, slot, address, pincode,
        total_amount, b2b_cost, platform_margin, payment_status, status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,'SCHEDULED')
      ON CONFLICT (id) DO NOTHING`,
      [
        id, customerPhone, patientName, patientAge, patientGender, patientRelation,
        itemName, itemType, labName, collectionDate, slot, address, pincode,
        totalAmount, b2bCost, platformMargin, paymentStatus || 'PENDING'
      ]
    );

    return NextResponse.json({ success: true, orderId: id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
