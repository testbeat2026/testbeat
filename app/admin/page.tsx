'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Building2, 
  Users, 
  ShieldCheck, 
  Wallet, 
  QrCode, 
  Settings, 
  Search, 
  Bell, 
  ExternalLink, 
  LogOut, 
  CheckCircle2, 
  Send, 
  Download, 
  Plus, 
  Check, 
  MessageSquare,
  TrendingUp,
  FileCheck2,
  RefreshCw,
  X,
  Sliders,
  Trash2,
  Save
} from 'lucide-react';

export default function SuperAdminPortalMaster() {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'bookings' | 'visitors' | 'roles' | 'finance' | 'affiliate' | 'apis' | 'settings'>('dashboard');

  // 1. Live Orders Pipeline State
  const [bookingsList, setBookingsList] = useState([
    { id: 'TB_RX_1791238476870_9497', patient: 'Ramesh Sharma', phone: '+91 98112 34567', test: 'Complete Blood Count (CBC) Test', lab: 'Redcliffe Labs', amount: 897.00, status: 'Lab Processing', phlebo: 'Sunil Kumar (AG-101)', reportUrl: 'https://reports.testbeat.in/pdf/9497' },
    { id: 'TB_1791234979305_7550', patient: 'Ananya Verma', phone: '+91 98711 22334', test: 'Thyroid Profile Total (T3, T4, TSH)', lab: 'Dr Lal PathLabs', amount: 1680.00, status: 'Sample Collected', phlebo: 'Vikas Singh (AG-104)', reportUrl: '' },
    { id: 'TB_1791234074636_2517', patient: 'Deepak Rao', phone: '+91 99100 88291', test: 'Lipid Profile Extended Panel', lab: 'Thyrocare', amount: 299.00, status: 'Phlebo Assigned', phlebo: 'Manoj Kumar (AG-108)', reportUrl: '' },
    { id: 'TB_1791233936740_4023', patient: 'Kavita Mishra', phone: '+91 98109 44321', test: 'Smart Full Body Vital Screen', lab: 'Redcliffe Labs', amount: 1099.00, status: 'Report Dispatched', phlebo: 'Sunil Kumar (AG-101)', reportUrl: 'https://reports.testbeat.in/pdf/4023' },
    { id: 'TB_1791233765486_3905', patient: 'Suresh Chandra', phone: '+91 97188 55412', test: 'Executive Health Screen + Vitamins', lab: 'Healthians', amount: 1499.00, status: 'Payment Pending', phlebo: 'Unassigned', reportUrl: '' }
  ]);

  const [activeLabFilter, setActiveLabFilter] = useState<string>('ALL');
  const [activeModalOrder, setActiveModalOrder] = useState<typeof bookingsList[0] | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string>('');

  const displayedOrders = useMemo(() => {
    if (activeLabFilter === 'ALL') return bookingsList;
    return bookingsList.filter(b => b.lab.toLowerCase().includes(activeLabFilter.toLowerCase()));
  }, [bookingsList, activeLabFilter]);

  const handleUpdateStatus = (id: string, newStatus: string, newLab?: string) => {
    setBookingsList(prev => prev.map(item => item.id === id ? { ...item, status: newStatus, lab: newLab || item.lab } : item));
    setActionSuccess(`Order ${id} updated successfully!`);
    setTimeout(() => setActionSuccess(''), 3000);
    setActiveModalOrder(null);
  };

  // 2. Visitors CRM
  const [visitorsList] = useState([
    { id: 'V-101', contact: '+91 98112 77011', location: 'Noida (201301)', ip: '27.59.71.180', landing: '/packages', time: 'Just now', score: 'High Intent' },
    { id: 'V-102', contact: '+91 98711 00214', location: 'Greater Noida (201310)', ip: '103.21.54.90', landing: '/book-test', time: '2 mins ago', score: 'Phone Captured' },
    { id: 'V-103', contact: 'Anonymous Viewer', location: 'Faridabad (121001)', ip: '49.36.12.10', landing: '/compare', time: '5 mins ago', score: 'Browsing' },
    { id: 'V-104', contact: '+91 99100 33219', location: 'Delhi (110075)', ip: '182.72.10.22', landing: '/partner', time: '11 mins ago', score: 'Doctor Lead' }
  ]);

  // 3. User & Role Management
  const [usersList, setUsersList] = useState([
    { id: 'U-1', name: 'Shubhranshu Kumar', mobile: '+91 76669 53705', role: 'SUPER ADMIN', status: 'Active' },
    { id: 'U-2', name: 'Dr. Neeraj Mathur', mobile: '+91 98110 44210', role: 'LAB OPS MANAGER', status: 'Active' },
    { id: 'U-3', name: 'Pooja Rani', mobile: '+91 98711 55219', role: 'FINANCE & AUDIT', status: 'Active' },
    { id: 'U-4', name: 'Sunil Phlebo Lead', mobile: '+91 99109 22014', role: 'COLLECTION AGENT', status: 'Active' }
  ]);
  const [newUserModal, setNewUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: '', mobile: '', role: 'LAB OPS MANAGER' });

  // 5. Affiliate Desk
  const [affiliates] = useState([
    { id: 'AFF-001', name: 'Dr. R.K. Sharma Clinic', contact: '+91 98112 00192', city: 'Greater Noida', refCode: 'TB-DOC-RK', commission: 20, wallet: 4850, totalBookings: 34 },
    { id: 'AFF-002', name: 'Sanjivani Medical Store', contact: '+91 98711 99201', city: 'Faridabad', refCode: 'TB-MED-SANJ', commission: 15, wallet: 2900, totalBookings: 18 }
  ]);
  const [selectedStandeePartner, setSelectedStandeePartner] = useState(affiliates[0]);

  // 6. APIs Hub State
  const [apiHub, setApiHub] = useState({
    redcliffe: { enabled: true, endpoint: 'https://api.redcliffelifesciences.com/v1', key: 'RL_PROD_JWT_9921' },
    drlal: { enabled: true, endpoint: 'https://partner-api.lalpathlabs.com/prod', key: 'LP_REF_NO_441' },
    thyrocare: { enabled: true, endpoint: 'https://xml.thyrocare.com/api', key: 'TC_LIVE_KEY_882910' },
    healthians: { enabled: false, endpoint: 'https://api.healthians.com/partner/v2', key: 'HN_AUTH_TOKEN_77218' }
  });
  const [apiSaveStatus, setApiSaveStatus] = useState(false);

  // 7. Settings State
  const [siteSettings, setSiteSettings] = useState({
    headerLogoUrl: '/logo.png',
    footerLogoUrl: '/logo-white.png',
    helplineNumber: '+91 83688 87011',
    whatsappNumber: '918368887011'
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.mobile) return;
    setUsersList([...usersList, {
      id: `U-${usersList.length + 1}`,
      name: newUserForm.name,
      mobile: newUserForm.mobile,
      role: newUserForm.role,
      status: 'Active'
    }]);
    setNewUserModal(false);
    setNewUserForm({ name: '', mobile: '', role: 'LAB OPS MANAGER' });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F6F9] font-sans text-slate-800 antialiased selection:bg-[#032C64] selection:text-white">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-[#011C40] text-slate-300 flex flex-col justify-between flex-shrink-0 border-r border-[#0c2f5d] z-20">
        <div>
          {/* Logo Branding */}
          <div className="h-20 flex items-center px-6 border-b border-[#0c2f5d] space-x-3 bg-[#011633]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D73027] via-[#FDAE61] to-[#4575B4] flex items-center justify-center text-white font-black text-sm shadow">
              TB
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="text-lg font-black text-white tracking-tight">Test</span>
                <span className="text-lg font-black text-[#74ADD1] tracking-tight">Beat</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block -mt-1">
                SUPER ADMIN
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 text-xs font-bold">
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all text-left ${
                activeSection === 'dashboard' ? 'bg-[#032C64] text-white shadow-md border-l-4 border-[#74ADD1]' : 'hover:bg-[#0c2f5d] text-slate-300'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#74ADD1]" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveSection('bookings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-left ${
                activeSection === 'bookings' ? 'bg-[#032C64] text-white shadow-md border-l-4 border-[#74ADD1]' : 'hover:bg-[#0c2f5d] text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <ClipboardList className="w-4 h-4 text-emerald-400" />
                <span>Live Bookings & Reports</span>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded text-[10px]">{bookingsList.length}</span>
            </button>

            <button
              onClick={() => setActiveSection('visitors')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all text-left ${
                activeSection === 'visitors' ? 'bg-[#032C64] text-white shadow-md border-l-4 border-[#74ADD1]' : 'hover:bg-[#0c2f5d] text-slate-300'
              }`}
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>Live Visitors & Leads CRM</span>
            </button>

            <button
              onClick={() => setActiveSection('roles')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all text-left ${
                activeSection === 'roles' ? 'bg-[#032C64] text-white shadow-md border-l-4 border-[#74ADD1]' : 'hover:bg-[#0c2f5d] text-slate-300'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>User & Role Management</span>
            </button>

            <button
              onClick={() => setActiveSection('finance')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all text-left ${
                activeSection === 'finance' ? 'bg-[#032C64] text-white shadow-md border-l-4 border-[#74ADD1]' : 'hover:bg-[#0c2f5d] text-slate-300'
              }`}
            >
              <Wallet className="w-4 h-4 text-teal-400" />
              <span>Finance, P&L & Taxes</span>
            </button>

            <button
              onClick={() => setActiveSection('affiliate')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all text-left ${
                activeSection === 'affiliate' ? 'bg-[#032C64] text-white shadow-md border-l-4 border-[#74ADD1]' : 'hover:bg-[#0c2f5d] text-slate-300'
              }`}
            >
              <QrCode className="w-4 h-4 text-pink-400" />
              <span>Affiliate Desk & Standees</span>
            </button>

            <button
              onClick={() => setActiveSection('apis')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all text-left ${
                activeSection === 'apis' ? 'bg-[#032C64] text-white shadow-md border-l-4 border-[#74ADD1]' : 'hover:bg-[#0c2f5d] text-slate-300'
              }`}
            >
              <Building2 className="w-4 h-4 text-sky-400" />
              <span>Partner APIs & Gateway Hub</span>
            </button>

            <button
              onClick={() => setActiveSection('settings')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all text-left ${
                activeSection === 'settings' ? 'bg-[#032C64] text-white shadow-md border-l-4 border-[#74ADD1]' : 'hover:bg-[#0c2f5d] text-slate-300'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings & Branding</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Bottom Controls */}
        <div className="p-4 border-t border-[#0c2f5d] space-y-2 text-xs font-bold bg-[#011633]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#0c2f5d] transition-colors"
          >
            <span className="flex items-center space-x-2">
              <ExternalLink className="w-4 h-4" />
              <span>Public Website</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">testbeat.in</span>
          </Link>

          <Link
            href="/login"
            className="flex items-center space-x-2 p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </Link>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">

        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
          <div className="relative w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search patient, phone, order ID, lab partner..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-[#032C64]"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => {
                setActionSuccess('Data cache synchronized with live database.');
                setTimeout(() => setActionSuccess(''), 2500);
              }}
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center space-x-1.5 text-xs font-bold"
              title="Refresh Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-[#032C64] text-white flex items-center justify-center font-black text-xs shadow-xs">
                SH
              </div>
              <div>
                <p className="text-xs font-black text-slate-800 leading-tight">Shubhranshu Kumar</p>
                <p className="text-[10px] font-bold text-slate-400">Super Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Section Views */}
        <div className="p-8 space-y-8 flex-1">

          {actionSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-800">
              <span className="flex items-center font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" />
                {actionSuccess}
              </span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-black">Success</span>
            </div>
          )}

          {/* ================= 1. DASHBOARD ================= */}
          {activeSection === 'dashboard' && (
            <div className="space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Welcome back, Admin 👋</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Diagnostic network telemetry & operations overview.</p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
                  ● 4 NABL Chains Operational
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div onClick={() => setActiveSection('bookings')} className="bg-white border border-slate-200 hover:border-[#032C64] rounded-2xl p-5 shadow-xs cursor-pointer group">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
                    <span>TOTAL DIAGNOSTIC ORDERS</span>
                    <span className="bg-blue-50 text-[#032C64] p-1.5 rounded-lg group-hover:bg-[#032C64] group-hover:text-white transition-colors"><ClipboardList className="w-4 h-4" /></span>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-slate-900">{bookingsList.length}</span>
                    <span className="text-[11px] text-emerald-600 font-bold">● Active Queue</span>
                  </div>
                </div>

                <div onClick={() => setActiveSection('finance')} className="bg-white border border-slate-200 hover:border-emerald-600 rounded-2xl p-5 shadow-xs cursor-pointer group">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
                    <span>GROSS COLLECTION (₹)</span>
                    <span className="bg-emerald-50 text-emerald-600 p-1.5 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors"><TrendingUp className="w-4 h-4" /></span>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-slate-900">₹4,474</span>
                    <span className="text-[10px] text-slate-400 font-bold">Cashfree PG</span>
                  </div>
                </div>

                <div onClick={() => setActiveSection('bookings')} className="bg-white border border-slate-200 hover:border-amber-500 rounded-2xl p-5 shadow-xs cursor-pointer group">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
                    <span>PRESCRIPTIONS UPLOADED</span>
                    <span className="bg-amber-50 text-amber-600 p-1.5 rounded-lg group-hover:bg-amber-500 group-hover:text-white transition-colors"><FileCheck2 className="w-4 h-4" /></span>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-slate-900">5</span>
                    <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">Action Queue</span>
                  </div>
                </div>

                <div onClick={() => setActiveSection('visitors')} className="bg-white border border-slate-200 hover:border-purple-600 rounded-2xl p-5 shadow-xs cursor-pointer group">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
                    <span>WEBSITE VISITORS & LEADS</span>
                    <span className="bg-purple-50 text-purple-600 p-1.5 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors"><Users className="w-4 h-4" /></span>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-slate-900">104</span>
                    <span className="text-[10px] text-purple-700 font-bold">Real-time Radar</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. LIVE BOOKINGS & REPORTS ================= */}
          {activeSection === 'bookings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Live Orders & Report Dispatch Desk 📑</h2>
                <p className="text-xs text-slate-500 mt-0.5">Real-time lab fulfillment tracking & WhatsApp/SMS delivery.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">
                    DIAGNOSTIC ORDERS PIPELINE ({bookingsList.length})
                  </h3>

                  <div className="space-y-3">
                    {bookingsList.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setActiveModalOrder(item)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          activeModalOrder?.id === item.id 
                            ? 'border-[#032C64] bg-blue-50/50 shadow-sm ring-2 ring-[#032C64]/10' 
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-black text-[#032C64]">{item.id}</span>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {item.lab}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-xs">{item.patient} ({item.phone})</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.test}</p>
                        
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-[11px]">
                          <span className="font-black text-slate-900">₹{item.amount.toFixed(2)}</span>
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">
                      LAB FULFILLMENT & PATIENT DELIVERY
                    </h3>
                    <p className="text-sm font-black text-slate-900">{activeModalOrder ? activeModalOrder.id : 'Select an order from left'}</p>
                  </div>

                  {activeModalOrder ? (
                    <>
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2.5">
                        <div className="flex justify-between"><span className="text-slate-500 font-bold">Patient:</span><span className="font-black text-slate-900">{activeModalOrder.patient}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500 font-bold">Assigned Lab:</span><span className="font-black text-[#032C64]">{activeModalOrder.lab}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500 font-bold">Phlebo:</span><span className="font-bold text-slate-900">{activeModalOrder.phlebo}</span></div>
                      </div>

                      <button
                        onClick={() => {
                          setActionSuccess(`Dispatch ping sent to ${activeModalOrder.phone} via WhatsApp & SMS!`);
                          setTimeout(() => setActionSuccess(''), 3000);
                        }}
                        className="w-full py-3 bg-[#032C64] hover:bg-[#0c2f5d] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow flex items-center justify-center space-x-2"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Dispatch Report to Patient (WhatsApp & SMS)</span>
                      </button>
                    </>
                  ) : (
                    <p className="text-xs text-slate-400 py-8 text-center">Click on any order in the pipeline to manage report dispatch.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= 3. VISITORS CRM ================= */}
          {activeSection === 'visitors' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              <h2 className="text-xl font-black text-slate-900">Live Visitors & Lead Radar 📡</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] font-black uppercase text-slate-400">
                      <th className="py-3 px-3">Visitor / Contact</th>
                      <th className="py-3 px-3">Location & IP</th>
                      <th className="py-3 px-3">Landing Page</th>
                      <th className="py-3 px-3">Time Activity</th>
                      <th className="py-3 px-3">Lead Score</th>
                      <th className="py-3 px-3 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visitorsList.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-extrabold text-slate-900">{v.contact}</td>
                        <td className="py-3 px-3">{v.location}</td>
                        <td className="py-3 px-3 font-bold text-[#032C64]">{v.landing}</td>
                        <td className="py-3 px-3 text-slate-500">{v.time}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                            {v.score}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <a
                            href={`https://wa.me/${v.contact.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1 bg-[#25D366] text-white font-bold rounded-lg text-[10px] inline-flex items-center space-x-1"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>WhatsApp Lead</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 4. USER ROLES ================= */}
          {activeSection === 'roles' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900">User Access & Role Privileges 🛡️</h2>
                <button
                  onClick={() => setNewUserModal(true)}
                  className="px-4 py-2 bg-[#032C64] text-white rounded-xl text-xs font-black uppercase shadow flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Staff Login</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] font-black uppercase text-slate-400">
                      <th className="py-3 px-3">Member Name</th>
                      <th className="py-3 px-3">Mobile / Login ID</th>
                      <th className="py-3 px-3">Role Privileges</th>
                      <th className="py-3 px-3">Account Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-black text-slate-900">{u.name}</td>
                        <td className="py-3 px-3 text-slate-600 font-bold">{u.mobile}</td>
                        <td className="py-3 px-3">
                          <span className="bg-blue-100 text-[#032C64] px-2 py-0.5 rounded text-[10px] font-black uppercase">
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-emerald-700 font-bold">{u.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {newUserModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
                  <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200">
                    <h3 className="text-base font-black text-slate-900 mb-3">Add Platform Operator Account</h3>
                    <form onSubmit={handleAddUser} className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-0.5">Staff Full Name</label>
                        <input
                          type="text"
                          required
                          value={newUserForm.name}
                          onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-0.5">Mobile Contact</label>
                        <input
                          type="tel"
                          required
                          value={newUserForm.mobile}
                          onChange={(e) => setNewUserForm({ ...newUserForm, mobile: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-0.5">Assigned Role</label>
                        <select
                          value={newUserForm.role}
                          onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                        >
                          <option>LAB OPS MANAGER</option>
                          <option>FINANCE & AUDIT</option>
                          <option>COLLECTION AGENT</option>
                          <option>CUSTOMER SUPPORT</option>
                        </select>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <button type="button" onClick={() => setNewUserModal(false)} className="flex-1 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">Cancel</button>
                        <button type="submit" className="flex-1 py-2 bg-[#032C64] text-white rounded-xl text-xs font-bold">Create User</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 5. FINANCE ================= */}
          {activeSection === 'finance' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900">Finance & Settlements Desk 💳</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Gross Revenue Collected</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">₹4,474.00</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">B2B Lab Cost (-55%)</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">₹2,460.70</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Platform Net Profit (+45%)</span>
                  <p className="text-2xl font-black text-emerald-600 mt-1">₹2,013.30</p>
                </div>
              </div>
            </div>
          )}

          {/* ================= 6. AFFILIATES ================= */}
          {activeSection === 'affiliate' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900">Affiliate Desk & Standees 🤝</h2>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                  {[
                    { id: 'AFF-001', name: 'Dr. R.K. Sharma Clinic', contact: '+91 98112 00192', city: 'Greater Noida', refCode: 'TB-DOC-RK', commission: 20, wallet: 4850 },
                    { id: 'AFF-002', name: 'Sanjivani Medical Store', contact: '+91 98711 99201', city: 'Faridabad', refCode: 'TB-MED-SANJ', commission: 15, wallet: 2900 }
                  ].map((aff) => (
                    <div key={aff.id} className="p-4 rounded-2xl border border-slate-200 bg-white flex justify-between items-center">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{aff.name}</h4>
                        <p className="text-xs text-slate-500">{aff.contact} • {aff.city}</p>
                        <span className="text-[10px] font-black text-pink-700 bg-pink-50 px-2 py-0.5 rounded mt-1 inline-block">
                          Code: {aff.refCode}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-400">Wallet</span>
                        <p className="text-base font-black text-emerald-600">₹{aff.wallet}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs text-center">
                  <h3 className="text-xs font-black uppercase text-slate-400 mb-3">PRINTABLE DESK STANDEE</h3>
                  <div className="border-4 border-[#032C64] rounded-2xl p-6 bg-gradient-to-b from-white to-blue-50/30">
                    <h4 className="text-lg font-black text-[#032C64]">TestBeat Diagnostics</h4>
                    <div className="my-4 p-4 bg-white border-2 border-dashed border-slate-300 rounded-xl inline-block">
                      <div className="w-28 h-28 bg-slate-900 rounded-lg flex items-center justify-center text-white text-[10px] font-bold p-2 text-center">
                        Scan to Book Lab Tests at 70% OFF
                      </div>
                    </div>
                    <div className="bg-[#032C64] text-white py-1.5 px-3 rounded-xl text-xs font-bold">
                      Dr. R.K. Sharma Clinic
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 7. APIS ================= */}
          {activeSection === 'apis' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900">Lab Partners & API Gateway Hub 🔌</h2>
                <button 
                  onClick={() => { setApiSaveStatus(true); setTimeout(() => setApiSaveStatus(false), 2000); }}
                  className="px-5 py-2 bg-[#032C64] text-white rounded-xl text-xs font-black uppercase shadow"
                >
                  {apiSaveStatus ? 'Saved ✓' : 'Save API Credentials'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-900">Redcliffe Lifetech API</span>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">LIVE</span>
                  </div>
                  <input type="text" value={apiHub.redcliffe.endpoint} readOnly className="w-full border rounded-lg p-2 font-mono text-[11px]" />
                  <input type="text" defaultValue={apiHub.redcliffe.key} className="w-full border rounded-lg p-2 font-mono text-[11px]" />
                </div>

                <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-900">Thyrocare Technologies API</span>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">LIVE</span>
                  </div>
                  <input type="text" value={apiHub.thyrocare.endpoint} readOnly className="w-full border rounded-lg p-2 font-mono text-[11px]" />
                  <input type="text" defaultValue={apiHub.thyrocare.key} className="w-full border rounded-lg p-2 font-mono text-[11px]" />
                </div>
              </div>
            </div>
          )}

          {/* ================= 8. SETTINGS ================= */}
          {activeSection === 'settings' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6 max-w-2xl">
              <h2 className="text-xl font-black text-slate-900">Platform Settings & Dynamic Branding ⚙️</h2>
              <form onSubmit={(e) => { e.preventDefault(); setSettingsSaved(true); setTimeout(() => setSettingsSaved(false), 2000); }} className="space-y-4 text-xs font-bold">
                <div>
                  <label className="block text-slate-700 uppercase mb-1">Header Logo Path</label>
                  <input
                    type="text"
                    value={siteSettings.headerLogoUrl}
                    onChange={(e) => setSiteSettings({ ...siteSettings, headerLogoUrl: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 uppercase mb-1">Customer Care Phone Number</label>
                  <input
                    type="text"
                    value={siteSettings.helplineNumber}
                    onChange={(e) => setSiteSettings({ ...siteSettings, helplineNumber: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <button type="submit" className="py-3 px-6 bg-[#032C64] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow">
                  {settingsSaved ? 'Saved Settings ✓' : 'Save Platform Settings'}
                </button>
              </form>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
