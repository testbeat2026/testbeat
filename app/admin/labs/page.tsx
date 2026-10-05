'use client';

import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  Plus, 
  KeyRound, 
  Power, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Clock, 
  Percent, 
  Radio
} from 'lucide-react';

interface LabPartner {
  id: number;
  lab_code: string;
  lab_name: string;
  tagline: string;
  api_endpoint: string;
  api_key: string;
  api_secret: string;
  status: 'LIVE' | 'UNLIVE';
  default_discount_pct: string;
  pickup_tat_mins: number;
  report_tat_hours: number;
}

export default function AdminLabsManagementPage() {
  const [labs, setLabs] = useState<LabPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLab, setSelectedLab] = useState<LabPartner | null>(null);

  // New Lab Modal Form
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLabName, setNewLabName] = useState('');
  const [newLabCode, setNewLabCode] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newEndpoint, setNewEndpoint] = useState('');
  const [newApiKey, setNewApiKey] = useState('');
  const [newApiSecret, setNewApiSecret] = useState('');
  const [newDiscount, setNewDiscount] = useState('20');
  const [submittingNew, setSubmittingNew] = useState(false);

  // Edit Form State
  const [editApiKey, setEditApiKey] = useState('');
  const [editApiSecret, setEditApiSecret] = useState('');
  const [editEndpoint, setEditEndpoint] = useState('');
  const [editDiscount, setEditDiscount] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchLabs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/labs');
      const data = await res.json();
      if (data.success) {
        setLabs(data.labs || []);
        if (data.labs?.length > 0 && !selectedLab) {
          selectLabForEdit(data.labs[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  const selectLabForEdit = (lab: LabPartner) => {
    setSelectedLab(lab);
    setEditApiKey(lab.api_key || '');
    setEditApiSecret(lab.api_secret || '');
    setEditEndpoint(lab.api_endpoint || '');
    setEditDiscount(lab.default_discount_pct || '20');
  };

  const toggleLabStatus = async (lab: LabPartner) => {
    const nextStatus = lab.status === 'LIVE' ? 'UNLIVE' : 'LIVE';
    try {
      const res = await fetch('/api/admin/labs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lab.id, status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        setLabs(labs.map(l => l.id === lab.id ? { ...l, status: nextStatus } : l));
        if (selectedLab?.id === lab.id) {
          setSelectedLab({ ...selectedLab, status: nextStatus });
        }
      }
    } catch (e) {
      alert('Status change failed');
    }
  };

  const handleSaveLabApi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLab) return;

    setUpdating(true);
    try {
      const res = await fetch('/api/admin/labs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedLab.id,
          apiKey: editApiKey,
          apiSecret: editApiSecret,
          apiEndpoint: editEndpoint,
          defaultDiscount: Number(editDiscount)
        })
      });
      const data = await res.json();
      setUpdating(false);

      if (data.success) {
        alert(`${selectedLab.lab_name} API credentials updated successfully!`);
        fetchLabs();
      } else {
        alert('Update error: ' + data.error);
      }
    } catch (err: any) {
      setUpdating(false);
      alert('Network update failed');
    }
  };

  const handleCreateNewLab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabName || !newLabCode) return;

    setSubmittingNew(true);
    try {
      const res = await fetch('/api/admin/labs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          labName: newLabName,
          labCode: newLabCode,
          tagline: newTagline,
          apiEndpoint: newEndpoint,
          apiKey: newApiKey,
          apiSecret: newApiSecret,
          defaultDiscount: Number(newDiscount),
          pickupTat: 60,
          reportTat: 24
        })
      });

      const data = await res.json();
      setSubmittingNew(false);

      if (data.success) {
        setShowAddModal(false);
        setNewLabName('');
        setNewLabCode('');
        setNewEndpoint('');
        setNewApiKey('');
        setNewApiSecret('');
        fetchLabs();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err: any) {
      setSubmittingNew(false);
      alert('Server error creating lab');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Lab Partners & API Gateway Hub 🔬</h1>
          <p className="text-xs text-slate-500 font-bold mt-1">
            Configure APIs, Live/Unlive routing for Redcliffe, Dr Lal, Thyrocare & Healthians
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLabs}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
            title="Refresh"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#00A896] hover:bg-[#008f80] text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            <Plus size={15} />
            <span>Onboard New Diagnostic Lab</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Connected Labs</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-slate-900">{labs.length} Chains</span>
            <Building2 className="text-[#00A896]" size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Live Routing Active</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-emerald-600">
              {labs.filter(l => l.status === 'LIVE').length}
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">In Customer Feed</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Unlive / Paused</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-rose-600">
              {labs.filter(l => l.status === 'UNLIVE').length}
            </span>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">Offline</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">API Protocol</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-black text-blue-600">REST JSON / HTTPS</span>
            <Radio className="text-blue-500" size={18} />
          </div>
        </div>
      </div>

      {/* Main 2-Column Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Labs Cards List (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Diagnostic Chains ({labs.length})
            </h2>
            <span className="text-[11px] text-slate-400 font-semibold">Click to configure API credentials</span>
          </div>

          {labs.map((lab) => {
            const isSelected = selectedLab?.id === lab.id;
            const isLive = lab.status === 'LIVE';

            return (
              <div
                key={lab.id}
                onClick={() => selectLabForEdit(lab)}
                className={`p-5 rounded-3xl border transition cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-white border-[#00A896] ring-2 ring-[#00A896]/15 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shadow-xs shrink-0 ${
                    isLive ? 'bg-teal-50 text-[#00A896] border border-teal-200' : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}>
                    {lab.lab_code.slice(0, 2)}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-slate-900">{lab.lab_name}</h3>
                      <span className="text-[10px] font-mono font-bold text-slate-400">({lab.lab_code})</span>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold truncate mt-0.5">{lab.tagline}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-bold mt-1">
                      <span className="flex items-center gap-1"><Clock size={11} /> {lab.pickup_tat_mins} Mins Pickup</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-black">{lab.default_discount_pct}% Base Margin</span>
                    </div>
                  </div>
                </div>

                {/* Status Toggle Switch */}
                <div className="text-right shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => toggleLabStatus(lab)}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer transition ${
                      isLive 
                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200' 
                        : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                    }`}
                  >
                    <Power size={13} />
                    <span>{isLive ? 'LIVE' : 'UNLIVE'}</span>
                  </button>
                  <span className="block text-[10px] text-slate-400 mt-1 font-semibold">
                    {isLive ? 'Customer Visible' : 'Hidden from comparison'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Lab API Credentials Editor (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-6">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <KeyRound size={15} className="text-[#00A896]" />
              {selectedLab ? `${selectedLab.lab_name} API Setup` : 'API Gateway Parameters'}
            </h3>

            {selectedLab ? (
              <form onSubmit={handleSaveLabApi} className="space-y-4 text-xs font-bold">
                <div>
                  <label className="text-slate-700 block mb-1">API Base URL / Endpoint</label>
                  <input
                    type="text"
                    required
                    placeholder="https://api.labpartner.com/v1"
                    value={editEndpoint}
                    onChange={(e) => setEditEndpoint(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">API Client Key (App ID)</label>
                  <input
                    type="text"
                    placeholder="Enter API Key"
                    value={editApiKey}
                    onChange={(e) => setEditApiKey(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">API Secret / Bearer Token</label>
                  <input
                    type="password"
                    placeholder="Enter Secret Key"
                    value={editApiSecret}
                    onChange={(e) => setEditApiSecret(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">Default Platform Discount Margin (%)</label>
                  <input
                    type="number"
                    value={editDiscount}
                    onChange={(e) => setEditDiscount(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-emerald-600 font-extrabold"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={updating}
                    className="w-full py-3.5 bg-[#00A896] hover:bg-[#008f80] text-white rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer font-black text-xs"
                  >
                    <Save size={14} />
                    <span>{updating ? 'Saving Changes...' : `Save ${selectedLab.lab_name} API Keys`}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-16 text-center text-slate-400 font-bold text-xs">
                Select a diagnostic lab from the left to configure API keys.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* POPUP MODAL: ADD NEW LAB */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Onboard New Diagnostic Chain</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 text-lg font-bold">×</button>
            </div>

            <form onSubmit={handleCreateNewLab} className="space-y-3 text-xs font-bold">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Lab Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Healthians / Metropolis"
                    value={newLabName}
                    onChange={(e) => setNewLabName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Code / Identifier *</label>
                  <input
                    type="text"
                    required
                    placeholder="HEALTHIANS"
                    value={newLabCode}
                    onChange={(e) => setNewLabCode(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none uppercase font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Tagline / Key Feature</label>
                <input
                  type="text"
                  placeholder="e.g. 60-min express sample collection in Greater Noida"
                  value={newTagline}
                  onChange={(e) => setNewTagline(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">API Base URL</label>
                <input
                  type="text"
                  placeholder="https://api.partnerlab.com"
                  value={newEndpoint}
                  onChange={(e) => setNewEndpoint(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">API Key</label>
                  <input
                    type="text"
                    placeholder="Key"
                    value={newApiKey}
                    onChange={(e) => setNewApiKey(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">API Secret</label>
                  <input
                    type="password"
                    placeholder="Secret"
                    value={newApiSecret}
                    onChange={(e) => setNewApiSecret(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Discount Margin (%)</label>
                <input
                  type="number"
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-emerald-600 font-black"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submittingNew}
                  className="w-full py-3.5 bg-[#00A896] hover:bg-[#008f80] text-white rounded-xl shadow-md transition font-black text-xs cursor-pointer"
                >
                  {submittingNew ? 'Saving Partner...' : 'Save & Activate Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
