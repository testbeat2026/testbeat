'use client';

import React, { useEffect, useState } from 'react';
import { 
  ClipboardList, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Send, 
  Eye, 
  Phone, 
  Building2, 
  AlertCircle,
  ExternalLink,
  Share2
} from 'lucide-react';

interface OrderItem {
  id: number;
  order_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  amount: string;
  lab_assigned: string;
  payment_status: string;
  fulfillment_status: string;
  lab_rider_name: string | null;
  lab_rider_phone: string | null;
  report_pdf_url: string | null;
  report_dispatched_at: string | null;
  dispatch_channel: string | null;
  created_at: string;
}

export default function AdminOrdersTrackingPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [reportUrlInput, setReportUrlInput] = useState('');
  const [dispatching, setDispatching] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
        if (data.orders?.length > 0 && !selectedOrder) {
          setSelectedOrder(data.orders[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleManualReportDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !reportUrlInput) return;

    setDispatching(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.order_id,
          reportUrl: reportUrlInput,
          action: 'DISPATCH_NOW'
        })
      });

      const data = await res.json();
      setDispatching(false);

      if (data.success) {
        alert('Report link updated! WhatsApp window opening...');
        if (data.waUrl) window.open(data.waUrl, '_blank');
        fetchOrders();
      } else {
        alert('Dispatch error: ' + data.error);
      }
    } catch (err: any) {
      setDispatching(false);
      alert('Error triggering dispatch');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'REPORT_READY':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full">Report Delivered</span>;
      case 'SAMPLE_COLLECTED':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black px-2 py-0.5 rounded-full">Sample Collected</span>;
      case 'PHLEBO_ASSIGNED':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-black px-2 py-0.5 rounded-full">Phlebo Dispatched</span>;
      default:
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black px-2 py-0.5 rounded-full">Lab Processing</span>;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Live Orders & Report Dispatch Desk 📑</h1>
          <p className="text-xs text-slate-500 font-bold mt-1">
            Real-time Lab fulfillment tracking, Phlebo status & automated WhatsApp/Email report delivery
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-2xs hover:bg-slate-50 cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Live Orders</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Active Bookings</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-slate-900">{orders.length}</span>
            <ClipboardList className="text-[#00A896]" size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Sample Pending</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-amber-600">
              {orders.filter(o => o.fulfillment_status !== 'REPORT_READY').length}
            </span>
            <Clock className="text-amber-500" size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Reports Dispatched</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-emerald-600">
              {orders.filter(o => o.report_pdf_url).length}
            </span>
            <CheckCircle2 className="text-emerald-500" size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Auto-Dispatch Engine</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-black text-blue-600">WhatsApp + Email</span>
            <Share2 className="text-blue-500" size={18} />
          </div>
        </div>
      </div>

      {/* 2-Column Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Orders List (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Diagnostic Orders Pipeline ({orders.length})
            </h2>
            <span className="text-[11px] text-slate-400">Click to view Lab & Report tracking</span>
          </div>

          {orders.map((ord) => {
            const isSelected = selectedOrder?.id === ord.id;
            return (
              <div
                key={ord.id}
                onClick={() => {
                  setSelectedOrder(ord);
                  setReportUrlInput(ord.report_pdf_url || '');
                }}
                className={`p-4 rounded-3xl border transition cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected 
                    ? 'bg-white border-[#00A896] ring-2 ring-[#00A896]/15 shadow-sm' 
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900">{ord.order_id}</span>
                    <span className="text-[10px] font-bold text-[#00A896] bg-teal-50 px-2 py-0.5 rounded-md">
                      {ord.lab_assigned}
                    </span>
                  </div>
                  <h3 className="text-xs font-black text-slate-800 mt-1">{ord.customer_name || 'Patient'}</h3>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-2">
                    <span>+91 {ord.customer_phone}</span>
                    <span>•</span>
                    <span className="font-black text-slate-900">₹{ord.amount}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {getStatusBadge(ord.fulfillment_status)}
                  <span className="block text-[10px] text-slate-400 mt-1">
                    {new Date(ord.created_at).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Lab Fulfillment & Report Dispatcher (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs sticky top-6 space-y-5">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building2 size={16} className="text-[#00A896]" />
              Lab Fulfillment & Patient Delivery Status
            </h3>

            {selectedOrder ? (
              <div className="space-y-4 text-xs font-bold">
                {/* Order Summary Card */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Lab Partner:</span>
                    <span className="text-[#00A896] font-black">{selectedOrder.lab_assigned}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment Status:</span>
                    <span className={selectedOrder.payment_status === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}>
                      {selectedOrder.payment_status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lab Rider / Phlebotomist:</span>
                    <span className="text-slate-800">{selectedOrder.lab_rider_name || 'Assigned by Lab via API'}</span>
                  </div>
                </div>

                {/* Report Section */}
                <div className="space-y-3 pt-2">
                  <label className="text-slate-800 block uppercase tracking-wider text-[11px]">
                    Verified PDF Report URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://reports.partnerlab.com/report_123.pdf"
                    value={reportUrlInput}
                    onChange={(e) => setReportUrlInput(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-xs focus:border-[#00A896]"
                  />

                  {selectedOrder.report_pdf_url && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800 text-[11px]">
                      <span className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        Report sent via WhatsApp!
                      </span>
                      <a
                        href={selectedOrder.report_pdf_url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline font-black flex items-center gap-1"
                      >
                        <Eye size={12} /> View PDF
                      </a>
                    </div>
                  )}

                  <button
                    onClick={handleManualReportDispatch}
                    disabled={dispatching || !reportUrlInput}
                    className="w-full py-3.5 bg-[#00A896] hover:bg-[#008f80] text-white rounded-xl shadow-md transition font-black text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send size={14} />
                    <span>{dispatching ? 'Dispatching...' : 'Dispatch Report to Patient (WhatsApp & Email)'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 font-bold text-xs">
                Select an order from the left to view Lab status or deliver report.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
