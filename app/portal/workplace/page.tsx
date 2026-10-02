'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DB } from '@/lib/dataStore';

export default function WorkplaceConsole() {
  const router = useRouter();
  const [role, setRole] = useState<'SUPER_ADMIN' | 'OPERATIONS' | 'FINANCE' | 'SALES'>('SUPER_ADMIN');
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'ORDERS' | 'CUSTOMERS' | 'LABS' | 'PACKAGES' | 'PRICING' | 'SETTLEMENTS'>('DASHBOARD');
  const [orderLabFilter, setOrderLabFilter] = useState<string>('ALL');
  const [liveOrders, setLiveOrders] = useState<any[]>(DB.orders);

  useEffect(() => {
    const saved = localStorage.getItem('tb_staff_role');
    if (saved) setRole(saved as any);

    // Fetch live orders from Neon PostgreSQL
    fetch('/api/orders/list')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.orders && data.orders.length > 0) {
          setLiveOrders(data.orders);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-[#FF5A00] flex items-center justify-center text-white font-black text-sm">TB</div>
            <div>
              <h3 className="font-bold text-sm text-white">Aggregator Workplace</h3>
              <span className="text-[10px] bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded font-bold uppercase">{role}</span>
            </div>
          </div>

          <nav className="mt-6 space-y-1 text-xs font-semibold">
            <button onClick={() => setActiveTab('DASHBOARD')} className={`w-full text-left px-3 py-2.5 rounded-xl transition ${activeTab === 'DASHBOARD' ? 'bg-[#FF5A00] text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
              📊 Workplace Overview
            </button>
            <button onClick={() => setActiveTab('ORDERS')} className={`w-full text-left px-3 py-2.5 rounded-xl transition ${activeTab === 'ORDERS' ? 'bg-[#FF5A00] text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
              📦 Live Orders (Neon DB)
            </button>
            <button onClick={() => setActiveTab('CUSTOMERS')} className={`w-full text-left px-3 py-2.5 rounded-xl transition ${activeTab === 'CUSTOMERS' ? 'bg-[#FF5A00] text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
              👥 Patient Directory CRM
            </button>
            <button onClick={() => setActiveTab('LABS')} className={`w-full text-left px-3 py-2.5 rounded-xl transition ${activeTab === 'LABS' ? 'bg-[#FF5A00] text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
              🏥 Accredited Labs Network
            </button>
            <button onClick={() => setActiveTab('PACKAGES')} className={`w-full text-left px-3 py-2.5 rounded-xl transition ${activeTab === 'PACKAGES' ? 'bg-[#FF5A00] text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
              🩺 Health Package Builder
            </button>
            <button onClick={() => setActiveTab('PRICING')} className={`w-full text-left px-3 py-2.5 rounded-xl transition ${activeTab === 'PRICING' ? 'bg-[#FF5A00] text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
              💰 B2B Cost & Margin Switchboard
            </button>
            <button onClick={() => setActiveTab('SETTLEMENTS')} className={`w-full text-left px-3 py-2.5 rounded-xl transition ${activeTab === 'SETTLEMENTS' ? 'bg-[#FF5A00] text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
              📑 Cashfree Lab Settlements
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
          <Link href="/" target="_blank" className="text-xs text-amber-400 hover:underline">View Storefront ↗</Link>
          <button onClick={() => router.push('/portal/login')} className="text-xs text-rose-400 hover:underline font-bold">Sign Out</button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen">
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">{role} Executive Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400">Total Bookings</span>
                <h3 className="text-2xl font-black text-white mt-1">{liveOrders.length} Orders</h3>
              </div>
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400">Total GMV</span>
                <h3 className="text-2xl font-black text-emerald-400 mt-1">₹{liveOrders.reduce((acc, o) => acc + Number(o.total_amount || o.totalAmount || 0), 0)}</h3>
              </div>
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400">Platform Gross Margin</span>
                <h3 className="text-2xl font-black text-amber-400 mt-1">₹{liveOrders.reduce((acc, o) => acc + Number(o.platform_margin || o.platformMargin || 0), 0)}</h3>
              </div>
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400">Database Engine</span>
                <h3 className="text-2xl font-black text-cyan-400 mt-1">Neon Postgres</h3>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ORDERS' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-black text-white">Live Neon PostgreSQL Orders Stream</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">Filter Lab:</span>
                <select
                  value={orderLabFilter}
                  onChange={(e) => setOrderLabFilter(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white rounded-xl p-2 text-xs font-bold"
                >
                  <option value="ALL">All Diagnostic Labs</option>
                  {DB.labs.map(l => (
                    <option key={l.id} value={l.name}>{l.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <tr><th className="p-4">Order ID</th><th className="p-4">Patient</th><th className="p-4">Test & Lab</th><th className="p-4">Payment</th><th className="p-4">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {liveOrders.map(o => (
                    <tr key={o.id}>
                      <td className="p-4 font-mono font-bold text-amber-400">{o.id}</td>
                      <td className="p-4"><p className="font-bold text-white">{o.patient_name || o.patientName}</p><p className="text-[11px] text-slate-500">{o.customer_phone || o.patientPhone}</p></td>
                      <td className="p-4"><p className="font-semibold text-white">{o.item_name || o.itemName}</p><p className="text-[11px] text-teal-400 font-bold">{o.lab_name || o.labName}</p></td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${(o.payment_status || o.paymentStatus) === 'PAID' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
                          {o.payment_status || o.paymentStatus || 'PENDING'}
                        </span>
                      </td>
                      <td className="p-4"><span className="px-2.5 py-0.5 rounded bg-amber-950 text-amber-400 font-bold text-[10px]">{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'CUSTOMERS' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Active Patient Directory (Neon PostgreSQL)</h2>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <tr><th className="p-4">Customer ID</th><th className="p-4">Name / Mobile</th><th className="p-4">Address</th><th className="p-4">Total Orders</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {DB.customers.map(c => (
                    <tr key={c.id}>
                      <td className="p-4 font-mono font-bold text-teal-400">{c.id}</td>
                      <td className="p-4"><p className="font-bold text-white">{c.name}</p><p className="text-[11px] text-slate-500">{c.phone}</p></td>
                      <td className="p-4 text-slate-400">{c.address} ({c.pincode})</td>
                      <td className="p-4">{c.totalOrders} Completed</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'LABS' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Connected Diagnostic Laboratories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DB.labs.map(l => (
                <div key={l.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{l.logo}</span>
                    <h4 className="font-bold text-white text-base">{l.name}</h4>
                  </div>
                  <p className="text-slate-400 mt-2">Accreditation: <b>{l.accreditation}</b></p>
                  <p className="text-amber-400 font-mono mt-1 font-bold">Payables: ₹{l.walletBalance}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'PACKAGES' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Curated Health Packages</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DB.packages.map(pkg => (
                <div key={pkg.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-xs">
                  <h4 className="font-bold text-white text-base">{pkg.name}</h4>
                  <p className="text-slate-400 mt-1">{pkg.parametersCount} Tests • Partner: <b>{pkg.partnerLab}</b></p>
                  <p className="text-amber-400 font-bold mt-1">Retail: ₹{pkg.price} (B2B: ₹{pkg.b2bCost})</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'PRICING' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">B2B Lab Cost vs Retail Price & Margin Engine</h2>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <tr><th className="p-4">Diagnostic Lab</th><th className="p-4">B2B Cost</th><th className="p-4">Customer Retail</th><th className="p-4">Platform Margin</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {DB.labPricing.map(m => (
                    <tr key={m.id}>
                      <td className="p-4 font-bold text-white">{m.labName}</td>
                      <td className="p-4 font-mono text-rose-400">₹{m.b2bCost}</td>
                      <td className="p-4 font-mono text-amber-400 font-bold">₹{m.retailPrice}</td>
                      <td className="p-4 font-mono text-emerald-400 font-bold">+₹{m.retailPrice - m.b2bCost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'SETTLEMENTS' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Cashfree Payouts & Lab Settlements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DB.labs.map(lab => (
                <div key={lab.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-xs">
                  <h4 className="font-bold text-white text-base">{lab.name}</h4>
                  <p className="text-slate-400 mt-2">Gross B2B Payables: <b className="text-rose-400 font-mono">₹{lab.walletBalance}</b></p>
                  <p className="text-slate-400">TDS (2%): ₹{Math.round(lab.walletBalance * 0.02)}</p>
                  <button onClick={() => alert(`Triggered Cashfree direct IMPS payout to ${lab.name}!`)} className="mt-4 w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl transition">
                    Trigger Cashfree Payout (₹{lab.walletBalance - Math.round(lab.walletBalance * 0.02)})
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
