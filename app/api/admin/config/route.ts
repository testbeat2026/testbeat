import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // 1. Fetch persistent app and API settings
    const settingsRes = await pool.query(`SELECT key, value FROM app_settings`);
    
    // 2. Fetch all registered affiliate partners
    const affiliatesRes = await pool.query(`SELECT * FROM affiliates ORDER BY id DESC`);
    
    // 3. Fetch current lab pricing and tests catalog
    const catalogRes = await pool.query(`
      SELECT 
        t.id, 
        t.name, 
        l.name as lab_name, 
        COALESCE(p.b2b_price, 120) as agreed_b2b, 
        COALESCE(p.b2b_price, 120) as current_b2b, 
        COALESCE(p.b2c_price, 299) as retail_price
      FROM tests t
      CROSS JOIN labs l
      LEFT JOIN lab_test_pricing p ON t.id = p.test_id AND l.id = p.lab_id
      ORDER BY t.id ASC, l.name ASC
    `);

    // 4. Fetch recent booking orders
    const ordersRes = await pool.query(`
      SELECT 
        b.id,
        b.booking_code,
        pt.full_name as patient_name,
        pt.phone,
        pt.address,
        l.name as lab_name,
        b.total_amount,
        b.payment_status,
        b.booking_status,
        b.collection_slot,
        b.created_at
      FROM bookings b
      LEFT JOIN patients pt ON b.patient_id = pt.id
      LEFT JOIN labs l ON b.lab_id = l.id
      ORDER BY b.id DESC
      LIMIT 50
    `);

    const configMap: Record<string, any> = {};
    settingsRes.rows.forEach(row => {
      configMap[row.key] = row.value;
    });

    return NextResponse.json({
      success: true,
      configs: configMap,
      affiliates: affiliatesRes.rows,
      catalog: catalogRes.rows,
      orders: ordersRes.rows
    });
  } catch (err: any) {
    console.error('Config fetch exception:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { type, data } = await req.json();

    // ACTION A: SAVE ALL API KEYS PERMANENTLY IN NEON DB
    if (type === 'save_apis') {
      await pool.query(
        `INSERT INTO app_settings (key, value, updated_at) 
         VALUES ('api_configs', $1, NOW())
         ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
        [JSON.stringify(data)]
      );
      return NextResponse.json({ success: true, message: 'All API keys and credentials saved permanently in Neon DB' });
    }

    // ACTION B: ONBOARD NEW AFFILIATE CLINIC / DOCTOR
    if (type === 'add_affiliate') {
      const res = await pool.query(
        `INSERT INTO affiliates (code, clinic_name, owner_name, phone, city, commission_pct, wallet_balance)
         VALUES ($1, $2, $3, $4, $5, $6, 0.00) RETURNING *`,
        [data.code, data.clinic_name, data.owner_name, data.phone, data.city, data.commission_pct || 15]
      );
      return NextResponse.json({ success: true, affiliate: res.rows[0] });
    }

    // ACTION C: UPDATE B2B / RETAIL MARGIN
    if (type === 'update_pricing') {
      await pool.query(
        `INSERT INTO lab_test_pricing (test_id, lab_id, b2c_price)
         VALUES ($1, $2, $3)
         ON CONFLICT (test_id, lab_id) DO UPDATE SET b2c_price = $3, updated_at = NOW()`,
        [data.test_id, data.lab_id, data.retail_price]
      );
      return NextResponse.json({ success: true, message: 'Retail price & aggregator margin updated' });
    }

    return NextResponse.json({ success: false, error: 'Unsupported action type' }, { status: 400 });
  } catch (err: any) {
    console.error('Config update exception:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
