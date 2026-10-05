'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Users, Building2, Bike, 
  Wallet, Settings, Bell, Search, RefreshCw, Filter, 
  CheckCircle2, Clock, AlertTriangle, ChevronRight, Download,
  TrendingUp, Activity, MoreVertical, Plus, Phone, MapPin, Check
} from 'lucide-react';

interface Booking {
  id: string;
  code: string;
  patient_name: string;
  phone: string;
  address: string;
  test_name: string;
  lab_name: string;
  amount: number;
  date: string;
  slot: string;
  payment_status: 'PAID' | 'PENDING' | 'REFUNDED';
  booking_status: 'INITIATED' | 'ASSIGNED' | 'COLLECTED' | 'PROCESSING' | 'REPORT_DISPATCHED';
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'patients' | 'labs' | 'riders' | 'revenue' | 'settings'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock initial dataset connected to live workflow
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      code: 'TB-928401',
      patient_name: 'Shubhranshu Kumar',
      phone: '+91 98765 43210',
      address: 'Chi V, Greater Noida, UP',
      test_name: 'HealthShield Complete Full Body (84 Tests)',
      lab_name: 'Redcliffe Labs',
      amount: 999,
      date: '2026-10-06',
      slot: '06:30 AM - 07:30 AM',
      payment_status: 'PAID',
      booking_status: 'ASSIGNED',
    },
    {
      id: '2',
      code: 'TB-928402',
      patient_name: 'Amit Sharma',
      phone: '+91 99112 23344',
      address: 'Alpha 1, Greater Noida',
      test_name: 'Complete Blood Count (CBC - 24 Params)',
      lab_name: 'Dr Lal PathLabs',
      amount: 399,
      date: '2026-10-06',
      slot: '07:30 AM - 08:30 AM',
      payment_status: 'PAID',
      booking_status: 'REPORT_DISPATCHED',
    },
    {
      id: '3',
      code: 'TB-928403',
      patient_name: 'Pooja Verma',
      phone: '+91 98101 23456',
      address: 'Sector 62, Noida, UP',
      test_name: 'Advanced Diabetes Glycemic Panel (HbA1c)',
      lab_name: 'Thyrocare',
      amount: 499,
      date: '2026-10-06',
      slot: '08:00 AM - 09:00 AM',
      payment_status: 'PENDING',
      booking_status: 'INITIATED',
    },
    {
      id: '4',
      code: 'TB-928404',
      patient_name: 'Rajesh Mehra',
      phone: '+91 97110 56789',
      address: 'Pari Chowk, Greater Noida',
      test_name: 'Senior Citizen Vital Organ Care (76 Tests)',
      lab_name: 'Redcliffe Labs',
      amount: 1499,
      date: '2026-10-06',
      slot: '07:00 AM - 08:00 AM',
      payment_status: 'PAID',
      booking_status: 'COLLECTED',
    }
  ]);

  const refreshData = () => {
    setIsRefreshing(true);
    fetch('/api/tests')
      .catch(() => {})
      .finally(() => setTimeout(() => setIsRefreshing(false), 500));
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = b.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm);
    const matchesStatus = selectedStatus === 'ALL' || b.booking_status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const updateBookingStatus = (id: string, newStatus: Booking['booking_status']) => {
    setBookings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, booking_status: newStatus } : item))
    );
  };

  return (
    <div className="flex h-screen w-screen bg-[#F4F6F9] overflow-hidden text-slate-800">
      
      {/* 1. LEFT SIDEBAR (Dark Navy Professional SaaS Theme) */}
      <aside className="w-64 bg-[#0A192F] text-slate-300 flex flex-col justify-between shrink-0 select-none border-r border-[#1E293B]">
        <div>
          {/* Brand Logo Header */}
          <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-[#00B4D8] flex items-center justify-center text-white font-black text-lg shadow-md">
              TB
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white">
                Test<span className="text-[#00B4D8]">Beat</span>
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-[#64748B]">
                Control Cloud
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
                activeTab === 'dashboard' 
                  ? 'bg-[#00B4D8] text-white shadow-md font-bold' 
                  : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard size={17} />
              <span>Executive Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition ${
                activeTab === 'bookings' 
                  ? 'bg-[#00B4D8] text-white shadow-md font-bold' 
                  : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag size={17} />
                <span>Bookings & Orders</span>
              </div>
              <span className="bg-[#FF6B35] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {bookings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('patients')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
                activeTab === 'patients' 
                  ? 'bg-[#00B4D8] text-white shadow-md font-bold' 
                  : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              <Users size={17} />
              <span>Patients Directory</span>
            </button>

            <button
              onClick={() => setActiveTab('labs')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
                activeTab === 'labs' 
                  ? 'bg-[#00B4D8] text-white shadow-md font-bold' 
                  : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              <Building2 size={17} />
              <span>Partner Labs (B2B)</span>
            </button>

            <button
              onClick={() => setActiveTab('riders')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
                activeTab === 'riders' 
                  ? 'bg-[#00B4D8] text-white shadow-md font-bold' 
                  : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              <Bike size={17} />
              <span>Phlebotomists Fleet</span>
            </button>

            <button
              onClick={() => setActiveTab('revenue')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
                activeTab === 'revenue' 
                  ? 'bg-[#00B4D8] text-white shadow-md font-bold' 
                  : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              <Wallet size={17} />
              <span>Cashfree Payouts & P&L</span>
            </button>
          </nav>
        </div>

        {/* Bottom Profile Bar */}
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-900/80 p-3 rounded-2xl flex items-center gap-3 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-extrabold text-sm">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">Administrator</p>
              <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Live Gateway
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-extrabold text-slate-900 capitalize">
              {activeTab === 'dashboard' ? 'Diagnostic Aggregator Command Center' : activeTab}
            </h1>
            <span className="hidden md:inline-flex bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-md font-semibold">
              Today: October 06, 2026
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Realtime Search Bar */}
            <div className="relative w-64 hidden sm:block">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patient, order ID..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-100 text-xs rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/30 transition"
              />
            </div>

            <button 
              onClick={refreshData}
              title="Refresh Live DB"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              <RefreshCw size={17} className={isRefreshing ? 'animate-spin' : ''} />
            </button>

            <button className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition">
              <Bell size={17} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF6B35] rounded-full"></span>
            </button>

            <div className="w-px h-6 bg-slate-200 mx-1"></div>

            <button 
              onClick={() => alert("Creating manual offline test booking...")}
              className="bg-[#00B4D8] hover:bg-[#0096C7] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus size={15} /> New Booking
            </button>
          </div>
        </header>

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* VIEW: EXECUTIVE OVERVIEW */}
          {activeTab === 'dashboard' && (
            <>
              {/* Metric Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Bookings</span>
                    <div className="p-2 bg-blue-50 text-[#00B4D8] rounded-xl"><ShoppingBag size={18} /></div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-2">1,248</div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold mt-2">
                    <TrendingUp size={14} /> +18.4% from last week
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Today's Gross GMV</span>
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Wallet size={18} /></div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-2">₹42,850</div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold mt-2">
                    <TrendingUp size={14} /> Cashfree Auto-settled
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Samples on Route</span>
                    <div className="p-2 bg-amber-50 text-[#FF6B35] rounded-xl"><Bike size={18} /></div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-2">14</div>
                  <div className="text-xs text-amber-700 font-bold mt-2">Cold-chain tracked</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Reports Dispatched</span>
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><CheckCircle2 size={18} /></div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-2">38</div>
                  <div className="text-xs text-purple-700 font-bold mt-2">Shared via WhatsApp</div>
                </div>
              </div>

              {/* Graphical Overview & Lab Share */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 7-Day Booking Volume Chart Simulation */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">7-Day Diagnostic Booking Volume</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Aggregated bookings across Delhi-NCR & UP</p>
                    </div>
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">Last 7 Days</span>
                  </div>

                  {/* Visual Chart Bars */}
                  <div className="h-48 flex items-end justify-between gap-4 pt-4 border-b border-slate-100 px-2">
                    {[
                      { day: 'Wed', count: 35, height: '45%' },
                      { day: 'Thu', count: 52, height: '65%' },
                      { day: 'Fri', count: 68, height: '80%' },
                      { day: 'Sat', count: 94, height: '95%' },
                      { day: 'Sun', count: 88, height: '90%' },
                      { day: 'Mon', count: 48, height: '60%' },
                      { day: 'Tue', count: 62, height: '75%' },
                    ].map((col, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#00B4D8] transition">{col.count}</span>
                        <div 
                          style={{ height: col.height }} 
                          className="w-full max-w-[42px] bg-slate-100 group-hover:bg-[#00B4D8] rounded-t-xl transition duration-200"
                        ></div>
                        <span className="text-xs font-semibold text-slate-500 mt-1">{col.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Partner Lab Split */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">Partner Lab Share</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Order distribution by diagnostic lab</p>
                  </div>

                  <div className="space-y-4 my-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-700">Redcliffe Labs</span>
                        <span className="text-slate-900">54%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-[#FF6B35] h-full rounded-full" style={{ width: '54%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-700">Dr Lal PathLabs</span>
                        <span className="text-slate-900">28%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-[#00B4D8] h-full rounded-full" style={{ width: '28%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-700">Thyrocare</span>
                        <span className="text-slate-900">18%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-[#0077B6] h-full rounded-full" style={{ width: '18%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100/60 text-xs text-slate-600">
                    Highest margin packages booked through <strong>Redcliffe Aggregator Tier</strong>.
                  </div>
                </div>
              </div>
            </>
          )}

          {/* VIEW: LIVE BOOKINGS TABLE (Available in Dashboard and Bookings tab) */}
          {(activeTab === 'dashboard' || activeTab === 'bookings') && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              {/* Table Toolbar */}
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Live Patient Bookings & Collection Queue</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time Neon PostgreSQL database records</p>
                </div>

                {/* Status Filter Chips */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {['ALL', 'INITIATED', 'ASSIGNED', 'COLLECTED', 'REPORT_DISPATCHED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setSelectedStatus(st)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition ${
                        selectedStatus === st
                          ? 'bg-[#0A192F] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                      }`}
                    >
                      {st === 'REPORT_DISPATCHED' ? 'Dispatched' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table Body */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-400 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-100">
                    <tr>
                      <th className="py-4 px-6">Booking Details</th>
                      <th className="py-4 px-6">Patient & Contact</th>
                      <th className="py-4 px-6">Assigned Lab</th>
                      <th className="py-4 px-6">Pickup Schedule</th>
                      <th className="py-4 px-6">Payment</th>
                      <th className="py-4 px-6">Action / Status Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/80 transition">
                        {/* Booking Code & Test */}
                        <td className="py-4 px-6">
                          <span className="font-black text-slate-900 text-xs block">{b.code}</span>
                          <span className="text-[11px] text-[#0077B6] font-semibold mt-0.5 block line-clamp-1">
                            {b.test_name}
                          </span>
                        </td>

                        {/* Patient info */}
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-900">{b.patient_name}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Phone size={11} /> {b.phone}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <MapPin size={11} /> {b.address}
                          </div>
                        </td>

                        {/* Lab */}
                        <td className="py-4 px-6">
                          <span className="font-extrabold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg text-[11px]">
                            {b.lab_name}
                          </span>
                        </td>

                        {/* Schedule */}
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-900">{b.date}</div>
                          <div className="text-[11px] text-slate-500 font-semibold">{b.slot}</div>
                        </td>

                        {/* Amount & Cashfree Status */}
                        <td className="py-4 px-6">
                          <div className="font-black text-slate-900 text-sm">₹{b.amount}</div>
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold mt-0.5 ${
                            b.payment_status === 'PAID'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {b.payment_status}
                          </span>
                        </td>

                        {/* Interactive Status Pipeline Dropdown */}
                        <td className="py-4 px-6">
                          <select
                            value={b.booking_status}
                            onChange={(e) => updateBookingStatus(b.id, e.target.value as any)}
                            className="bg-white border border-slate-200 text-xs font-bold rounded-xl px-2.5 py-1.5 outline-none focus:border-[#00B4D8] cursor-pointer shadow-2xs"
                          >
                            <option value="INITIATED">1. Initiated</option>
                            <option value="ASSIGNED">2. Phlebotomist Assigned</option>
                            <option value="COLLECTED">3. Sample Collected</option>
                            <option value="PROCESSING">4. Processing at Lab</option>
                            <option value="REPORT_DISPATCHED">5. Report Dispatched ✓</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: PARTNER LABS */}
          {activeTab === 'labs' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Redcliffe Labs', accreditation: 'NABL, ISO 9001', testsOffered: 142, margin: '48%', status: 'Active API' },
                { name: 'Dr Lal PathLabs', accreditation: 'NABL, CAP Gold', testsOffered: 210, margin: '35%', status: 'Active API' },
                { name: 'Thyrocare Technologies', accreditation: 'NABL, CAP', testsOffered: 98, margin: '44%', status: 'Active API' },
              ].map((lab, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      {lab.status}
                    </span>
                    <Building2 className="text-[#00B4D8]" size={20} />
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-3">{lab.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{lab.accreditation}</p>

                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Live Catalog Tests:</span>
                      <span className="font-bold text-slate-900">{lab.testsOffered}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Average Aggregator Margin:</span>
                      <span className="font-bold text-emerald-600">{lab.margin}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW: PHLEBOTOMISTS FLEET */}
          {activeTab === 'riders' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <h3 className="text-base font-extrabold text-slate-900 mb-4">Active Phlebotomist Fleet (Home Collection Team)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Sunil Verma', zone: 'Greater Noida West & Pari Chowk', phone: '+91 98990 11223', activePickups: 3 },
                  { name: 'Deepak Sharma', zone: 'Noida Sec 62, 50, 76', phone: '+91 98770 22334', activePickups: 2 },
                  { name: 'Vikram Singh', zone: 'Ghaziabad & Indirapuram', phone: '+91 98110 33445', activePickups: 4 },
                ].map((rider, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <Bike size={16} className="text-[#FF6B35]" />
                      <span className="font-bold text-slate-900 text-xs">{rider.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{rider.zone}</p>
                    <div className="mt-3 flex justify-between items-center text-xs pt-2 border-t border-slate-200">
                      <span className="text-slate-400">{rider.phone}</span>
                      <span className="font-extrabold text-[#0077B6]">{rider.activePickups} Active Pickups</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: CASHFREE PAYOUTS & REVENUE */}
          {activeTab === 'revenue' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <h3 className="text-base font-extrabold text-slate-900 mb-2">Cashfree Gateway Reconciliation</h3>
              <p className="text-xs text-slate-500 mb-6">Automated settlements to company current account.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block font-semibold">Available for Settlement</span>
                  <span className="text-2xl font-black text-slate-900 mt-1 block">₹28,450</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Auto-T+1 Cycle</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block font-semibold">Gateway Processing Fee (1.9%)</span>
                  <span className="text-2xl font-black text-slate-900 mt-1 block">₹540.55</span>
                  <span className="text-[10px] text-slate-400 font-bold">Cashfree Standard</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block font-semibold">Net Diagnostics Margin (EBITDA)</span>
                  <span className="text-2xl font-black text-emerald-600 mt-1 block">₹14,920</span>
                  <span className="text-[10px] text-emerald-600 font-bold">~42% Blended Margin</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
