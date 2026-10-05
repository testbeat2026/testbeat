'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Lock, 
  Phone, 
  ArrowRight, 
  AlertCircle, 
  UserCheck, 
  Wallet, 
  BadgePercent, 
  Headphones,
  CheckCircle2
} from 'lucide-react';

const PORTAL_ROLES = [
  { id: 'SUPER_ADMIN', title: 'Super Admin', desc: 'Founder & Full Command Control', icon: ShieldCheck, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { id: 'ADMIN', title: 'Admin Ops', desc: 'Live Bookings, Phlebo Dispatch & Labs', icon: UserCheck, color: 'text-teal-600 bg-teal-50 border-teal-200' },
  { id: 'FINANCE', title: 'Finance Desk', desc: 'Cashfree Settlements, P&L & Payouts', icon: Wallet, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'SALES', title: 'Sales Team', desc: 'Prescription Quotes & Tele-Consult Leads', icon: Headphones, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: 'AFFILIATE', title: 'Affiliate Partner', desc: 'Clinics, Doctors & Referral Dashboard', icon: BadgePercent, color: 'text-amber-600 bg-amber-50 border-amber-200' },
];

export default function UnifiedPortalLoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState('SUPER_ADMIN');
  const [phone, setPhone] = useState('7666953705');
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          passcode,
          role: selectedRole
        })
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        setErrorText(data.error || 'Login failed');
        return;
      }

      // Save user session in localStorage
      localStorage.setItem('tb_user_session', JSON.stringify(data.user));
      localStorage.setItem('tb_admin_auth', 'true');

      // Direct based on role
      router.push('/admin');

    } catch (err: any) {
      setLoading(false);
      setErrorText('Server connection failed: ' + err.message);
    }
  };

  const activeRoleData = PORTAL_ROLES.find(r => r.id === selectedRole) || PORTAL_ROLES[0];

  return (
    <div className="fixed inset-0 z-50 bg-[#081325] flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        
        {/* Left Side: Role Selector Welcome Screen (5 Roles) */}
        <div className="md:col-span-5 bg-[#0F1E36] p-6 sm:p-8 text-white flex flex-col justify-between border-r border-[#1B2D4B]">
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-[#00A896] text-white flex items-center justify-center font-black text-base shadow">
                TB
              </div>
              <div>
                <span className="text-lg font-black tracking-tight">Test<span className="text-[#00A896]">Beat</span></span>
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Enterprise Gateway</span>
              </div>
            </div>

            <h2 className="text-sm font-black uppercase tracking-wider text-slate-300 mb-1">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-400 mb-5">Select your operational clearance role:</p>

            <div className="space-y-2">
              {PORTAL_ROLES.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <div
                    key={role.id}
                    onClick={() => { setSelectedRole(role.id); setErrorText(''); }}
                    className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                      isSelected 
                        ? 'bg-[#172C4F] border-[#00A896] shadow-sm text-white' 
                        : 'border-[#1B2D4B] bg-[#12233E]/50 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl border ${role.color}`}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white">{role.title}</h4>
                        <p className="text-[10px] text-slate-400 leading-tight">{role.desc}</p>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 size={16} className="text-[#00A896] shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-[#1B2D4B] text-[10px] text-slate-500 font-semibold flex items-center justify-between">
            <span>Unified Node v3.2</span>
            <span>256-Bit Encrypted</span>
          </div>
        </div>

        {/* Right Side: Passcode & Number Auth Form */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white">
          <div className="max-w-sm w-full mx-auto">
            <div className="mb-6">
              <span className="text-[10px] font-black uppercase tracking-wider bg-teal-50 text-[#00A896] px-3 py-1 rounded-full border border-teal-200">
                {activeRoleData.title} Authentication
              </span>
              <h1 className="text-2xl font-black text-slate-900 mt-2">Sign in to Console</h1>
              <p className="text-xs text-slate-500 mt-1">Authorized personnel verification</p>
            </div>

            {errorText && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorText}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              <div>
                <label className="text-xs font-black text-slate-700 block mb-1.5">Registered Mobile Number</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-[#00A896]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black text-slate-700">Access Passcode / PIN</label>
                  <span className="text-[10px] text-slate-400 font-bold">Default: 1234</span>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    autoFocus
                    placeholder="Enter security passcode"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-[#00A896]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#00A896] hover:bg-[#008f80] text-white font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>{loading ? 'Authenticating...' : `Unlock ${activeRoleData.title} Portal`}</span>
                <ArrowRight size={14} />
              </button>
            </form>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-bold">
              <span>Managed by Super Admin</span>
              <a href="/" className="hover:text-slate-700">Back to Website</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
