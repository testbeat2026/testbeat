'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, CheckCircle2, ShieldCheck, FileText, ArrowRight, ArrowLeft } from 'lucide-react';

export default function UploadPrescriptionPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('7666953705');
  const [address, setAddress] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imagePreview) {
      alert('Kripya prescription (parcha) ki photo upload karein.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/prescription/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: fullName,
          patientPhone: phone,
          patientAddress: address,
          fileBase64: imagePreview
        })
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setSubmitted(true);
      } else {
        alert('Upload failed: ' + (data.error || 'Server error'));
      }
    } catch (err: any) {
      setLoading(false);
      alert('Upload error: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] font-sans pb-16">
      {/* Top Banner */}
      <div className="bg-[#17466E] text-white text-[11px] font-bold text-center py-2 px-4 shadow-sm flex items-center justify-center gap-2">
        <span>⚡ Quick Prescription Review</span>
        <span>•</span>
        <span>Best Lab Price Match in 15 Minutes</span>
      </div>

      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-9 h-9 rounded-xl bg-[#009387] text-white flex items-center justify-center font-black text-base shadow">
              TB
            </div>
            <div>
              <span className="text-xl font-black text-[#17466E] tracking-tight">Test<span className="text-[#009387]">Beat</span></span>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Diagnostic Aggregator</span>
            </div>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="text-xs font-bold text-slate-600 hover:text-[#17466E] flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Catalog
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto p-4 sm:p-6 mt-6">
        {submitted ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Parcha Received
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-3">Prescription Uploaded!</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Humari medical team prescription verify karke Redcliffe aur Lal PathLabs se best discounted rates ka SMS / WhatsApp link aapke number (<strong>{phone}</strong>) par 15 minute mein bhej degi.
            </p>

            <button
              onClick={() => router.push('/')}
              className="mt-6 w-full py-3.5 bg-[#009387] hover:bg-[#007A70] text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
            <div className="text-center mb-6">
              <span className="text-[10px] font-black uppercase tracking-wider bg-teal-50 text-[#009387] px-3 py-1 rounded-full border border-teal-200">
                Direct Lab Price Match
              </span>
              <h1 className="text-2xl font-black text-slate-900 mt-2">Upload Doctor's Prescription</h1>
              <p className="text-xs text-slate-500 mt-1">Photo upload kijiye, hum best discounted lab quote banayenge.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo Upload Area */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Prescription Photo / Slip *</label>
                <div className="border-2 border-dashed border-slate-200 hover:border-[#009387] rounded-2xl p-4 text-center cursor-pointer transition bg-slate-50 relative">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    required
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {imagePreview ? (
                    <div className="flex flex-col items-center">
                      <img src={imagePreview} alt="Prescription" className="max-h-48 rounded-xl object-contain mb-2 shadow-xs" />
                      <span className="text-xs font-bold text-emerald-600">✓ Photo attached (Click to change)</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-6 text-slate-400">
                      <UploadCloud size={36} className="text-[#009387] mb-2" />
                      <span className="text-xs font-black text-slate-700">Click to capture or upload photo</span>
                      <span className="text-[11px] text-slate-400 mt-0.5">JPG, PNG ya PDF (Upto 5MB)</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#009387]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number (For WhatsApp / SMS Quote) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#009387]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Pickup Address / Sector</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Chi V, Greater Noida"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#009387]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-4 bg-[#009387] hover:bg-[#007A70] text-white font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Uploading Prescription...' : 'Submit Prescription for Quote'}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-bold">
              <ShieldCheck size={16} className="text-[#009387]" />
              <span>Strict 100% Medical Data Confidentiality</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
