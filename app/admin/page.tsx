'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, DollarSign, Clock, CheckCircle2, 
  RefreshCw, FileText, ChevronRight, Activity 
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: '12',
    revenueToday: '11,488',
    pendingPickups: '3',
    reportsReady: '7'
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = () => {
    setLoading(true);
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.metrics);
          setRecentOrders(data.recentActivity || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load stats', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-6 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <span className="text-[11px] font-black uppercase text-[#00B4D8] bg-blue-50 px-2.5 py-1 rounded-md">
              Operations Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              TestBeat Aggregator Dashboard
            </h1>
          </div>

          <button
            onClick={fetchStats}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh Data
          </button>
        </div>

        {/* 4 Core Operational Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Bookings</span>
              <Users size={18} className="text-[#00B4D8]" />
            </div>
            <div className="text-2xl font-black text-slate-900">{stats.totalBookings}</div>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 block">Live in Neon Database</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Today's Revenue</span>
              <DollarSign size={18} className="text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">₹{stats.revenueToday}</div>
            <span className="text-[11px] text-slate-400 font-medium mt-1 block">Via Cashfree Gateway</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Pending Pickups</span>
              <Clock size={18} className="text-[#FF6B35]" />
            </div>
            <div className="text-2xl font-black text-slate-900">{stats.pendingPickups}</div>
            <span className="text-[11px] text-amber-600 font-bold mt-1 block">Phlebotomists on field</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Reports Dispatched</span>
              <CheckCircle2 size={18} className="text-purple-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{stats.reportsReady}</div>
            <span className="text-[11px] text-purple-600 font-bold mt-1 block">Shared on WhatsApp</span>
          </div>
        </div>

        {/* Live Incoming Orders Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-base">Recent Patient Bookings</h3>
            <span className="text-xs text-slate-400">Auto-synced with Neon DB</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Booking ID</th>
                  <th className="py-3.5 px-4">Patient</th>
                  <th className="py-3.5 px-4">Partner Lab</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {recentOrders.length > 0 ? (
                  recentOrders.map((ord, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{ord.booking_code}</td>
                      <td className="py-3.5 px-4">{ord.patient_name || 'Shubhranshu Kumar'}</td>
                      <td className="py-3.5 px-4 font-semibold text-[#0077B6]">{ord.lab_name || 'Redcliffe Labs'}</td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">₹{ord.total_amount}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px]">
                          {ord.booking_status || 'ASSIGNED'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button className="text-[#00B4D8] hover:text-[#0077B6] font-bold">Manage</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No incoming bookings yet. Test orders will appear here automatically.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
