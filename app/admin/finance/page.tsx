'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { Wallet, TrendingUp, RefreshCw, CheckCircle2, Clock } from 'lucide-react';

export default function AdminFinancePage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFinance = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      if (!res.ok) throw new Error('API offline');
      const data = await res.json();
      if (data.success) setOrders(data.orders || []);
    } catch (e) {
      console.warn('Finance data fetch skipped during static phase');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinance();
  }, []);

  const paidOrders = orders.filter(o => o?.payment_status === 'PAID');
  const gross = paidOrders.reduce((sum, o) => sum + Number(o?.amount || 0), 0);
  const labShare = Math.round(gross * 0.55);
  const netMargin = Math.round(gross * 0.45);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Finance & Settlements Desk 💳</h1>
          <p className="text-xs text-slate-500 font-bold mt-1">Cashfree PG collections, Lab fulfillments & Net margin</p>
        </div>
        <button
          onClick={fetchFinance}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-2xs hover:bg-slate-50 cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Sync Ledger</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Gross Collection</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-slate-900">₹{gross}</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Cashfree PG</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Lab Payables (~55%)</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-amber-600">₹{labShare}</span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Redcliffe/Lal</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Platform Margin (~45%)</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-[#00A896]">₹{netMargin}</span>
            <span className="text-[10px] font-bold text-[#00A896] bg-teal-50 px-2 py-0.5 rounded-full">Net Profit</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Settled Bookings</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-blue-600">{paidOrders.length} Paid</span>
            <span className="text-[10px] font-bold text-slate-400">Total: {orders.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-black text-xs uppercase text-slate-800">
          Reconciled Settlement Log
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px]">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Gross Collected</th>
                <th className="py-3 px-4">Lab Cost (~55%)</th>
                <th className="py-3 px-4">Platform Margin</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">
                    No transaction entries found.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{o.order_id}</td>
                    <td className="py-3.5 px-4">{o.customer_name || 'Patient'}</td>
                    <td className="py-3.5 px-4 font-black">₹{o.amount}</td>
                    <td className="py-3.5 px-4 font-mono text-amber-700">₹{Math.round(Number(o.amount || 0) * 0.55)}</td>
                    <td className="py-3.5 px-4 font-mono text-emerald-600 font-black">₹{Math.round(Number(o.amount || 0) * 0.45)}</td>
                    <td className="py-3.5 px-4">
                      {o.payment_status === 'PAID' ? (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <CheckCircle2 size={11} /> PAID
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Clock size={11} /> PENDING
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
