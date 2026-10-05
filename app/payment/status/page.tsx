'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, Clock, ArrowRight, ShieldCheck, Home } from 'lucide-react';

function StatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('order_id');

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'PAID' | 'FAILED' | 'PENDING'>('PENDING');
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setStatus('FAILED');
      return;
    }

    const checkStatus = async () => {
      try {
        const res = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId })
        });
        const data = await res.json();
        setLoading(false);

        if (data.success && data.orderStatus === 'PAID') {
          setStatus('PAID');
          setDetails(data.data);
        } else {
          setStatus('FAILED');
          setDetails(data.data);
        }
      } catch (err) {
        setLoading(false);
        setStatus('FAILED');
      }
    };

    checkStatus();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7F9] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-[#009387] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-bold text-slate-700 text-sm">Verifying payment with Cashfree...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7F9] flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-xl border border-slate-100 text-center">
        {status === 'PAID' ? (
          <>
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Booking Confirmed
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-3">Payment Successful!</h2>
            <p className="text-xs text-slate-500 mt-1">
              Sample collection partner will be assigned shortly.
            </p>

            <div className="mt-6 bg-slate-50 p-4 rounded-2xl text-left space-y-2 border border-slate-100 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Order Reference:</span>
                <span className="font-mono font-bold text-slate-800">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-bold text-slate-900">₹{details?.order_amount || '---'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Channel:</span>
                <span className="font-bold text-[#009387]">Cashfree Live PG</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => router.push('/')}
                className="w-full py-3 bg-[#009387] hover:bg-[#007A70] text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home size={14} /> Back to Home
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={36} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
              Payment Incomplete
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-3">Transaction Failed</h2>
            <p className="text-xs text-slate-500 mt-1">
              Your payment could not be processed or was cancelled.
            </p>

            <div className="mt-6 bg-slate-50 p-4 rounded-2xl text-left space-y-2 border border-slate-100 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Order Reference:</span>
                <span className="font-mono font-bold text-slate-800">{orderId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-rose-600">Failed / Cancelled</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => router.push('/')}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
              >
                Retry Booking
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading payment status...</div>}>
      <StatusContent />
    </Suspense>
  );
}
