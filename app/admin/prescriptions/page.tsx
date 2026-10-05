'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { 
  RefreshCw, 
  FileText, 
  Send, 
  Phone, 
  Eye, 
  Sparkles 
} from 'lucide-react';

interface Prescription {
  id: number;
  patient_name: string;
  patient_phone: string;
  patient_address: string;
  file_url: string;
  status: string;
  extracted_tests: string;
  selected_lab: string;
  quoted_amount: string;
  created_at: string;
}

export default function AdminPrescriptionsPage() {
  const [items, setItems] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);

  const [testNames, setTestNames] = useState('');
  const [quoteAmount, setQuoteAmount] = useState('');
  const [lab, setLab] = useState('Redcliffe Labs');
  const [submitting, setSubmitting] = useState(false);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/prescriptions').catch(() => null);
      if (!res || !res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (data.success && Array.isArray(data.prescriptions)) {
        setItems(data.prescriptions);
        if (data.prescriptions.length > 0) {
          setSelectedRx(data.prescriptions[0]);
          setTestNames(data.prescriptions[0].extracted_tests || 'CBC with ESR, Lipid Profile');
          setQuoteAmount(data.prescriptions[0].quoted_amount || '649');
          setLab(data.prescriptions[0].selected_lab || 'Redcliffe Labs');
        }
      }
    } catch (err) {
      console.warn('Prescriptions fetch skipped during static generation phase');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleSelectPrescription = (rx: Prescription) => {
    setSelectedRx(rx);
    setTestNames(rx.extracted_tests || 'CBC with ESR, Thyroid Profile');
    setQuoteAmount(rx.quoted_amount || '649');
    setLab(rx.selected_lab || 'Redcliffe Labs');
  };

  const handleSendQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRx || !quoteAmount) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prescriptionId: selectedRx.id,
          testNames,
          quoteAmount: Number(quoteAmount),
          labAssigned: lab
        })
      });

      const data = await res.json();
      setSubmitting(false);

      if (data.success && data.waUrl && typeof window !== 'undefined') {
        window.open(data.waUrl, '_blank');
        fetchPrescriptions();
      } else {
        alert('Quote failed: ' + (data.error || 'Server error'));
      }
    } catch (err: any) {
      setSubmitting(false);
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Prescriptions</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-slate-900">{items.length}</span>
            <span className="text-[11px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">Live DB</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Pending Review</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-amber-600">
              {items.filter(i => i.status !== 'QUOTED').length}
            </span>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Action Req.</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Quoted & Converted</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-emerald-600">
              {items.filter(i => i.status === 'QUOTED').length}
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Dispatched</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Database Status</span>
            <span className="text-sm font-black text-[#00A896] block mt-1">Operational</span>
          </div>
          <button
            onClick={fetchPrescriptions}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition"
            title="Refresh DB"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Main 2-Column Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of Prescriptions */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Incoming Prescriptions Queue ({items.length})
            </h2>
            <span className="text-xs text-slate-400 font-semibold">Click row to review & dispatch</span>
          </div>

          {items.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-400 font-bold text-xs border border-slate-200">
              {loading ? 'Fetching live prescriptions...' : 'No prescriptions uploaded yet.'}
            </div>
          ) : (
            items.map((rx) => {
              const isSelected = selectedRx?.id === rx.id;
              return (
                <div
                  key={rx.id}
                  onClick={() => handleSelectPrescription(rx)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-white border-[#00A896] ring-2 ring-[#00A896]/15 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {rx.file_url ? (
                        <img src={rx.file_url} alt="Rx" className="w-full h-full object-cover" />
                      ) : (
                        <FileText size={18} className="text-slate-400" />
                      )}
                    </div>
                    <div className="truncate">
                      <h3 className="text-xs font-black text-slate-900 truncate">{rx.patient_name || 'Patient'}</h3>
                      <p className="text-[11px] text-slate-500 font-mono font-bold mt-0.5 flex items-center gap-1">
                        <Phone size={10} /> +91 {rx.patient_phone}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {rx.extracted_tests || 'General Tests Selected'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {rx.status === 'QUOTED' ? (
                      <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full uppercase">
                        Quoted ₹{rx.quoted_amount}
                      </span>
                    ) : (
                      <span className="text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full uppercase">
                        Pending
                      </span>
                    )}
                    <span className="block text-[10px] text-slate-400 mt-1 font-semibold">
                      {rx.created_at ? new Date(rx.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Review & Dispatch Generator */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-6">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles size={14} className="text-[#00A896]" />
              Prescription Inspection & WhatsApp Dispatch
            </h3>

            {selectedRx ? (
              <form onSubmit={handleSendQuote} className="space-y-4 text-xs font-bold">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase mb-1">Doctor Parcha Preview:</span>
                  <a
                    href={selectedRx.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="block relative group overflow-hidden rounded-2xl border border-slate-200 max-h-48 bg-slate-100"
                  >
                    <img src={selectedRx.file_url} alt="Prescription" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white gap-1 transition">
                      <Eye size={14} /> Click to Full Screen
                    </div>
                  </a>
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">Diagnosed Tests</label>
                  <input
                    type="text"
                    required
                    value={testNames}
                    onChange={(e) => setTestNames(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#00A896] text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 block mb-1">Assigned Lab</label>
                    <select
                      value={lab}
                      onChange={(e) => setLab(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[#0F1E36] text-xs font-bold"
                    >
                      <option value="Redcliffe Labs">Redcliffe Labs</option>
                      <option value="Dr Lal PathLabs">Dr Lal PathLabs</option>
                      <option value="Thyrocare">Thyrocare</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-700 block mb-1">Quote Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={quoteAmount}
                      onChange={(e) => setQuoteAmount(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-emerald-600 font-extrabold text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-[#00A896] hover:bg-[#008f80] text-white rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer font-black text-xs"
                >
                  <Send size={14} />
                  <span>{submitting ? 'Generating Quote...' : 'Dispatch Quote to Patient WhatsApp'}</span>
                </button>
              </form>
            ) : (
              <div className="py-16 text-center text-slate-400 font-bold text-xs">
                Select a prescription from the queue to inspect and dispatch.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
