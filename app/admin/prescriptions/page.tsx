'use client';

import React, { useEffect, useState } from 'react';
import { RefreshCw, FileText, CheckCircle2, Send, Phone, MapPin, Eye, ExternalLink } from 'lucide-react';

interface Prescription {
  id: number;
  patient_name: string;
  patient_phone: string;
  patient_address: string;
  file_url: string;
  status: string;
  extracted_tests: string;
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
      const res = await fetch('/api/admin/prescriptions');
      const data = await res.json();
      if (data.success) {
        setItems(data.prescriptions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

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

      if (data.success && data.waUrl) {
        window.open(data.waUrl, '_blank');
        fetchPrescriptions();
        setSelectedRx(null);
      } else {
        alert('Quote failed: ' + (data.error || 'Server error'));
      }
    } catch (err: any) {
      setSubmitting(false);
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Prescription ("Parcha") Desk</h1>
            <p className="text-xs text-slate-500 font-bold mt-1">Review Patient Uploads & Generate WhatsApp Quotes</p>
          </div>
          <button 
            onClick={fetchPrescriptions}
            className="flex items-center justify-center gap-2 bg-[#009387] hover:bg-[#007A70] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow cursor-pointer transition w-fit"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Sync Uploads</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of Prescriptions */}
          <div className="lg:col-span-2 space-y-4">
            {items.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-slate-400 font-bold text-xs">
                {loading ? 'Loading prescriptions...' : 'No prescriptions uploaded yet.'}
              </div>
            ) : (
              items.map((item) => (
                <div 
                  key={item.id} 
                  className={`bg-white rounded-3xl p-5 border transition cursor-pointer shadow-xs ${selectedRx?.id === item.id ? 'border-[#009387] ring-2 ring-[#009387]/20' : 'border-slate-200 hover:border-slate-300'}`}
                  onClick={() => {
                    setSelectedRx(item);
                    setTestNames(item.extracted_tests || 'CBC + LFT + KFT Profile');
                    setQuoteAmount(item.quoted_amount || '799');
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                        {item.file_url ? (
                          <img src={item.file_url} alt="Rx" className="w-full h-full object-cover" />
                        ) : (
                          <FileText size={20} className="text-slate-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900">{item.patient_name || 'Patient'}</h3>
                        <p className="text-xs font-mono text-slate-500 font-bold mt-0.5">+91 {item.patient_phone}</p>
                        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                          <MapPin size={10} /> {item.patient_address || 'Greater Noida'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {item.status === 'QUOTED' ? (
                        <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full uppercase">
                          Quoted (₹{item.quoted_amount})
                        </span>
                      ) : (
                        <span className="text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full uppercase">
                          Pending Review
                        </span>
                      )}
                      <span className="block text-[10px] text-slate-400 font-semibold mt-2">
                        {new Date(item.created_at).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Action Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm h-fit">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">
              Quote & Dispatch Generator
            </h2>

            {selectedRx ? (
              <form onSubmit={handleSendQuote} className="space-y-4 text-xs font-bold">
                <div>
                  <span className="text-slate-400 block mb-1">Prescription Preview:</span>
                  <a href={selectedRx.file_url} target="_blank" rel="noreferrer" className="block relative group overflow-hidden rounded-2xl border border-slate-200 max-h-44">
                    <img src={selectedRx.file_url} alt="Prescription" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white gap-1 transition">
                      <Eye size={14} /> Full View
                    </div>
                  </a>
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">Diagnosed Tests (Extracted)</label>
                  <input
                    type="text"
                    required
                    value={testNames}
                    onChange={(e) => setTestNames(e.target.value)}
                    placeholder="e.g. Thyroid, HbA1c, Vitamin D"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#009387]"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">Fulfillment Lab Partner</label>
                  <select
                    value={lab}
                    onChange={(e) => setLab(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[#17466E]"
                  >
                    <option value="Redcliffe Labs">Redcliffe Labs (Fastest)</option>
                    <option value="Dr Lal PathLabs">Dr Lal PathLabs</option>
                    <option value="Thyrocare">Thyrocare</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">Discounted Quote Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(e.target.value)}
                    placeholder="e.g. 699"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-emerald-600 font-extrabold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-[#009387] hover:bg-[#007A70] text-white rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer font-black"
                >
                  <Send size={14} />
                  <span>{submitting ? 'Creating Quote...' : 'Send WhatsApp Quote Link'}</span>
                </button>
              </form>
            ) : (
              <div className="py-12 text-center text-slate-400 font-bold text-xs">
                Select any prescription from the list to review and send instant quote.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
