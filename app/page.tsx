'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
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
  UserCheck
} from 'lucide-react';

// --- DATA: Tests List ---
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
];

const LABS_DATA = [
  {
    labName: 'Thyrocare Technologies',
    labLogo: 'TC',
    accreditation: 'NABL & CAP',
    reportHours: 24,
    basePrice: 1999,
    discountPercentage: 55,
  },
  {
    labName: 'Healthians Network',
    labLogo: 'HN',
    accreditation: 'NABL Certified',
    reportHours: 18,
    basePrice: 2200,
    discountPercentage: 58,
  },
  {
    labName: 'Redcliffe Lifetech',
    labLogo: 'RL',
    accreditation: 'NABL & ISO',
    reportHours: 16,
    basePrice: 2100,
    discountPercentage: 52,
  },
  {
    labName: 'Dr. Lal PathLabs Partner',
    labLogo: 'LP',
    accreditation: 'NABL & CAP Gold',
    reportHours: 12,
    basePrice: 2800,
    discountPercentage: 35,
  }
];

export default function HomePage() {
  // Navigation & Customer Modal States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authStep, setAuthStep] = useState<'MOBILE' | 'OTP'>('MOBILE');
  const [patientMobile, setPatientMobile] = useState('');
  const [patientOtp, setPatientOtp] = useState('');

  // Multi-Test Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTests, setSelectedTests] = useState<TestItem[]>([
    AVAILABLE_TESTS[0], // CBC
    AVAILABLE_TESTS[1]  // Thyroid
  ]);

  // Affiliate Lead State
  const [affiliateSubmitted, setAffiliateSubmitted] = useState(false);

  // Filter test items
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

  // Dynamic pricing & Best Value scoring
  const labCalculations = useMemo(() => {
    return LABS_DATA.map((lab) => {
      const multiplier = Math.max(1, selectedTests.length * 0.75);
      const calculatedMrp = Math.round(lab.basePrice * multiplier);
      const finalPrice = Math.round(calculatedMrp * (1 - lab.discountPercentage / 100));
      const valueScore = (totalParams / (finalPrice || 1)) * 1000;

      return {
        ...lab,
        mrp: calculatedMrp,
        finalPrice,
        valueScore
      };
    }).sort((a, b) => b.valueScore - a.valueScore);
  }, [selectedTests, totalParams]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">

      {/* ================= 1. ALL-INDIA TRUST BAR ================= */}
      <div className="bg-slate-950 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-4 overflow-x-auto text-[11px] sm:text-xs">
            <span className="flex items-center text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> 100% NABL & CAP Accredited Labs
            </span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:flex items-center text-slate-300">
              <Activity className="w-3.5 h-3.5 mr-1 text-sky-400" /> Temperature-Controlled Cold-Chain Logistics
            </span>
            <span className="hidden lg:inline text-slate-600">•</span>
            <span className="flex items-center text-amber-300">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Pan-India Home Sample Pickup
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center text-slate-300">
              <MapPin className="w-3.5 h-3.5 mr-1 text-rose-400" />
              <span className="font-medium">All India (50+ Cities)</span>
            </div>
            <a href="tel:+918368887011" className="flex items-center text-sky-400 font-semibold hover:underline">
              <PhoneCall className="w-3.5 h-3.5 mr-1" /> +91 83688 87011
            </a>
          </div>
        </div>
      </div>

      {/* ================= 2. MAIN HEADER & MENUS ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo & Updated Slogan */}
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-sky-500/20">
              TB
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-2xl font-black tracking-tight text-slate-900">Test<span className="text-sky-600">Beat</span></span>
                <span className="bg-sky-100 text-sky-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase">Unified</span>
              </div>
              <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                India&apos;s Trusted Multi-Lab Platform
              </p>
            </div>
          </div>

          {/* Clean Nav Menus */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-bold text-slate-700">
            <a href="#compare" className="flex items-center space-x-1.5 text-sky-600 hover:text-sky-700">
              <FlaskConical className="w-4 h-4" />
              <span>Compare Labs</span>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">Live</span>
            </a>
            <a href="#compare" className="hover:text-sky-600 transition-colors">Health Packages</a>
            <a href="#compare" className="hover:text-sky-600 transition-colors">Blood Tests</a>
            <a href="#affiliate" className="flex items-center space-x-1 hover:text-sky-600 transition-colors">
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
              className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold shadow-md shadow-sky-600/20 transition-all"
            >
              Book Test Now
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Links */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-5 space-y-3">
            <a href="#compare" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-700 py-1">Compare Labs</a>
            <a href="#compare" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-700 py-1">Health Packages</a>
            <a href="#affiliate" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-700 py-1">Affiliate Partner</a>
            <button
              onClick={() => { setMobileMenuOpen(false); setIsAuthOpen(true); }}
              className="w-full mt-2 py-2.5 bg-sky-600 text-white rounded-xl text-sm font-bold"
            >
              Patient Sign In / Register
            </button>
          </div>
        )}
      </header>

      {/* ================= 3. HERO & MULTI-TEST COMPARISON ENGINE ================= */}
      <main className="flex-grow" id="compare">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          
          {/* Main Hero Headline */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-4">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>India&apos;s Multi-Lab Aggregator • Up to 70% Off</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Health Checkups at Home. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-teal-500">
                Compare Labs. Save Big.
              </span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-4 max-w-2xl mx-auto">
              Select multiple blood tests or full body health packages. Our engine compares accredited diagnostic networks to show you the best price, highest parameter depth, and fastest digital report.
            </p>
          </div>

          {/* Multi-Test Search Bar */}
          <div className="max-w-3xl mx-auto relative mb-6">
            <div className="relative flex items-center bg-white border-2 border-sky-600/50 rounded-2xl shadow-xl shadow-sky-600/10 focus-within:border-sky-600 transition-all p-2">
              <Search className="w-6 h-6 text-sky-600 ml-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type test name: CBC, Thyroid, HbA1c, Vitamin D, Lipid, KFT..."
                className="w-full px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none text-base font-semibold"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600 mr-2">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Dropdown Auto Suggestions */}
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
                    <span className="text-xs font-bold text-sky-600 bg-sky-100 px-2.5 py-1 rounded-lg">
                      + Add
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
                className="inline-flex items-center bg-slate-900 text-white text-xs font-semibold pl-3 pr-2 py-1.5 rounded-lg shadow-sm"
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

          {/* Comparison Cards Matrix */}
          {selectedTests.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-300 rounded-3xl max-w-2xl mx-auto bg-white">
              <FlaskConical className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-700 font-bold">Please select at least one test above to compare labs.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {labCalculations.map((lab, idx) => {
                const isBestValue = idx === 0;
                return (
                  <div 
                    key={lab.labName}
                    className={`relative rounded-3xl p-6 bg-white border transition-all duration-300 flex flex-col justify-between ${
                      isBestValue 
                        ? 'border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-4 ring-emerald-50' 
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
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-800 text-lg border border-slate-200">
                          {lab.labLogo}
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                          {lab.accreditation}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-lg leading-snug mb-1">{lab.labName}</h3>
                      <p className="text-xs text-slate-500 mb-4">Certified Doorstep Collection</p>

                      <div className="space-y-2 border-t border-b border-slate-100 py-3.5 mb-4 text-xs text-slate-700">
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
                          <span className="text-slate-500">Home Pickup:</span>
                          <span className="font-bold text-emerald-600">100% FREE</span>
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
                        <p className="text-[11px] text-slate-400 mt-1">Free sample pickup & digital report</p>
                      </div>

                      <button 
                        onClick={() => alert(`Test package added for ${lab.labName}! Proceeding to appointment.`)}
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
        </div>

        {/* ================= 4. AFFILIATE / PARTNER APPLICATION SECTION ================= */}
        <section id="affiliate" className="bg-white border-t border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
                <Handshake className="w-4 h-4 text-emerald-600" />
                <span>TestBeat Affiliate & Partner Network</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Partner With India&apos;s Multi-Lab Platform
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                Doctors, Clinics, Pathology Centers & Health Marketers: Earn attractive revenue share on every test booking.
              </p>
            </div>

            {affiliateSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center max-w-lg mx-auto">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-xl font-black text-slate-900">Application Submitted!</h3>
                <p className="text-xs text-slate-600 mt-2">
                  Our corporate onboarding team will connect with you within 2 working hours.
                </p>
              </div>
            ) : (
              <form 
                onSubmit={(e) => { e.preventDefault(); setAffiliateSubmitted(true); }}
                className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 max-w-2xl mx-auto shadow-sm"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Full Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Dr. / Mr. Name" 
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-sky-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Number</label>
                    <input 
                      type="tel" 
                      maxLength={10} 
                      required 
                      placeholder="10-digit phone number" 
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-sky-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">City / Region</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Greater Noida, Delhi" 
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-sky-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Partner Type</label>
                    <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-sky-600">
                      <option>Doctor / Clinic</option>
                      <option>Pathology Lab / Sample Center</option>
                      <option>Pharmacy / Medical Store</option>
                      <option>Digital Health Marketer</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-slate-900 hover:bg-sky-600 text-white rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <span>Submit Partner Request</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* ================= 5. FOOTER ================= */}
      <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-black text-sm">
                  TB
                </div>
                <span className="text-xl font-black text-white">Test<span className="text-sky-500">Beat</span></span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                India&apos;s Trusted Multi-Lab Diagnostic Aggregator. Unifying accredited networks (Thyrocare, Healthians, Redcliffe, Dr. Lal) for transparent pricing and cold-chain sample safety.
              </p>
              <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>NABL & CAP Certified Partner Labs</span>
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
                <li><a href="#affiliate" className="hover:text-white">For Doctors & Clinics</a></li>
                <li><a href="#affiliate" className="hover:text-white">Sample Collection Centers</a></li>
                <li><a href="#affiliate" className="hover:text-white">Corporate Health Checkups</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Contact & Support</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <PhoneCall className="w-4 h-4 text-slate-400" />
                  <span>+91 83688 87011</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Pan-India Operations</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
            <p>© 2026 TestBeat Health Platform. All rights reserved.</p>
            <p>Built for pan-India diagnostic accessibility.</p>
          </div>
        </div>
      </footer>

      {/* ================= 6. CUSTOMER ONLY SIGN-IN POPUP ================= */}
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
              <span className="text-xs font-bold uppercase tracking-wider">Patient Login</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-1">
              {authStep === 'MOBILE' ? 'Access Patient Portal' : 'Verify Mobile OTP'}
            </h3>
            <p className="text-slate-500 text-xs mb-6">
              Track phlebotomist arrival, view PDF reports, and manage family test bookings.
            </p>

            {authStep === 'MOBILE' ? (
              <form onSubmit={(e) => { e.preventDefault(); setAuthStep('OTP'); }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Number</label>
                  <div className="flex items-center border border-slate-300 rounded-xl px-3 py-2.5">
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
                  className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <span>Send Login OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); alert('Patient logged in successfully!'); setIsAuthOpen(false); }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Enter 6-Digit OTP</label>
                  <div className="flex items-center border border-slate-300 rounded-xl px-3 py-2.5">
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
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md transition-all"
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
