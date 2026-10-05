import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });

    const { patientName, patientPhone, patientAddress, fileBase64, selectedTests, selectedLab, totalAmount } = body;

    if (!patientPhone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    const cleanPhone = String(patientPhone).replace(/\D/g, '').slice(-10);
    const testsStr = Array.isArray(selectedTests) ? selectedTests.join(', ') : (selectedTests || 'General Health Checkup');

    // Insert into Neon DB
    const { rows } = await pool.query(
      `INSERT INTO prescriptions (patient_name, patient_phone, patient_address, file_url, extracted_tests, selected_lab, quoted_amount, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'PENDING_REVIEW')
       RETURNING id, patient_name, patient_phone, status, created_at`,
      [
        patientName || 'Valued Patient',
        cleanPhone,
        patientAddress || 'Home Collection Address',
        fileBase64 || '',
        testsStr,
        selectedLab || 'Redcliffe Labs',
        Number(totalAmount) || 499
      ]
    );

    return NextResponse.json({
      success: true,
      prescriptionId: rows[0].id,
      message: 'Prescription saved'
    });

  } catch (err: any) {
    console.error('Upload API Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
