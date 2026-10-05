'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Script from 'next/script';
import { ShieldCheck, Clock, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    Cashfree: any;
  }
}

function CartBookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const testId = searchParams.get('test_id') || '6';

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('7666953705');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Greater Noida');
  const [pincode, setPincode] = useState('201310');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [sdkReady, setSdkReady] = useState(false);

  const testPackages: Record<string, { name: string; lab: string; originalPrice: number; price: number }> = {
    '6': {
      name: 'HealthShield Comprehensive Full Body Checkup',
      lab: 'Redcliffe Labs',
      originalPrice: 1999,
      price: 999
    },
    '1': {
      name: 'Complete Blood Count (CBC)',
      lab: 'Redcliffe Labs',
      originalPrice: 450,
      price: 299
    },
    '2': {
      name: 'Lipid Profile & HbA1c',
      lab: 'Dr Lal PathLabs',
      originalPrice: 1200,
      price: 749
    }
  };

  const selectedTest = testPackages[testId] || testPackages['6'];

  const handleBookingPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!phone || phone.replace(/\D/g, '').length < 10) {
      alert('Kripya valid 10-digit mobile number bhariye.');
      return;
    }

    if (!window.Cashfree) {
      alert('Payment SDK initialize ho raha hai, 2 second baad dobara click karein.');
      return;
    }

    setLoading(true);

    try {
      // 1. Order generation call to backend
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: fullName || 'Patient',
          customerPhone: phone,
          customerEmail: `${phone}@testbeat.in`,
          amount: selectedTest.price,
          labAssigned: selectedTest.lab
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.paymentSessionId) {
        setLoading(false);
        const errorText = data.error || data.details?.message || 'Payment initiation failed';
        setErrorMessage(errorText);
        alert('Payment Error: ' + errorText);
        return;
      }

      // 2. Initialize official Cashfree JS SDK v3
      const isProd = data.env === 'PRODUCTION';
      const cashfree = window.Cashfree({
        mode: isProd ? 'production' : 'sandbox'
      });

      setLoading(false);

      // 3. Launch seamless Cashfree Checkout UI
      cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: '_self'
      });

    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err.message);
      alert('Connection error: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] font-sans pb-16">
      {/* Official Cashfree v3 SDK Loader */}
      <Script
        src="https://sdk.cashfree.com/js/v3/cashfree.js"
        strategy="afterInteractive"
        onLoad={() => setSdkReady(true)}
      />

      {/* Top Banner */}
      <div className="bg-[#17466E] text-white text-[11px] font-bold text-center py-2 px-4 shadow-sm flex items-center justify-center gap-2">
        <span>⚡ Up to 70% OFF Diagnostic Lab Aggregator</span>
        <span>•</span>
        <span>Free Home Sample Pickup in 60 Mins</span>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-9 h-9 rounded-xl bg-[#009387] text-white flex items-center justify-center font-black text-base shadow">
              TB
            </div>
            <div>
              <span className="text-xl font-black text-[#17466E] tracking-tight">Test<span className="text-[#009387]">Beat</span></span>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Diagnostic Aggregator</span>
            </div>
          </div>
          <div className="text-right text-xs">
            <span className="text-slate-400 font-semibold block">Deliver to:</span>
            <span className="font-extrabold text-[#17466E]">{city} ({pincode})</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto p-4 sm:p-6 mt-4">
        <div className="text-center mb-6">
          <span className="text-[10px] font-black uppercase tracking-wider bg-teal-50 text-[#009387] px-3 py-1 rounded-full border border-teal-200">
            Safe & Sanitized Home Collection
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">Confirm Diagnostic Booking</h1>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-base font-black text-[#17466E] mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#17466E] text-white flex items-center justify-center text-xs">1</span>
              Patient & Collection Address
            </h2>

            <form onSubmit={handleBookingPayment} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#009387]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number (For Reports) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit phone number"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#009387]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#009387]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">House No, Building & Street Address</label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Complete home pickup address"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#009387]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-4 bg-[#009387] hover:bg-[#007A70] text-white font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Opening Cashfree Secure Gateway...</span>
                ) : (
                  <span>Proceed to Pay ₹{selectedTest.price}</span>
                )}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-fit space-y-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3">Order Summary</h3>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Selected Test</span>
                <h4 className="font-black text-xs text-[#17466E] mt-0.5">{selectedTest.name}</h4>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[11px] font-extrabold text-[#009387] bg-teal-50 px-2 py-0.5 rounded">
                    🔬 {selectedTest.lab}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500 font-semibold">
                  <span>Standard Test Price</span>
                  <span className="line-through">₹{selectedTest.originalPrice}</span>
                </div>
                <div className="flex justify-between text-[#009387] font-bold">
                  <span>TestBeat Aggregator Discount</span>
                  <span>-₹{selectedTest.originalPrice - selectedTest.price}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-semibold">
                  <span>Home Sample Collection</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>
                <hr className="my-2 border-slate-100" />
                <div className="flex justify-between text-sm font-black text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-[#17466E]">₹{selectedTest.price}</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center gap-2 text-[11px] text-emerald-800 font-bold">
              <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
              <span>100% Secure Checkout via Cashfree Payments</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading Cart...</div>}>
      <CartBookingContent />
    </Suspense>
  );
}
