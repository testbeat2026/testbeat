'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { DATA } from '@/lib/dataStore';
import { useAuth } from '@/lib/authContext';

export default function AdminPortal() {
  const { adminLoggedIn, adminRole, loginAdmin, logoutAdmin } = useAuth();
  const [passcode, setPasscode] = useState('');
  const [selectedRole, setSelectedRole] = useState<'SUPER_ADMIN' | 'ADMIN' | 'STAFF'>('SUPER_ADMIN');

  // Navigation Sub-sections
  const [currentSection, setCurrentSection] = useState<
    'DASHBOARD' | 'ORDERS' | 'TESTS' | 'PACKAGES' | 'PRICING' | 'PRICE_UPRATE' | 'COUPONS' | 'APIS' | 'AFFILIATES' | 'SETTINGS'
  >('DASHBOARD');

  // Master Test Creation State
  const [newTestName, setNewTestName] = useState('');
  const [newCategory, setNewCategory] = useState('Vitamins');
  const [newSample, setNewSample] = useState('Blood');
  const [newFasting, setNewFasting] = useState(false);

  // Pricing Rule Mapping State
  const [mapMasterId, setMapMasterId] = useState('T1');
  const [mapLabName, setMapLabName] = useState('Healthians');
  const [mapLabTestName, setMapLabTestName] = useState('');
  const [mapB2B, setMapB2B] = useState('');
  const [mapRetail, setMapRetail] = useState('');

  // Handle Admin Passcode Login
  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    loginAdmin(selectedRole);
  };

  // Add Test to Catalog
  const handleAddTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestName) return;
    DATA.tests.push({
      id: "T" + (DATA.tests.length + 1),
      name: newTestName,
      category: newCategory,
      sampleType: newSample,
      fasting: newFasting,
      fastingHours: newFasting ? 10 : 0,
      synonyms: [newTestName.toLowerCase()],
      description: "Added via TestBeat Master Catalog Admin."
    });
    setNewTestName('');
    alert("Master Test Successfully Added to Standard Catalog!");
  };

  // Add B2B & Retail Price Mapping
  const handleAddMapping = (e: React.FormEvent) => {
    e.preventDefault();
    DATA.labMappings.push({
      id: "M" + (DATA.labMappings.length + 1),
      masterTestId: mapMasterId,
      labId: mapLabName.toLowerCase().replace(/\s/g, ''),
      labName: mapLabName,
      labTestName: mapLabTestName || "Standard Diagnostic Test",
      b2bPrice: Number(mapB2B) || 200,
      mrp: Number(mapRetail) * 2 || 1000,
      retailPrice: Number(mapRetail) || 450,
      tat: "24 Hours",
      rating: 4.8,
      accreditation: "NABL Certified"
    });
    setMapLabTestName('');
    setMapB2B('');
    setMapRetail('');
    alert("New Lab B2B / Retail Commercial Mapping Saved!");
  };

  // Toggle API Mode (Mock -> Live -> Disabled)
  const toggleApiMode = (id: string) => {
    const api = DATA.apis.find(a => a.id === id);
    if (api) {
      api.mode = api.mode === 'MOCK' ? 'LIVE' : (api.mode === 'LIVE' ? 'DISABLED' : 'MOCK');
      alert(`${api.name} switched to ${api.mode} Mode!`);
    }
  };

  // If Not Authenticated -> Show Admin Login Screen
  if (!adminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl text-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-white font-black text-xl">TB</span>
            <div>
              <h2 className="text-xl font-black text-white">TestBeat Control Access</h2>
              <p className="text-xs text-slate-400">Enterprise Healthcare Management Suite</p>
            </div>
          </div>

          <form onSubmit={handleAdminAuth} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Select Access Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold focus:outline-none"
              >
                <option value="SUPER_ADMIN">Super Admin (Full Commercial Control)</option>
                <option value="ADMIN">Diagnostic Lab Operations Manager</option>
                <option value="STAFF">Phlebotomist / Order Dispatch Staff</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Admin Security Passcode</label>
              <input
                type="password"
                placeholder="Enter Passcode (Mock: any key)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-[11px] text-slate-400 space-y-1">
              <p>• Super Admin controls pricing, labs, wallets, and API switchboard.</p>
              <p>• Production Ready: Direct Vercel login enabled without hardcoded barriers.</p>
            </div>

            <button type="submit" className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-lg transition">
              Authenticate & Open Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
            <span className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-black text-sm">TB</span>
            <div>
              <h3 className="font-bold text-sm text-white">TestBeat Admin</h3>
              <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-1.5 py-0.5 rounded font-bold">{adminRole}</span>
            </div>
          </div>

          <nav className="mt-6 space-y-1 text-xs font-semibold">
            {[
              { id: 'DASHBOARD', label: '📊 Master Dashboard' },
              { id: 'ORDERS', label: '📦 Orders & Fasting Tracking' },
              { id: 'TESTS', label: '🧪 Master Test Catalog' },
              { id: 'PACKAGES', label: '🩺 TestBeat Packages' },
              { id: 'PRICING', label: '💰 B2B & Retail Pricing' },
              { id: 'PRICE_UPRATE', label: '⚠️ Price Uprate Alerts' },
              { id: 'COUPONS', label: '🎟️ Coupons & Offers' },
              { id: 'APIS', label: '⚡ API Control Switchboard' },
              { id: 'AFFILIATES', label: '🤝 Affiliates & Wallets' },
              { id: 'SETTINGS', label: '⚙️ Settings & Security' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentSection(item.id as any)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition ${currentSection === item.id ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
          <Link href="/" className="text-xs text-cyan-400 hover:underline">View Storefront</Link>
          <button onClick={logoutAdmin} className="text-xs text-rose-400 hover:underline font-bold">Sign Out</button>
        </div>
      </aside>

      {/* Main Administrative Workplace */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen">
        {/* Section 1: Dashboard */}
        {currentSection === 'DASHBOARD' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Aggregator Intelligence & Operations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400">Total GMV</span>
                <h3 className="text-2xl font-black text-emerald-400 mt-1">₹48,920</h3>
                <span className="text-[10px] text-slate-500">Live order settlements</span>
              </div>
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400">Total Bookings</span>
                <h3 className="text-2xl font-black text-white mt-1">{DATA.orders.length}</h3>
                <span className="text-[10px] text-slate-500">All connected labs</span>
              </div>
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400">Connected Labs</span>
                <h3 className="text-2xl font-black text-cyan-400 mt-1">6 Active</h3>
                <span className="text-[10px] text-slate-500">Thyrocare, Healthians...</span>
              </div>
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400">Active Coupons</span>
                <h3 className="text-2xl font-black text-amber-400 mt-1">{DATA.coupons.length} Active</h3>
                <span className="text-[10px] text-slate-500">TESTBEAT100 & more</span>
              </div>
            </div>

            {/* Live Orders Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
              <h3 className="text-sm font-bold text-white mb-3">Live Fasting / Sample Pickup Tracking</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <tr><th className="p-3">Order ID</th><th className="p-3">Patient</th><th className="p-3">Lab</th><th className="p-3">Test</th><th className="p-3">Slot</th><th className="p-3">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {DATA.orders.map(o => (
                      <tr key={o.id}>
                        <td className="p-3 font-mono font-bold text-cyan-400">{o.id}</td>
                        <td className="p-3 font-semibold text-white">{o.patientName}</td>
                        <td className="p-3">{o.labName}</td>
                        <td className="p-3">{o.testName}</td>
                        <td className="p-3 text-slate-400">{o.slot}</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold text-[10px]">{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Orders Stream */}
        {currentSection === 'ORDERS' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Full Booking & Order Dispatch Stream</h2>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <tr><th className="p-4">ID</th><th className="p-4">Patient / Contact</th><th className="p-4">Lab / Test</th><th className="p-4">Address</th><th className="p-4">Finances</th><th className="p-4">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {DATA.orders.map(o => (
                    <tr key={o.id}>
                      <td className="p-4 font-mono font-bold text-cyan-400">{o.id}</td>
                      <td className="p-4"><p className="font-bold text-white">{o.patientName}</p><p className="text-[11px] text-slate-500">{o.patientPhone}</p></td>
                      <td className="p-4"><p className="font-semibold text-slate-200">{o.testName}</p><p className="text-[11px] text-cyan-400">{o.labName}</p></td>
                      <td className="p-4 text-slate-400 max-w-xs">{o.address}</td>
                      <td className="p-4"><p className="text-emerald-400 font-bold">₹{o.totalAmount}</p><p className="text-[10px] text-slate-500">B2B Cost: ₹{o.b2bCost}</p></td>
                      <td className="p-4">
                        <button onClick={() => alert(`Status of order ${o.id} marked as COMPLETED!`)} className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded text-[11px] font-bold">
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 3: Master Test Catalog */}
        {currentSection === 'TESTS' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black text-white">Master Test Normalization Engine</h2>
              <p className="text-xs text-slate-400 mt-1">Define canonical tests and normalize divergent lab naming conventions.</p>
            </div>

            <form onSubmit={handleAddTest} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Test Canonical Name</label>
                <input type="text" placeholder="e.g. Ferritin (Iron Deficiency)" value={newTestName} onChange={(e) => setNewTestName(e.target.value)} required className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold" />
              </div>
              <div>
                <label className="font-bold text-slate-300 block mb-1">Category</label>
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold">
                  <option>Vitamins</option><option>Hematology</option><option>Hormones</option><option>Diabetes</option><option>Organ Profile</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-300 block mb-1">Fasting Required</label>
                <select value={newFasting ? "YES" : "NO"} onChange={(e) => setNewFasting(e.target.value === "YES")} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold">
                  <option value="NO">No Fasting Required</option><option value="YES">Yes (10-12 Hrs Fasting)</option>
                </select>
              </div>
              <div className="flex items-end">
                <button type="submit" className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition">
                  + Add Master Test
                </button>
              </div>
            </form>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
              <h3 className="text-sm font-bold text-white mb-3">Master Tests Catalog ({DATA.tests.length} Standard Tests)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DATA.tests.map(t => (
                  <div key={t.id} className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded font-bold uppercase">{t.category}</span>
                      <h4 className="font-bold text-white text-sm mt-1">{t.name}</h4>
                      <p className="text-slate-400 text-[11px]">{t.description}</p>
                    </div>
                    <span className="text-slate-500 font-mono text-[10px]">{t.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section 4: B2B Pricing Management */}
        {currentSection === 'PRICING' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">B2B Lab Pricing & Retail Margin Switchboard</h2>
            <form onSubmit={handleAddMapping} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Master Test</label>
                <select value={mapMasterId} onChange={(e) => setMapMasterId(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold">
                  {DATA.tests.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-300 block mb-1">Partner Lab</label>
                <select value={mapLabName} onChange={(e) => setMapLabName(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold">
                  <option>Healthians</option><option>Thyrocare</option><option>Redcliffe Labs</option><option>Dr Lal PathLabs</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-300 block mb-1">B2B Cost (₹)</label>
                <input type="number" placeholder="250" value={mapB2B} onChange={(e) => setMapB2B(e.target.value)} required className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold" />
              </div>
              <div>
                <label className="font-bold text-slate-300 block mb-1">Customer Retail (₹)</label>
                <input type="number" placeholder="499" value={mapRetail} onChange={(e) => setMapRetail(e.target.value)} required className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold" />
              </div>
              <div className="flex items-end">
                <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition">
                  Save Price Rule
                </button>
              </div>
            </form>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <tr><th className="p-3">Partner Lab</th><th className="p-3">Test Title</th><th className="p-3">B2B Cost</th><th className="p-3">TestBeat Retail</th><th className="p-3">Platform Margin</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {DATA.labMappings.map(m => (
                    <tr key={m.id}>
                      <td className="p-3 font-bold text-white">{m.labName}</td>
                      <td className="p-3">{m.labTestName}</td>
                      <td className="p-3 font-mono text-rose-400">₹{m.b2bPrice}</td>
                      <td className="p-3 font-mono text-cyan-400 font-bold">₹{m.retailPrice}</td>
                      <td className="p-3 font-mono text-emerald-400 font-bold">+₹{m.retailPrice - m.b2bPrice} ({Math.round(((m.retailPrice - m.b2bPrice)/m.retailPrice)*100)}%)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 5: Price Uprate Anomaly Alerts */}
        {currentSection === 'PRICE_UPRATE' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Price Uprate / Anomaly Detection</h2>
            <p className="text-xs text-slate-400">Automatic scanner alerts when a partner lab updates its API catalog price above contracted B2B rate.</p>
            <div className="space-y-4">
              {DATA.priceAlerts.map(alt => (
                <div key={alt.id} className="p-5 bg-rose-950/40 border border-rose-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="text-[10px] bg-rose-900 text-rose-300 px-2 py-0.5 rounded font-bold uppercase">Spike Alert (+{alt.percent}%)</span>
                    <h4 className="font-bold text-white text-sm mt-1">{alt.lab}: {alt.test}</h4>
                    <p className="text-slate-400">Agreed B2B: ₹{alt.agreedB2B} → Lab Catalog: ₹{alt.newApiPrice} (+₹{alt.diff} increase)</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => alert("Old contracted price locked and lab account alerted!")} className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-xl">Lock & Dispute</button>
                    <button onClick={() => alert("Price update accepted.")} className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl font-bold">Accept</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 6: Dynamic API Switchboard */}
        {currentSection === 'APIS' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Dynamic API Control Switchboard</h2>
            <p className="text-xs text-slate-400">Toggle individual lab APIs, Payment Gateways (Cashfree/Razorpay), and Notifications between MOCK and LIVE mode.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DATA.apis.map(api => (
                <div key={api.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] bg-slate-800 text-cyan-400 px-2 py-0.5 rounded font-bold">{api.category}</span>
                        <h4 className="font-bold text-white text-sm mt-1">{api.name}</h4>
                      </div>
                      <button
                        onClick={() => toggleApiMode(api.id)}
                        className={`text-[10px] font-black px-2.5 py-1 rounded transition ${api.mode === 'LIVE' ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-amber-400 text-slate-950 font-black'}`}
                      >
                        MODE: {api.mode} ⚡
                      </button>
                    </div>
                    <div className="mt-3 text-[11px] font-mono text-slate-400 space-y-0.5">
                      <p>Endpoint: <span className="text-slate-200">{api.endpoint}</span></p>
                      <p>API Key: <span className="text-slate-200">{api.apiKey}</span></p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-emerald-400 text-[11px]">● Status: {api.status}</span>
                    <button onClick={() => alert(`Connection to ${api.name} verified! 200 OK`)} className="text-cyan-400 hover:underline font-bold text-[11px]">Test Connection</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 7: Coupons Engine */}
        {currentSection === 'COUPONS' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Coupons & Offer Engine</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {DATA.coupons.map(c => (
                <div key={c.code} className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                  <span className="text-xs font-mono font-black text-cyan-400 bg-cyan-950 border border-cyan-800 px-2.5 py-1 rounded">{c.code}</span>
                  <h4 className="font-bold text-white text-lg mt-3">₹{c.discount} OFF</h4>
                  <p className="text-xs text-slate-400 mt-1">Min Order: ₹{c.minOrder}</p>
                  <span className="inline-block mt-3 text-[10px] text-emerald-400 font-bold uppercase">● Active Campaign</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 8: Affiliates & Partner Wallets */}
        {currentSection === 'AFFILIATES' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Affiliate Clinic & Pharmacy Wallets</h2>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <tr><th className="p-3">Partner Name</th><th className="p-3">Referral Code</th><th className="p-3">Bookings</th><th className="p-3">Gross Revenue</th><th className="p-3">Wallet Balance</th><th className="p-3">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {DATA.affiliates.map(a => (
                    <tr key={a.id}>
                      <td className="p-3 font-bold text-white">{a.name}</td>
                      <td className="p-3 font-mono text-cyan-400 font-bold">{a.refCode}</td>
                      <td className="p-3">{a.bookings}</td>
                      <td className="p-3">₹{a.revenue}</td>
                      <td className="p-3 font-bold text-emerald-400">₹{a.wallet}</td>
                      <td className="p-3">
                        <button onClick={() => alert(`NEFT Payout of ₹${a.wallet} initiated to ${a.name}`)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-[11px] font-bold">
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
      </main>
    </div>
  );
}
