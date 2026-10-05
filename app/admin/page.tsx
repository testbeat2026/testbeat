'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Users, Building2, Wallet, 
  Settings, Bell, Search, RefreshCw, CheckCircle2, Clock, 
  AlertTriangle, Download, TrendingUp, Activity, Plus, Phone, 
  MapPin, ShieldAlert, Key, QrCode, FileText, Send, ToggleLeft, 
  ToggleRight, Lock, Unlock, Stethoscope, HeartPulse, Percent, 
  Receipt, ArrowUpRight, Check, X, Eye, ExternalLink, Printer
} from 'lucide-react';

export default function TestBeatAdminCommandCenter() {
  // Navigation & Role State
  const [role, setRole] = useState<'SUPER_ADMIN' | 'ADMIN' | 'STAFF'>('SUPER_ADMIN');
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'b2b_pricing' | 'parcha_quotes' | 'affiliates' | 'apis' | 'finance' | 'customers' | 'team'
  >('overview');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isLiveSync, setIsLiveSync] = useState(true);

  // 1. LIVE ORDERS STATE (Phlebo handled by Lab, tracked via API)
  const [orders, setOrders] = useState([
    {
      id: 'TB-928401',
      patient: 'Shubhranshu Kumar',
      phone: '+91 98765 43210',
      address: 'Chi V, Greater Noida, UP',
      test: 'Comprehensive Full Body (84 Tests)',
      lab: 'Redcliffe Labs',
      b2b_cost: 450,
      retail_price: 999,
      slot: 'Tomorrow • 06:30 AM',
      lab_phlebo_status: 'Phlebo Assigned (Lab Fleet)',
      phlebo_name: 'Vikas Sharma (Redcliffe)',
      payment: 'PAID (Cashfree)',
      status: 'SAMPLE_ON_ROUTE',
    },
    {
      id: 'TB-928402',
      patient: 'Sunita Sharma',
      phone: '+91 98112 34567',
      address: 'Beta 1, Greater Noida',
      test: 'Lipid Profile + HbA1c Glycemic',
      lab: 'Dr Lal PathLabs',
      b2b_cost: 320,
      retail_price: 749,
      slot: 'Tomorrow • 07:00 AM',
      lab_phlebo_status: 'Sample Reached Regional Lab',
      phlebo_name: 'Pawan Lal (Lal PathLabs)',
      payment: 'PAID (Razorpay)',
      status: 'TESTING_IN_LAB',
    },
    {
      id: 'TB-928403',
      patient: 'Rahul Verma',
      phone: '+91 99990 12345',
      address: 'Indirapuram, Ghaziabad',
      test: 'Complete Blood Count (CBC)',
      lab: 'Thyrocare',
      b2b_cost: 110,
      retail_price: 299,
      slot: 'Today • 08:30 AM',
      lab_phlebo_status: 'Report Generated (PDF Ready)',
      phlebo_name: 'Amit Rawat (Thyrocare)',
      payment: 'PAID (Cashfree)',
      status: 'REPORT_DISPATCHED',
    }
  ]);

  // 2. B2B PRICING & UPRATE LAYER
  const [catalogPricing, setCatalogPricing] = useState([
    { id: 101, name: 'Complete Blood Count (CBC)', lab: 'Redcliffe Labs', agreed_b2b: 120, current_b2b: 145, retail: 299, locked: true, alert: 'Rate Hiked by Lab (+₹25)' },
    { id: 102, name: 'Complete Blood Count (CBC)', lab: 'Thyrocare', agreed_b2b: 110, current_b2b: 110, retail: 279, locked: true, alert: null },
    { id: 103, name: 'Complete Blood Count (CBC)', lab: 'Dr Lal PathLabs', agreed_b2b: 180, current_b2b: 180, retail: 399, locked: true, alert: null },
    { id: 104, name: 'Full Body Comprehensive (84 Tests)', lab: 'Redcliffe Labs', agreed_b2b: 450, current_b2b: 450, retail: 999, locked: false, alert: null },
    { id: 105, name: 'HbA1c Glycated Sugar', lab: 'Metropolis', agreed_b2b: 160, current_b2b: 190, retail: 450, locked: true, alert: 'Rate Hiked by Lab (+₹30)' },
  ]);

  // 3. PARCHA (PRESCRIPTION) AI QUOTE STATE
  const [parchaText, setParchaText] = useState('Patient: Ramesh (54M) - Advised: CBC, Fasting Sugar, LFT, Lipid, ECG');
  const [detectedParchaTests, setDetectedParchaTests] = useState([
    { name: 'Complete Blood Count (CBC)', price: 299, selected: true },
    { name: 'Fasting Blood Sugar (FBS)', price: 99, selected: true },
    { name: 'Liver Function Test (LFT)', price: 449, selected: true },
    { name: 'Lipid Profile Comprehensive', price: 399, selected: true },
    { name: 'Home 12-Lead ECG Screening', price: 599, selected: true },
  ]);

  // 4. AFFILIATE & QR STANDEE PARTNERS
  const [affiliates, setAffiliates] = useState([
    { id: 'AFF-01', name: 'Dr. Verma Clinic', owner: 'Dr. S.K. Verma', city: 'Greater Noida', scans: 242, bookings: 38, gmv: 34200, commission_earned: 5130, wallet_balance: 3130, qr_code: 'TB-QR-VERMA' },
    { id: 'AFF-02', name: 'Sanjivani Medical Store', owner: 'Manoj Gupta', city: 'Noida Sec 62', scans: 512, bookings: 84, gmv: 75600, commission_earned: 11340, wallet_balance: 7500, qr_code: 'TB-QR-SANJIVANI' },
    { id: 'AFF-03', name: 'Care Pharmacy & Wellness', owner: 'Ankit Tyagi', city: 'Ghaziabad', scans: 180, bookings: 22, gmv: 19800, commission_earned: 2970, wallet_balance: 1400, qr_code: 'TB-QR-CAREPHARMA' }
  ]);
  const [selectedStandee, setSelectedStandee] = useState<any>(null);

  // 5. API SWITCHBOARD
  const [apiConfigs, setApiConfigs] = useState({
    redcliffe: { live: true, status: 'Active (v2)', key: 'sk_live_redc_99281' },
    thyrocare: { live: true, status: 'Active (XML/REST)', key: 'thy_prod_4421' },
    lalpath: { live: true, status: 'Active (HL7/API)', key: 'lal_live_sec_01' },
    metropolis: { live: false, status: 'Sandbox Mode', key: 'metro_test_8819' },
    cashfree: { live: true, status: 'Production PG', key: 'cf_app_991823' },
    razorpay: { live: false, status: 'Secondary Backup', key: 'rzp_live_2819' },
    msg91: { live: true, status: 'SMS Flow Live', key: '381923AJX8829' },
    resend: { live: true, status: 'Transactional Mail', key: 're_182938129' },
    whatsapp: { live: true, status: 'Meta Cloud API', key: 'EAAQ2819283' },
    zoho: { live: true, status: 'Books & Invoicing', key: 'zoho_oauth_281' },
    doctorConsult: { enabled: true, provider: 'Tata 1mg / E-Clinic API' },
    homeEcg: { enabled: true, provider: 'SanketLife 12-Lead Portable API' }
  });

  return (
    <div className="flex h-screen w-screen bg-[#F4F7F9] text-[#202D3C] overflow-hidden">
      
      {/* 1. LEFT NAVIGATION SIDEBAR (TestBeat Brand Theme) */}
      <aside className="w-64 bg-[#17466E] text-white flex flex-col justify-between shrink-0 border-r border-[#0E3250]">
        <div>
          {/* Logo Brand Header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-white/10 bg-[#0F3556]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#009387] flex items-center justify-center font-black text-white text-base shadow-sm">
                TB
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white">
                  Test<span className="text-[#009387]">Beat</span>
                </span>
                <span className="block text-[9px] uppercase font-bold tracking-widest text-teal-200">
                  Aggregator Cloud
                </span>
              </div>
            </div>
            <span className="text-[10px] font-extrabold bg-[#009387]/30 text-teal-200 px-2 py-0.5 rounded border border-[#009387]/50">
              v3.2
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs font-semibold">
            {[
              { id: 'overview', label: 'Executive Dashboard', icon: LayoutDashboard },
              { id: 'orders', label: 'Live Orders & Lab Status', icon: ShoppingBag, count: orders.length },
              { id: 'b2b_pricing', label: 'B2B Price & Hike Watch', icon: Percent },
              { id: 'parcha_quotes', label: 'Parcha Custom Quotes', icon: FileText },
              { id: 'affiliates', label: 'Affiliates & Standee QR', icon: QrCode },
              { id: 'apis', label: 'API Integrations Hub', icon: Key },
              { id: 'finance', label: 'Finance & GST Invoicing', icon: Receipt },
              { id: 'customers', label: 'Customer Directory', icon: Users },
              { id: 'team', label: 'Access Control (RBAC)', icon: ShieldAlert },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                    isActive 
                      ? 'bg-[#009387] text-white font-bold shadow-md' 
                      : 'text-slate-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <span className="bg-[#FF6B35] text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Role & Operator Status */}
        <div className="p-3.5 border-t border-white/10 bg-[#0F3556]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#009387] text-white flex items-center justify-center font-bold text-xs">
                SK
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">Shubhranshu</p>
                <p className="text-[10px] text-teal-300 font-semibold">{role}</p>
              </div>
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="bg-[#17466E] text-white border border-white/20 text-[10px] rounded px-1.5 py-0.5 outline-none font-bold"
            >
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ADMIN">Operations</option>
              <option value="STAFF">Support</option>
            </select>
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Operational Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-black text-[#17466E] uppercase tracking-wide">
              {activeTab.replace('_', ' ')}
            </h2>
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All Lab APIs Live: Redcliffe • Thyrocare • Lal PathLabs
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patient, test, mobile..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-100 text-xs rounded-xl outline-none focus:ring-2 focus:ring-[#009387]"
              />
            </div>

            <button 
              onClick={() => alert("Synchronizing all Lab B2B Webhooks & Neon DB...")}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
              title="Sync with Lab Servers"
            >
              <RefreshCw size={16} />
            </button>

            <button className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition">
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF6B35] rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Scrollable View Canvas */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 4 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-bold text-slate-400 uppercase">Today Bookings</span>
                  <div className="text-3xl font-black text-[#17466E] mt-1">28</div>
                  <div className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
                    <TrendingUp size={14} /> +32% vs Yesterday
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-bold text-slate-400 uppercase">Gross GMV (Retail)</span>
                  <div className="text-3xl font-black text-[#17466E] mt-1">₹34,890</div>
                  <span className="text-xs text-slate-400 block mt-2">Cashfree & Razorpay Settled</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-bold text-slate-400 uppercase">Aggregator Net Margin</span>
                  <div className="text-3xl font-black text-[#009387] mt-1">₹18,450</div>
                  <span className="text-xs text-[#009387] font-bold mt-2 block">~52.8% Spread Revenue</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-bold text-slate-400 uppercase">Lab Phlebos Active</span>
                  <div className="text-3xl font-black text-[#FF6B35] mt-1">19</div>
                  <span className="text-xs text-slate-500 mt-2 block">Doorstep cold-boxes on field</span>
                </div>
              </div>

              {/* Lab Partner Volume Split & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-extrabold text-[#17466E] text-sm">Aggregator Order Distribution by Lab</h3>
                    <span className="text-xs text-slate-400">All samples dispatched to certified NABL centres</span>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { lab: 'Redcliffe Labs', share: 58, orders: 16, margin: '₹9,800', color: 'bg-[#009387]' },
                      { lab: 'Dr Lal PathLabs', share: 24, orders: 7, margin: '₹4,900', color: 'bg-[#17466E]' },
                      { lab: 'Thyrocare Technologies', share: 18, orders: 5, margin: '₹3,750', color: 'bg-[#FF6B35]' }
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                          <span className="text-slate-800">{item.lab} ({item.orders} Orders)</span>
                          <span className="text-[#009387]">TestBeat Profit: {item.margin}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color}`} style={{ width: `${item.share}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Automation & Notification Switch */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-[#17466E] text-sm">Automated Dispatch Engine</h3>
                    <p className="text-xs text-slate-400 mt-1">Automatic patient notification triggers on booking & report readiness.</p>
                  </div>

                  <div className="space-y-3 my-4 text-xs font-semibold">
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                      <span>WhatsApp Cloud Bot (Reports PDF)</span>
                      <span className="text-emerald-600 font-bold">Active ✓</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                      <span>MSG91 SMS Phlebo Tracking URL</span>
                      <span className="text-emerald-600 font-bold">Active ✓</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                      <span>Resend Email Invoice & Barcode</span>
                      <span className="text-emerald-600 font-bold">Active ✓</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => alert("Notification broadcast pipeline is running smoothly.")}
                    className="w-full py-2.5 bg-[#17466E] hover:bg-[#0F3556] text-white text-xs font-bold rounded-xl transition"
                  >
                    View Notification Audit Logs
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE ORDERS & LAB PHLEBOTOMIST TRACKING */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-[#17466E] text-base">Active Orders & Lab Phlebotomist Live Status</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Phlebotomists are dispatched & managed by respective partner labs</p>
                </div>
                <button 
                  onClick={() => alert("Adding manual phone booking...")}
                  className="bg-[#009387] hover:bg-[#007A70] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition"
                >
                  <Plus size={14} /> Add Manual Booking
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-400 uppercase font-black text-[10px] border-b border-slate-100">
                    <tr>
                      <th className="py-3.5 px-4">Booking ID</th>
                      <th className="py-3.5 px-4">Patient & Location</th>
                      <th className="py-3.5 px-4">Prescribed Test</th>
                      <th className="py-3.5 px-4">Fulfillment Lab</th>
                      <th className="py-3.5 px-4">Margin Spread</th>
                      <th className="py-3.5 px-4">Lab Phlebo Status</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-black text-slate-900">{ord.id}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800">{ord.patient}</div>
                          <div className="text-[11px] text-slate-400">{ord.phone} • {ord.address}</div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#17466E]">{ord.test}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold bg-blue-50 text-[#17466E] px-2.5 py-1 rounded-md text-[11px]">
                            {ord.lab}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">₹{ord.retail_price}</div>
                          <div className="text-[10px] text-emerald-600 font-semibold">
                            B2B: ₹{ord.b2b_cost} (Profit: ₹{ord.retail_price - ord.b2b_cost})
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded text-[11px] block w-fit">
                            {ord.lab_phlebo_status}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Assigned: {ord.phlebo_name}</span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button 
                            onClick={() => alert(`Pulling live GPS & sample barcode from ${ord.lab} API...`)}
                            className="bg-slate-100 hover:bg-[#009387] hover:text-white text-slate-700 font-bold px-2.5 py-1.5 rounded-lg text-xs transition"
                          >
                            Live Track
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: B2B PRICING & UPRATE WATCH LAYER */}
          {activeTab === 'b2b_pricing' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-[#17466E] text-base">B2B Agreement Price Protection & Uprate Layer</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    If any partner lab increases their API base rate above agreed MOU, it triggers an instant alert.
                  </p>
                </div>
                <button 
                  onClick={() => alert("Locking all current agreed B2B prices across partner contracts.")}
                  className="bg-[#17466E] hover:bg-[#0F3556] text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5"
                >
                  <Lock size={14} /> Lock Current MOU Pricing
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-400 uppercase font-black text-[10px] border-b border-slate-100">
                    <tr>
                      <th className="py-3.5 px-4">Diagnostic Test / Profile</th>
                      <th className="py-3.5 px-4">Partner Lab</th>
                      <th className="py-3.5 px-4">MOU Agreed B2B</th>
                      <th className="py-3.5 px-4">Live API B2B Rate</th>
                      <th className="py-3.5 px-4">Customer Retail Price</th>
                      <th className="py-3.5 px-4">Price Discrepancy Status</th>
                      <th className="py-3.5 px-4 text-right">Lock / Edit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {catalogPricing.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{item.name}</td>
                        <td className="py-3.5 px-4 font-semibold text-[#17466E]">{item.lab}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">₹{item.agreed_b2b}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">₹{item.current_b2b}</td>
                        <td className="py-3.5 px-4 font-extrabold text-[#009387]">₹{item.retail}</td>
                        <td className="py-3.5 px-4">
                          {item.alert ? (
                            <span className="bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1 w-fit">
                              <AlertTriangle size={12} /> {item.alert}
                            </span>
                          ) : (
                            <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1 w-fit">
                              <CheckCircle2 size={12} /> Price Protected
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button 
                            onClick={() => {
                              const newRetail = prompt(`Enter new retail price for ${item.name}:`, item.retail.toString());
                              if (newRetail) {
                                setCatalogPricing(prev => prev.map(p => p.id === item.id ? { ...p, retail: Number(newRetail) } : p));
                              }
                            }}
                            className="text-[#009387] hover:underline font-bold text-xs"
                          >
                            Adjust Margin
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: PARCHA (PRESCRIPTION) AI QUOTE CREATOR */}
          {activeTab === 'parcha_quotes' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-[#17466E] text-base">Doctor Prescription (Parcha) AI Scanner</h3>
                  <span className="text-[10px] bg-teal-50 text-[#009387] font-bold px-2 py-0.5 rounded">OCR Enabled</span>
                </div>
                
                <p className="text-xs text-slate-500">
                  Upload patient doctor prescription or paste handwritten doctor notes to auto-detect required clinical tests.
                </p>

                <textarea
                  rows={4}
                  value={parchaText}
                  onChange={(e) => setParchaText(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#009387]"
                />

                <div className="flex gap-2">
                  <button 
                    onClick={() => alert("Simulating OCR scan on prescription image...")}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition"
                  >
                    Upload Parcha Image (JPG/PNG)
                  </button>
                  <button 
                    onClick={() => alert("Re-analyzing prescription with Medical NLP...")}
                    className="bg-[#009387] hover:bg-[#007A70] text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                  >
                    Auto-Detect Tests
                  </button>
                </div>
              </div>

              {/* Generated Custom Quote */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-[#17466E] text-base mb-3">Custom Quote Preview & WhatsApp Sender</h3>
                  <div className="space-y-2">
                    {detectedParchaTests.map((t, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl text-xs">
                        <span className="font-bold text-slate-800">{t.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-black text-[#17466E]">₹{t.price}</span>
                          <input 
                            type="checkbox" 
                            checked={t.selected} 
                            onChange={(e) => {
                              const updated = [...detectedParchaTests];
                              updated[idx].selected = e.target.checked;
                              setDetectedParchaTests(updated);
                            }}
                            className="w-4 h-4 accent-[#009387] cursor-pointer"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-sm font-black">
                    <span>Total Package Quote:</span>
                    <span className="text-[#009387] text-lg">
                      ₹{detectedParchaTests.filter(t => t.selected).reduce((acc, curr) => acc + curr.price, 0)}
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => alert("Custom Quote link with 1-click Cashfree checkout sent to Patient WhatsApp via Meta API!")}
                    className="w-full py-3 bg-[#009387] hover:bg-[#007A70] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
                  >
                    <Send size={15} /> Send Instant Quote to WhatsApp
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AFFILIATE & STANDY QR PARTNER ENGINE */}
          {activeTab === 'affiliates' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-[#17466E] text-base">Authorized Affiliate Partner Network & Paytm-Style Standee QR</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Generate printable desktop acrylic standees for doctors, clinics, and pharmacies with instant wallet commissions.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    const clinic = prompt("Enter Clinic / Pharmacy Display Name:");
                    if (clinic) {
                      setAffiliates(prev => [
                        ...prev,
                        {
                          id: `AFF-0${prev.length + 1}`,
                          name: clinic,
                          owner: 'Dr Partner',
                          city: 'Greater Noida',
                          scans: 0,
                          bookings: 0,
                          gmv: 0,
                          commission_earned: 0,
                          wallet_balance: 0,
                          qr_code: `TB-QR-${clinic.toUpperCase().replace(/\s+/g, '')}`
                        }
                      ]);
                    }
                  }}
                  className="bg-[#009387] hover:bg-[#007A70] text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5"
                >
                  <Plus size={14} /> Onboard New Affiliate
                </button>
              </div>

              {/* Affiliates List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {affiliates.map((aff) => (
                  <div key={aff.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black bg-blue-50 text-[#17466E] px-2 py-0.5 rounded">
                          {aff.id}
                        </span>
                        <span className="text-xs font-bold text-emerald-600">Wallet: ₹{aff.wallet_balance}</span>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-sm mt-2">{aff.name}</h4>
                      <p className="text-xs text-slate-400">{aff.owner} • {aff.city}</p>

                      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <span className="text-slate-400 block text-[10px]">Total Scans</span>
                          <span className="font-black text-slate-800">{aff.scans}</span>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <span className="text-slate-400 block text-[10px]">Test Bookings</span>
                          <span className="font-black text-[#009387]">{aff.bookings}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 flex gap-2">
                      <button 
                        onClick={() => setSelectedStandee(aff)}
                        className="flex-1 bg-[#17466E] hover:bg-[#0F3556] text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1 transition"
                      >
                        <QrCode size={13} /> View Standee
                      </button>
                      <button 
                        onClick={() => alert(`Wallet payout of ₹${aff.wallet_balance} transferred to ${aff.owner} via Cashfree Payout API!`)}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs px-3 py-2 rounded-xl transition"
                      >
                        Payout
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* STANDY MODAL / PREVIEW */}
              {selectedStandee && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center relative border border-slate-200">
                    <button 
                      onClick={() => setSelectedStandee(null)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
                    >
                      <X size={18} />
                    </button>

                    {/* Acrylic Standee Print Mockup */}
                    <div className="p-6 rounded-2xl bg-gradient-to-b from-[#17466E] to-[#0E2D49] text-white border-4 border-slate-200 shadow-inner">
                      <div className="w-10 h-10 rounded-xl bg-[#009387] text-white flex items-center justify-center font-black mx-auto shadow">
                        TB
                      </div>
                      <h3 className="font-black text-lg mt-2">Test<span className="text-[#009387]">Beat</span></h3>
                      <p className="text-[10px] text-teal-200 font-semibold uppercase tracking-wider">
                        Authorized Diagnostic Partner
                      </p>

                      <div className="my-5 bg-white p-4 rounded-2xl inline-block shadow-md">
                        <div className="w-36 h-36 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-800 flex-col">
                          <QrCode size={90} className="text-[#17466E]" />
                          <span className="text-[9px] font-black text-slate-600 mt-1">{selectedStandee.qr_code}</span>
                        </div>
                      </div>

                      <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                        <span className="text-[10px] text-slate-300 block">Prescriptions & Tests Fulfilled At</span>
                        <h4 className="font-extrabold text-sm text-white">{selectedStandee.name}</h4>
                      </div>

                      <p className="text-[9px] text-slate-300 mt-3">
                        Scan to Book Lab Tests • Upto 70% Off • Free Home Sample Collection
                      </p>
                    </div>

                    <button 
                      onClick={() => window.print()}
                      className="w-full mt-4 py-2.5 bg-[#009387] hover:bg-[#007A70] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
                    >
                      <Printer size={15} /> Print Acrylic Standee Sheet
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: UNIVERSAL API INTEGRATION SWITCHBOARD */}
          {activeTab === 'apis' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="font-extrabold text-[#17466E] text-base">API Switchboard & Gateway Credentials</h3>
                <p className="text-xs text-slate-400 mt-0.5">Toggle between Sandbox and Live production keys without server re-deployment.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  { name: 'Redcliffe Labs API', cat: 'Diagnostic Partner', status: apiConfigs.redcliffe.status, live: apiConfigs.redcliffe.live, key: apiConfigs.redcliffe.key },
                  { name: 'Thyrocare Tech API', cat: 'Diagnostic Partner', status: apiConfigs.thyrocare.status, live: apiConfigs.thyrocare.live, key: apiConfigs.thyrocare.key },
                  { name: 'Dr Lal PathLabs', cat: 'Diagnostic Partner', status: apiConfigs.lalpath.status, live: apiConfigs.lalpath.live, key: apiConfigs.lalpath.key },
                  { name: 'Metropolis Healthcare', cat: 'Diagnostic Partner', status: apiConfigs.metropolis.status, live: apiConfigs.metropolis.live, key: apiConfigs.metropolis.key },
                  { name: 'Cashfree Payments', cat: 'Payment Gateway', status: apiConfigs.cashfree.status, live: apiConfigs.cashfree.live, key: apiConfigs.cashfree.key },
                  { name: 'Razorpay Backup', cat: 'Payment Gateway', status: apiConfigs.razorpay.status, live: apiConfigs.razorpay.live, key: apiConfigs.razorpay.key },
                  { name: 'MSG91 Flow SMS', cat: 'Notifications', status: apiConfigs.msg91.status, live: apiConfigs.msg91.live, key: apiConfigs.msg91.key },
                  { name: 'Resend Transactional', cat: 'Email Pipeline', status: apiConfigs.resend.status, live: apiConfigs.resend.live, key: apiConfigs.resend.key },
                  { name: 'WhatsApp Cloud API', cat: 'Official Meta BOT', status: apiConfigs.whatsapp.status, live: apiConfigs.whatsapp.live, key: apiConfigs.whatsapp.key },
                  { name: 'Zoho Books ERP', cat: 'GST & Invoicing', status: apiConfigs.zoho.status, live: apiConfigs.zoho.live, key: apiConfigs.zoho.key },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          {item.cat}
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          item.live ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {item.live ? 'LIVE' : 'SANDBOX'}
                        </span>
                      </div>
                      
                      <h4 className="font-extrabold text-[#17466E] text-sm mt-2">{item.name}</h4>
                      <p className="text-xs text-slate-400">{item.status}</p>

                      <div className="mt-3 bg-slate-50 p-2 rounded-lg font-mono text-[10px] text-slate-600 truncate border border-slate-100">
                        {item.key}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                      <button 
                        onClick={() => alert(`Credentials updated for ${item.name}`)}
                        className="text-[#009387] font-bold text-xs hover:underline"
                      >
                        Update Key
                      </button>
                      <button 
                        onClick={() => alert(`Toggled environment mode for ${item.name}`)}
                        className="text-xs text-slate-500 font-semibold hover:text-slate-800"
                      >
                        Switch Env
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Future Modular Toggles */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h4 className="font-extrabold text-[#17466E] text-sm mb-4">On-Demand Health Services Switch</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <HeartPulse size={16} className="text-[#009387]" /> Home 12-Lead ECG Service
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">SanketLife portable ECG kit fleet dispatch</p>
                    </div>
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">Enabled ✓</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <Stethoscope size={16} className="text-[#17466E]" /> Instant Doctor Tele-Consultation
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Automated post-report consultation booking</p>
                    </div>
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">Enabled ✓</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: FINANCE & GST INVOICING */}
          {activeTab === 'finance' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-[#17466E] text-base">Financial Ledger, GST & Automated Zoho Invoicing</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Automated B2B lab payment reconciliation and GST output tax.</p>
                </div>
                <button 
                  onClick={() => alert("Downloading GSTR-1 & Sales Ledger CSV...")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition"
                >
                  <Download size={14} /> Export Financial Ledger
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 font-semibold block">Total Aggregator Sales (MTD)</span>
                  <span className="text-2xl font-black text-[#17466E] mt-1 block">₹2,84,500</span>
                  <span className="text-emerald-600 font-bold text-[10px]">100% Digital Realization</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 font-semibold block">Lab Partner Escrow Payable</span>
                  <span className="text-2xl font-black text-slate-800 mt-1 block">₹1,32,400</span>
                  <span className="text-slate-400 font-semibold text-[10px]">Net B2B Fulfillment Cost</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 font-semibold block">Net TestBeat Margin (EBITDA)</span>
                  <span className="text-2xl font-black text-[#009387] mt-1 block">₹1,52,100</span>
                  <span className="text-emerald-600 font-bold text-[10px]">~53.4% Gross Operating Profit</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: CUSTOMER DIRECTORY */}
          {activeTab === 'customers' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <h3 className="font-extrabold text-[#17466E] text-base mb-4">Registered Patients & Families</h3>
              <div className="space-y-3">
                {[
                  { name: 'Shubhranshu Kumar', phone: '+91 98765 43210', city: 'Greater Noida', orders: 4, lastTest: 'Full Body Comprehensive' },
                  { name: 'Sunita Sharma', phone: '+91 98112 34567', city: 'Greater Noida', orders: 2, lastTest: 'Lipid Profile + HbA1c' },
                  { name: 'Rahul Verma', phone: '+91 99990 12345', city: 'Ghaziabad', orders: 1, lastTest: 'Complete Blood Count (CBC)' },
                ].map((cust, i) => (
                  <div key={i} className="flex justify-between items-center p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">{cust.name}</span>
                      <span className="text-slate-400">{cust.phone} • {cust.city}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-[#009387] block">{cust.orders} Bookings</span>
                      <span className="text-slate-400 text-[10px]">Last: {cust.lastTest}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: ACCESS CONTROL (RBAC) */}
          {activeTab === 'team' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <h3 className="font-extrabold text-[#17466E] text-base">Team Roles & Permission Gates (RBAC)</h3>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 block">Super Admin (Founder Level)</span>
                    <span className="text-slate-400">Unrestricted access to B2B Pricing, API Keys, Cashfree Payouts, Team Roles</span>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 font-black px-2.5 py-1 rounded">Full Control</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 block">Operations & Phlebo Dispatch Admin</span>
                    <span className="text-slate-400">Manage orders, track lab collection status, send WhatsApp quotes</span>
                  </div>
                  <span className="bg-blue-50 text-[#17466E] font-black px-2.5 py-1 rounded">Operations Only</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 block">Support Desk & Call Representative</span>
                    <span className="text-slate-400">View patient details, reschedule morning fasting slots, view reports</span>
                  </div>
                  <span className="bg-slate-200 text-slate-700 font-black px-2.5 py-1 rounded">Read & Call</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
