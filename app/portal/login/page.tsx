'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InternalPortalLoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'SUPER_ADMIN' | 'OPERATIONS' | 'SALES_MARKETING' | 'FINANCE'>('SUPER_ADMIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('tb_staff_role', role);
    localStorage.setItem('tb_staff_email', email || 'admin@testbeat.in');
    router.push('/portal/workplace');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl text-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-xl">TB</div>
          <div>
            <h2 className="text-xl font-black text-white">TestBeat Internal Workplace</h2>
            <p className="text-xs text-slate-400">Enterprise Role-Based Access Control</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-300 block mb-1">Select Department / Staff Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold focus:outline-none focus:border-teal-500"
            >
              <option value="SUPER_ADMIN">👑 Super Admin (Full Platform Commercials)</option>
              <option value="OPERATIONS">🏥 Lab Operations & Dispatch Management</option>
              <option value="SALES_MARKETING">📈 Sales & Marketing (Affiliates, Standees, Coupons)</option>
              <option value="FINANCE">💰 Finance & Billing (B2B Payables, Margins, Invoices)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">Corporate Email</label>
            <input
              type="email"
              required
              placeholder="staff@testbeat.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">Security Passcode</label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-[11px] text-slate-400 space-y-0.5">
            <p>• Isolated URL: Completely detached from customer storefront.</p>
            <p>• Demo access configured: Enter credentials to log in.</p>
          </div>

          <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg transition">
            Authorize & Open Workplace
          </button>
        </form>
      </div>
    </div>
  );
}
