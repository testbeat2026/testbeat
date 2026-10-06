'use client';

import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  PhoneCall, 
  User, 
  Search, 
  FileText, 
  Activity, 
  FlaskConical, 
  Menu, 
  X,
  Sparkles,
  Award,
  Clock,
  ArrowRight,
  Handshake,
  CheckCircle2,
  Lock,
  Send,
  UserCheck,
  Check,
  Percent,
  UploadCloud,
  ChevronDown
} from 'lucide-react';

// --- Diagnostic Test Database ---
interface TestItem {
  id: string;
  name: string;
  category: string;
  parametersCount: number;
}

const AVAILABLE_TESTS: TestItem[] = [
  { id: 't1', name: 'Complete Blood Count (CBC with ESR)', category: 'Blood', parametersCount: 28 },
  { id: 't2', name: 'Thyroid Profile Total (T3, T4, TSH)', category: 'Thyroid', parametersCount: 3 },
  { id: 't3', name: 'HbA1c (Glycated Hemoglobin)', category: 'Diabetes', parametersCount: 2 },
  { id: 't4', name: 'Lipid Profile (Cholesterol & Triglycerides)', category: 'Heart', parametersCount: 8 },
  { id: 't5', name: 'Liver Function Test (LFT)', category: 'Liver', parametersCount: 12 },
  { id: 't6', name: 'Kidney Function Test (KFT with Electrolytes)', category: 'Kidney', parametersCount: 11 },
  { id: 't7', name: 'Vitamin D (25-Hydroxy)', category: 'Vitamins', parametersCount: 1 },
  { id: 't8', name: 'Vitamin B12 (Cyanocobalamin)', category: 'Vitamins', parametersCount: 1 },
  { id: 't9', name: 'Urine Routine & Microscopic', category: 'Routine', parametersCount: 18 },
  { id: 't10', name: 'Iron Deficiency Profile', category: 'Anemia', parametersCount: 4 }
];

const POPULAR_PACKAGES = [
  {
    id: 'p1',
    title: 'Full Body Comprehensive Checkup',
    tag: 'Most Booked',
    parameters: 84,
    mrp: 3999,
    price: 1199,
    discount: '70% OFF',
    features: ['CBC, LFT, KFT, Lipid', 'Thyroid, Diabetes, Urine', 'Free Home Sample Pickup', 'Doctor Consultation Inc.']
  },
  {
    id: 'p2',
    title: 'Senior Citizen Active Care',
    tag: 'Specialized',
    parameters: 92,
    mrp: 4999,
    price: 1699,
    discount: '66% OFF',
    features: ['Cardiac Risk Markers', 'Bone Health (Vit D & Calcium)', 'Kidney & Liver Screening', 'Reports within 18 Hours']
  },
  {
    id: 'p3',
    title: 'Diabetes & Cardiac Evaluation',
    tag: 'Chronic Care',
    parameters: 68,
    mrp: 2999,
    price: 899,
    discount: '70% OFF',
    features: ['HbA1c & Fasting Sugar', 'Lipid Profile Extended', 'Renal Microalbumin', 'Certified Cold-Chain Safety']
  }
];

const LABS_DATA = [
  {
    labName: 'Thyrocare Technologies',
    labLogo: 'TC',
    badge: 'Centralized Lab Automation',
    accreditation: 'NABL & CAP Certified',
    reportHours: 24,
    basePrice: 1899,
    discountPercentage: 58,
    sampleMethod: 'Barcoded Vacutainers'
  },
  {
    labName: 'Healthians Network',
    labLogo: 'HN',
    badge: 'Fastest Home Collection',
    accreditation: 'NABL Accredited',
    reportHours: 18,
    basePrice: 2199,
    discountPercentage: 60,
    sampleMethod: 'Smart Cool-Gel Kits'
  },
  {
    labName: 'Redcliffe Lifetech',
    labLogo: 'RL',
    badge: 'AI Report Analysis',
    accreditation: 'NABL & ISO Certified',
    reportHours: 16,
    basePrice: 2099,
    discountPercentage: 55,
    sampleMethod: 'Temperature Monitored'
  },
  {
    labName: 'Dr. Lal PathLabs Network',
    labLogo: 'LP',
    badge: 'Gold Standard Diagnostics',
    accreditation: 'NABL & CAP Gold',
    reportHours: 12,
    basePrice: 2799,
    discountPercentage: 35,
    sampleMethod: 'Direct Regional Processing'
  }
];

