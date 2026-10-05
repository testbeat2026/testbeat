'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  ClipboardList, 
  Users, 
  Settings, 
  Building2, 
  ArrowLeft, 
  Bell, 
  Search,
  LogOut,
  ShieldCheck,
  Eye,
  Wallet,
  BadgePercent
} from 'lucide-react';

interface UserSession {
  id: number;
  name: string;
  phone: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'FINANCE' | 'SALES' | 'AFFILIATE';
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem('tb_user_session');
    const isAuth = localStorage.getItem('tb_admin_auth');
    if (isAuth === 'true' && raw) {
      try {
        setSession(JSON.parse(raw));
      } catch {
        router.replace('/login');
      }
    } else {
      router.replace('/login');
    }
    setLoading(false);
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('tb_admin_auth');
    localStorage.removeItem('tb_user_session');
    router.replace('/login');
  };

  if (loading || !session) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0F1E36] flex items-center justify-center text-white font-bold text-sm">
        Verifying Security Credentials...
      </div>
    );
  }

  // Dynamic Navigation filtered strictly by Role
  const role = session.role;
  const menu = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, show: true },
    { name: 'Live Bookings', href: '/admin/orders', icon: ClipboardList, show: ['SUPER_ADMIN', 'ADMIN', 'FINANCE'].includes(role) },
    { name: 'Prescription Desk', href: '/admin/prescriptions', icon: FileText, show: ['SUPER_ADMIN', 'ADMIN', 'SALES'].includes(role) },
    { name: 'Live Visitors & Leads', href: '/admin/visitors', icon: Eye, show: ['SUPER_ADMIN', 'SALES'].includes(role) },
    { name: 'User & Roles', href: '/admin/users', icon: ShieldCheck, show: role === 'SUPER_ADMIN' },
    { name: 'Finance & P&L', href: '/admin/finance', icon: Wallet, show: ['SUPER_ADMIN', 'FINANCE'].includes(role) },
    { name: 'Affiliate Desk', href: '/admin/affiliates', icon: BadgePercent, show: ['SUPER_ADMIN', 'AFFILIATE'].includes(role) },
    { name: 'Settings', href: '/admin/settings', icon: Settings, show: ['SUPER_ADMIN', 'ADMIN'].includes(role) },
  ].filter(item => item.show);

  return (
    <div className="fixed inset-0 z-50 flex bg-[#F4F7FB] font-sans antialiased overflow-hidden">
      {/* 1. DARK NAVY SIDEBAR */}
      <aside className="w-64 bg-[#0F1E36] text-slate-300 flex flex-col justify-between shrink-0 shadow-2xl border-r border-[#1B2D4B]">
        <div>
          {/* Logo Brand Header */}
          <div className="p-5 border-b border-[#1B2D4B] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#00A896] text-white flex items-center justify-center font-black text-base shadow">
                TB
              </div>
              <div>
                <span className="text-lg font-black text-white tracking-tight">Test<span className="text-[#00A896]">Beat</span></span>
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">{session.role.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {menu.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-[#00A896] text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-[#162744]'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#1B2D4B] space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-[#162744] transition"
          >
            <ArrowLeft size={15} />
            <span>Public Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-4 w-96">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient, phone, order ID..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#00A896]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-3">
              <div className="w-8 h-8 rounded-full bg-[#0F1E36] text-white font-bold text-xs flex items-center justify-center">
                {session.name ? session.name.slice(0, 2).toUpperCase() : 'TB'}
              </div>
              <div className="text-left text-xs">
                <span className="font-extrabold text-slate-800 block">{session.name}</span>
                <span className="text-[10px] text-[#00A896] font-bold">{session.role}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
          {children}
        </main>
      </div>
    </div>
  );
}
