'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DB } from '@/lib/dataStore';

export default function WorkplaceMasterPortal() {
  const router = useRouter();
  const [role, setRole] = useState<'SUPER_ADMIN' | 'OPERATIONS' | 'SALES_MARKETING' | 'FINANCE'>('SUPER_ADMIN');
  const [activeTab, setActiveTab] = useState<string>('DASHBOARD');

  useEffect(() => {
    const savedRole = localStorage.getItem('tb_staff_role');
    if (savedRole) setRole(savedRole as any);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('tb_staff_role');
    router.push('/portal/login');
  };

  const [newLabName, setNewLabName] = useState('');
  const [newLabCode, setNewLabCode] = useState('');

  const handleAddLab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabName) return;
    DB.labs.push({
      id: "lab-" + newLabCode.toLowerCase(),
      name: newLabName,
      code: newLabCode.toUpperCase(),
      logo: "🏥",
      accreditations: "NABL Certified",
      tat: "24 Hours",
      rating: 4.8,
      reviewsCount: 10,
      homeCollectionFee: 0,
      status: "ACTIVE",
      b2bAgreementDate: new Date().toISOString().split('T')[0],
      walletBalance: 0
    });
    setNewLabName('');
    setNewLabCode('');
    alert("New Diagnostic Lab added to network!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-black text-sm">TB</div>
            <div>
              <h3 className="font-bold text-sm text-white">Workplace Console</h3>
              <span className="text-[10px] bg-teal-950 text-teal-400 border border-teal-800 px-2 py-0.5 rounded font-bold uppercase">{role.replace('_', ' ')}</span>
            </div>
          </div>

          <nav className="mt-6 space-y-1 text-xs font-semibold">
            <button onClick={() => setActiveTab('DASHBOARD')} className={`w-full text-left px-3 py-2.5 rounded-xl transition ${activeTab === 'DASHBOARD' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
              📊 Overview & Analytics
            </button>

            {(role === 'SUPER_ADMIN' || role === 'OPERATIONS') && (
              <>
                <button onClick={() => setActiveTab('ORDERS')} className={`w-full text-left px-3 py-2.5 rounded-xl transition ${activeTab === 'ORDERS' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
                  📦 Orders & Phlebo Dispatch
                </button>
                <button onClick={() => setActiveTab('LABS')} className={`w-full text-left px-3 py-2.5 rounded-xl transition ${activeTab === 'LABS' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
                  🏥 Labs Network Management
                </button>
              </>
            )}

            {(role === 'SUPER_ADMIN' || role === 'SALES_MARKETING') && (
              <>
                <button onClick={() => setActiveTab('CUSTOMERS')} className={`w-full text-left px-3 py-2.5 rounded-xl transition ${activeTab === 'CUSTOMERS' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
                  👥 Customer CRM & Records
                </button>
                <button onClick={() => setActiveTab('AFFILIATES')} className={`w-full text-left px-3 py-2.5 rounded-xl transition ${activeTab === 'AFFILIATES' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
                  🤝 Clinics, Standees & Affiliates
                </button>
              </>
            )}

            {(role === 'SUPER_ADMIN' || role === 'FINANCE') && (
              <>
                <button onClick={() => setActiveTab('PRICING')} className={`w-full text-left px-3 py-2.5 rounded-xl transition ${activeTab === 'PRICING' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
                  💰 B2B Pricing & Margins
                </button>
                <button onClick={() => setActiveTab('FINANCE_SETTLEMENTS')} className={`w-full text-left px-3 py-2.5 rounded-xl transition ${activeTab === 'FINANCE_SETTLEMENTS' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
                  📑 Lab Payables & Margins
                </button>
              </>
            )}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
          <Link href="/" target="_blank" className="text-xs text-teal-400 hover:underline">View Storefront ↗</Link>
          <button onClick={handleLogout} className="text-xs text-rose-400 hover:underline font-bold">Logout</button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen">
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">{role.replace('_', ' ')} Executive Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400">Total Bookings</span>
                <h3 className="text-2xl font-black text-white mt-1">{DB.orders.length}</h3>
              </div>
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400">Partner Diagnostic Labs</span>
                <h3 className="text-2xl font-black text-teal-400 mt-1">{DB.labs.length} Connected</h3>
              </div>
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400">Total Platform Margin</span>
                <h3 className="text-2xl font-black text-emerald-400 mt-1">₹{DB.orders.reduce((acc, o) => acc + o.platformMargin, 0)}</h3>
              </div>
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400">Affiliate Clinics</span>
                <h3 className="text-2xl font-black text-amber-400 mt-1">{DB.affiliates.length} Partners</h3>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ORDERS' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Live Phlebotomy Dispatch & Order Tracking</h2>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <tr><th className="p-4">Order ID</th><th className="p-4">Patient</th><th className="p-4">Lab & Test</th><th className="p-4">Address</th><th className="p-4">Phlebo</th><th className="p-4">Status</th><th className="p-4">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {DB.orders.map(o => (
                    <tr key={o.id}>
                      <td className="p-4 font-mono font-bold text-teal-400">{o.id}</td>
                      <td className="p-4"><p className="font-bold text-white">{o.patientName}</p><p className="text-[11px] text-slate-500">{o.patientPhone}</p></td>
                      <td className="p-4"><p className="font-semibold text-white">{o.testName}</p><p className="text-[11px] text-teal-400">{o.labName}</p></td>
                      <td className="p-4 text-slate-400">{o.address}</td>
                      <td className="p-4">{o.phleboName}</td>
                      <td className="p-4"><span className="px-2 py-0.5 rounded bg-teal-950 text-teal-400 font-bold text-[10px]">{o.status}</span></td>
                      <td className="p-4">
                        <button onClick={() => alert(`Status of order ${o.id} progressed to next stage!`)} className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded text-[11px] font-bold">
                          Progress Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'LABS' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Connected Diagnostic Laboratory Partners</h2>
            <form onSubmit={handleAddLab} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <input type="text" required placeholder="Lab Name (e.g. Apollo Diagnostics)" value={newLabName} onChange={(e) => setNewLabName(e.target.value)} className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
              <input type="text" required placeholder="Lab Code (e.g. APOLLO)" value={newLabCode} onChange={(e) => setNewLabCode(e.target.value)} className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
              <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl py-2.5">+ Onboard New Lab</button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DB.labs.map(l => (
                <div key={l.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{l.logo}</span>
                      <h4 className="font-bold text-white text-base">{l.name}</h4>
                    </div>
                    <p className="text-slate-400 mt-1">Accreditation: {l.accreditations} • TAT: {l.tat}</p>
                    <p className="text-teal-400 font-mono mt-0.5">Payable Balance: ₹{l.walletBalance}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px]">ACTIVE</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'CUSTOMERS' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Customer Database & Patient CRM</h2>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <tr><th className="p-4">Customer ID</th><th className="p-4">Name / Phone</th><th className="p-4">Email</th><th className="p-4">Address</th><th className="p-4">Family Members</th><th className="p-4">Total Spend</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {DB.customers.map(c => (
                    <tr key={c.id}>
                      <td className="p-4 font-mono font-bold text-teal-400">{c.id}</td>
                      <td className="p-4"><p className="font-bold text-white">{c.name}</p><p className="text-[11px] text-slate-500">{c.phone}</p></td>
                      <td className="p-4">{c.email}</td>
                      <td className="p-4 text-slate-400">{c.address} ({c.pincode})</td>
                      <td className="p-4">{c.familyMembers.length} Members Linked</td>
                      <td className="p-4 font-bold text-emerald-400">₹{c.totalSpend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'AFFILIATES' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Clinic Partners, QR Standees & Commission Wallets</h2>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <tr><th className="p-4">Clinic / Partner</th><th className="p-4">Referral Code</th><th className="p-4">Bookings</th><th className="p-4">Commission Earned</th><th className="p-4">Wallet Balance</th><th className="p-4">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {DB.affiliates.map(a => (
                    <tr key={a.id}>
                      <td className="p-4"><p className="font-bold text-white">{a.businessName}</p><p className="text-[11px] text-slate-500">{a.ownerName} ({a.phone})</p></td>
                      <td className="p-4 font-mono font-bold text-teal-400">{a.refCode}</td>
                      <td className="p-4">{a.bookingsCount} Patients</td>
                      <td className="p-4">₹{a.totalCommission}</td>
                      <td className="p-4 font-bold text-emerald-400">₹{a.walletBalance}</td>
                      <td className="p-4">
                        <button onClick={() => alert(`NEFT Payout of ₹${a.walletBalance} triggered for ${a.businessName}!`)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-[11px] font-bold">
                          Approve Payout
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'PRICING' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">B2B Contracted Cost vs Customer Retail Margin</h2>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <tr><th className="p-4">Lab</th><th className="p-4">Test Title</th><th className="p-4">Agreed B2B Cost</th><th className="p-4">Customer Retail</th><th className="p-4">Platform Margin</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {DB.labMappings.map(m => (
                    <tr key={m.id}>
                      <td className="p-4 font-bold text-white">{m.labId.replace('lab-', '').toUpperCase()}</td>
                      <td className="p-4">{m.labTestName}</td>
                      <td className="p-4 font-mono text-rose-400">₹{m.b2bCost}</td>
                      <td className="p-4 font-mono text-teal-400 font-bold">₹{m.retailPrice}</td>
                      <td className="p-4 font-mono text-emerald-400 font-bold">+₹{m.platformMargin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'FINANCE_SETTLEMENTS' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Finance & Laboratory Settlement Ledger</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DB.labs.map(l => (
                <div key={l.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-xs">
                  <h4 className="font-bold text-white text-base">{l.name}</h4>
                  <div className="mt-3 space-y-1 text-slate-400">
                    <p>Total Completed Bookings: <b>184</b></p>
                    <p>Gross B2B Payable Amount: <b className="text-rose-400 font-mono">₹{l.walletBalance}</b></p>
                    <p>TDS / Tax Deducted: <b>₹4,225 (2%)</b></p>
                  </div>
                  <button onClick={() => alert(`Generated formal settlement invoice for ${l.name}!`)} className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition">
                    Download Settlement PDF Invoice
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
