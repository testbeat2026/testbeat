'use client';

import React, { useState } from 'react';
import Script from 'next/script';

interface CheckoutProps {
  amount: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  labAssigned?: string;
  onSuccess?: () => void;
}

declare global {
  interface Window {
    Cashfree: any;
  }
}

export default function CashfreeCheckout({
  amount,
  customerName,
  customerPhone,
  customerEmail,
  labAssigned,
  onSuccess
}: CheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);

  const initiatePayment = async () => {
    if (!window.Cashfree) {
      alert('Cashfree Gateway load ho raha hai, 2 second baad dobara dabayein.');
      return;
    }

    setLoading(true);

    try {
      // 1. Backend se session ID generate karna
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          customerName,
          customerPhone,
          customerEmail,
          labAssigned
        })
      });

      const data = await res.json();

      if (!data.success || !data.paymentSessionId) {
        alert('Order creation failed: ' + (data.error || 'Server error'));
        setLoading(false);
        return;
      }

      // 2. Cashfree SDK Initialise
      const isProd = data.env === 'PRODUCTION';
      const cashfree = window.Cashfree({
        mode: isProd ? 'production' : 'sandbox'
      });

      // 3. Dropin Modal Launch (No broken blank redirect)
      const checkoutOptions = {
        paymentSessionId: data.paymentSessionId,
        redirectTarget: '_modal' // Screen ke upar clean UPI/Card modal khulega
      };

      cashfree.checkout(checkoutOptions).then((result: any) => {
        if (result.error) {
          // Fallback redirect with session param if modal is closed
          window.location.href = isProd 
            ? `https://api.cashfree.com/pg/view/sessions/checkout?payment_session_id=${data.paymentSessionId}`
            : `https://sandbox.cashfree.com/pg/view/sessions/checkout?payment_session_id=${data.paymentSessionId}`;
        }
        if (result.paymentDetails) {
          window.location.href = `/payment/status?order_id=${data.orderId}`;
        }
      });

    } catch (err: any) {
      alert('Payment execution failed: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://sdk.cashfree.com/js/v3/cashfree.js"
        strategy="afterInteractive"
        onLoad={() => setSdkReady(true)}
      />

      <button
        type="button"
        onClick={initiatePayment}
        disabled={loading}
        className="w-full py-3.5 bg-[#009387] hover:bg-[#007A70] text-white font-extrabold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
      >
        {loading ? 'Opening Cashfree Gateway...' : `Pay ₹${amount} & Confirm Booking`}
      </button>
    </>
  );
}
