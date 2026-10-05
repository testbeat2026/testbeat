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
    if (!sdkReady && !window.Cashfree) {
      alert('Cashfree SDK is initializing, please wait 2 seconds.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on backend
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

      // 2. Initialize Cashfree SDK
      const cashfree = window.Cashfree({
        mode: process.env.NEXT_PUBLIC_CASHFREE_MODE === 'PRODUCTION' ? 'production' : 'sandbox'
      });

      // 3. Launch Checkout Dropin / Redirection
      cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: '_self'
      });

    } catch (err: any) {
      alert('Payment initialization failed: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://sdk.cashfree.com/js/v3/cashfree.js"
        onLoad={() => setSdkReady(true)}
      />

      <button
        onClick={initiatePayment}
        disabled={loading}
        className="w-full py-3 bg-[#009387] hover:bg-[#007A70] text-white font-extrabold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
      >
        {loading ? 'Opening Secure Gateway...' : `Pay ₹${amount} & Confirm Booking`}
      </button>
    </>
  );
}
