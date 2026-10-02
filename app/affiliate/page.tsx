'use client';
import React from 'react';

export default function AffiliatePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-black text-[#002B49]">Clinic & Pharmacy Partner Ecosystem</h1>
      <p className="text-xs text-slate-500 mt-1">Printable diagnostic QR standee generator for clinics, doctors and pharmacies.</p>

      <div className="mt-8 max-w-xs mx-auto border-4 border-[#002B49] rounded-3xl p-6 bg-gradient-to-b from-orange-50 to-white shadow-xl flex flex-col items-center">
        <span className="w-10 h-10 rounded-xl bg-[#FF5A00] text-white font-black flex items-center justify-center text-lg mb-2">TB</span>
        <h4 className="font-black text-[#002B49]">TEST<span className="text-[#FF5A00]">BEAT</span></h4>
        <p className="text-[11px] font-bold text-slate-500">Authorised Diagnostic Partner</p>

        <div className="my-5 p-4 bg-white rounded-2xl border-2 border-slate-900">
          <div className="w-32 h-32 bg-slate-900 flex items-center justify-center text-white text-[10px] text-center p-2 rounded font-mono">
            [DYNAMIC QR CODE]<br/>Scan & Book with Dr. Sharma Clinic
          </div>
        </div>

        <div className="bg-[#FF5A00] text-white px-4 py-1.5 rounded-full text-xs font-bold">Flat ₹100 OFF on Blood Tests</div>
      </div>

      <button onClick={() => window.print()} className="mt-6 bg-[#002B49] text-white font-bold px-6 py-2.5 rounded-xl text-xs">
        🖨️ Print Clinic Standee
      </button>
    </div>
  );
}
