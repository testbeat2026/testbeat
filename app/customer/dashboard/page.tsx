'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { DB } from '@/lib/dataStore';

export default function CustomerDashboardPage() {
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'FAMILY' | 'REPORTS' | 'PROFILE'>('ORDERS');
  const [familyMembers, setFamilyMembers] = useState(DB.customers[0].familyMembers);
  const [newMemName, setNewMemName] = useState('');
  const [newMemRelation, setNewMemRelation] = useState('Parent');
  const [newMemAge, setNewMemAge] = useState(55);
  const [newMemGender, setNewMemGender] = useState('Female');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemName) return;
    const added = { name: newMemName, relation: newMemRelation, age: Number(newMemAge), gender: newMemGender };
    setFamilyMembers(prev => [...prev, added]);
    setNewMemName('');
    alert("Family Member added successfully!");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">Patient Portal</span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Welcome, Shubhranshu Kumar</h1>
          <p className="text-xs text-slate-500">Contact: +91 9876543210 • Noida, UP</p>
        </div>
        <Link href="/" className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition">
          + Book New Test
        </Link>
      </div>

      <div className="flex gap-2 border-b border-slate-200 mt-6 pb-2 text-xs font-bold">
        {[
          { id: 'ORDERS', label: '📦 My Bookings & Live Phlebo Tracking' },
          { id: 'FAMILY', label: '👨‍👩‍👦 Manage Family Members' },
          { id: 'REPORTS', label: '📄 Digital Health Records (PDF)' },
          { id: 'PROFILE', label: '⚙️ Patient Profile' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition ${activeTab === tab.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'ORDERS' && (
        <div className="mt-6 space-y-4">
          {DB.orders.map(o => (
            <div key={o.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">{o.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${o.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {o.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mt-2">{o.testName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Processing Lab: <b>{o.labName}</b> • Patient: <b>{o.patientName}</b> ({o.patientRelation}) • Slot: {o.slot}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Phlebotomist: <b>{o.phleboName}</b> ({o.phleboPhone})</p>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-5">
                <span className="text-lg font-black text-slate-900">₹{o.totalAmount}</span>
                {o.reportUrl ? (
                  <button onClick={() => alert("Downloading Verified Lab Report PDF...")} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition">
                    📄 Download Report
                  </button>
                ) : (
                  <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl font-medium">
                    Report Under Processing
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'FAMILY' && (
        <div className="mt-6 space-y-6">
          <form onSubmit={handleAddMember} className="bg-white p-6 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Member Name</label>
              <input type="text" required placeholder="Full Name" value={newMemName} onChange={(e) => setNewMemName(e.target.value)} className="w-full p-2.5 border rounded-xl" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Relationship</label>
              <select value={newMemRelation} onChange={(e) => setNewMemRelation(e.target.value)} className="w-full p-2.5 border rounded-xl bg-white font-medium">
                <option>Parent</option><option>Spouse</option><option>Child</option><option>Sibling</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Age</label>
              <input type="number" required value={newMemAge} onChange={(e) => setNewMemAge(Number(e.target.value))} className="w-full p-2.5 border rounded-xl" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Gender</label>
              <select value={newMemGender} onChange={(e) => setNewMemGender(e.target.value)} className="w-full p-2.5 border rounded-xl bg-white font-medium">
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition">
                + Add Member
              </button>
            </div>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {familyMembers.map((m, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">{m.relation}</span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">{m.name}</h4>
                  <p className="text-xs text-slate-500">{m.age} Yrs • {m.gender}</p>
                </div>
                <button onClick={() => setFamilyMembers(prev => prev.filter((_, idx) => idx !== i))} className="text-rose-500 text-xs font-bold hover:underline">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'REPORTS' && (
        <div className="mt-6 bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="font-bold text-sm text-slate-900 mb-3">Lifetime Downloadable Diagnostic Vault</h3>
          <p className="text-xs text-slate-500 mb-4">All lab reports are encrypted and permanently archived for patient records.</p>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
            <div>
              <h4 className="font-bold text-slate-900">Thyrocare Full Body 84 Parameters Report</h4>
              <p className="text-slate-400">Order: TB2026710492 • Delivered: Oct 01, 2026</p>
            </div>
            <button onClick={() => alert("Downloading PDF...")} className="bg-teal-600 text-white px-3.5 py-1.5 rounded-xl font-bold">
              Download PDF
            </button>
          </div>
        </div>
      )}

      {activeTab === 'PROFILE' && (
        <div className="mt-6 bg-white p-6 rounded-2xl border border-slate-200 max-w-lg text-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900">Patient Master Profile</h3>
          <div><label className="text-slate-500">Name:</label> <p className="font-bold text-slate-900">Shubhranshu Kumar</p></div>
          <div><label className="text-slate-500">Primary Mobile:</label> <p className="font-bold text-slate-900">+91 9876543210</p></div>
          <div><label className="text-slate-500">Saved Address:</label> <p className="font-bold text-slate-900">Flat 402, Green Avenue, Greater Noida (201310)</p></div>
        </div>
      )}
    </div>
  );
}
