'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  ClipboardList, 
  FileText, 
  TrendingUp, 
  Activity, 
  RefreshCw, 
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Eye
} from 'lucide-react';

export default function MasterDashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    paidOrders: 0,
    totalPrescriptions: 0,
    totalVisitors: 0,
    grossCollection: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [ordRes, rxRes, visRes] = await Promise.all([
        fetch('/api/admin/orders').then(r => r.json()),
        fetch('/api/admin/prescriptions').then(r => r.json()),
        fetch('/api/tracker').then(r => r.json())
      ]);

      const orders = ordRes.orders || [];
      const prescriptions = rxRes.prescriptions || [];
      const visitors = visRes.visitors || [];

      const paid = orders.filter((o: any) => o.payment_status === 'PAID');
      const totalRevenue = paid.reduce((sum: number, o: any) => sum + Number(o.amount || 0), 0);

      setStats({
        totalOrders: orders.length,
        paidOrders: paid.length,
        totalPrescriptions: prescriptions.length,
        totalVisitors: visitors.length,
        grossCollection: totalRevenue
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Welcome back, Admin 👋</h1>
          <p className="text-xs text-slate-500 font-bold mt-1">Here is what is happening across your diagnostic network today.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-2xs hover:bg-slate-50 cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Live Stats</span>
        </button>
      </div>

      {/* 4 Top KPI Cards (Ref Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Diagnostic Orders</span>
            <ClipboardList size={18} className="text-[#00A896]" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{stats.totalOrders}</span>
            <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {stats.paidOrders} Paid
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Gross Collection (₹)</span>
            <TrendingUp size={18} className="text-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">₹{stats.grossCollection}</span>
            <span className="text-[11px] font-black text-[#00A896] bg-teal-50 px-2 py-0.5 rounded-full">Cashfree PG</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Prescriptions Uploaded</span>
            <FileText size={18} className="text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{stats.totalPrescriptions}</span>
            <span className="text-[11px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Active Queue</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Website Visitors & Leads</span>
            <Eye size={18} className="text-blue-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{stats.totalVisitors}</span>
            <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Real-Time IP</span>
          </div>
        </div>
      </div>

      {/* Center Grid: Performance Bars & Split Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lab Fulfillment Distribution (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Multi-Lab Fulfillment & Routing
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Automated distribution across connected lab network</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl">
              100% SLA Adherence
            </span>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700">Redcliffe Labs (Fastest Turnaround)</span>
                <span className="text-[#00A896]">62% Load</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#00A896] rounded-full" style={{ width: '62%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700">Dr Lal PathLabs (Gold Standard Profiles)</span>
                <span className="text-blue-600">25% Load</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '25%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700">Thyrocare (Preventive Packages)</span>
                <span className="text-amber-600">13% Load</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '13%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Status Donut / Metric Widget (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-1">
              Sample Status Overview
            </h3>
            <p className="text-xs text-slate-400">Real-time phlebotomy lifecycle</p>
          </div>

          <div className="my-6 text-center">
            <div className="w-32 h-32 rounded-full border-8 border-teal-500 border-t-amber-400 border-r-blue-500 flex flex-col items-center justify-center mx-auto shadow-inner">
              <span className="text-2xl font-black text-slate-900">{stats.totalOrders}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Bookings</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-800">
              <span className="block text-sm font-black">{stats.paidOrders}</span>
              <span className="text-[9px] uppercase">Collected</span>
            </div>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-800">
              <span className="block text-sm font-black">{stats.totalOrders - stats.paidOrders}</span>
              <span className="text-[9px] uppercase">Pending</span>
            </div>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-800">
              <span className="block text-sm font-black">{stats.totalPrescriptions}</span>
              <span className="text-[9px] uppercase">Parcha</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Bookings Stream */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Live Feed: Latest Customer Diagnostic Bookings
          </h3>
          <span className="text-[11px] font-bold text-slate-400">Direct Neon DB Connection</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px]">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Assigned Partner</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-bold">
                    No orders booked yet. Live bookings will appear here instantly.
                  </td>
                </tr>
              ) : (
                recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{ord.order_id}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{ord.customer_name || 'Patient'}</span>
                      <span className="text-[10px] text-slate-400 font-mono">+91 {ord.customer_phone}</span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900">₹{ord.amount}</td>
                    <td className="py-3.5 px-4 text-[#00A896] font-bold">{ord.lab_assigned || 'Redcliffe Labs'}</td>
                    <td className="py-3.5 px-4">
                      {ord.payment_status === 'PAID' ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 size={11} /> PAID
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 font-bold text-[10px] px-2 py-0.5 rounded-full border border-amber-200">
                          <Clock size={11} /> PENDING
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
