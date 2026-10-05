import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    const { patientName, patientPhone, patientAddress, fileBase64, extractedNotes } = body;

    if (!patientPhone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    const cleanPhone = String(patientPhone).replace(/\D/g, '').slice(-10);

    // Default note agar OCR fail ho ya handwriting clear na ho
    const initialNotes = extractedNotes && extractedNotes.trim().length > 0 
      ? extractedNotes 
      : 'Doctor Prescription Uploaded (Awaiting Medical Team Review)';

    // Neon DB Insert
    const { rows } = await pool.query(
      `INSERT INTO prescriptions (patient_name, patient_phone, patient_address, file_url, extracted_tests, status)
       VALUES ($1, $2, $3, $4, $5, 'PENDING_REVIEW')
       RETURNING id, patient_name, patient_phone, status, created_at`,
      [
        patientName || 'Patient',
        cleanPhone,
        patientAddress || 'Pickup Address Shared',
        fileBase64 || '',
        initialNotes
      ]
    );

    return NextResponse.json({
      success: true,
      prescriptionId: rows[0].id,
      message: 'Prescription successfully uploaded'
    });

  } catch (err: any) {
    console.error('Prescription Upload Error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Database insert failed' }, { status: 500 });
  }
}
