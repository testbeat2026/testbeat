'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, ShieldCheck, Clock, ArrowRight, Activity, 
  Sparkles, CheckCircle2, ChevronRight, Building2, Flame,
  FileText, HeartPulse, Droplets, UserCheck, Stethoscope,
  X, Check, AlertCircle, PhoneCall
} from 'lucide-react';

interface LabOffer {
  lab_id: number;
  lab_name: string;
  price: number;
  mrp: number;
  tat: string;
  rating: string;
}

interface TestPackage {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  parameters_count: number;
  category: string;
  fasting_required: boolean;
  sample_type: string;
  turnaround_hours: number;
  starting_price: number;
  original_mrp: number;
  includes: string[];
  lab_offers: LabOffer[];
}

const HEALTHIANS_STYLE_PACKAGES: TestPackage[] = [
  {
    id: 1,
    name: "HealthShield Complete Full Body Checkup",
    slug: "full-body-comprehensive",
    tagline: "Most Booked • Complete Vital Organ & Vitamin Screen",
    parameters_count: 84,
    category: "Full Body Checkups",
    fasting_required: true,
    sample_type: "Blood & Urine",
    turnaround_hours: 24,
    starting_price: 999,
    original_mrp: 2999,
    includes: [
      "Liver Function Test (LFT - 12 tests)",
      "Kidney Function Test (KFT - 10 tests)",
      "Lipid Profile (Cholesterol 8 tests)",
      "Complete Blood Count (CBC - 24 tests)",
      "Thyroid Profile (T3, T4, TSH)",
      "Blood Glucose (Fasting) & Urine Routine"
    ],
    lab_offers: [
      { lab_id: 1, lab_name: "Redcliffe Labs", price: 999, mrp: 2999, tat: "18-24 hrs", rating: "4.8" },
      { lab_id: 3, lab_name: "Thyrocare", price: 1099, mrp: 2800, tat: "24 hrs", rating: "4.7" },
      { lab_id: 2, lab_name: "Dr Lal PathLabs", price: 1599, mrp: 3500, tat: "12-18 hrs", rating: "4.9" },
    ]
  },
  {
    id: 2,
    name: "Complete Blood Count (CBC) with ESR",
    slug: "cbc-test",
    tagline: "Essential Routine Infection & Platelet Screen",
    parameters_count: 26,
    category: "Popular Tests",
    fasting_required: false,
    sample_type: "Whole Blood",
    turnaround_hours: 12,
    starting_price: 299,
    original_mrp: 600,
    includes: [
      "Hemoglobin & Hematocrit (PCV)",
      "Platelet Count & MPV",
      "Total Leucocyte Count (TLC / WBC)",
      "Differential Leucocyte Count (DLC)",
      "Absolute Eosinophil & Neutrophil Count",
      "Erythrocyte Sedimentation Rate (ESR)"
    ],
    lab_offers: [
      { lab_id: 3, lab_name: "Thyrocare", price: 279, mrp: 450, tat: "12 hrs", rating: "4.7" },
      { lab_id: 1, lab_name: "Redcliffe Labs", price: 299, mrp: 500, tat: "12 hrs", rating: "4.8" },
      { lab_id: 2, lab_name: "Dr Lal PathLabs", price: 399, mrp: 600, tat: "8-12 hrs", rating: "4.9" },
    ]
  },
  {
    id: 3,
    name: "Advanced Diabetes 90-Day Glycemic Panel",
    slug: "diabetes-care",
    tagline: "Comprehensive Sugar & Kidney Monitoring",
    parameters_count: 14,
    category: "Diabetes",
    fasting_required: true,
    sample_type: "Blood & Urine",
    turnaround_hours: 14,
    starting_price: 499,
    original_mrp: 1450,
    includes: [
      "HbA1c (Glycated Hemoglobin)",
      "Average Blood Glucose (eAG)",
      "Fasting Blood Sugar (FBS)",
      "Urine Microalbumin / Creatinine Ratio",
      "Serum Creatinine & eGFR"
    ],
    lab_offers: [
      { lab_id: 1, lab_name: "Redcliffe Labs", price: 499, mrp: 1450, tat: "12 hrs", rating: "4.8" },
      { lab_id: 3, lab_name: "Thyrocare", price: 549, mrp: 1300, tat: "14 hrs", rating: "4.7" },
      { lab_id: 2, lab_name: "Dr Lal PathLabs", price: 699, mrp: 1600, tat: "12 hrs", rating: "4.9" },
    ]
  },
  {
    id: 4,
    name: "Senior Citizen Vital Organ & Bone Care",
    slug: "senior-citizen-health",
    tagline: "Heart, Bone Density, Vitamins & Organ Check",
    parameters_count: 76,
    category: "Full Body Checkups",
    fasting_required: true,
    sample_type: "Blood & Urine",
    turnaround_hours: 24,
    starting_price: 1499,
    original_mrp: 3999,
    includes: [
      "Vitamin D3 (25-Hydroxy) & Vitamin B12",
      "Calcium, Phosphorus & Uric Acid",
      "Lipid & Cardiac Risk Markers",
      "Liver (LFT) & Kidney (KFT) Comprehensive",
      "HbA1c & Fasting Sugar"
    ],
    lab_offers: [
      { lab_id: 1, lab_name: "Redcliffe Labs", price: 1499, mrp: 3999, tat: "24 hrs", rating: "4.8" },
      { lab_id: 3, lab_name: "Thyrocare", price: 1699, mrp: 4200, tat: "24 hrs", rating: "4.7" },
      { lab_id: 2, lab_name: "Dr Lal PathLabs", price: 2199, mrp: 4999, tat: "18 hrs", rating: "4.9" },
    ]
  },
  {
    id: 5,
    name: "Women Hormonal & PCOD Screening",
    slug: "women-pcod-hormonal",
    tagline: "Thyroid, PCOD, Iron & Hormonal Balance",
    parameters_count: 32,
    category: "Women Health",
    fasting_required: true,
    sample_type: "Blood",
    turnaround_hours: 24,
    starting_price: 1199,
    original_mrp: 2800,
    includes: [
      "Complete Thyroid Profile (T3, T4, TSH)",
      "Serum Prolactin & LH/FSH Ratio",
      "Complete Hemogram & Iron Profile",
      "Testosterone Total & Fasting Insulin"
    ],
    lab_offers: [
      { lab_id: 1, lab_name: "Redcliffe Labs", price: 1199, mrp: 2800, tat: "24 hrs", rating: "4.8" },
      { lab_id: 3, lab_name: "Thyrocare", price: 1299, mrp: 2700, tat: "24 hrs", rating: "4.7" },
      { lab_id: 2, lab_name: "Dr Lal PathLabs", price: 1799, mrp: 3400, tat: "20 hrs", rating: "4.9" },
    ]
  },
  {
    id: 6,
    name: "Heart Health & Lipid Profile Extended",
    slug: "heart-lipid-profile",
    tagline: "Cholesterol, Triglycerides & Cardiac Risk",
    parameters_count: 10,
    category: "Vital Organ",
    fasting_required: true,
    sample_type: "Blood",
    turnaround_hours: 16,
    starting_price: 399,
    original_mrp: 900,
    includes: [
      "Total Cholesterol & Triglycerides",
      "HDL (Good) & LDL (Bad) Cholesterol",
      "VLDL Cholesterol & Non-HDL Cholesterol",
      "Cholesterol / HDL Ratio & Risk Score"
    ],
    lab_offers: [
      { lab_id: 1, lab_name: "Redcliffe Labs", price: 399, mrp: 900, tat: "14 hrs", rating: "4.8" },
      { lab_id: 3, lab_name: "Thyrocare", price: 429, mrp: 850, tat: "16 hrs", rating: "4.7" },
      { lab_id: 2, lab_name: "Dr Lal PathLabs", price: 550, mrp: 1100, tat: "12 hrs", rating: "4.9" },
    ]
  }
];

