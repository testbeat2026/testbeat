import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { orderId, amount, customerPhone, customerName, testName } = await req.json();

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const env = process.env.CASHFREE_ENV || 'PROD'; // 'TEST' ya 'PROD'

    const baseUrl = env === 'PROD' 
      ? 'https://api.cashfree.com/pg/orders' 
      : 'https://sandbox.cashfree.com/pg/orders';

    if (!appId || !secretKey) {
      // Agar Vercel me keys set na hui ho toh safe simulated response
      return NextResponse.json({
        success: false,
        error: 'CASHFREE_APP_ID ya CASHFREE_SECRET_KEY Vercel Environment Variables me set nahi hai.'
      }, { status: 400 });
    }

    const payload = {
      order_id: orderId,
      order_amount: Number(amount),
      order_currency: 'INR',
      customer_details: {
        customer_id: customerPhone,
        customer_name: customerName,
        customer_email: `${customerPhone}@testbeat.in`,
        customer_phone: customerPhone
      },
      order_meta: {
        return_url: `https://testbeat.in/customer/dashboard?order_id={order_id}`
      },
      order_note: `Diagnostic Booking: ${testName}`
    };

    const cfRes = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'x-client-id': appId.trim(),
        'x-client-secret': secretKey.trim(),
        'x-api-version': '2023-08-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const cfData = await cfRes.json();

    if (cfRes.status >= 400 || cfData.type === 'error') {
      return NextResponse.json({
        success: false,
        error: cfData.message || 'Cashfree payment session creation failed'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      payment_session_id: cfData.payment_session_id,
      order_id: cfData.order_id
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
