'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DB } from '@/lib/dataStore';

export default function WorkplaceConsole() {
  const router = useRouter();
  const [role, setRole] = useState<'SUPER_ADMIN' | 'OPERATIONS' | 'FINANCE' | 'SALES'>('SUPER_ADMIN');
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'ORDERS' | 'LABS' | 'CUSTOMERS' | 'PACKAGES' | 'PRICING' | 'SETTLEMENTS'>('DASHBOARD');
  const [orderLabFilter, setOrderLabFilter] = useState<string>('ALL');

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
  const [pkgLab, setPkgLab] = useState('Healthians Diagnostic');

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
      partnerLab: pkgLab,
      subProfiles: [{ name: "Comprehensive Panel", count: Number(pkgCount), tests: ["Complete Profile"] }]
    });
    setPkgTitle('');
    alert("New Health Package created and live on customer storefront!");
  };

  const handleUpdateOrderStatus = (orderId: string) => {
    const order = DB.orders.find(o => o.id === orderId);
    if (order) {
      if (order.status === 'SCHEDULED') order.status = 'PHLEBO_ASSIGNED';
      else if (order.status === 'PHLEBO_ASSIGNED') order.status = 'SAMPLE_COLLECTED';
      else if (order.status === 'SAMPLE_COLLECTED') order.status = 'LAB_RECEIVED';
      else if (order.status === 'LAB_RECEIVED') order.status = 'PROCESSING';
      else if (order.status === 'PROCESSING') order.status = 'REPORT_READY';
      else if (order.status === 'REPORT_READY') order.status = 'COMPLETED';
      alert(`Order ${orderId} moved to stage: ${order.status}`);
      setActiveTab(activeTab);
    }
  };

  const filteredOrders = DB.orders.filter(o => {
    if (orderLabFilter === 'ALL') return true;
    return o.labId === orderLabFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Workplace Sidebar */}
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
              📦 Live Orders (Per Lab Stream)
            </button>
            <button onClick={() => setActiveTab('CUSTOMERS')} className={`w-full text-left px-3 py-2.5 rounded-xl transition ${activeTab === 'CUSTOMERS' ? 'bg-[#FF5A00] text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
              👥 Active Customer CRM List
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
              📑 Lab Settlement Ledgers
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
          <Link href="/" target="_blank" className="text-xs text-amber-400 hover:underline">View Storefront ↗</Link>
          <button onClick={() => router.push('/portal/login')} className="text-xs text-rose-400 hover:underline font-bold">Sign Out</button>
        </div>
      </aside>

      {/* Workplace Body */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen">
        {/* Overview */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">{role} Executive Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400">Total Bookings</span>
                <h3 className="text-2xl font-black text-white mt-1">{DB.orders.length} Orders</h3>
              </div>
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400">Total GMV</span>
                <h3 className="text-2xl font-black text-emerald-400 mt-1">₹{DB.orders.reduce((acc, o) => acc + o.totalAmount, 0)}</h3>
              </div>
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400">Platform Gross Margin</span>
                <h3 className="text-2xl font-black text-amber-400 mt-1">₹{DB.orders.reduce((acc, o) => acc + o.platformMargin, 0)}</h3>
              </div>
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400">Registered Customers</span>
                <h3 className="text-2xl font-black text-cyan-400 mt-1">{DB.customers.length} Patients</h3>
              </div>
            </div>
          </div>
        )}

        {/* Orders Stream per Lab */}
        {activeTab === 'ORDERS' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-black text-white">Live Phlebotomy & Multi-Lab Order Stream</h2>
              {/* Lab Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">Filter by Lab:</span>
                <select
                  value={orderLabFilter}
                  onChange={(e) => setOrderLabFilter(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white rounded-xl p-2 text-xs font-bold"
                >
                  <option value="ALL">All Diagnostic Labs</option>
                  {DB.labs.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <tr><th className="p-4">Order ID</th><th className="p-4">Patient</th><th className="p-4">Item & Processing Lab</th><th className="p-4">Fasting Slot</th><th className="p-4">Phlebo</th><th className="p-4">Status</th><th className="p-4">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredOrders.map(o => (
                    <tr key={o.id}>
                      <td className="p-4 font-mono font-bold text-amber-400">{o.id}</td>
                      <td className="p-4"><p className="font-bold text-white">{o.patientName}</p><p className="text-[11px] text-slate-500">{o.patientPhone}</p></td>
                      <td className="p-4"><p className="font-semibold text-white">{o.itemName}</p><p className="text-[11px] text-teal-400 font-bold">{o.labName}</p></td>
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

        {/* Active Customer List CRM */}
        {activeTab === 'CUSTOMERS' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Active Registered Customer & Patient Directory</h2>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <tr><th className="p-4">Customer ID</th><th className="p-4">Patient Name / Mobile</th><th className="p-4">Email</th><th className="p-4">Home Address</th><th className="p-4">Orders</th><th className="p-4">Total Spent</th><th className="p-4">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {DB.customers.map(c => (
                    <tr key={c.id}>
                      <td className="p-4 font-mono font-bold text-teal-400">{c.id}</td>
                      <td className="p-4"><p className="font-bold text-white">{c.name}</p><p className="text-[11px] text-slate-500">{c.phone}</p></td>
                      <td className="p-4">{c.email}</td>
                      <td className="p-4 text-slate-400">{c.address} ({c.pincode})</td>
                      <td className="p-4">{c.totalOrders} Completed</td>
                      <td className="p-4 font-bold text-emerald-400">₹{c.totalSpent}</td>
                      <td className="p-4"><span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px]">{c.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Labs Network */}
        {activeTab === 'LABS' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Authorized Diagnostic Laboratories Network</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DB.labs.map(l => (
                <div key={l.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-xs flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{l.logo}</span>
                      <h4 className="font-bold text-white text-base">{l.name}</h4>
                    </div>
                    <p className="text-slate-400 mt-2">Accreditation: <b>{l.accreditation}</b></p>
                    <p className="text-slate-400">Avg Report TAT: <b>{l.tatHours} Hours</b></p>
                    <p className="text-slate-400">Support: {l.contactPhone} • {l.contactEmail}</p>
                    <p className="text-amber-400 font-mono mt-2 font-bold">Unsettled Wallet Balance: ₹{l.walletBalance}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px]">ACTIVE</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Package Builder */}
        {activeTab === 'PACKAGES' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Health Package Builder & Aggregator Publisher</h2>
            <form onSubmit={handleCreatePackage} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-300 block mb-1">Package Title</label>
                <input type="text" required placeholder="e.g. Master Executive Vital Screening (88 Tests)" value={pkgTitle} onChange={(e) => setPkgTitle(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold" />
              </div>
              <div>
                <label className="font-bold text-slate-300 block mb-1">Partner Laboratory</label>
                <select value={pkgLab} onChange={(e) => setPkgLab(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold">
                  <option>Healthians Diagnostic</option><option>Thyrocare Technologies</option><option>Redcliffe Labs</option><option>Dr Lal PathLabs</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-300 block mb-1">Category</label>
                <select value={pkgCategory} onChange={(e) => setPkgCategory(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold">
                  <option>Full Body Checkup</option><option>Senior Citizen Special</option><option>Women's Wellness</option><option>Diabetes Care</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-300 block mb-1">Total Tests Included</label>
                <input type="number" required value={pkgCount} onChange={(e) => setPkgCount(Number(e.target.value))} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
              </div>
              <div>
                <label className="font-bold text-slate-300 block mb-1">B2B Lab Cost (₹)</label>
                <input type="number" required value={pkgCost} onChange={(e) => setPkgCost(Number(e.target.value))} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
              </div>
              <div>
                <label className="font-bold text-slate-300 block mb-1">Customer Retail Price (₹)</label>
                <input type="number" required value={pkgPrice} onChange={(e) => setPkgPrice(Number(e.target.value))} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-amber-400" />
              </div>
              <div className="sm:col-span-3 flex justify-end">
                <button type="submit" className="py-2.5 px-6 bg-[#FF5A00] hover:bg-[#E04E00] text-white font-bold rounded-xl text-xs transition">
                  + Publish Health Package Live
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DB.packages.map(pkg => (
                <div key={pkg.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between text-xs">
                  <div>
                    <span className="text-[10px] bg-slate-800 text-amber-400 px-2 py-0.5 rounded font-bold uppercase">{pkg.category}</span>
                    <h4 className="font-bold text-white text-sm mt-2">{pkg.name}</h4>
                    <p className="text-slate-400 mt-1">{pkg.parametersCount} Tests • Partner: <b>{pkg.partnerLab}</b></p>
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

        {/* Pricing Matrix */}
        {activeTab === 'PRICING' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">B2B Lab Contracted Cost vs Customer Retail Margin</h2>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <tr><th className="p-4">Diagnostic Lab</th><th className="p-4">Test Title</th><th className="p-4">Agreed B2B Cost</th><th className="p-4">Customer Retail</th><th className="p-4">Platform Margin</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {DB.labPricing.map(m => (
                    <tr key={m.id}>
                      <td className="p-4 font-bold text-white">{m.labName}</td>
                      <td className="p-4">{(DB.tests.find(t => t.id === m.masterTestId)?.name) || "Diagnostic Assay"}</td>
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
            <h2 className="text-2xl font-black text-white">Laboratory Settlements & Payable Ledgers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DB.labs.map(lab => (
                <div key={lab.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{lab.logo}</span>
                    <h4 className="font-bold text-white text-base">{lab.name}</h4>
                  </div>
                  <div className="mt-3 space-y-1 text-slate-400">
                    <p>Gross B2B Payables: <b className="text-rose-400 font-mono text-sm">₹{lab.walletBalance}</b></p>
                    <p>Applicable TDS (Section 194C 2%): <b>₹{Math.round(lab.walletBalance * 0.02)}</b></p>
                    <p>Net Payable Amount: <b className="text-emerald-400 font-bold">₹{lab.walletBalance - Math.round(lab.walletBalance * 0.02)}</b></p>
                  </div>
                  <button onClick={() => alert(`Generated settlement tax invoice for ${lab.name}!`)} className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition">
                    Download GST Settlement Invoice PDF
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