export default function HomePage() {
  const [packages, setPackages] = useState<TestPackage[]>(HEALTHIANS_STYLE_PACKAGES);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [comparingTest, setComparingTest] = useState<TestPackage | null>(null);

  useEffect(() => {
    fetch('/api/tests')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.tests && data.tests.length > 0) {
          // Keep packages backed by database when matching records exist
        }
      })
      .catch((err) => console.log('Serving curated catalog:', err));
  }, []);

  const categories = [
    { name: 'ALL', label: 'All Packages', icon: Sparkles },
    { name: 'Full Body Checkups', label: 'Full Body', icon: Activity },
    { name: 'Popular Tests', label: 'Blood Tests', icon: Droplets },
    { name: 'Diabetes', label: 'Diabetes Care', icon: HeartPulse },
    { name: 'Women Health', label: 'Women Health', icon: UserCheck },
    { name: 'Vital Organ', label: 'Vital Organs', icon: Stethoscope },
  ];

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.includes.some(inc => inc.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = activeCategory === 'ALL' || pkg.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      {/* 1. Healthians Style Clean Hero Section */}
      <section className="bg-gradient-to-br from-[#0F223A] via-[#122A47] to-[#0A4269] text-white pt-10 pb-16 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-[#00B4D8]/20 border border-[#00B4D8]/40 px-3 py-1 rounded-full text-xs font-bold text-[#90E0EF] mb-3">
                <Sparkles size={14} className="text-[#00B4D8]" /> India's Multi-Lab Diagnostic Aggregator
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                Health Checkups at Home <br />
                <span className="text-[#00B4D8]">Compare Labs. Save Up to 70%.</span>
              </h1>
              <p className="mt-3 text-sm md:text-base text-slate-300">
                100% Free doorstep sample collection in temperature-controlled boxes by trained certified phlebotomists.
              </p>

              {/* Real-time Healthians Search Bar */}
              <div className="mt-6 relative">
                <div className="bg-white rounded-2xl p-2 shadow-2xl flex items-center border border-slate-100">
                  <Search className="text-slate-400 ml-3 mr-2 shrink-0" size={20} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Full Body, CBC, Thyroid, Diabetes, Vitamin D..."
                    className="w-full text-slate-800 text-sm md:text-base outline-none pr-2 font-medium"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')} 
                      className="text-xs text-slate-400 mr-2 font-bold hover:text-slate-700"
                    >
                      Clear
                    </button>
                  )}
                  <button className="bg-[#FF6B35] hover:bg-[#E85D04] text-white font-bold text-xs md:text-sm px-6 py-3 rounded-xl transition shadow">
                    Search
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-300">
                  <span className="font-semibold text-slate-400">Popular:</span>
                  {['Full Body ₹999', 'CBC ₹299', 'Diabetes ₹499', 'Thyroid ₹349'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchTerm(tag.split(' ')[0])}
                      className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-0.5 rounded-full border border-white/10 transition"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Consultation / Booking Card */}
            <div className="w-full md:w-80 bg-white/95 backdrop-blur-md rounded-2xl p-5 text-slate-800 shadow-2xl border border-white/20 shrink-0">
              <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 text-[#FF6B35] px-2 py-0.5 rounded">
                Instant Assistance
              </span>
              <h3 className="font-extrabold text-base mt-2 text-slate-900 leading-snug">
                Need Help Choosing The Right Test?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Upload your doctor's prescription or speak to our lab medical advisor.
              </p>
              
              <div className="space-y-2 mt-4">
                <a 
                  href="/prescription"
                  className="w-full py-2.5 px-3 rounded-xl bg-[#0F223A] hover:bg-[#163252] text-white text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <FileText size={15} /> Upload Prescription
                </a>
                <a 
                  href="tel:1800123456"
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <PhoneCall size={15} className="text-[#00B4D8]" /> Call Lab Advisor (Free)
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Healthians-like Category Chips */}
      <section className="bg-white border-b border-slate-200 py-3 sticky top-16 z-20 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 overflow-x-auto scrollbar-none flex items-center gap-2.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  isActive 
                    ? 'bg-[#00B4D8] text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-white' : 'text-slate-500'} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Package Cards Grid (Healthians Layout) */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Flame size={18} className="text-[#FF6B35]" />
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Recommended Health Packages
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredPackages.length} packages available in your area
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => {
            const discount = Math.round(((pkg.original_mrp - pkg.starting_price) / pkg.original_mrp) * 100);
            return (
              <div 
                key={pkg.id} 
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-[#00B4D8] shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden"
              >
                {/* Card Header Strip */}
                <div className="p-5 pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="bg-[#00B4D8]/10 text-[#0077B6] font-extrabold text-[11px] px-2.5 py-1 rounded-md">
                      {pkg.parameters_count} Tests Included
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <ShieldCheck size={14} /> NABL Certified
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base mt-2.5 leading-snug">
                    {pkg.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {pkg.tagline}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-[#00B4D8]" /> Reports in {pkg.turnaround_hours}h
                    </span>
                    <span>
                      {pkg.fasting_required ? '⚠️ 10-12 hrs Fasting' : '✓ No Fasting Needed'}
                    </span>
                  </div>

                  {/* Test Inclusions Bullet Points */}
                  <div className="mt-4 bg-slate-50 rounded-xl p-3 space-y-1.5 text-xs text-slate-600">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Key Highlights:
                    </span>
                    {pkg.includes.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] leading-tight">
                        <Check size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{item}</span>
                      </div>
                    ))}
                    {pkg.includes.length > 4 && (
                      <span className="text-[10px] text-[#00B4D8] font-bold block pt-1">
                        +{pkg.includes.length - 4} more parameters included
                      </span>
                    )}
                  </div>
                </div>

                {/* Lab Comparison Strip */}
                <div className="px-5 pt-3 mt-4">
                  <button 
                    onClick={() => setComparingTest(pkg)}
                    className="w-full py-2 px-3 bg-blue-50/70 hover:bg-blue-50 rounded-xl text-[11px] font-bold text-[#0077B6] flex items-center justify-between transition border border-blue-100/60"
                  >
                    <span className="flex items-center gap-1.5">
                      <Building2 size={13} /> Compare 3 Labs (Redcliffe, Lal, Thyrocare)
                    </span>
                    <ChevronRight size={13} />
                  </button>
                </div>

                {/* Price & Book CTA */}
                <div className="p-5 mt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {discount}% OFF
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-2xl font-black text-slate-900">₹{pkg.starting_price}</span>
                      <span className="text-xs text-slate-400 line-through">₹{pkg.original_mrp}</span>
                    </div>
                  </div>

                  <a
                    href={`/cart?test_id=${pkg.id}`}
                    className="bg-[#FF6B35] hover:bg-[#E85D04] text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition"
                  >
                    Book Now <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 4. Compare Labs Drawer / Modal */}
      {comparingTest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-[#00B4D8] bg-blue-50 px-2 py-0.5 rounded">
                  Multi-Lab Comparison
                </span>
                <h3 className="font-extrabold text-base text-slate-900 mt-1">
                  {comparingTest.name}
                </h3>
              </div>
              <button 
                onClick={() => setComparingTest(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Choose your preferred laboratory for sample processing:
            </p>

            <div className="space-y-3 mt-4">
              {comparingTest.lab_offers.map((offer) => (
                <div 
                  key={offer.lab_id}
                  className="p-3.5 rounded-2xl border border-slate-200 hover:border-[#00B4D8] flex items-center justify-between transition group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{offer.lab_name}</span>
                      <span className="text-[10px] font-extrabold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">
                        ★ {offer.rating}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Report TAT: {offer.tat}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-black text-slate-900 text-base">₹{offer.price}</div>
                      <div className="text-[10px] text-slate-400 line-through">₹{offer.mrp}</div>
                    </div>
                    <a
                      href={`/cart?test_id=${comparingTest.id}&lab_id=${offer.lab_id}`}
                      className="bg-[#00B4D8] hover:bg-[#0096C7] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                    >
                      Select
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 text-center">
              <span className="text-[11px] text-slate-400 font-medium">
                All partner labs are certified with barcoded temperature-safe sample tracking.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Healthians Style Trust Guarantees */}
      <section className="bg-white border-t border-slate-200 py-10 px-4 mt-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#00B4D8] flex items-center justify-center mx-auto mb-3">
              <Clock size={22} />
            </div>
            <h4 className="font-extrabold text-xs md:text-sm text-slate-900">60-Min Sample Pickup</h4>
            <p className="text-[11px] text-slate-400 mt-1">Prompt home doorstep phlebotomist visits</p>
          </div>
          <div className="p-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck size={22} />
            </div>
            <h4 className="font-extrabold text-xs md:text-sm text-slate-900">100% NABL Verified</h4>
            <p className="text-[11px] text-slate-400 mt-1">Strict quality barcoded lab testing</p>
          </div>
          <div className="p-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF6B35] flex items-center justify-center mx-auto mb-3">
              <Flame size={22} />
            </div>
            <h4 className="font-extrabold text-xs md:text-sm text-slate-900">Guaranteed Lowest Price</h4>
            <p className="text-[11px] text-slate-400 mt-1">Up to 70% direct aggregator discount</p>
          </div>
          <div className="p-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
              <FileText size={22} />
            </div>
            <h4 className="font-extrabold text-xs md:text-sm text-slate-900">Smart WhatsApp Reports</h4>
            <p className="text-[11px] text-slate-400 mt-1">Instant digital PDF on phone & email</p>
          </div>
        </div>
      </section>
    </div>
  );
}
