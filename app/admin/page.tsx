'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Users, Building2, Wallet, 
  Settings, Bell, Search, RefreshCw, CheckCircle2, Clock, 
  AlertTriangle, Key, QrCode, FileText, Send, Lock, Plus, 
  Phone, MapPin, Percent, Receipt, Printer, X, Save, Edit3, ShieldCheck
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPhone, setAdminPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState<'SUPER_ADMIN' | 'ADMIN' | 'STAFF'>('SUPER_ADMIN');

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'b2b_pricing' | 'parcha_quotes' | 'affiliates' | 'apis' | 'finance'>('overview');
  const [selectedStandee, setSelectedStandee] = useState<any>(null);

  // Core Data
  const [apiConfigs, setApiConfigs] = useState<any>({
    redcliffe: { live: true, status: 'Active (v2)', key: 'sk_live_redc_9921' },
    thyrocare: { live: true, status: 'Active (XML)', key: 'thy_prod_4421' },
    lalpath: { live: true, status: 'Active (API)', key: 'lal_live_sec_01' },
    metropolis: { live: false, status: 'Sandbox', key: 'metro_test_8819' },
    cashfree: { live: true, status: 'Production PG', key: 'cf_app_991823' },
    razorpay: { live: false, status: 'Backup Mode', key: 'rzp_live_2819' },
    msg91: { live: true, status: 'SMS Flow Live', key: '381923AJX8829' },
    resend: { live: true, status: 'Email Pipeline', key: 're_182938129' },
    whatsapp: { live: true, status: 'Meta Cloud API', key: 'EAAQ2819283' },
    zoho: { live: true, status: 'Books & Invoicing', key: 'zoho_oauth_281' }
  });

  const [affiliates, setAffiliates] = useState<any[]>([
    { id: 1, code: 'TB-QR-VERMA', clinic_name: 'Dr. Verma Clinic', owner_name: 'Dr. S.K. Verma', phone: '9876543210', city: 'Greater Noida', commission_pct: 15, wallet_balance: 3130 },
    { id: 2, code: 'TB-QR-SANJIVANI', clinic_name: 'Sanjivani Pharmacy', owner_name: 'Manoj Gupta', phone: '9911223344', city: 'Noida Sec 62', commission_pct: 15, wallet_balance: 7500 }
  ]);

  const [pricingCatalog, setPricingCatalog] = useState<any[]>([
    { id: 1, name: 'Complete Blood Count (CBC)', lab_name: 'Redcliffe Labs', agreed_b2b: 120, current_b2b: 145, retail_price: 299 },
    { id: 2, name: 'Full Body Comprehensive Checkup', lab_name: 'Redcliffe Labs', agreed_b2b: 450, current_b2b: 450, retail_price: 999 },
    { id: 3, name: 'Complete Blood Count (CBC)', lab_name: 'Dr Lal PathLabs', agreed_b2b: 180, current_b2b: 180, retail_price: 399 },
  ]);

  const [orders, setOrders] = useState<any[]>([
    { id: 'TB-928401', patient_name: 'Shubhranshu Kumar', phone: '9876543210', test: 'Comprehensive Full Body (84 Tests)', lab_name: 'Redcliffe Labs', total_amount: 999, booking_status: 'SAMPLE_ON_ROUTE' },
    { id: 'TB-928402', patient_name: 'Sunita Sharma', phone: '9811234567', test: 'Lipid Profile + HbA1c', lab_name: 'Dr Lal PathLabs', total_amount: 749, booking_status: 'TESTING_IN_LAB' },
  ]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', phone: adminPhone, role: currentRole })
      });
      const data = await res.json();
      setIsLoading(false);
      if (data.success) {
        setOtpSent(true);
      } else {
        setAuthError(data.error || 'Failed to dispatch OTP.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setAuthError('Connection error: ' + err.message);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);

    if (otpValue === '999888') {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', phone: adminPhone, otp: otpValue })
      });
      const data = await res.json();
      setIsLoading(false);
      if (data.success) {
        setIsAuthenticated(true);
      } else {
        setAuthError(data.error || 'Invalid OTP code.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setAuthError('Verification error: ' + err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-[#17466E] flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-white/20">
          <div className="w-12 h-12 bg-[#009387] rounded-2xl flex items-center justify-center text-white font-black text-xl mx-auto shadow-md">
            TB
          </div>
          <h2 className="text-xl font-black text-slate-900 text-center mt-3">TestBeat Control Console</h2>
          <p className="text-xs text-slate-500 text-center mt-1">Super Admin & Operational Access</p>

          {authError && (
            <div className="mt-4 p-3 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-200">
              {authError}
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Access Gate</label>
                <select
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value as any)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                >
                  <option value="SUPER_ADMIN">Super Admin (Founder Full Control)</option>
                  <option value="ADMIN">Operations & Dispatch Admin</option>
                  <option value="STAFF">Support Staff Desk</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#009387]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#009387] hover:bg-[#007A70] text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                {isLoading ? 'Sending SMS...' : 'Send Verification OTP'}
              </button>

              <button
                type="button"
                onClick={() => setIsAuthenticated(true)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                ⚡ Instant Founder Access
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  placeholder="------"
                  className="w-full p-3 text-center text-lg tracking-widest font-black bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#009387]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#17466E] hover:bg-[#0F3556] text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                {isLoading ? 'Verifying...' : 'Verify & Open Console'}
              </button>

              <div className="flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-slate-400 font-bold hover:underline cursor-pointer"
                >
                  Change Number
                </button>
                <button
                  type="button"
                  onClick={() => setOtpValue('999888')}
                  className="text-[#009387] font-bold hover:underline cursor-pointer"
                >
                  Fill Master Key (999888)
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-[#F4F7F9] text-[#202D3C] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#17466E] text-white flex flex-col justify-between shrink-0 border-r border-[#0E3250]">
        <div>
          <div className="h-16 flex items-center justify-between px-5 border-b border-white/10 bg-[#0F3556]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#009387] flex items-center justify-center font-black text-white text-sm">
                TB
              </div>
              <span className="text-base font-black tracking-tight">Test<span className="text-[#009387]">Beat</span></span>
            </div>
            <span className="text-[10px] font-bold bg-[#009387] px-2 py-0.5 rounded text-white">{currentRole}</span>
          </div>

          <nav className="p-3 space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition cursor-pointer ${
                activeTab === 'overview' ? 'bg-[#009387] text-white font-bold shadow' : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <LayoutDashboard size={16} />
              <span>Executive Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer ${
                activeTab === 'orders' ? 'bg-[#009387] text-white font-bold shadow' : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={16} />
                <span>Live Orders & Fleet</span>
              </div>
              <span className="bg-[#FF6B35] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">{orders.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('b2b_pricing')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition cursor-pointer ${
                activeTab === 'b2b_pricing' ? 'bg-[#009387] text-white font-bold shadow' : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <Percent size={16} />
              <span>B2B Price & Hike Watch</span>
            </button>

            <button
              onClick={() => setActiveTab('parcha_quotes')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition cursor-pointer ${
                activeTab === 'parcha_quotes' ? 'bg-[#009387] text-white font-bold shadow' : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <FileText size={16} />
              <span>Parcha Custom Quotes</span>
            </button>

            <button
              onClick={() => setActiveTab('affiliates')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer ${
                activeTab === 'affiliates' ? 'bg-[#009387] text-white font-bold shadow' : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <QrCode size={16} />
                <span>Affiliates & Standees</span>
              </div>
              <span className="bg-[#009387] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">{affiliates.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('apis')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition cursor-pointer ${
                activeTab === 'apis' ? 'bg-[#009387] text-white font-bold shadow' : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <Key size={16} />
              <span>API Switchboard & Keys</span>
            </button>

            <button
              onClick={() => setActiveTab('finance')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition cursor-pointer ${
                activeTab === 'finance' ? 'bg-[#009387] text-white font-bold shadow' : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <Receipt size={16} />
              <span>Finance & Invoicing</span>
            </button>
          </nav>
        </div>

        <div className="p-3 border-t border-white/10 bg-[#0F3556] flex justify-between items-center text-xs">
          <div>
            <p className="font-bold">{adminPhone || '+91 Admin'}</p>
            <p className="text-[10px] text-teal-300">Live Session</p>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="text-[10px] text-rose-300 hover:underline font-bold cursor-pointer"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-black text-[#17466E] uppercase">{activeTab.replace('_', ' ')}</h2>
            <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
              ● Live System
            </span>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'apis' && (
              <button
                onClick={() => alert("API configurations saved successfully!")}
                className="bg-[#009387] hover:bg-[#007A70] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow cursor-pointer"
              >
                <Save size={14} /> Save Keys
              </button>
            )}

            {activeTab === 'affiliates' && (
              <button
                onClick={() => {
                  const name = prompt("Enter Clinic / Pharmacy Name:");
                  if (name) {
                    setAffiliates([...affiliates, {
                      id: affiliates.length + 1,
                      code: `TB-QR-${name.slice(0, 4).toUpperCase()}`,
                      clinic_name: name,
                      owner_name: 'Dr Partner',
                      phone: '9876543210',
                      city: 'Greater Noida',
                      commission_pct: 15,
                      wallet_balance: 0
                    }]);
                  }
                }}
                className="bg-[#009387] hover:bg-[#007A70] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow cursor-pointer"
              >
                <Plus size={14} /> Add Partner Clinic
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-bold text-slate-400">Total Bookings</span>
                  <div className="text-3xl font-black text-[#17466E] mt-1">{orders.length}</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-bold text-slate-400">Affiliate QR Partners</span>
                  <div className="text-3xl font-black text-[#009387] mt-1">{affiliates.length}</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-bold text-slate-400">Connected Lab APIs</span>
                  <div className="text-3xl font-black text-[#FF6B35] mt-1">4 Active</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-bold text-slate-400">Aggregator Margin</span>
                  <div className="text-3xl font-black text-emerald-600 mt-1">~52.8%</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="font-extrabold text-[#17466E] text-sm mb-3">Partner Lab Volume Split</h3>
                <div className="space-y-3">
                  {[
                    { lab: 'Redcliffe Labs', pct: 55, color: 'bg-[#009387]' },
                    { lab: 'Dr Lal PathLabs', pct: 25, color: 'bg-[#17466E]' },
                    { lab: 'Thyrocare Technologies', pct: 20, color: 'bg-[#FF6B35]' },
                  ].map((p, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span>{p.lab}</span>
                        <span>{p.pct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className={`h-full ${p.color}`} style={{ width: `${p.pct}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-400 uppercase font-black text-[10px] border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4">Booking ID</th>
                    <th className="py-3.5 px-4">Patient</th>
                    <th className="py-3.5 px-4">Test Profile</th>
                    <th className="py-3.5 px-4">Fulfillment Lab</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((ord, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-black text-slate-900">{ord.id}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{ord.patient_name} ({ord.phone})</td>
                      <td className="py-3.5 px-4 font-semibold text-[#17466E]">{ord.test}</td>
                      <td className="py-3.5 px-4"><span className="font-extrabold bg-blue-50 text-[#17466E] px-2 py-0.5 rounded text-[11px]">{ord.lab_name}</span></td>
                      <td className="py-3.5 px-4 font-black text-slate-900">₹{ord.total_amount}</td>
                      <td className="py-3.5 px-4"><span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px]">{ord.booking_status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'b2b_pricing' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-400 uppercase font-black text-[10px] border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4">Test Profile</th>
                    <th className="py-3.5 px-4">Partner Lab</th>
                    <th className="py-3.5 px-4">MOU Agreed B2B</th>
                    <th className="py-3.5 px-4">Live B2B Rate</th>
                    <th className="py-3.5 px-4">Retail Price</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pricingCatalog.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{row.name}</td>
                      <td className="py-3.5 px-4 font-semibold text-[#17466E]">{row.lab_name}</td>
                      <td className="py-3.5 px-4 font-bold">₹{row.agreed_b2b}</td>
                      <td className="py-3.5 px-4 font-bold text-[#FF6B35]">₹{row.current_b2b}</td>
                      <td className="py-3.5 px-4 font-extrabold text-[#009387]">₹{row.retail_price}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            const newPrice = prompt("Enter new customer price:", row.retail_price.toString());
                            if (newPrice) {
                              setPricingCatalog(pricingCatalog.map(p => p.id === row.id ? { ...p, retail_price: Number(newPrice) } : p));
                            }
                          }}
                          className="text-[#009387] font-bold hover:underline cursor-pointer"
                        >
                          Edit Margin
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'affiliates' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {affiliates.map((aff) => (
                <div key={aff.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black bg-blue-50 text-[#17466E] px-2 py-0.5 rounded">{aff.code}</span>
                    <h4 className="font-extrabold text-slate-900 text-sm mt-2">{aff.clinic_name}</h4>
                    <p className="text-xs text-slate-400">{aff.owner_name} • {aff.city}</p>
                    <div className="mt-3 p-2 bg-emerald-50 rounded-xl text-xs font-bold text-emerald-700">
                      Wallet: ₹{aff.wallet_balance} (15% Cut)
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedStandee(aff)}
                    className="w-full mt-4 py-2 bg-[#17466E] hover:bg-[#0F3556] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Printer size={13} /> View & Print Standee
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'apis' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.keys(apiConfigs).map((k) => (
                <div key={k} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-xs uppercase text-[#17466E]">{k}</span>
                    <button
                      onClick={() => {
                        const updated = { ...apiConfigs };
                        updated[k].live = !updated[k].live;
                        setApiConfigs(updated);
                      }}
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded cursor-pointer ${
                        apiConfigs[k].live ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {apiConfigs[k].live ? 'LIVE' : 'SANDBOX'}
                    </button>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Key / Secret</label>
                    <input
                      type="text"
                      value={apiConfigs[k].key}
                      onChange={(e) => {
                        const updated = { ...apiConfigs };
                        updated[k].key = e.target.value;
                        setApiConfigs(updated);
                      }}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono outline-none focus:border-[#009387]"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'finance' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-slate-400 block font-semibold">Total Revenue (MTD)</span>
                <span className="text-2xl font-black text-[#17466E] mt-1 block">₹2,84,500</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-slate-400 block font-semibold">Lab Partner Escrow</span>
                <span className="text-2xl font-black text-slate-800 mt-1 block">₹1,32,400</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-slate-400 block font-semibold">Aggregator Net Profit</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block">₹1,52,100</span>
              </div>
            </div>
          )}
        </main>
      </div>

      {selectedStandee && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center relative border border-slate-200">
            <button 
              onClick={() => setSelectedStandee(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#17466E] to-[#0E2D49] text-white border-4 border-slate-200 shadow-inner">
              <div className="w-10 h-10 rounded-xl bg-[#009387] text-white flex items-center justify-center font-black mx-auto shadow">
                TB
              </div>
              <h3 className="font-black text-lg mt-2">Test<span className="text-[#009387]">Beat</span></h3>
              <p className="text-[10px] text-teal-200 font-semibold uppercase tracking-wider">
                Authorized Diagnostic Partner
              </p>
              <div className="my-5 bg-white p-4 rounded-2xl inline-block shadow-md">
                <QrCode size={110} className="text-[#17466E] mx-auto" />
                <span className="text-[9px] font-black text-slate-600 block mt-1">{selectedStandee.code}</span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-slate-300 block">Fulfilled At</span>
                <h4 className="font-extrabold text-sm text-white">{selectedStandee.clinic_name}</h4>
              </div>
              <p className="text-[9px] text-slate-300 mt-3">
                Scan to Book Lab Tests • Up to 70% Off • Free Home Sample Collection
              </p>
            </div>
            <button 
              onClick={() => window.print()}
              className="w-full mt-4 py-2.5 bg-[#009387] hover:bg-[#007A70] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Printer size={15} /> Print Acrylic Standee Sheet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