export default function UnifiedTestBeatPortal() {
  // Navigation & Customer Modal States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authStep, setAuthStep] = useState<'MOBILE' | 'OTP'>('MOBILE');
  const [patientMobile, setPatientMobile] = useState('');
  const [patientOtp, setPatientOtp] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Multi-Test Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTests, setSelectedTests] = useState<TestItem[]>([
    AVAILABLE_TESTS[0], // CBC
    AVAILABLE_TESTS[1]  // Thyroid
  ]);

  // Affiliate Lead State
  const [affiliateData, setAffiliateData] = useState({
    name: '',
    phone: '',
    city: '',
    category: 'Doctor / Clinic',
    volume: '10-50 tests/month'
  });
  const [affiliateSubmitted, setAffiliateSubmitted] = useState(false);

  // Search filter
  const filteredTests = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return AVAILABLE_TESTS.filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedTests.some(st => st.id === t.id)
    );
  }, [searchQuery, selectedTests]);

  const toggleTest = (test: TestItem) => {
    if (selectedTests.some(t => t.id === test.id)) {
      setSelectedTests(selectedTests.filter(t => t.id !== test.id));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
    setSearchQuery('');
  };

  const totalParams = useMemo(() => {
    return selectedTests.reduce((acc, t) => acc + t.parametersCount, 0);
  }, [selectedTests]);

  // Dynamic pricing calculation & Best Value index scoring
  const labCalculations = useMemo(() => {
    return LABS_DATA.map((lab) => {
      const multiplier = Math.max(1, selectedTests.length * 0.72);
      const calculatedMrp = Math.round(lab.basePrice * multiplier);
      const finalPrice = Math.round(calculatedMrp * (1 - lab.discountPercentage / 100));
      // Best Value score: higher parameter count per rupee spent
      const valueScore = (totalParams / (finalPrice || 1)) * 1000;

      return {
        ...lab,
        mrp: calculatedMrp,
        finalPrice,
        valueScore
      };
    }).sort((a, b) => b.valueScore - a.valueScore);
  }, [selectedTests, totalParams]);

  // Customer MSG91 OTP Action
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (patientMobile.length !== 10) return alert('Please enter 10-digit number');
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setAuthStep('OTP');
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (patientOtp.length < 4) return alert('Please enter OTP');
    alert(`Welcome to TestBeat Patient Portal (+91 ${patientMobile})`);
    setIsAuthOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-sky-500 selection:text-white">

      {/* ================= 1. ALL-INDIA TRUST BAR ================= */}
      <div className="bg-slate-950 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-4 overflow-x-auto text-[11px] sm:text-xs">
            <span className="flex items-center text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> 100% NABL & CAP Accredited Diagnostic Partners
            </span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:flex items-center text-slate-300">
              <Activity className="w-3.5 h-3.5 mr-1 text-sky-400" /> Temperature-Controlled Cold-Chain Sample Safety
            </span>
            <span className="hidden lg:inline text-slate-600">•</span>
            <span className="flex items-center text-amber-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Pan-India Home Sample Pickup
            </span>
          </div>

          <div className="flex items-center space-x-5 text-xs">
            <div className="flex items-center text-slate-300 font-medium">
              <MapPin className="w-3.5 h-3.5 mr-1 text-rose-400" />
              <span>All India (50+ Major Cities)</span>
            </div>
            <a href="tel:+918368887011" className="flex items-center text-sky-400 font-bold hover:underline">
              <PhoneCall className="w-3.5 h-3.5 mr-1" /> +91 83688 87011
            </a>
          </div>
        </div>
      </div>

      {/* ================= 2. MAIN HEADER & MENUS ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo & Updated Slogan */}
          <a href="#" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              TB
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black tracking-tight text-slate-900">Test<span className="text-sky-600">Beat</span></span>
                <span className="bg-sky-100 text-sky-700 text-[10px] font-black px-2 py-0.5 rounded-md tracking-wider uppercase">Unified</span>
              </div>
              <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                India&apos;s Trusted Multi-Labs Platform
              </p>
            </div>
          </a>

          {/* Clean Nav Menus */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-bold text-slate-700">
            <a href="#compare" className="flex items-center space-x-1.5 text-sky-600 hover:text-sky-700 transition-colors">
              <FlaskConical className="w-4 h-4" />
              <span>Compare Labs</span>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">Live</span>
            </a>
            <a href="#packages" className="hover:text-sky-600 transition-colors">Health Packages</a>
            <a href="#compare" className="hover:text-sky-600 transition-colors">Blood Tests</a>
            <a href="#rx" className="flex items-center space-x-1 hover:text-sky-600 transition-colors">
              <UploadCloud className="w-4 h-4 text-indigo-500" />
              <span>Upload Prescription</span>
            </a>
            <a href="#affiliate" className="flex items-center space-x-1 text-slate-600 hover:text-sky-600 transition-colors">
              <Handshake className="w-4 h-4 text-emerald-600" />
              <span>Partner With Us</span>
            </a>
          </nav>

          {/* Customer Only Sign In Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => { setAuthStep('MOBILE'); setIsAuthOpen(true); }}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-bold hover:border-sky-500 hover:text-sky-600 hover:bg-sky-50 transition-all shadow-sm"
            >
              <User className="w-4 h-4 text-sky-600" />
              <span>Patient Sign In</span>
            </button>

            <a
              href="#compare"
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-sm font-extrabold shadow-md shadow-sky-600/20 transition-all"
            >
              Book Test
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-5 pt-3 pb-6 space-y-3 shadow-xl">
            <a href="#compare" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-800 py-1">Compare Labs Live</a>
            <a href="#packages" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-800 py-1">Health Packages</a>
            <a href="#rx" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-800 py-1">Upload Doctor Prescription</a>
            <a href="#affiliate" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-800 py-1">Affiliate Partner Program</a>
            <button
              onClick={() => { setMobileMenuOpen(false); setIsAuthOpen(true); }}
              className="w-full mt-2 py-3 bg-sky-600 text-white rounded-xl text-sm font-bold shadow-md"
            >
              Patient Sign In / Register
            </button>
          </div>
        )}
      </header>

      {/* ================= 3. HERO & MULTI-TEST COMPARATOR ================= */}
      <main className="flex-grow">
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-4 shadow-sm">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>India&apos;s Multi-Lab Diagnostic Aggregator • Save Up to 70%</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Health Checkups at Home. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600">
                Compare Labs. Save Big.
              </span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
              Select multiple blood tests or choose health packages. Compare accredited diagnostic partners instantly to get the highest parameter depth at the most honest price.
            </p>
          </div>

          {/* Multi-Test Search Input */}
          <div className="max-w-3xl mx-auto relative mb-6" id="compare">
            <div className="relative flex items-center bg-white border-2 border-sky-600/40 rounded-2xl shadow-xl shadow-sky-600/10 focus-within:border-sky-600 transition-all p-2">
              <Search className="w-6 h-6 text-sky-600 ml-3 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search and add tests: CBC, Thyroid, HbA1c, Vitamin D, Lipid..."
                className="w-full px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none text-base font-semibold"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600 mr-2">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Dropdown Suggestions */}
            {filteredTests.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-30 overflow-hidden divide-y divide-slate-100">
                {filteredTests.map((test) => (
                  <div
                    key={test.id}
                    onClick={() => toggleTest(test)}
                    className="flex items-center justify-between p-3.5 hover:bg-sky-50 cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{test.name}</span>
                      <div className="text-xs text-slate-500">{test.category} • {test.parametersCount} Parameters Included</div>
                    </div>
                    <span className="text-xs font-bold text-sky-600 bg-sky-100 px-3 py-1 rounded-lg">
                      + Add Test
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Test Chips */}
          <div className="max-w-3xl mx-auto mb-10 flex flex-wrap items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mr-2">Selected Tests:</span>
            {selectedTests.map((test) => (
              <span
                key={test.id}
                className="inline-flex items-center bg-slate-900 text-white text-xs font-semibold pl-3 pr-2 py-1.5 rounded-xl shadow-sm"
              >
                <span>{test.name} ({test.parametersCount} P)</span>
                <button
                  onClick={() => toggleTest(test)}
                  className="ml-2 p-0.5 hover:bg-slate-700 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            {selectedTests.length > 0 && (
              <button
                onClick={() => setSelectedTests([])}
                className="text-xs text-rose-600 font-bold hover:underline ml-2"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Live Comparison Engine Matrix */}
          {selectedTests.length === 0 ? (
            <div className="text-center py-14 border-2 border-dashed border-slate-300 rounded-3xl max-w-2xl mx-auto bg-white">
              <FlaskConical className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-700 font-bold">Please select at least one test above to compare labs.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {labCalculations.map((lab, idx) => {
                const isBestValue = idx === 0; // Highest scored choice
                return (
                  <div 
                    key={lab.labName}
                    className={`relative rounded-3xl p-6 bg-white border transition-all duration-300 flex flex-col justify-between ${
                      isBestValue 
                        ? 'border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-4 ring-emerald-50 scale-102' 
                        : 'border-slate-200 shadow hover:border-sky-300 hover:shadow-lg'
                    }`}
                  >
                    {isBestValue && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-black uppercase tracking-wider py-1 px-4 rounded-full flex items-center shadow-md">
                        <Award className="w-3.5 h-3.5 mr-1" />
                        Best Value Choice
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-800 text-lg border border-slate-200">
                          {lab.labLogo}
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                          {lab.accreditation}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-lg leading-snug mb-1">{lab.labName}</h3>
                      <p className="text-xs text-sky-600 font-semibold mb-4">{lab.badge}</p>

                      <div className="space-y-2.5 border-t border-b border-slate-100 py-3.5 mb-4 text-xs text-slate-700">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Parameters Covered:</span>
                          <span className="font-black text-slate-900">{totalParams} Parameters</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Report Turnaround:</span>
                          <span className="font-bold text-slate-900 flex items-center">
                            <Clock className="w-3 h-3 mr-1 text-slate-400" />
                            Within {lab.reportHours} hrs
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Home Sample Pickup:</span>
                          <span className="font-black text-emerald-600">100% FREE</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-4">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-3xl font-black text-slate-900">₹{lab.finalPrice}</span>
                          <span className="text-sm line-through text-slate-400">₹{lab.mrp}</span>
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {lab.discountPercentage}% OFF
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">Free doorstep collection & verified digital report</p>
                      </div>

                      <button 
                        onClick={() => alert(`Appointment selected for ${lab.labName}! Proceeding to address details.`)}
                        className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 transition-all shadow-md ${
                          isBestValue 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20' 
                            : 'bg-slate-900 hover:bg-sky-600 text-white'
                        }`}
                      >
                        <span>Book with {lab.labLogo}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ================= 4. POPULAR HEALTH PACKAGES ================= */}
        <section className="bg-slate-100/70 border-t border-slate-200/80 py-16 px-4 sm:px-6 lg:px-8" id="packages">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-extrabold text-sky-700 uppercase tracking-widest bg-sky-100 px-3 py-1 rounded-full">Preventive Wellness</span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                Curated Full Body Health Packages
              </h2>
              <p className="text-slate-600 text-sm mt-2">Certified multi-parameter test combinations for individuals and families.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {POPULAR_PACKAGES.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all">
                  <div>
                    <span className="text-[10px] font-extrabold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {pkg.tag}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-3">{pkg.title}</h3>
                    <p className="text-xs text-slate-500 font-semibold mb-4">Includes {pkg.parameters} Vital Tests</p>

                    <div className="space-y-2 border-t border-b border-slate-100 py-4 mb-6">
                      {pkg.features.map((feat, i) => (
                        <div key={i} className="flex items-center text-xs text-slate-700">
                          <Check className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-baseline space-x-2 mb-4">
                      <span className="text-3xl font-black text-slate-900">₹{pkg.price}</span>
                      <span className="text-sm line-through text-slate-400">₹{pkg.mrp}</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        {pkg.discount}
                      </span>
                    </div>

                    <button 
                      onClick={() => alert(`Package ${pkg.title} selected! Proceeding to booking.`)}
                      className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm transition-all"
                    >
                      Book Package
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 5. PRESCRIPTION UPLOAD ASSISTANCE ================= */}
        <section className="bg-white border-t border-slate-200 py-16 px-4 sm:px-6 lg:px-8" id="rx">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-slate-900 to-sky-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-widest bg-sky-950/60 px-3 py-1 rounded-full border border-sky-800">
                Doctor Prescription Support
              </span>
              <h2 className="text-3xl font-black mt-4">Have a Doctor&apos;s Prescription?</h2>
              <p className="text-slate-300 text-sm mt-2">
                Don&apos;t know which tests to choose? Upload your prescription photo. Our medical team will select the right tests and compare labs for you.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-center w-full sm:w-auto">
              <UploadCloud className="w-10 h-10 text-sky-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-200 mb-4">PNG, JPG or PDF up to 10MB</p>
              <button 
                onClick={() => alert('Prescription upload dialog opened')}
                className="px-6 py-3 bg-white text-slate-950 font-bold rounded-xl text-sm shadow hover:bg-slate-100 transition-all"
              >
                Upload Prescription Now
              </button>
            </div>
          </div>
        </section>

        {/* ================= 6. AFFILIATE & PARTNER SECTION ================= */}
        <section id="affiliate" className="bg-slate-50 border-t border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3 shadow-sm">
                <Handshake className="w-4 h-4 text-emerald-600" />
                <span>TestBeat Affiliate & Corporate Partner Network</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Partner With India&apos;s Multi-Lab Platform
              </h2>
              <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto">
                Doctors, Clinics, Sample Collection Centers & Health Influencers: Monetize your patient network with high revenue share and zero hardware costs.
              </p>
            </div>

            {affiliateSubmitted ? (
              <div className="bg-white border-2 border-emerald-500 rounded-3xl p-8 text-center max-w-lg mx-auto shadow-xl">
                <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-2xl font-black text-slate-900">Application Received!</h3>
                <p className="text-xs text-slate-600 mt-2">
                  Our regional onboarding manager will contact you on <span className="font-bold text-slate-900">+91 {affiliateData.phone}</span> within 2 business hours.
                </p>
              </div>
            ) : (
              <form 
                onSubmit={(e) => { e.preventDefault(); setAffiliateSubmitted(true); }}
                className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 max-w-2xl mx-auto shadow-md"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={affiliateData.name}
                      onChange={(e) => setAffiliateData({ ...affiliateData, name: e.target.value })}
                      placeholder="Dr. / Mr. Name" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-sky-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Number</label>
                    <input 
                      type="tel" 
                      maxLength={10} 
                      required 
                      value={affiliateData.phone}
                      onChange={(e) => setAffiliateData({ ...affiliateData, phone: e.target.value.replace(/\D/g, '') })}
                      placeholder="10-digit number" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-sky-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Operating City</label>
                    <input 
                      type="text" 
                      required 
                      value={affiliateData.city}
                      onChange={(e) => setAffiliateData({ ...affiliateData, city: e.target.value })}
                      placeholder="e.g. Delhi, Greater Noida, Patna" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-sky-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Partner Type</label>
                    <select 
                      value={affiliateData.category}
                      onChange={(e) => setAffiliateData({ ...affiliateData, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-sky-600"
                    >
                      <option>Doctor / Clinic</option>
                      <option>Pathology Lab / Sample Center</option>
                      <option>Pharmacy / Medical Store</option>
                      <option>Corporate HR / Hospital Assistant</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-slate-950 hover:bg-sky-600 text-white rounded-xl font-bold text-sm shadow-xl transition-all flex items-center justify-center space-x-2"
                >
                  <span>Submit Partner Application</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* ================= 7. FOOTER ================= */}
      <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white font-black text-sm">
                  TB
                </div>
                <span className="text-xl font-black text-white">Test<span className="text-sky-500">Beat</span></span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                India&apos;s Trusted Multi-Lab Diagnostic Aggregator. Bringing together NABL/CAP certified diagnostic networks to give patients honest pricing, doorstep phlebotomy, and smart digital reports.
              </p>
              <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>NABL & CAP Certified Diagnostic Chains</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Partner Program</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#affiliate" className="text-sky-400 font-bold hover:underline flex items-center space-x-1">
                    <span>★ Affiliate Partner Form</span>
                  </a>
                </li>
                <li><a href="#affiliate" className="hover:text-white">Doctor & Clinic Tie-ups</a></li>
                <li><a href="#affiliate" className="hover:text-white">Sample Collection Franchises</a></li>
                <li><a href="#affiliate" className="hover:text-white">Corporate Wellness Drives</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Contact Support</h4>
              <ul className="space-y-2.5">
                <li className="flex items-center space-x-2">
                  <PhoneCall className="w-4 h-4 text-slate-400" />
                  <span>+91 83688 87011</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Pan-India Diagnostics Network</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
            <p>© 2026 TestBeat Health Platform. All rights reserved.</p>
            <p>Certified Pan-India Diagnostic Aggregator.</p>
          </div>
        </div>
      </footer>

      {/* ================= 8. PATIENT-ONLY AUTH MODAL ================= */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-7 relative border border-slate-100">
            <button
              onClick={() => setIsAuthOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-sky-600 mb-2">
              <UserCheck className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Patient Login Only</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-1">
              {authStep === 'MOBILE' ? 'Access Patient Portal' : 'Verify Mobile OTP'}
            </h3>
            <p className="text-slate-500 text-xs mb-6">
              Track phlebotomist arrival, view PDF reports, and manage family test bookings.
            </p>

            {authStep === 'MOBILE' ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Number</label>
                  <div className="flex items-center border border-slate-300 rounded-xl px-3 py-2.5 focus-within:border-sky-600">
                    <span className="text-slate-500 font-bold text-sm mr-2">+91</span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={patientMobile}
                      onChange={(e) => setPatientMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 10-digit number"
                      className="w-full text-slate-900 font-bold focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <span>{authLoading ? 'Sending OTP...' : 'Send Login OTP'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Enter 6-Digit OTP</label>
                  <div className="flex items-center border border-slate-300 rounded-xl px-3 py-2.5 focus-within:border-sky-600">
                    <Lock className="w-4 h-4 text-slate-400 mr-2" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={patientOtp}
                      onChange={(e) => setPatientOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full text-center text-slate-900 font-black tracking-widest focus:outline-none text-base"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md transition-all"
                >
                  Verify & Enter
                </button>

                <button
                  type="button"
                  onClick={() => setAuthStep('MOBILE')}
                  className="w-full text-center text-xs font-semibold text-slate-500 hover:underline"
                >
                  Change Mobile Number
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
