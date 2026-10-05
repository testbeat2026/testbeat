'use client';

import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, Clock, Award, ArrowRight, Activity, MapPin } from 'lucide-react';

interface TestItem {
  id: number;
  name: string;
  slug: string;
  category: string;
  fasting_required: boolean;
  turnaround_hours: number;
  starting_price: string | number | null;
}

export default function HomePage() {
  const [tests, setTests] = useState<TestItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tests')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTests(data.tests);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch tests', err);
        setLoading(false);
      });
  }, []);

  const filteredTests = tests.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.category && t.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* 1. Header Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#00B4D8] flex items-center justify-center text-white font-extrabold text-xl shadow-sm">
              T
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Test<span className="text-[#00B4D8]">Beat</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold bg-slate-100 px-3 py-1.5 rounded-full text-slate-600">
            <MapPin size={14} className="text-[#00B4D8]" />
            <span>Delhi-NCR</span>
          </div>
        </div>
      </header>

      {/* 2. Hero Section & Real-Time Search */}
      <section className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-100 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-blue-50 text-[#00B4D8] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            Multi-Lab Diagnostic Aggregator
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Compare & Book Lab Tests <br className="hidden sm:inline" />
            <span className="text-[#00B4D8]">At Guaranteed Lowest Prices</span>
          </h1>
          <p className="mt-3 text-sm md:text-base text-slate-500 max-w-xl mx-auto">
            Book certified tests from Dr Lal PathLabs, Redcliffe, and Thyrocare with 100% free home sample collection.
          </p>

          {/* Interactive Search Box */}
          <div className="mt-8 relative max-w-2xl mx-auto">
            <div className="relative flex items-center shadow-lg rounded-2xl bg-white border border-slate-200 focus-within:border-[#00B4D8] focus-within:ring-2 focus-within:ring-[#00B4D8]/20 transition overflow-hidden">
              <Search className="ml-4 text-slate-400 shrink-0" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search CBC, Lipid Profile, Full Body Checkup..."
                className="w-full py-4 px-3 text-sm md:text-base text-slate-800 outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mr-4 text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Live Test Catalog from Neon Database */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">Popular Tests & Packages</h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              {loading ? 'Fetching tests...' : `${filteredTests.length} tests found in database`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Activity className="mx-auto text-slate-400 mb-2" size={32} />
            <p className="font-semibold text-slate-700">No diagnostic tests found</p>
            <p className="text-xs text-slate-400 mt-1">Try searching for &quot;CBC&quot; or &quot;Blood&quot;</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                      {test.category || 'General'}
                    </span>
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <ShieldCheck size={14} /> NABL Verified
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug">{test.name}</h3>

                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-3">
                    <span className="flex items-center gap-1">
                      <Clock size={13} /> {test.turnaround_hours}h Reports
                    </span>
                    <span>
                      {test.fasting_required ? '⚠️ Fasting Required' : '✓ No Fasting'}
                    </span>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Starting From</span>
                    <div className="text-xl font-extrabold text-slate-900">
                      ₹{test.starting_price || 299}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      alert(`Booking initialized for ${test.name}. Connecting checkout...`);
                    }}
                    className="bg-[#00B4D8] hover:bg-[#0096C7] text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition shadow-sm"
                  >
                    Compare & Book <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Trust Badges */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-around gap-6 text-center text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Award className="text-[#00B4D8]" size={20} />
            <span className="font-semibold text-slate-700">100% Certified Partner Labs</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="text-[#00B4D8]" size={20} />
            <span className="font-semibold text-slate-700">On-Time Home Sample Collection</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-[#00B4D8]" size={20} />
            <span className="font-semibold text-slate-700">Digital PDF Reports on WhatsApp & Mail</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
