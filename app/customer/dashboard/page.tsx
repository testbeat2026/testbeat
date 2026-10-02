'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DB } from '@/lib/dataStore';

export default function CustomerDashboardPage() {
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'REPORTS' | 'PROFILE'>('ORDERS');
  const [orders, setOrders] = useState<any[]>(DB.orders);

  useEffect(() => {
    fetch('/api/orders/list')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.orders && data.orders.length > 0) {
          setOrders(data.orders);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-[#FF5A00] uppercase tracking-widest">Patient Portal</span>
          <h1 className="text-2xl font-black text-[#002B49] mt-0.5">Welcome, Shubhranshu Kumar</h1>
          <p className="text-xs text-slate-500">Contact: +91 9876543210 • Greater Noida, UP</p>
        </div>
        <Link href="/" className="bg-[#FF5A00] hover:bg-[#E04E00] text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition">
          + Book Health Test
        </Link>
      </div>

      <div className="flex gap-2 border-b border-slate-200 mt-6 pb-2 text-xs font-bold">
        <button onClick={() => setActiveTab('ORDERS')} className={`px-4 py-2 rounded-xl transition ${activeTab === 'ORDERS' ? 'bg-[#002B49] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
          📦 My Health Bookings & Tracking
        </button>
        <button onClick={() => setActiveTab('REPORTS')} className={`px-4 py-2 rounded-xl transition ${activeTab === 'REPORTS' ? 'bg-[#002B49] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
          📄 Digital Smart Reports
        </button>
        <button onClick={() => setActiveTab('PROFILE')} className={`px-4 py-2 rounded-xl transition ${activeTab === 'PROFILE' ? 'bg-[#002B49] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
          ⚙️ Patient Profile & Address
        </button>
      </div>

      {activeTab === 'ORDERS' && (
        <div className="mt-6 space-y-4">
          {orders.map(o => (
            <div key={o.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">{o.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${(o.payment_status || o.paymentStatus) === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    Payment: {o.payment_status || o.paymentStatus || 'PENDING'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                    {o.status}
                  </span>
                </div>
                <h3 className="font-bold text-[#002B49] text-base mt-2">{o.item_name || o.itemName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lab: <b>{o.lab_name || o.labName}</b> • Patient: <b>{o.patient_name || o.patientName}</b> • Slot: {o.slot}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Phlebotomist: <b>{o.phlebo_name || o.phleboName || 'Assigned on Dispatch'}</b></p>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-5">
                <span className="text-lg font-black text-slate-900">₹{o.total_amount || o.totalAmount}</span>
                <button onClick={() => alert("Downloading Verified Healthians-Standard PDF Report...")} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition">
                  📄 Download Smart Report
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'REPORTS' && (
        <div className="mt-6 bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="font-bold text-sm text-[#002B49] mb-3">Lifetime Verified Health Records</h3>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
            <div>
              <h4 className="font-bold text-slate-900">Thyrocare Complete HealthShield 84 Parameters Report</h4>
              <p className="text-slate-400">Delivered: Oct 01, 2026</p>
            </div>
            <button onClick={() => alert("Downloading PDF...")} className="bg-[#FF5A00] text-white px-4 py-2 rounded-xl font-bold">
              Download PDF
            </button>
          </div>
        </div>
      )}

      {activeTab === 'PROFILE' && (
        <div className="mt-6 bg-white p-6 rounded-2xl border border-slate-200 max-w-lg text-xs space-y-3">
          <h3 className="font-bold text-sm text-[#002B49]">Patient Details</h3>
          <div><label className="text-slate-500">Name:</label> <p className="font-bold text-slate-900">Shubhranshu Kumar</p></div>
          <div><label className="text-slate-500">Mobile:</label> <p className="font-bold text-slate-900">+91 9876543210</p></div>
          <div><label className="text-slate-500">Address:</label> <p className="font-bold text-slate-900">Flat 402, Green Avenue, Greater Noida (201310)</p></div>
        </div>
      )}
    </div>
  );
}
