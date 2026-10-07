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
  Plus, 
  TrendingUp,
  FileCheck2,
  RefreshCw,
  MessageSquare
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'bookings' | 'visitors' | 'roles' | 'finance' | 'affiliate' | 'apis' | 'settings'>('dashboard');

  // Live Orders Pipeline State
  const [bookingsList, setBookingsList] = useState([
    { id: 'TB_RX_1791238476870_9497', patient: 'Ramesh Sharma', phone: '+91 98112 34567', test: 'Complete Blood Count (CBC) Test', lab: 'Redcliffe Labs', amount: 897.00, status: 'Lab Processing', phlebo: 'Sunil Kumar (AG-101)', reportUrl: 'https://reports.testbeat.in/pdf/9497' },
    { id: 'TB_1791234979305_7550', patient: 'Ananya Verma', phone: '+91 98711 22334', test: 'Thyroid Profile Total (T3, T4, TSH)', lab: 'Dr Lal PathLabs', amount: 1680.00, status: 'Sample Collected', phlebo: 'Vikas Singh (AG-104)', reportUrl: '' },
    { id: 'TB_1791234074636_2517', patient: 'Deepak Rao', phone: '+91 99100 88291', test: 'Lipid Profile Extended Panel', lab: 'Thyrocare', amount: 299.00, status: 'Phlebo Assigned', phlebo: 'Manoj Kumar (AG-108)', reportUrl: '' },
    { id: 'TB_1791233936740_4023', patient: 'Kavita Mishra', phone: '+91 98109 44321', test: 'Smart Full Body Vital Screen', lab: 'Redcliffe Labs', amount: 1099.00, status: 'Report Dispatched', phlebo: 'Sunil Kumar (AG-101)', reportUrl: 'https://reports.testbeat.in/pdf/4023' },
    { id: 'TB_1791233765486_3905', patient: 'Suresh Chandra', phone: '+91 97188 55412', test: 'Executive Health Screen + Vitamins', lab: 'Healthians', amount: 1499.00, status: 'Payment Pending', phlebo: 'Unassigned', reportUrl: '' }
  ]);

  // Clickable Lab Filter from Multi-Lab distribution bar
  const [activeLabFilter, setActiveLabFilter] = useState<string>('ALL');

  // Modal State for inspecting and actioning an order directly from dashboard
  const [activeModalOrder, setActiveModalOrder] = useState<typeof bookingsList[0] | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string>('');

  // Filtered list based on clicked distribution using useMemo
  const displayedOrders = useMemo(() => {
    if (activeLabFilter === 'ALL') return bookingsList;
    return bookingsList.filter(b => b.lab.toLowerCase().includes(activeLabFilter.toLowerCase()));
  }, [bookingsList, activeLabFilter]);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setBookingsList(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    setActionSuccess(`Order ${id} status updated to: ${newStatus}`);
    setTimeout(() => setActionSuccess(''), 3000);
    setActiveModalOrder(null);
  };

  const [visitorsList] = useState([
    { id: 'V-101', contact: '+91 98112 77011', location: 'Noida (201301)', ip: '27.59.71.180', landing: '/packages', time: 'Just now', score: 'High Intent' },
    { id: 'V-102', contact: '+91 98711 00214', location: 'Greater Noida (201310)', ip: '103.21.54.90', landing: '/book-test', time: '2 mins ago', score: 'Phone Captured' },
    { id: 'V-103', contact: 'Anonymous Viewer', location: 'Faridabad (121001)', ip: '49.36.12.10', landing: '/compare', time: '5 mins ago', score: 'Browsing' },
    { id: 'V-104', contact: '+91 99100 33219', location: 'Delhi (110075)', ip: '182.72.10.22', landing: '/partner', time: '11 mins ago', score: 'Doctor Lead' }
  ]);

  const [usersList, setUsersList] = useState([
    { id: 'U-1', name: 'Shubhranshu Kumar', mobile: '+91 76669 53705', role: 'SUPER ADMIN', status: 'Active' },
    { id: 'U-2', name: 'Dr. Neeraj Mathur', mobile: '+91 98110 44210', role: 'LAB OPS MANAGER', status: 'Active' },
    { id: 'U-3', name: 'Pooja Rani', mobile: '+91 98711 55219', role: 'FINANCE & AUDIT', status: 'Active' },
    { id: 'U-4', name: 'Sunil Phlebo Lead', mobile: '+91 99109 22014', role: 'COLLECTION AGENT', status: 'Active' }
  ]);
  const [newUserModal, setNewUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: '', mobile: '', role: 'LAB OPS MANAGER' });

  const [affiliates] = useState([
    { id: 'AFF-001', name: 'Dr. R.K. Sharma Clinic', contact: '+91 98112 00192', city: 'Greater Noida', refCode: 'TB-DOC-RK', commission: 20, wallet: 4850, totalBookings: 34 },
    { id: 'AFF-002', name: 'Sanjivani Medical Store', contact: '+91 98711 99201', city: 'Faridabad', refCode: 'TB-MED-SANJ', commission: 15, wallet: 2900, totalBookings: 18 }
  ]);
  const [selectedStandeePartner] = useState(affiliates[0]);

  const [apiHub] = useState({
    redcliffe: { enabled: true, endpoint: 'https://api.redcliffelifesciences.com/v1', key: 'RL_PROD_JWT_9921' },
    drlal: { enabled: true, endpoint: 'https://partner-api.lalpathlabs.com/prod', key: 'LP_REF_NO_441' },
    thyrocare: { enabled: true, endpoint: 'https://xml.thyrocare.com/api', key: 'TC_LIVE_KEY_882910' },
    healthians: { enabled: false, endpoint: 'https://api.healthians.com/partner/v2', key: 'HN_AUTH_TOKEN_77218' }
  });
  const [apiSaveStatus, setApiSaveStatus] = useState(false);

  const [siteSettings, setSiteSettings] = useState({
    headerLogoUrl: '/logo.png',
    footerLogoUrl: '/logo-white.png',
    helplineNumber: '+91 83688 87011',
    whatsappNumber: '918368887011'
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  const handleAutoDispatch = () => {
    setActionSuccess('Automated Dispatch Triggered: WhatsApp Verified PDF & SMS download link sent to patient!');
    setTimeout(() => setActionSuccess(''), 3000);
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
    <div className="flex h-screen overflow-hidden bg-[#F4F6F9] font-sans text-slate-800 antialiased selection:bg-[#032C64] selection:text-white">

      {/* ================= SINGLE SIDEBAR ================= */}
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

          {/* ================= 1. COMPLETE DETAILED DASHBOARD ================= */}
          {activeSection === 'dashboard' && (
            <div className="space-y-8">
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Welcome back, Admin 👋</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Diagnostic network telemetry & operations overview.</p>
                </div>
                <div className="flex items-center space-x-2 text-xs font-bold">
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1.5"></span>
                    4 NABL Chains Operational
                  </span>
                </div>
              </div>

              {/* 4 Clickable Metric Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                
                <div 
                  onClick={() => setActiveSection('bookings')}
                  className="bg-white border border-slate-200 hover:border-[#032C64] rounded-2xl p-5 shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
                    <span>TOTAL DIAGNOSTIC ORDERS</span>
                    <span className="bg-blue-50 text-[#032C64] p-1.5 rounded-lg group-hover:bg-[#032C64] group-hover:text-white transition-colors">
                      <ClipboardList className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-slate-900">{bookingsList.length}</span>
                    <span className="text-[11px] text-emerald-600 font-bold">● Active Queue</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 block group-hover:text-[#032C64] font-bold">
                    View Live Pipeline →
                  </span>
                </div>

                <div 
                  onClick={() => setActiveSection('finance')}
                  className="bg-white border border-slate-200 hover:border-emerald-600 rounded-2xl p-5 shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
                    <span>GROSS COLLECTION (₹)</span>
                    <span className="bg-emerald-50 text-emerald-600 p-1.5 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <TrendingUp className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-slate-900">₹4,474</span>
                    <span className="text-[10px] text-slate-400 font-bold">Cashfree PG</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 block group-hover:text-emerald-600 font-bold">
                    View P&L Settlements →
                  </span>
                </div>

                <div 
                  onClick={() => {
                    setActiveLabFilter('ALL');
                    setActionSuccess('Showing all Prescription direct bookings');
                    setTimeout(() => setActionSuccess(''), 2500);
                  }}
                  className="bg-white border border-slate-200 hover:border-amber-500 rounded-2xl p-5 shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
                    <span>PRESCRIPTIONS UPLOADED</span>
                    <span className="bg-amber-50 text-amber-600 p-1.5 rounded-lg group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <FileCheck2 className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-slate-900">5</span>
                    <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">Action Queue</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 block group-hover:text-amber-600 font-bold">
                    Filter Prescriptions →
                  </span>
                </div>

                <div 
                  onClick={() => setActiveSection('visitors')}
                  className="bg-white border border-slate-200 hover:border-purple-600 rounded-2xl p-5 shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
                    <span>WEBSITE VISITORS & LEADS</span>
                    <span className="bg-purple-50 text-purple-600 p-1.5 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <Users className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-slate-900">104</span>
                    <span className="text-[10px] text-purple-700 font-bold">Real-time Radar</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 block group-hover:text-purple-600 font-bold">
                    Open Leads CRM →
                  </span>
                </div>

              </div>

              {/* Middle Row: Multi-Lab Distribution & Sample Status Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                        Multi-Lab Fulfillment Distribution
                      </h3>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        Online
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-5">Click any diagnostic chain bar to filter live orders below.</p>

                    <div className="space-y-4 text-xs font-bold">
                      
                      <div 
                        onClick={() => setActiveLabFilter(activeLabFilter === 'Redcliffe' ? 'ALL' : 'Redcliffe')}
                        className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${activeLabFilter === 'Redcliffe' ? 'border-[#032C64] bg-blue-50/50 shadow-xs' : 'border-slate-100 hover:border-slate-200'}`}
                      >
                        <div className="flex justify-between mb-1.5">
                          <span className="text-slate-800 flex items-center">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#032C64] mr-2"></span>
                            Redcliffe Labs (60-Min Doorstep Pickup)
                          </span>
                          <span className="text-[#032C64] font-black">55% Load</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#032C64] to-[#4575B4] w-[55%] rounded-full"></div>
                        </div>
                      </div>

                      <div 
                        onClick={() => setActiveLabFilter(activeLabFilter === 'Dr Lal' ? 'ALL' : 'Dr Lal')}
                        className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${activeLabFilter === 'Dr Lal' ? 'border-amber-500 bg-amber-50/50 shadow-xs' : 'border-slate-100 hover:border-slate-200'}`}
                      >
                        <div className="flex justify-between mb-1.5">
                          <span className="text-slate-800 flex items-center">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#FDAE61] mr-2"></span>
                            Dr Lal PathLabs (Gold Standard Reference)
                          </span>
                          <span className="text-amber-800 font-black">25% Load</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#FDAE61] w-[25%] rounded-full"></div>
                        </div>
                      </div>

                      <div 
                        onClick={() => setActiveLabFilter(activeLabFilter === 'Thyrocare' ? 'ALL' : 'Thyrocare')}
                        className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${activeLabFilter === 'Thyrocare' ? 'border-emerald-600 bg-emerald-50/50 shadow-xs' : 'border-slate-100 hover:border-slate-200'}`}
                      >
                        <div className="flex justify-between mb-1.5">
                          <span className="text-slate-800 flex items-center">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2"></span>
                            Thyrocare & Healthians (Preventive Profiles)
                          </span>
                          <span className="text-emerald-800 font-black">20% Load</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[20%] rounded-full"></div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {activeLabFilter !== 'ALL' && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-500">Filtered by: <b>{activeLabFilter}</b></span>
                      <button onClick={() => setActiveLabFilter('ALL')} className="text-[#032C64] font-black underline">
                        Reset Filter
                      </button>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between text-center">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-1">
                      Sample Status Overview
                    </h3>
                    <p className="text-xs text-slate-400 mb-6">Phlebotomy and lab lifecycle.</p>

                    <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-slate-100" strokeWidth="3.8" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-[#032C64]" strokeDasharray="60, 100" strokeWidth="3.8" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-slate-900">{bookingsList.length}</span>
                        <span className="text-[9px] font-bold uppercase text-slate-400">Total Orders</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs border-t border-slate-100 pt-3">
                      <div><span className="block font-black text-slate-800">0</span><span className="text-[10px] text-slate-400 font-bold">Paid</span></div>
                      <div><span className="block font-black text-amber-600">5</span><span className="text-[10px] text-slate-400 font-bold">Pending</span></div>
                      <div><span className="block font-black text-blue-600">5</span><span className="text-[10px] text-slate-400 font-bold">Parcha</span></div>
                    </div>
                  </div>

                  <button onClick={() => setActiveSection('bookings')} className="w-full mt-4 py-2 bg-slate-50 hover:bg-slate-100 text-[#032C64] rounded-xl text-xs font-black transition-all">
                    View All Status Filters →
                  </button>
                </div>
              </div>

              {/* Live Feed Table */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                      LIVE FEED: LATEST CUSTOMER BOOKINGS
                    </h3>
                    <p className="text-xs text-slate-400">Click any row to open dispatch or re-assign phlebotomist.</p>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    Showing: {displayedOrders.length} records
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-[11px] font-black uppercase text-slate-400">
                        <th className="py-3 px-3">Order / Reference</th>
                        <th className="py-3 px-3">Patient Contact</th>
                        <th className="py-3 px-3">Test Investigation</th>
                        <th className="py-3 px-3">Assigned Lab</th>
                        <th className="py-3 px-3">Amount</th>
                        <th className="py-3 px-3">Current Status</th>
                        <th className="py-3 px-3 text-right">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {displayedOrders.map((order) => (
                        <tr 
                          key={order.id} 
                          onClick={() => setActiveModalOrder(order)}
                          className="hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <td className="py-3.5 px-3 font-bold text-[#032C64]">{order.id}</td>
                          <td className="py-3.5 px-3">
                            <span className="font-extrabold text-slate-900 block">{order.patient}</span>
                            <span className="text-[11px] text-slate-500">{order.phone}</span>
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-slate-700">{order.test}</td>
                          <td className="py-3.5 px-3">
                            <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[10px]">
                              {order.lab}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-black text-slate-900">₹{order.amount.toFixed(2)}</td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                              order.status.includes('Dispatched') ? 'bg-emerald-100 text-emerald-800' :
                              order.status.includes('Processing') ? 'bg-blue-100 text-blue-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button className="px-2.5 py-1 bg-[#032C64] text-white rounded-lg text-[10px] font-bold">
                              Manage →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {activeSection !== 'dashboard' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3">
              <h3 className="text-xl font-black text-[#032C64] uppercase">{activeSection} Module</h3>
              <p className="text-xs text-slate-500">Navigation active. Click Dashboard in sidebar to return to telemetry overview.</p>
              <button onClick={() => setActiveSection('dashboard')} className="px-4 py-2 bg-[#032C64] text-white rounded-xl text-xs font-bold">
                Back to Dashboard View
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Order Action Modal */}
      {activeModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400">ORDER ACTION CONSOLE</span>
                <h3 className="text-base font-black text-slate-900">{activeModalOrder.id}</h3>
              </div>
              <button onClick={() => setActiveModalOrder(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs mb-6">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                <div className="flex justify-between"><span className="text-slate-500 font-bold">Patient Name:</span><span className="font-extrabold text-slate-900">{activeModalOrder.patient}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-bold">Phone Number:</span><span className="font-bold text-[#032C64]">{activeModalOrder.phone}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-bold">Diagnostic Test:</span><span className="font-semibold text-slate-700">{activeModalOrder.test}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-bold">Total Bill:</span><span className="font-black text-emerald-700">₹{activeModalOrder.amount.toFixed(2)}</span></div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Update Pipeline Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Phlebo Assigned', 'Sample Collected', 'Lab Processing', 'Report Dispatched'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(activeModalOrder.id, st)}
                      className={`p-2 rounded-xl text-xs font-bold border text-left transition-all ${
                        activeModalOrder.status === st ? 'bg-[#032C64] text-white border-[#032C64]' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <a
                href={`https://wa.me/${activeModalOrder.phone.replace(/\D/g, '')}?text=Hello%20${activeModalOrder.patient},%20your%20TestBeat%20order%20status%20is:%20${activeModalOrder.status}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 bg-[#25D366] text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1 shadow"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Patient</span>
              </a>

              <button
                onClick={() => setActiveModalOrder(null)}
                className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
