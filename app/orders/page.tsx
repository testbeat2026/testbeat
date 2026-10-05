'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Calendar, MapPin, Phone, ShieldCheck, Download, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function OrderDetails() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || `TB-${Date.now().toString().slice(-6)}`;

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-12 px-4 font-sans text-slate-800">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-10 text-center">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-sm">
          <CheckCircle2 size={36} />
        </div>

        <span className="text-[11px] font-black uppercase tracking-wider text-[#00B4D8] bg-blue-50 px-3 py-1 rounded-full">
          Booking Confirmed
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
          Diagnostic Test Scheduled!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Your home sample collection request has been registered in the system.
        </p>

        {/* Booking Card Details */}
        <div className="mt-8 bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200">
            <span className="text-slate-500 font-medium">Booking ID:</span>
            <span className="font-extrabold text-slate-900 text-base">{orderId}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Payment Status:</span>
            <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs">
              ✓ Verified & Received
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Phlebotomist Visit:</span>
            <span className="font-bold text-slate-800">Tomorrow • 06:30 AM</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Sample Kit:</span>
            <span className="font-bold text-slate-800">Barcoded Cold-Chain Box</span>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-200">
            <span className="text-slate-500 font-medium">Digital PDF Report:</span>
            <span className="font-bold text-[#0077B6]">Within 18-24 Hours via WhatsApp</span>
          </div>
        </div>

        {/* Safety Note */}
        <div className="mt-6 flex items-start gap-2 text-left bg-blue-50/60 p-3.5 rounded-xl border border-blue-100 text-xs text-slate-600">
          <ShieldCheck size={18} className="text-[#00B4D8] shrink-0 mt-0.5" />
          <span>
            <strong>Fasting Guideline:</strong> Please maintain 10-12 hours of overnight fasting before the phlebotomist arrives. Only plain water is permitted.
          </span>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 bg-[#0F223A] hover:bg-[#163252] text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition flex items-center justify-center gap-1.5 shadow"
          >
            Back to Home
          </Link>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition flex items-center justify-center gap-1.5 shadow"
          >
            Chat Support on WhatsApp <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-500">Loading order receipt...</div>}>
      <OrderDetails />
    </Suspense>
  );
}
