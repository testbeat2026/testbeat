'use client';
import React from 'react';
import Link from 'next/link';
import { DATA } from '@/lib/dataStore';
import { useAuth } from '@/lib/authContext';

export default function CustomerOrders() {
  const { customerPhone } = useAuth();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Diagnostic Bookings & Digital Reports</h1>
          <p className="text-xs text-slate-500 mt-1">Live tracking of phlebotomists, fasting slots, and digital reports.</p>
        </div>
        <Link href="/" className="text-xs bg-cyan-600 text-white font-bold px-4 py-2 rounded-xl shadow-sm">
          + Book Another Test
        </Link>
      </div>

      <div className="space-y-4">
        {DATA.orders.map((o) => (
          <div key={o.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">{o.id}</span>
                <span className="text-[10px] font-bold bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded uppercase">{o.status.replace(/_/g, ' ')}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base mt-2">{o.testName}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Lab: <b>{o.labName}</b> • Patient: <b>{o.patientName}</b> ({o.patientRelation}) • Slot: {o.slot}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Address: {o.address}</p>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-5">
              <span className="text-base font-black text-slate-900">₹{o.totalAmount}</span>
              {o.reportReady ? (
                <button
                  onClick={() => alert(`Downloading verified digital PDF report for order ${o.id}...`)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm"
                >
                  📄 Download Report
                </button>
              ) : (
                <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-xl font-medium">
                  Phlebotomist Assigned
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
