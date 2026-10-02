import React from 'react';
import Link from 'next/link';

export default function HomeEcgPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <span className="text-5xl block mb-3">🫀</span>
      <h1 className="text-3xl font-black text-slate-900">12-Lead Home ECG Service</h1>
      <p className="text-slate-600 mt-2 text-sm">Hospital-grade certified 12-Lead ECG conducted by trained cardiac paramedics. Instant cardiologist verified digital report within 30 minutes.</p>
      <div className="mt-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm max-w-md mx-auto text-left">
        <div className="flex justify-between items-center pb-3 border-b">
          <h3 className="font-bold text-slate-900 text-sm">12-Lead ECG + Doctor Review</h3>
          <span className="text-lg font-black text-cyan-900">₹799</span>
        </div>
        <p className="py-3 text-xs text-slate-500">✓ Paramedic arrives in 60-90 minutes with machine</p>
        <Link href="/" className="block text-center w-full py-2.5 bg-cyan-600 text-white font-bold rounded-xl text-xs">Book Home ECG Slot</Link>
      </div>
    </div>
  );
}
