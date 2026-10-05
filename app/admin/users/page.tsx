'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, UserPlus, Ban, CheckCircle, RefreshCw, KeyRound, Phone, Mail } from 'lucide-react';

interface PortalUser {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

export default function UserRoleManagerPage() {
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [loading, setLoading] = useState(true);

  // New User Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('ADMIN');
  const [passcode, setPasscode] = useState('1234');
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !fullName) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone, email, role, passcode })
      });
      const data = await res.json();
      setSubmitting(false);

      if (data.success) {
        setFullName('');
        setPhone('');
        setEmail('');
        fetchUsers();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err: any) {
      setSubmitting(false);
      alert('Error creating user');
    }
  };

  const toggleUserStatus = async (userId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(u => u.id === userId ? { ...u, status: nextStatus } : u));
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      }
    } catch (err) {
      alert('Failed to update role');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">User & Role Manager 🔐</h1>
          <p className="text-xs text-slate-500 font-bold mt-1">Super Admin Access Control for 5 Portal Roles</p>
        </div>
        <button
          onClick={fetchUsers}
          className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Create Member Form (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm h-fit">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <UserPlus size={15} className="text-[#00A896]" />
            Add New Portal Member
          </h2>

          <form onSubmit={handleCreateUser} className="space-y-3 text-xs font-bold">
            <div>
              <label className="text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#00A896]"
              />
            </div>

            <div>
              <label className="text-slate-700 block mb-1">Mobile Number (Login ID)</label>
              <input
                type="tel"
                required
                placeholder="10-digit phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#00A896]"
              />
            </div>

            <div>
              <label className="text-slate-700 block mb-1">Email (Optional)</label>
              <input
                type="email"
                placeholder="team@testbeat.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#00A896]"
              />
            </div>

            <div>
              <label className="text-slate-700 block mb-1">Select Access Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[#0F1E36]"
              >
                <option value="SUPER_ADMIN">Super Admin (Founder Full Access)</option>
                <option value="ADMIN">Admin (Ops & Dispatch)</option>
                <option value="FINANCE">Finance (Cashfree Settlements & P&L)</option>
                <option value="SALES">Sales Team (Prescriptions & Quotes)</option>
                <option value="AFFILIATE">Affiliate Partner (Referrals)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 block mb-1">Initial Passcode</label>
              <input
                type="text"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-[#00A896] hover:bg-[#008f80] text-white rounded-xl shadow transition font-black text-xs cursor-pointer mt-2"
            >
              {submitting ? 'Creating...' : 'Create & Activate Account'}
            </button>
          </form>
        </div>

        {/* Existing Users Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Authorized Team Members ({users.length})
            </h3>
            <span className="text-[11px] text-slate-400 font-bold">Live Database Access</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px]">
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{u.full_name}</span>
                      <span className="text-[10px] text-slate-400">{u.email || 'No email attached'}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-600">
                      +91 {u.phone}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        disabled={u.phone === '7666953705'}
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-lg px-2 py-1 outline-none text-[#0F1E36]"
                      >
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="FINANCE">FINANCE</option>
                        <option value="SALES">SALES</option>
                        <option value="AFFILIATE">AFFILIATE</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      {u.status === 'ACTIVE' ? (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black px-2 py-0.5 rounded-full">
                          BLOCKED
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {u.phone !== '7666953705' && (
                        <button
                          onClick={() => toggleUserStatus(u.id, u.status)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-black cursor-pointer transition ${
                            u.status === 'ACTIVE'
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {u.status === 'ACTIVE' ? 'Block Access' : 'Unblock'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
