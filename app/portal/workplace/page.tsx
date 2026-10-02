'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DB } from '@/lib/dataStore';

export default function WorkplaceConsole() {
  const router = useRouter();
  const [role, setRole] = useState<'SUPER_ADMIN' | 'OPERATIONS' | 'FINANCE' | 'SALES'>('SUPER_ADMIN');
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'ORDERS' | 'PACKAGES' | 'TESTS' | 'PRICING' | 'SETTLEMENTS'>('DASHBOARD');

  useEffect(() => {
    const saved = localStorage.getItem('tb_staff_role');
    if (saved) setRole(saved as any);
  }, []);

  // Real Add Package Form State
  const [pkgTitle, setPkgTitle] = useState('');
  const [pkgCategory, setPkgCategory] = useState('Full Body Checkup');
  const [pkgCount, setPkgCount] = useState(80);
  const [pkgMrp, setPkgMrp] = useState(3500);
  const [pkgPrice, setPkgPrice] = useState(1099);
  const [pkgCost, setPkgCost] = useState(600);

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgTitle) return;
    DB.packages.unshift({
      id: "PKG-" + Date.now(),
      name: pkgTitle,
      badge: "NEW LAUNCH",
      category: pkgCategory,
      parametersCount: Number(pkgCount),
      mrp: Number(pkgMrp),
      price: Number(pkgPrice),
      b2bCost: Number(pkgCost),
      discountPercent: Math.round(((Number(pkgMrp) - Number(pkgPrice)) / Number(pkgMrp)) * 100),
      fastingHours: 10,
      sampleType: "Blood & Urine",
      tat: "Reports in 24 Hours",
      tags: ["Doctor Consultation Included"],
      subPackages: [{ title: "Comprehensive Screen", count: Number(pkgCount), tests: ["Complete Profile"] }]
    });
    setPkgTitle('');
    alert("New Health Package successfully created and live on storefront!");
  };

  const handleUpdateOrderStatus = (orderId: string) => {
    const order = DB.orders.find(o => o.id === orderId);
    if (order) {
      if (order.status === 'SCHEDULED') order.status = 'PHLEBO_ASSIGNED';
      else if (order.status === 'PHLEBO_ASSIGNED') order.status = 'SAMPLE_COLLECTED';
      else if (order.status === 'SAMPLE_COLLECTED') order.status = 'PROCESSING';
      else if (order.status === 'PROCESSING') order.status = 'REPORT_READY';
      else if (order.status === 'REPORT_READY') order.status = 'COMPLETED';
      alert(`Order ${orderId} moved to stage: ${order.status}`);
      // trigger rerender
      setActiveTab(activeTab);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Workplace Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-[#FF5A00] flex items-center justify-center text-white font-black text-sm">TB</div>
            <div>
              <h3 className="font-bold text-sm text-white">Workplace Portal</h3>
              <span className="text-[10px] bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded font-bold uppercase">{role}</span>
            </div>
          </div>

          <nav className="mt-6 space-y-1 text-xs font-semibold">
            <button onClick={() => setActiveTab('DASHBOARD')} className={`w-full text-left px-3 py-2.5 rounded-xl transition ${activeTab === 'DASHBOARD' ? 'bg-[#FF5A00] text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
              📊 Workplace Overview
            </button>
            <button onClick={() => setActiveTab('ORDERS')} className={`w-full text-left px-3 py-2.5 rounded-xl transition ${activeTab === 'ORDERS' ? 'bg-[#FF5A00] text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
              📦 Phlebotomy Dispatch Stream
            </button>
            <button onClick={() => setActiveTab('PACKAGES')} className={`w-full text-left px-3 py-2.5 rounded-xl transition ${activeTab === 'PACKAGES' ? 'bg-[#FF5A00] text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
              🩺 Health Package Builder
            </button>
            <button onClick={() => setActiveTab('TESTS')} className={`w-full text-left px-3 py-2.5 rounded-xl transition ${activeTab === 'TESTS' ? 'bg-[#FF5A00] text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
              🧪 Master Test Normalization
            </button>
            <button onClick={() => setActiveTab('PRICING')} className={`w-full text-left px-3 py-2.5 rounded-xl transition ${activeTab === 'PRICING' ? 'bg-[#FF5A00] text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
              💰 B2B Cost & Margin Switchboard
            </button>
            <button onClick={() => setActiveTab('SETTLEMENTS')} className={`w-full text-left px-3 py-2.5 rounded-xl transition ${activeTab === 'SETTLEMENTS' ? 'bg-[#FF5A00] text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
              📑 Lab Payables & Invoices
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
          <Link href="/" target="_blank" className="text-xs text-amber-400 hover:underline">View Storefront ↗</Link>
          <button onClick={() => router.push('/portal/login')} className="text-xs text-rose-400 hover:underline font-bold">Sign Out</button>
        </div>
      </aside>

      {/* Workplace Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen">
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">{role} Operations Console</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400">Total Orders</span>
                <h3 className="text-2xl font-black text-white mt-1">{DB.orders.length}</h3>
              </div>
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400">Total GMV Bookings</span>
                <h3 className="text-2xl font-black text-emerald-400 mt-1">₹{DB.orders.reduce((acc, o) => acc + o.totalAmount, 0)}</h3>
              </div>
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400">Platform Gross Margin</span>
                <h3 className="text-2xl font-black text-amber-400 mt-1">₹{DB.orders.reduce((acc, o) => acc + o.platformMargin, 0)}</h3>
              </div>
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400">Active Health Packages</span>
                <h3 className="text-2xl font-black text-cyan-400 mt-1">{DB.packages.length} Packages</h3>
              </div>
            </div>
          </div>
        )}

        {/* Orders Stream */}
        {activeTab === 'ORDERS' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Live Phlebotomy Dispatch & Order Tracking</h2>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <tr><th className="p-4">Order ID</th><th className="p-4">Patient</th><th className="p-4">Item Booked</th><th className="p-4">Fasting Slot</th><th className="p-4">Phlebo</th><th className="p-4">Status</th><th className="p-4">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {DB.orders.map(o => (
                    <tr key={o.id}>
                      <td className="p-4 font-mono font-bold text-amber-400">{o.id}</td>
                      <td className="p-4"><p className="font-bold text-white">{o.patientName}</p><p className="text-[11px] text-slate-500">{o.patientPhone}</p></td>
                      <td className="p-4"><p className="font-semibold text-white">{o.itemName}</p><p className="text-[11px] text-teal-400">{o.labName}</p></td>
                      <td className="p-4 text-slate-400">{o.slot}</td>
                      <td className="p-4">{o.phleboName}</td>
                      <td className="p-4"><span className="px-2.5 py-0.5 rounded bg-amber-950 text-amber-400 font-bold text-[10px]">{o.status}</span></td>
                      <td className="p-4">
                        <button onClick={() => handleUpdateOrderStatus(o.id)} className="bg-[#FF5A00] hover:bg-[#E04E00] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold">
                          Progress Status ➔
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Packages Builder */}
        {activeTab === 'PACKAGES' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Health Package Builder & Catalog Management</h2>
            <form onSubmit={handleCreatePackage} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-300 block mb-1">Package Title</label>
                <input type="text" required placeholder="e.g. Executive Full Body Vital Checkup (80 Tests)" value={pkgTitle} onChange={(e) => setPkgTitle(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold" />
              </div>
              <div>
                <label className="font-bold text-slate-300 block mb-1">Category</label>
                <select value={pkgCategory} onChange={(e) => setPkgCategory(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold">
                  <option>Full Body Checkup</option><option>Senior Citizen Special</option><option>Women's Wellness</option><option>Diabetes Care</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-300 block mb-1">Tests Count</label>
                <input type="number" required value={pkgCount} onChange={(e) => setPkgCount(Number(e.target.value))} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
              </div>
              <div>
                <label className="font-bold text-slate-300 block mb-1">B2B Lab Cost (₹)</label>
                <input type="number" required value={pkgCost} onChange={(e) => setPkgCost(Number(e.target.value))} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
              </div>
              <div>
                <label className="font-bold text-slate-300 block mb-1">Customer Price (₹)</label>
                <input type="number" required value={pkgPrice} onChange={(e) => setPkgPrice(Number(e.target.value))} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-amber-400" />
              </div>
              <div className="sm:col-span-3 flex justify-end">
                <button type="submit" className="py-2.5 px-6 bg-[#FF5A00] hover:bg-[#E04E00] text-white font-bold rounded-xl text-xs transition">
                  + Publish Package on Storefront
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {DB.packages.map(pkg => (
                <div key={pkg.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between text-xs">
                  <div>
                    <span className="text-[10px] bg-slate-800 text-amber-400 px-2 py-0.5 rounded font-bold uppercase">{pkg.category}</span>
                    <h4 className="font-bold text-white text-sm mt-2">{pkg.name}</h4>
                    <p className="text-slate-400 mt-1">{pkg.parametersCount} Parameters • Fasting {pkg.fastingHours}h</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-slate-400">B2B: ₹{pkg.b2bCost} → </span>
                      <span className="text-amber-400 font-bold">Retail: ₹{pkg.price}</span>
                    </div>
                    <span className="text-emerald-400 font-bold">Margin: +₹{pkg.price - pkg.b2bCost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Switchboard */}
        {activeTab === 'PRICING' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">B2B Lab Cost vs Retail Price & Margin Engine</h2>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <tr><th className="p-4">Diagnostic Lab</th><th className="p-4">Test Title</th><th className="p-4">Agreed B2B Cost</th><th className="p-4">Customer Retail</th><th className="p-4">Platform Margin</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {DB.labMappings.map(m => (
                    <tr key={m.id}>
                      <td className="p-4 font-bold text-white">{m.labName}</td>
                      <td className="p-4">{m.labTestName || "Diagnostic Assay"}</td>
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

        {/* Settlements */}
        {activeTab === 'SETTLEMENTS' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Laboratory Settlements & Invoices</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Healthians Diagnostic', 'Thyrocare Technologies', 'Redcliffe Labs', 'Dr Lal PathLabs'].map((lab, i) => (
                <div key={i} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-xs">
                  <h4 className="font-bold text-white text-base">{lab}</h4>
                  <p className="text-slate-400 mt-2">B2B Completed Bookings: <b>142 Orders</b></p>
                  <p className="text-rose-400 font-mono mt-1">Gross Payable: <b>₹64,200</b></p>
                  <button onClick={() => alert(`Generated settlement tax invoice for ${lab}!`)} className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition">
                    Generate Formal GST Settlement PDF
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
