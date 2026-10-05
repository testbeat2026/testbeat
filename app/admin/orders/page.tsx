'use client';

import React, { useEffect, useState } from 'react';
import { RefreshCw, CheckCircle2, Clock, Phone, Search, MessageSquare, Send } from 'lucide-react';

interface Order {
  id: number;
  order_id: string;
  customer_name: string;
  customer_phone: string;
  amount: string;
  payment_status: string;
  cf_order_id: string;
  lab_assigned: string;
  created_at: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleLabChange = async (orderId: string, lab: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, labAssigned: lab })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, lab_assigned: lab } : o));
      }
    } catch (err) {
      alert('Failed to update lab');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDispatchWhatsApp = async (orderId: string, type: 'patient' | 'phlebo') => {
    try {
      const res = await fetch('/api/orders/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, phleboName: 'Rahul (Phlebotomist)', phleboPhone: '7666953705' })
      });
      const data = await res.json();
      if (data.success) {
        const targetUrl = type === 'patient' ? data.patientWhatsAppUrl : data.phleboWhatsAppUrl;
        window.open(targetUrl, '_blank');
      }
    } catch (err: any) {
      alert('Failed to generate dispatch link');
    }
  };

  const filteredOrders = orders.filter(o => 
    o.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer_phone?.includes(searchTerm) ||
    o.order_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F4F7F9] p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Bookings & Dispatch Console</h1>
            <p className="text-xs text-slate-500 font-bold mt-1">Live Neon DB Orders, Cashfree Settlements & Lab Routing</p>
          </div>
          <button 
            onClick={fetchOrders}
            className="flex items-center justify-center gap-2 bg-[#009387] hover:bg-[#007A70] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow cursor-pointer transition w-fit"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Sync Live Orders</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs mb-6 flex items-center gap-3">
          <Search size={16} className="text-slate-400 ml-2" />
          <input
            type="text"
            placeholder="Search by Patient Name, Phone or Order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs font-bold text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Assigned Lab</th>
                  <th className="py-3 px-4 text-center">Instant Dispatch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400 font-bold">
                      {loading ? 'Fetching orders from database...' : 'No orders found.'}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900 block">{ord.order_id}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(ord.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{ord.customer_name || 'Patient'}</span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                          <Phone size={10} /> {ord.customer_phone}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-black text-slate-900">₹{ord.amount}</span>
                      </td>
                      <td className="py-3 px-4">
                        {ord.payment_status === 'PAID' ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 size={12} /> PAID
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 font-bold text-[10px] px-2 py-0.5 rounded-full border border-amber-200">
                            <Clock size={12} /> {ord.payment_status || 'PENDING'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          disabled={updatingId === ord.order_id}
                          value={ord.lab_assigned || 'Redcliffe Labs'}
                          onChange={(e) => handleLabChange(ord.order_id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-lg px-2 py-1 outline-none cursor-pointer text-[#17466E]"
                        >
                          <option value="Redcliffe Labs">Redcliffe Labs</option>
                          <option value="Dr Lal PathLabs">Dr Lal PathLabs</option>
                          <option value="Thyrocare">Thyrocare</option>
                          <option value="Direct Phlebotomist">Direct Phlebotomist</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            title="Send Patient WhatsApp Confirmation"
                            onClick={() => handleDispatchWhatsApp(ord.order_id, 'patient')}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg cursor-pointer transition flex items-center gap-1 font-bold text-[11px]"
                          >
                            <MessageSquare size={13} />
                            <span>Patient</span>
                          </button>
                          <button
                            title="Dispatch Phlebotomist Pickup Lead"
                            onClick={() => handleDispatchWhatsApp(ord.order_id, 'phlebo')}
                            className="p-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg cursor-pointer transition flex items-center gap-1 font-bold text-[11px]"
                          >
                            <Send size={13} />
                            <span>Phlebo</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
