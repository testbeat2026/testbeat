'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, ArrowRight, Activity, Users, ClipboardList, FileText } from 'lucide-react';

export default function AdminIndexPage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [phone, setPhone] = useState('7666953705');
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (localStorage.getItem('tb_admin_auth') === 'true') {
      setIsAuth(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Master access pin
    if (passcode === '1234' || passcode === 'admin123' || passcode === '2026') {
      localStorage.setItem('tb_admin_auth', 'true');
      setIsAuth(true);
      window.location.reload();
    } else {
      setErrorMsg('Incorrect Access Passcode. (Try: 1234)');
    }
  };

  // 1. IF NOT LOGGED IN: Clean Modern Modal
  if (!isAuth) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 text-center">
        <div className="w-14 h-14 bg-teal-50 text-[#00A896] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-teal-100">
          <ShieldCheck size={28} />
        </div>
        <h1 className="text-xl font-black text-slate-900">TestBeat Control Console</h1>
        <p className="text-xs text-slate-500 font-bold mt-1">Super Admin & Operations Access</p>

        {errorMsg && (
          <div className="mt-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4 text-left">
          <div>
            <label className="text-[11px] font-black uppercase text-slate-500 tracking-wider block mb-1">
              Authorized Mobile
            </label>
            <input
              type="text"
              readOnly
              value={phone}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-[11px] font-black uppercase text-slate-500 tracking-wider block mb-1">
              Admin Passcode
            </label>
            <input
              type="password"
              required
              autoFocus
              placeholder="Enter passcode (1234)"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold outline-none focus:border-[#00A896]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#00A896] hover:bg-[#008f80] text-white rounded-xl font-black text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Unlock Ops Console</span>
            <ArrowRight size={14} />
          </button>
        </form>
      </div>
    );
  }

  // 2. IF LOGGED IN: Executive Dashboard (Ref Photo)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Executive Overview 📊</h1>
          <p className="text-xs text-slate-500 font-bold mt-1">TestBeat Real-Time Multi-Lab Aggregator Operations</p>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
            All Systems Live
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Live Bookings</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-slate-900">Active</span>
            <ClipboardList className="text-[#00A896]" size={22} />
          </div>
          <button 
            onClick={() => router.push('/admin/orders')}
            className="mt-3 text-[11px] font-extrabold text-[#00A896] hover:underline block"
          >
            Open Orders Console →
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Prescription Desk</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-slate-900">Queue</span>
            <FileText className="text-amber-500" size={22} />
          </div>
          <button 
            onClick={() => router.push('/admin/prescriptions')}
            className="mt-3 text-[11px] font-extrabold text-[#00A896] hover:underline block"
          >
            Review Uploads →
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Lab Partners</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-slate-900">3 Connected</span>
            <Activity className="text-blue-500" size={22} />
          </div>
          <span className="mt-3 text-[11px] font-bold text-slate-400 block">Redcliffe, Lal, Thyrocare</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Gateway Mode</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-emerald-600">Production</span>
            <ShieldCheck className="text-emerald-500" size={22} />
          </div>
          <span className="mt-3 text-[11px] font-bold text-emerald-600 block">Cashfree PG v3</span>
        </div>
      </div>
    </div>
  );
}
