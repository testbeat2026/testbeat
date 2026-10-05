'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  ShieldCheck, Clock, Calendar, MapPin, 
  User, Phone, Mail, Building2, CheckCircle2, Lock
} from 'lucide-react';

declare global {
  interface Window {
    Cashfree: any;
  }
}

function CartContent() {
  const searchParams = useSearchParams();
  const testId = searchParams.get('test_id') || '1';
  const labId = searchParams.get('lab_id') || '1';

  const [testName, setTestName] = useState('Full Body Checkup');
  const [labName, setLabName] = useState('Redcliffe Labs');
  const [price, setPrice] = useState(999);
  const [loading, setLoading] = useState(false);

  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('201310');
  const [date, setDate] = useState('2026-10-06');
  const [slot, setSlot] = useState('06:00 AM - 07:00 AM (Recommended for Fasting)');

  useEffect(() => {
    if (testId === '2') {
      setTestName('Complete Blood Count (CBC - 24 Params)');
      setPrice(299);
    } else if (testId === '3') {
      setTestName('Advanced Diabetes 90-Day Glycemic Panel');
      setPrice(499);
    } else if (testId === '4') {
      setTestName('Senior Citizen Vital Organ Care');
      setPrice(1499);
    } else if (testId === '5') {
      setTestName('Women Hormonal & PCOD Screening');
      setPrice(1199);
    } else if (testId === '6') {
      setTestName('Heart Health & Lipid Profile Extended');
      setPrice(399);
    } else {
      setTestName('HealthShield Complete Full Body Checkup');
      setPrice(999);
    }

    if (labId === '2') setLabName('Dr Lal PathLabs');
    if (labId === '3') setLabName('Thyrocare');
  }, [testId, labId]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName || !phone || !address) {
      alert('Please fill in your Name, Phone Number, and Complete Address');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_name: patientName,
          phone,
          email,
          address,
          pincode,
          test_id: Number(testId),
          test_name: testName,
          lab_id: Number(labId),
          amount: price,
          collection_date: date,
          collection_slot: slot
        })
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error || 'Failed to start payment');
        setLoading(false);
        return;
      }

      if (typeof window !== 'undefined' && window.Cashfree) {
        const cashfree = window.Cashfree({
          mode: process.env.NEXT_PUBLIC_CASHFREE_MODE === 'PRODUCTION' ? 'production' : 'sandbox'
        });

        cashfree.checkout({
          paymentSessionId: data.payment_session_id,
          redirectTarget: '_self'
        });
      } else {
        alert(`Booking #${data.order_id} recorded in Neon database. Loading payment checkout...`);
      }

    } catch (err: any) {
      alert('Payment initialization error: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 px-4 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <span className="text-[11px] font-black uppercase text-[#00B4D8] bg-blue-50 px-2.5 py-1 rounded-md">
            Safe & Sanitized Home Collection
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
            Confirm Diagnostic Booking
          </h1>
        </div>

        <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 mb-4">
                <User size={16} className="text-[#00B4D8]" /> 1. Patient Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Patient full name"
                    className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-[#00B4D8]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mobile Number (For Reports) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10 digit mobile number"
                    className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-[#00B4D8]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Email ID (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="To receive digital PDF report"
                    className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-[#00B4D8]"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 mb-4">
                <MapPin size={16} className="text-[#FF6B35]" /> 2. Home Sample Collection Address
              </h3>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Complete House Address *</label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Flat / House No, Building name, Street / Society, Landmark"
                    className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-[#00B4D8]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Pincode"
                    className="w-full sm:w-48 p-3 rounded-xl border border-slate-200 outline-none focus:border-[#00B4D8]"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 mb-4">
                <Calendar size={16} className="text-[#00B4D8]" /> 3. Select Date & Fasting Slot
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-[#00B4D8]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time Slot</label>
                  <select
                    value={slot}
                    onChange={(e) => setSlot(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-[#00B4D8] bg-white"
                  >
                    <option>06:00 AM - 07:00 AM (Best for Fasting)</option>
                    <option>07:00 AM - 08:00 AM</option>
                    <option>08:00 AM - 09:00 AM</option>
                    <option>09:00 AM - 10:00 AM</option>
                    <option>10:00 AM - 11:00 AM</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-20">
              <h3 className="font-black text-slate-900 text-sm mb-4 pb-3 border-b border-slate-100">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Selected Test</span>
                  <p className="font-extrabold text-slate-900 mt-0.5 text-sm">{testName}</p>
                </div>

                <div className="flex items-center justify-between py-2 border-y border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Building2 size={14} className="text-[#00B4D8]" /> Processing Lab:
                  </span>
                  <span className="font-bold text-slate-900">{labName}</span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Standard Test Price</span>
                  <span className="line-through">₹{price * 2}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>TestBeat Aggregator Discount</span>
                  <span>- ₹{price}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Home Sample Collection</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="font-extrabold text-sm text-slate-900">Total Payable</span>
                  <span className="font-black text-2xl text-slate-900">₹{price}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-[#FF6B35] hover:bg-[#E85D04] text-white font-extrabold text-sm py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Lock size={16} /> {loading ? 'Creating Order...' : `Pay ₹${price} & Book`}
              </button>

              <div className="mt-4 space-y-1.5 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  <span>NABL Barcoded Cold-Chain Sample Box</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  <span>100% Free Cancellation before sample pickup</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading booking cart...</div>}>
      <CartContent />
    </Suspense>
  );
}
