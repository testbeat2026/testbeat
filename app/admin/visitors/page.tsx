'use client';

import React, { useEffect, useState } from 'react';
import { RefreshCw, MessageSquare, Phone, MapPin, Globe } from 'lucide-react';

export default function AdminVisitorsPage() {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tracker');
      const data = await res.json();
      if (data.success) setVisitors(data.visitors || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const sendWhatsAppOffer = (phone: string, name?: string | null) => {
    const clean = phone.replace(/\D/g, '').slice(-10);
    const greeting = name ? `Hello ${name}` : 'Hello';
    const message = `${greeting},\nTestBeat Diagnostics par aane ke liye dhanyawad!\n\nAapke area mein aaj *Full Body Health Checkup (62 Tests)* par special 50% discount chal raha hai sirf ₹699 mein (Free Home Sample Pickup included).\n\nBook karein: https://testbeat.in/upload-prescription\n\n- TestBeat Team`;
    window.open(`https://wa.me/91${clean}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Live Visitors & Lead Radar 📡</h1>
          <p className="text-xs text-slate-500 font-bold mt-1">Real-time visitor IP tracking, captured numbers & WhatsApp outreach</p>
        </div>
        <button
          onClick={fetchVisitors}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-2xs hover:bg-slate-50 cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Leads</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Visitors Tracked</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-slate-900">{visitors.length}</span>
            <Globe className="text-blue-500" size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Actionable Phone Leads</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-emerald-600">
              {visitors.filter(v => v.captured_phone).length}
            </span>
            <Phone className="text-emerald-500" size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Target Node</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-base font-black text-slate-800">Greater Noida / NCR</span>
            <MapPin className="text-[#00A896]" size={20} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-black text-xs uppercase text-slate-800">
          Visitor Session & Telemetry Log
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px]">
                <th className="py-3 px-4">Visitor / Contact</th>
                <th className="py-3 px-4">Location & IP</th>
                <th className="py-3 px-4">Landing Page</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {visitors.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4">
                    {v.captured_phone ? (
                      <div>
                        <span className="font-bold text-slate-900 block">{v.captured_name || 'Prospect Lead'}</span>
                        <span className="text-[11px] text-emerald-700 font-mono font-bold flex items-center gap-1">
                          <Phone size={10} /> +91 {v.captured_phone}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 font-mono">Anonymous Visitor</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{v.city || 'NCR Region'}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{v.ip_address}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-600">{v.page_visited}</td>
                  <td className="py-3.5 px-4 text-slate-400 text-[10px]">
                    {new Date(v.session_time).toLocaleTimeString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {v.captured_phone ? (
                      <button
                        onClick={() => sendWhatsAppOffer(v.captured_phone, v.captured_name)}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                      >
                        <MessageSquare size={12} />
                        <span>Send WhatsApp Offer</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-300 font-bold uppercase">Browsing</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
