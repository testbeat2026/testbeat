'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InternalWorkplaceLogin() {
  const router = useRouter();
  const [role, setRole] = useState<'SUPER_ADMIN' | 'OPERATIONS' | 'FINANCE' | 'SALES'>('SUPER_ADMIN');
  const [email, setEmail] = useState('admin@testbeat.in');
  const [password, setPassword] = useState('admin123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('tb_staff_role', role);
    localStorage.setItem('tb_staff_email', email);
    router.push('/portal/workplace');
  };

  return (
    <div className="min-h-screen bg-[#002B49] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl text-slate-900">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#FF5A00] flex items-center justify-center text-white font-black text-xl">TB</div>
          <div>
            <h2 className="text-xl font-black text-[#002B49]">TestBeat Workplace Login</h2>
            <p className="text-xs text-slate-400">Departmental Enterprise Staff Portal</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Select Department</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full p-3 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-[#FF5A00]"
            >
              <option value="SUPER_ADMIN">👑 Super Admin (Full Platform Control)</option>
              <option value="OPERATIONS">🏥 Lab Operations & Phlebotomy Dispatch</option>
              <option value="FINANCE">💰 Finance, B2B Pricing & Settlements</option>
              <option value="SALES">📈 Sales & Marketing (Clinics & Affiliates)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Staff Corporate Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Passcode</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 font-mono"
            />
          </div>

          <button type="submit" className="w-full py-3 bg-[#FF5A00] hover:bg-[#E04E00] text-white font-bold rounded-xl shadow-lg transition">
            Login & Access Department Workplace
          </button>
        </form>
      </div>
    </div>
  );
}
