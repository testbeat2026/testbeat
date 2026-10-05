'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  Check, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  Sparkles,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

interface LabPartner {
  lab_code: string;
  lab_name: string;
  tagline: string;
  default_discount_pct: string;
  pickup_tat_mins: number;
  report_tat_hours: number;
}

interface LabTest {
  id: number;
  test_code: string;
  test_name: string;
  category: string;
  fasting_required: boolean;
  redcliffe_price: string;
  lalpath_price: string;
  thyrocare_price: string;
}

export default function CompareLabsPage() {
  const router = useRouter();
  const [labs, setLabs] = useState<LabPartner[]>([]);
  const [tests, setTests] = useState<LabTest[]>([]);
  const [selectedCodes, setSelectedCodes] = useState<string[]>(['CBC', 'THYROID']);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/compare')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLabs(data.activeLabs || []);
          setTests(data.tests || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleTest = (code: string) => {
    if (selectedCodes.includes(code)) {
      if (selectedCodes.length > 1) {
        setSelectedCodes(selectedCodes.filter(c => c !== code));
      }
    } else {
      setSelectedCodes([...selectedCodes, code]);
    }
  };

  const getLabTotal = (labCode: string) => {
    return selectedCodes.reduce((sum, code) => {
      const item = tests.find(t => t.test_code === code);
      if (!item) return sum + 300;
      if (labCode === 'REDCLIFFE') return sum + Number(item.redcliffe_price);
      if (labCode === 'DRLAL') return sum + Number(item.lalpath_price);
      if (labCode === 'THYROCARE') return sum + Number(item.thyrocare_price);
      // Healthians or custom default
      return sum + Number(item.redcliffe_price);
    }, 0);
  };

  const filteredTests = tests.filter(t => 
    t.test_name.toLowerCase().includes(search.toLowerCase()) ||
    t.test_code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F4F7FB] font-sans pb-16">
      {/* Top Banner */}
      <div className="bg-[#0F1E36] text-white text-[11px] font-bold text-center py-2 px-4 shadow-sm flex items-center justify-center gap-2">
        <span>⚡ Neutral Diagnostic Rate Aggregator</span>
        <span>•</span>
        <span>Free Home Sample Collection in 60 Mins across Greater Noida</span>
      </div>

      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-9 h-9 rounded-xl bg-[#00A896] text-white flex items-center justify-center font-black text-base shadow">
              TB
            </div>
            <div>
              <span className="text-xl font-black text-[#0F1E36] tracking-tight">Test<span className="text-[#00A896]">Beat</span></span>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Multi-Lab Comparison</span>
            </div>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="text-xs font-bold text-slate-600 hover:text-[#00A896] flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Home
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 mt-2">
        {/* Header Title */}
        <div className="text-center max-w-xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-wider bg-teal-50 text-[#00A896] px-3 py-1 rounded-full border border-teal-200 inline-block">
            Transparent Pricing Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">Compare Diagnostic Labs Side-by-Side</h1>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Select pathology tests below to see instant live rates from NABL accredited lab chains.
          </p>
        </div>

        {/* 1. SELECT TESTS SECTION */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                1. Select Tests to Compare ({selectedCodes.length} Selected)
              </h2>
              <span className="text-[11px] text-slate-400 font-semibold">Tick multiple tests to compare combined package cost</span>
            </div>
            <div className="relative w-full sm:w-72">
              <Search size={14} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search CBC, Lipid, Sugar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#00A896]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            {filteredTests.map((t) => {
              const isChecked = selectedCodes.includes(t.test_code);
              return (
                <div
                  key={t.test_code}
                  onClick={() => toggleTest(t.test_code)}
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition text-xs font-bold ${
                    isChecked 
                      ? 'border-[#00A896] bg-teal-50/50 text-[#0F1E36] ring-1 ring-[#00A896]/30' 
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${isChecked ? 'bg-[#00A896] border-[#00A896] text-white' : 'border-slate-300'}`}>
                      {isChecked && <Check size={12} />}
                    </div>
                    <span className="truncate">{t.test_name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. REAL-TIME LAB COMPARISON CARDS */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              2. Live Lab Rates for Selected Tests
            </h2>
            <span className="text-[11px] text-emerald-600 font-bold">✓ Showing Active Diagnostic Partners</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {labs.map((lab) => {
              const total = getLabTotal(lab.lab_code);

              return (
                <div
                  key={lab.lab_code}
                  className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-[#00A896] transition shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {lab.lab_code}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {lab.default_discount_pct}% OFF
                      </span>
                    </div>

                    <h3 className="font-black text-lg text-slate-900 mt-3">{lab.lab_name}</h3>
                    <p className="text-xs text-slate-500 font-semibold mt-1">{lab.tagline}</p>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs font-bold text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Sample Pickup:</span>
                        <span>{lab.pickup_tat_mins} Mins</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Report Turnaround:</span>
                        <span>{lab.report_tat_hours} Hours</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Home Collection:</span>
                        <span className="text-emerald-600 font-black">FREE</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-black block">Combined Package Price</span>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-2xl font-black text-slate-900">₹{total}</span>
                    </div>

                    <button
                      onClick={() => router.push(`/upload-prescription`)}
                      className="w-full mt-4 py-3 bg-[#00A896] hover:bg-[#008f80] text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Book with {lab.lab_name}</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Trust Assurance */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 text-center flex flex-col sm:flex-row items-center justify-around gap-4 text-xs font-bold text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-[#00A896]" />
            <span>100% NABL / ISO Certified Labs Only</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-[#00A896]" />
            <span>Digital Smart Reports on WhatsApp</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-[#00A896]" />
            <span>No Hidden Home Pickup Charges</span>
          </div>
        </div>
      </main>
    </div>
  );
}
