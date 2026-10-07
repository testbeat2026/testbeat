'use client';

import React, { useState } from 'react';
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
  Clock, 
  AlertCircle, 
  Send, 
  Download, 
  Plus, 
  Power, 
  RefreshCw, 
  PhoneCall, 
  Share2, 
  Check, 
  Lock, 
  Smartphone, 
  FileText,
  CreditCard,
  MessageSquare
} from 'lucide-react';

// Brand Colors Definition (Locked with TestBeat Identity):
// Primary Navy: #032C64 | Accent Spectrum: #D73027, #F46D43, #FDAE61, #FEE090, #E0F3F8, #ABD9E9, #74ADD1, #4575B4

export default function SuperAdminPortal() {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'bookings' | 'visitors' | 'roles' | 'finance' | 'affiliate' | 'apis' | 'settings'>('dashboard');

  // 1. Live Bookings & Reports Data
  const [bookingsList, setBookingsList] = useState([
    { id: 'TB_RX_1791238476870_9497', patient: 'Ramesh Sharma', phone: '+91 98112 34567', test: 'Complete Blood Count (CBC) Test', lab: 'Redcliffe Labs', amount: 897.00, status: 'Lab Processing', phlebo: 'Sunil Kumar (AG-101)', reportUrl: 'https://reports.testbeat.in/pdf/9497' },
    { id: 'TB_1791234979305_7550', patient: 'Ananya Verma', phone: '+91 98711 22334', test: 'Thyroid Profile Total (T3, T4, TSH)', lab: 'Dr Lal PathLabs', amount: 1680.00, status: 'Sample Collected', phlebo: 'Vikas Singh (AG-104)', reportUrl: '' },
    { id: 'TB_1791234074636_2517', patient: 'Deepak Rao', phone: '+91 99100 88291', test: 'Lipid Profile Extended Panel', lab: 'Thyrocare', amount: 299.00, status: 'Phlebo Assigned', phlebo: 'Manoj Kumar (AG-108)', reportUrl: '' },
    { id: 'TB_1791233936740_4023', patient: 'Kavita Mishra', phone: '+91 98109 44321', test: 'Smart Full Body Vital Screen', lab: 'Redcliffe Labs', amount: 1099.00, status: 'Report Dispatched', phlebo: 'Sunil Kumar (AG-101)', reportUrl: 'https://reports.testbeat.in/pdf/4023' },
    { id: 'TB_1791233765486_3905', patient: 'Suresh Chandra', phone: '+91 97188 55412', test: 'Executive Health Screen + Vitamins', lab: 'Healthians', amount: 1499.00, status: 'Payment Pending', phlebo: 'Unassigned', reportUrl: '' }
  ]);

  const [selectedBooking, setSelectedBooking] = useState(bookingsList[0]);
  const [dispatchAlert, setDispatchAlert] = useState(false);

  // 2. Live Visitors CRM Data
  const [visitorsList] = useState([
    { id: 'V-101', contact: '+91 98112 77011', location: 'Noida (201301)', ip: '27.59.71.180', landing: '/packages', time: 'Just now', score: 'High Intent' },
    { id: 'V-102', contact: '+91 98711 00214', location: 'Greater Noida (201310)', ip: '103.21.54.90', landing: '/book-test', time: '2 mins ago', score: 'Phone Captured' },
    { id: 'V-103', contact: 'Anonymous Viewer', location: 'Faridabad (121001)', ip: '49.36.12.10', landing: '/compare', time: '5 mins ago', score: 'Browsing' },
    { id: 'V-104', contact: '+91 99100 33219', location: 'Delhi (110075)', ip: '182.72.10.22', landing: '/partner', time: '11 mins ago', score: 'Doctor Lead' }
  ]);

  // 3. User Roles & Privileges
  const [usersList, setUsersList] = useState([
    { id: 'U-1', name: 'Shubhranshu Kumar', mobile: '+91 76669 53705', role: 'SUPER ADMIN', status: 'Active' },
    { id: 'U-2', name: 'Dr. Neeraj Mathur', mobile: '+91 98110 44210', role: 'LAB OPS MANAGER', status: 'Active' },
    { id: 'U-3', name: 'Pooja Rani', mobile: '+91 98711 55219', role: 'FINANCE & AUDIT', status: 'Active' },
    { id: 'U-4', name: 'Sunil Phlebo Lead', mobile: '+91 99109 22014', role: 'COLLECTION AGENT', status: 'Active' }
  ]);
  const [newUserModal, setNewUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: '', mobile: '', role: 'LAB OPS MANAGER' });

  // 4. Affiliate Partners & Standee Generator
  const [affiliates, setAffiliates] = useState([
    { id: 'AFF-001', name: 'Dr. R.K. Sharma Clinic', contact: '+91 98112 00192', city: 'Greater Noida', refCode: 'TB-DOC-RK', commission: 20, wallet: 4850, pendingWithdraw: 2000, totalBookings: 34 },
    { id: 'AFF-002', name: 'Sanjivani Medical Store', contact: '+91 98711 99201', city: 'Faridabad', refCode: 'TB-MED-SANJ', commission: 15, wallet: 2900, pendingWithdraw: 0, totalBookings: 18 }
  ]);
  const [selectedStandeePartner, setSelectedStandeePartner] = useState(affiliates[0]);
  const [showStandeeModal, setShowStandeeModal] = useState(false);

  // 5. Partner APIs Hub Configuration
  const [apiHub, setApiHub] = useState({
    redcliffe: { enabled: true, endpoint: 'https://api.redcliffelifesciences.com/v1', key: 'RL_PROD_JWT_9921', secret: '••••••••••••••••' },
    drlal: { enabled: true, endpoint: 'https://partner-api.lalpathlabs.com/prod', key: 'LP_REF_NO_441', secret: '••••••••••••••••' },
    thyrocare: { enabled: true, endpoint: 'https://xml.thyrocare.com/api', key: 'TC_LIVE_KEY_882910', secret: '••••••••••••••••' },
    healthians: { enabled: false, endpoint: 'https://api.healthians.com/partner/v2', key: 'HN_AUTH_TOKEN_77218', secret: '••••••••••••••••' },
    whatsapp: { enabled: true, endpoint: 'https://graph.facebook.com/v18.0', token: 'EAAQ...WA_TOKEN', phoneId: '109823419082' },
    msg91: { enabled: true, authKey: '334901AZMsg91Live', templateId: 'TB_REPORT_SMS_01' },
    zoho: { enabled: true, clientId: '1000.ZOHO_CLIENT_99', orgId: '8092144' },
    cashfree: { enabled: true, appId: 'CF_LIVE_99210', secretKey: '••••••••••••••••' },
    razorpay: { enabled: true, keyId: 'rzp_live_TestBeat99', keySecret: '••••••••••••••••' }
  });
  const [apiSaveStatus, setApiSaveStatus] = useState(false);

  // 6. Settings & Branding State
  const [siteSettings, setSiteSettings] = useState({
    headerLogoUrl: '/logo.png',
    footerLogoUrl: '/logo-white.png',
    helplineNumber: '+91 83688 87011',
    whatsappNumber: '918368887011',
    autoReportDispatch: true,
    platformMarginPercent: 45
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Handlers
  const handleAutoDispatch = () => {
    setDispatchAlert(true);
    setTimeout(() => setDispatchAlert(false), 3000);
  };

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
    <div className="min-h-screen bg-[#F4F6F9] flex font-sans text-slate-800 antialiased selection:bg-[#032C64] selection:text-white">

      {/* ================= SIDEBAR (LOCKED TO SCREENSHOT STYLE) ================= */}
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
              <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded text-[10px]">5</span>
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

      {/* ================= MAIN DASHBOARD BODY ================= */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">

        {/* Top Header Bar */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search patient, phone, booking ID, affiliate..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-[#032C64]"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D73027]"></span>
            </button>

            <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-[#032C64] text-white flex items-center justify-center font-black text-xs shadow-xs">
                SK
              </div>
              <div>
                <p className="text-xs font-black text-slate-800 leading-tight">Shubhranshu Kumar</p>
                <p className="text-[10px] font-bold text-slate-400">Chief Executive Officer</p>
              </div>
            </div>
          </div>
        </header>

        {/* Body Container */}
        <div className="p-8 space-y-8">

          {/* Top Banner Alert for Automated Dispatch */}
          {dispatchAlert && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-800 animate-in fade-in">
              <span className="flex items-center font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" />
                Automated Dispatch Triggered: WhatsApp Verified PDF & SMS download link sent to patient!
              </span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-black">Success</span>
            </div>
          )}

          {/* ================= 1. DASHBOARD OVERVIEW ================= */}
          {activeSection === 'dashboard' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Welcome back, Admin 👋</h2>
                <p className="text-xs text-slate-500 mt-0.5">Diagnostic network telemetry & operations overview.</p>
              </div>

              {/* 4 KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
                    <span>TOTAL DIAGNOSTIC ORDERS</span>
                    <span className="bg-blue-50 text-[#032C64] p-1.5 rounded-lg"><ClipboardList className="w-4 h-4" /></span>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-slate-900">{bookingsList.length}</span>
                    <span className="text-[11px] text-emerald-600 font-bold">● Active Queue</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
                    <span>GROSS COLLECTION (₹)</span>
                    <span className="bg-emerald-50 text-emerald-600 p-1.5 rounded-lg"><Wallet className="w-4 h-4" /></span>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-slate-900">₹4,474</span>
                    <span className="text-[10px] text-slate-400 font-bold">Cashfree / PG</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
                    <span>ACTIVE LAB ROUTING</span>
                    <span className="bg-amber-50 text-amber-600 p-1.5 rounded-lg"><Building2 className="w-4 h-4" /></span>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-slate-900">4</span>
                    <span className="text-[10px] text-emerald-600 font-bold">NABL Chains Live</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
                    <span>WEBSITE VISITORS & LEADS</span>
                    <span className="bg-purple-50 text-purple-600 p-1.5 rounded-lg"><Users className="w-4 h-4" /></span>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-slate-900">104</span>
                    <span className="text-[10px] text-purple-700 font-bold">Real-time Node</span>
                  </div>
                </div>
              </div>

              {/* Multi-Lab Load Distribution Progress */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-1">
                    Multi-Lab Fulfillment Distribution
                  </h3>
                  <p className="text-xs text-slate-400 mb-5">Automated workload distribution across integrated diagnostic partners.</p>

                  <div className="space-y-4 text-xs font-bold">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-700">Redcliffe Labs (60-Min Doorstep Pickup)</span>
                        <span className="text-[#032C64]">55% Load</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#032C64] to-[#4575B4] w-[55%] rounded-full"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-700">Dr Lal PathLabs (National Reference Assays)</span>
                        <span className="text-[#032C64]">25% Load</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#FDAE61] w-[25%] rounded-full"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-700">Thyrocare & Healthians (Preventive Wellness)</span>
                        <span className="text-[#032C64]">20% Load</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[20%] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-1">
                      Auto Dispatch Engine
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">Real-time status of automated patient updates.</p>

                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="font-bold text-slate-700">WhatsApp Cloud API</span>
                        <span className="text-emerald-700 font-black flex items-center">
                          <Check className="w-3.5 h-3.5 mr-1" /> Active
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="font-bold text-slate-700">MSG91 SMS Gateway</span>
                        <span className="text-emerald-700 font-black flex items-center">
                          <Check className="w-3.5 h-3.5 mr-1" /> Active
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="font-bold text-slate-700">Cold-Chain Monitor (2-8°C)</span>
                        <span className="text-blue-700 font-black">IoT Active</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAutoDispatch}
                    className="w-full mt-4 py-2.5 bg-[#032C64] hover:bg-[#0c2f5d] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow"
                  >
                    Test Auto-Dispatch Ping
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. LIVE BOOKINGS & REPORT ENGINE ================= */}
          {activeSection === 'bookings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Live Orders & Report Dispatch Desk 📑</h2>
                <p className="text-xs text-slate-500 mt-0.5">Real-time lab fulfillment tracking, phlebo status & automated WhatsApp/SMS delivery.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Bookings Queue */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">
                    DIAGNOSTIC ORDERS PIPELINE ({bookingsList.length})
                  </h3>

                  <div className="space-y-3">
                    {bookingsList.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedBooking(item)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          selectedBooking.id === item.id 
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

                {/* Single Order Fulfillment & Dispatch Drawer */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">
                      LAB FULFILLMENT & PATIENT DELIVERY
                    </h3>
                    <p className="text-sm font-black text-slate-900">{selectedBooking.id}</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">Assigned Lab Partner:</span>
                      <span className="font-black text-[#032C64]">{selectedBooking.lab}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">Payment Status:</span>
                      <span className="font-black text-emerald-700">Paid (Cashfree / UPI)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">Lab Rider / Phlebotomist:</span>
                      <span className="font-bold text-slate-900">{selectedBooking.phlebo}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Verified PDF Report URL (Direct Cloud Link)
                    </label>
                    <input
                      type="text"
                      value={selectedBooking.reportUrl}
                      onChange={(e) => setSelectedBooking({ ...selectedBooking, reportUrl: e.target.value })}
                      placeholder="https://reports.partnerlab.com/report_123.pdf"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#032C64]"
                    />
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleAutoDispatch}
                      className="w-full py-3 bg-[#032C64] hover:bg-[#0c2f5d] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow flex items-center justify-center space-x-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch Report to Patient (WhatsApp & SMS)</span>
                    </button>

                    <a
                      href={selectedBooking.reportUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Preview PDF File</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 3. LIVE VISITORS & LEADS CRM ================= */}
          {activeSection === 'visitors' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Live Visitors & Lead Radar 📡</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Real-time visitor IP tracking, captured numbers & WhatsApp outreach.</p>
                </div>
                <span className="text-xs font-black bg-purple-50 text-purple-700 px-3 py-1.5 rounded-xl border border-purple-200">
                  Target Node: Greater Noida / NCR
                </span>
              </div>

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
                        <td className="py-3 px-3">
                          <span className="font-semibold text-slate-800 block">{v.location}</span>
                          <span className="text-[10px] text-slate-400">{v.ip}</span>
                        </td>
                        <td className="py-3 px-3 font-bold text-[#032C64]">{v.landing}</td>
                        <td className="py-3 px-3 text-slate-500">{v.time}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            v.score.includes('Captured') ? 'bg-emerald-100 text-emerald-800' :
                            v.score.includes('High') ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {v.score}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <a
                            href={`https://wa.me/${v.contact.replace(/\D/g, '')}?text=Hello,%20we%20noticed%20you%20were%20looking%20for%20diagnostic%20tests%20on%20TestBeat.`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1 bg-[#25D366] hover:bg-emerald-600 text-white font-bold rounded-lg text-[10px] inline-flex items-center space-x-1"
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

          {/* ================= 4. USER & ROLES PRIVILEGES ================= */}
          {activeSection === 'roles' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">User Access & Role Privileges 🛡️</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Super Admin, Finance, Lab Operations & Sales sub-account credentials.</p>
                </div>
                <button
                  onClick={() => setNewUserModal(true)}
                  className="px-4 py-2 bg-[#032C64] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow flex items-center space-x-1.5"
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
                      <th className="py-3 px-3 text-right">Action</th>
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
                        <td className="py-3 px-3">
                          <span className="text-emerald-700 font-bold flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button 
                            onClick={() => alert(`Access permissions updated for ${u.name}`)}
                            className="text-xs font-bold text-slate-500 hover:text-slate-900 underline"
                          >
                            Modify Privileges
                          </button>
                        </td>
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

          {/* ================= 5. FINANCE, P&L & TAXATION ================= */}
          {activeSection === 'finance' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Finance & Settlements Desk 💳</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Cashfree PG collections, Lab fulfillments & Net margin breakdown.</p>
                </div>
                <span className="text-xs font-black bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200">
                  GST Invoicing: Ready
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Gross Revenue Collected</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">₹4,474.00</p>
                  <span className="text-[10px] text-emerald-600 font-bold">Cashfree & Razorpay</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">B2B Lab Cost (-55%)</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">₹2,460.70</p>
                  <span className="text-[10px] text-slate-500">Payable to Redcliffe & Dr Lal</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Platform Net Profit (+45%)</span>
                  <p className="text-2xl font-black text-emerald-600 mt-1">₹2,013.30</p>
                  <span className="text-[10px] text-emerald-700 font-bold">Retained Net Margin</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">RECONCILED SETTLEMENT LOG</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-[11px] font-black uppercase text-slate-400">
                        <th className="py-2.5 px-3">Order ID</th>
                        <th className="py-2.5 px-3">Patient</th>
                        <th className="py-2.5 px-3">Gross Collected</th>
                        <th className="py-2.5 px-3">Lab Cost (~55%)</th>
                        <th className="py-2.5 px-3">Platform Margin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookingsList.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-[#032C64]">{b.id}</td>
                          <td className="py-2.5 px-3">{b.patient}</td>
                          <td className="py-2.5 px-3 font-black text-slate-900">₹{b.amount.toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-slate-600 font-bold">₹{(b.amount * 0.55).toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-emerald-700 font-black">₹{(b.amount * 0.45).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 6. AFFILIATE DESK & QR STANDEE GENERATOR ================= */}
          {activeSection === 'affiliate' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Affiliate KYC, Commission & Payouts 🤝</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Verify Doctor/Clinic documents, customize commission rate & generate Paytm-style Standees.</p>
                </div>
                <span className="text-xs font-black bg-pink-50 text-pink-700 px-3 py-1.5 rounded-xl border border-pink-200">
                  Affiliate Partners: {affiliates.length}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Partners List */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    REGISTERED B2B PARTNER DIRECTORY
                  </h3>

                  <div className="space-y-3">
                    {affiliates.map((aff) => (
                      <div
                        key={aff.id}
                        className="p-4 rounded-2xl border border-slate-200 hover:border-[#032C64] transition-all bg-white flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-black uppercase text-pink-700 bg-pink-50 px-2 py-0.5 rounded">
                              {aff.refCode}
                            </span>
                            <h4 className="font-extrabold text-slate-900 text-sm mt-1">{aff.name}</h4>
                            <p className="text-xs text-slate-500">{aff.contact} • {aff.city}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-slate-400">Wallet Balance</span>
                            <p className="text-base font-black text-emerald-600">₹{aff.wallet}</p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-600">Commission: <b>{aff.commission}%</b></span>
                          <button
                            onClick={() => {
                              setSelectedStandeePartner(aff);
                              setShowStandeeModal(true);
                            }}
                            className="px-3.5 py-1.5 bg-[#032C64] text-white rounded-xl text-xs font-bold flex items-center space-x-1"
                          >
                            <QrCode className="w-3.5 h-3.5 mr-1" />
                            <span>View Paytm-Style Standee</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Standee Preview Box */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs text-center">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                    PRINT-READY DESK STANDEE PREVIEW
                  </h3>

                  <div className="border-4 border-[#032C64] rounded-2xl p-6 bg-gradient-to-b from-white via-blue-50/30 to-white shadow-md relative overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-[#032C64] text-white font-black text-base flex items-center justify-center mx-auto mb-2">
                      TB
                    </div>
                    <h4 className="text-lg font-black text-[#032C64]">TestBeat Diagnostics</h4>
                    <p className="text-[10px] font-bold text-slate-500">Official Health Partner Collection Stand</p>

                    <div className="my-5 p-4 bg-white border-2 border-dashed border-slate-300 rounded-2xl inline-block shadow-xs">
                      {/* Scaled QR Graphic */}
                      <div className="w-32 h-32 bg-slate-900 rounded-xl flex items-center justify-center text-white text-[11px] font-black p-2 text-center">
                        Scan to Book Lab Tests at 70% OFF
                      </div>
                    </div>

                    <div className="bg-[#032C64] text-white py-2 px-3 rounded-xl">
                      <p className="text-xs font-extrabold">{selectedStandeePartner.name}</p>
                      <p className="text-[10px] text-teal-300">Partner Code: {selectedStandeePartner.refCode}</p>
                    </div>

                    <p className="text-[9px] text-slate-400 mt-3 font-semibold">
                      Powered by Thyrocare, Healthians, Redcliffe & Dr Lal PathLabs
                    </p>
                  </div>

                  <button
                    onClick={() => alert(`Standee for ${selectedStandeePartner.name} sent to high-res PDF printer!`)}
                    className="w-full mt-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Printable High-Res PDF Standee</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= 7. PARTNER APIS & GATEWAYS HUB ================= */}
          {activeSection === 'apis' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Lab Partners & API Gateway Hub 🔌</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Configure APIs, Live/Unlive routing for Redcliffe, Dr Lal, Thyrocare & Healthians.</p>
                </div>
                <button
                  onClick={() => {
                    setApiSaveStatus(true);
                    setTimeout(() => setApiSaveStatus(false), 2500);
                  }}
                  className="px-5 py-2 bg-[#032C64] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow"
                >
                  {apiSaveStatus ? 'Saved Successfully ✓' : 'Save Live API Credentials'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                {/* Redcliffe Configuration */}
                <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-sm">Redcliffe Lifetech API</span>
                    <button
                      onClick={() => setApiHub({ ...apiHub, redcliffe: { ...apiHub.redcliffe, enabled: !apiHub.redcliffe.enabled } })}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                        apiHub.redcliffe.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {apiHub.redcliffe.enabled ? 'LIVE (Active)' : 'STOPPED'}
                    </button>
                  </div>
                  <input type="text" value={apiHub.redcliffe.endpoint} readOnly className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-500 font-mono text-[11px]" />
                  <input type="text" placeholder="Client Key" defaultValue={apiHub.redcliffe.key} className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono text-[11px]" />
                </div>

                {/* Dr Lal PathLabs Configuration */}
                <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-sm">Dr. Lal PathLabs API</span>
                    <button
                      onClick={() => setApiHub({ ...apiHub, drlal: { ...apiHub.drlal, enabled: !apiHub.drlal.enabled } })}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                        apiHub.drlal.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {apiHub.drlal.enabled ? 'LIVE (Active)' : 'STOPPED'}
                    </button>
                  </div>
                  <input type="text" value={apiHub.drlal.endpoint} readOnly className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-500 font-mono text-[11px]" />
                  <input type="text" placeholder="Partner Token" defaultValue={apiHub.drlal.key} className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono text-[11px]" />
                </div>

                {/* Thyrocare Configuration */}
                <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-sm">Thyrocare Technologies XML/REST</span>
                    <button
                      onClick={() => setApiHub({ ...apiHub, thyrocare: { ...apiHub.thyrocare, enabled: !apiHub.thyrocare.enabled } })}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                        apiHub.thyrocare.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {apiHub.thyrocare.enabled ? 'LIVE (Active)' : 'STOPPED'}
                    </button>
                  </div>
                  <input type="text" value={apiHub.thyrocare.endpoint} readOnly className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-500 font-mono text-[11px]" />
                  <input type="text" placeholder="API Key" defaultValue={apiHub.thyrocare.key} className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono text-[11px]" />
                </div>

                {/* Payment Gateway: Cashfree & Razorpay */}
                <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-sm">Payment Gateways (Cashfree / Razorpay)</span>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-black">2026 Production</span>
                  </div>
                  <input type="text" placeholder="Cashfree App ID" defaultValue={apiHub.cashfree.appId} className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono text-[11px]" />
                  <input type="text" placeholder="Razorpay Key ID" defaultValue={apiHub.razorpay.keyId} className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono text-[11px]" />
                </div>
              </div>
            </div>
          )}

          {/* ================= 8. SETTINGS & BRANDING DESK ================= */}
          {activeSection === 'settings' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6 max-w-3xl">
              <div>
                <h2 className="text-xl font-black text-slate-900">Platform Settings & Dynamic Branding ⚙️</h2>
                <p className="text-xs text-slate-500 mt-0.5">Control homepage logo assets, customer care phone numbers & global commission margins.</p>
              </div>

              {settingsSaved && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Branding & Platform settings saved! Live changes applied across website.</span>
                </div>
              )}

              <form onSubmit={(e) => { e.preventDefault(); setSettingsSaved(true); setTimeout(() => setSettingsSaved(false), 2500); }} className="space-y-4 text-xs font-bold">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 uppercase mb-1">Header Logo Path</label>
                    <input
                      type="text"
                      value={siteSettings.headerLogoUrl}
                      onChange={(e) => setSiteSettings({ ...siteSettings, headerLogoUrl: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#032C64]"
                    />
                    <span className="text-[10px] text-slate-400 font-normal">Default: /logo.png</span>
                  </div>

                  <div>
                    <label className="block text-slate-700 uppercase mb-1">Footer White Logo Path</label>
                    <input
                      type="text"
                      value={siteSettings.footerLogoUrl}
                      onChange={(e) => setSiteSettings({ ...siteSettings, footerLogoUrl: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#032C64]"
                    />
                    <span className="text-[10px] text-slate-400 font-normal">Default: /logo-white.png</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 uppercase mb-1">Customer Helpline Number</label>
                    <input
                      type="text"
                      value={siteSettings.helplineNumber}
                      onChange={(e) => setSiteSettings({ ...siteSettings, helplineNumber: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#032C64]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 uppercase mb-1">WhatsApp Chat Desk</label>
                    <input
                      type="text"
                      value={siteSettings.whatsappNumber}
                      onChange={(e) => setSiteSettings({ ...siteSettings, whatsappNumber: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#032C64]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="py-3 px-6 bg-[#032C64] hover:bg-[#0c2f5d] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow"
                >
                  Save Platform & Branding Settings
                </button>
              </form>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
