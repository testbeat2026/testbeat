'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Trash2, 
  RefreshCw, 
  KeyRound, 
  Phone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface StaffUser {
  id: number;
  name: string;
  phone: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'FINANCE' | 'SALES' | 'AFFILIATE';
  status: 'ACTIVE' | 'BLOCKED';
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);

  // New User Form
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'FINANCE' | 'SALES' | 'AFFILIATE'>('SALES');
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users').catch(() => null);
      if (!res || !res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      }
    } catch (err) {
      console.warn('Users fetch skipped during static generation phase');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !password) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, password, role })
      });

      const data = await res.json();
      setSubmitting(false);

      if (data.success) {
        setShowModal(false);
        setName('');
        setPhone('');
        setPassword('');
        fetchUsers();
      } else {
        alert('Error: ' + (data.error || 'Failed to create user'));
      }
    } catch (e: any) {
      setSubmitting(false);
      alert('Error creating user');
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(u => u.id === id ? { ...u, status: nextStatus as any } : u));
      }
    } catch (e) {
      alert('Failed to update status');
    }
  };

  const getRoleBadge = (r: string) => {
    switch (r) {
      case 'SUPER_ADMIN':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-black px-2 py-0.5 rounded-full">SUPER ADMIN</span>;
      case 'ADMIN':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black px-2 py-0.5 rounded-full">ADMIN</span>;
      case 'FINANCE':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full">FINANCE</span>;
      case 'SALES':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black px-2 py-0.5 rounded-full">SALES</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-black px-2 py-0.5 rounded-full">{r}</span>;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">User Access & Role Privileges 🛡️</h1>
          <p className="text-xs text-slate-500 font-bold mt-1">
            Super Admin, Finance, Lab Operations & Sales sub-account credentials
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
            title="Refresh Users"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#00A896] hover:bg-[#008f80] text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            <UserPlus size={15} />
            <span>Create Staff Access</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Team Accounts</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-slate-900">{users.length}</span>
            <Users className="text-[#00A896]" size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Active Authorized</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-emerald-600">
              {users.filter(u => u.status === 'ACTIVE').length}
            </span>
            <CheckCircle2 className="text-emerald-500" size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Restricted / Blocked</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-rose-600">
              {users.filter(u => u.status === 'BLOCKED').length}
            </span>
            <AlertCircle className="text-rose-500" size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Access Guard</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-black text-purple-600">Strict RBAC</span>
            <ShieldCheck className="text-purple-500" size={20} />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Registered Staff & Operational Roles ({users.length})
          </h2>
          <span className="text-[11px] text-slate-400 font-semibold">Neon DB Auth Sync</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px]">
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Mobile / Login ID</th>
                <th className="py-3 px-4">Role Privileges</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-bold">
                    {loading ? 'Loading team accounts...' : 'No staff accounts configured.'}
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#0F1E36] text-white flex items-center justify-center font-black text-xs">
                          {u.name ? u.name.slice(0, 2).toUpperCase() : 'ST'}
                        </div>
                        <span className="font-bold text-slate-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-600">
                      +91 {u.phone}
                    </td>
                    <td className="py-3.5 px-4">
                      {getRoleBadge(u.role)}
                    </td>
                    <td className="py-3.5 px-4">
                      {u.status === 'ACTIVE' ? (
                        <span className="text-emerald-700 text-[11px] font-bold flex items-center gap-1">
                          ● Active
                        </span>
                      ) : (
                        <span className="text-rose-600 text-[11px] font-bold flex items-center gap-1">
                          ○ Blocked
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {u.role !== 'SUPER_ADMIN' && (
                        <button
                          onClick={() => handleToggleStatus(u.id, u.status)}
                          className={`px-3 py-1 rounded-xl text-[10px] font-black cursor-pointer transition ${
                            u.status === 'ACTIVE'
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Staff Account */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Provision Staff Credentials</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 text-lg font-bold">×</button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs font-bold">
              <div>
                <label className="text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Finance Officer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Mobile Number (Login ID) *</label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Access Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Assigned Operational Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[#0F1E36]"
                >
                  <option value="ADMIN">ADMIN (Ops & Lab Routing)</option>
                  <option value="FINANCE">FINANCE (Cashfree P&L Ledger)</option>
                  <option value="SALES">SALES (Parcha & Leads Desk)</option>
                  <option value="AFFILIATE">AFFILIATE (Partner Links)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#00A896] hover:bg-[#008f80] text-white rounded-xl shadow-md transition font-black text-xs cursor-pointer mt-3"
              >
                {submitting ? 'Creating Account...' : 'Generate Staff Access'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
