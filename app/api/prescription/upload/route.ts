import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { patientName, patientPhone, patientAddress, fileBase64, fileName } = await req.json();

    if (!patientPhone || !fileBase64) {
      return NextResponse.json({ 
        success: false, 
        error: 'Phone number and prescription image are required' 
      }, { status: 400 });
    }

    const cleanPhone = patientPhone.replace(/\D/g, '').slice(-10);

    // Save prescription into Neon DB
    const { rows } = await pool.query(
      `INSERT INTO prescriptions (patient_name, patient_phone, patient_address, file_url, status)
       VALUES ($1, $2, $3, $4, 'PENDING_REVIEW')
       RETURNING id, patient_name, patient_phone, status, created_at`,
      [
        patientName || 'Patient',
        cleanPhone,
        patientAddress || '',
        fileBase64
      ]
    );

    return NextResponse.json({
      success: true,
      prescriptionId: rows[0].id,
      message: 'Prescription uploaded successfully. Diagnostic team will verify and quote tests.'
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
