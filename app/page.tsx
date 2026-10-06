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
  UploadCloud, 
  Microscope, 
  ChevronRight,
  Package,
  CalendarCheck
} from 'lucide-react';

interface TestItem {
  id: string;
  name: string;
  category: 'Full Body' | 'Diabetes' | 'Thyroid' | 'Heart' | 'Liver' | 'Kidney' | 'Vitamins';
  parametersCount: number;
  fastingRequired: boolean;
  sampleType: string;
  description: string;
}

const AVAILABLE_TESTS: TestItem[] = [
  { id: 't1', name: 'Complete Blood Count (CBC with 28 Parameters)', category: 'Full Body', parametersCount: 28, fastingRequired: false, sampleType: 'EDTA Whole Blood', description: 'Evaluates hemoglobin, platelets, WBC count, and detects latent infections.' },
  { id: 't2', name: 'Thyroid Profile Total (T3, T4, TSH)', category: 'Thyroid', parametersCount: 3, fastingRequired: true, sampleType: 'Serum', description: 'Gold-standard screening for thyroid gland activity and metabolic regulation.' },
  { id: 't3', name: 'HbA1c with Estimated Average Glucose (eAG)', category: 'Diabetes', parametersCount: 2, fastingRequired: false, sampleType: 'Whole Blood', description: '3-month average blood glucose control marker.' },
  { id: 't4', name: 'Lipid Profile Comprehensive (Cardiovascular Risk)', category: 'Heart', parametersCount: 8, fastingRequired: true, sampleType: 'Serum', description: 'Total Cholesterol, HDL, LDL, VLDL, and Triglycerides levels.' },
  { id: 't5', name: 'Liver Function Test (LFT with 12 Enzymes)', category: 'Liver', parametersCount: 12, fastingRequired: false, sampleType: 'Serum', description: 'Evaluates liver health via SGOT, SGPT, Bilirubin, and Proteins.' },
  { id: 't6', name: 'Kidney Function Test (KFT with Electrolytes)', category: 'Kidney', parametersCount: 11, fastingRequired: false, sampleType: 'Serum', description: 'Serum Creatinine, Blood Urea, Uric Acid, Sodium, and Potassium.' },
  { id: 't7', name: 'Vitamin D 25-Hydroxy (Bone & Defense)', category: 'Vitamins', parametersCount: 1, fastingRequired: false, sampleType: 'Serum', description: 'Immunity status, bone calcium density, and chronic fatigue indicator.' },
  { id: 't8', name: 'Vitamin B12 (Active Cyanocobalamin)', category: 'Vitamins', parametersCount: 1, fastingRequired: true, sampleType: 'Serum', description: 'Crucial for nerve health, brain function, and red blood cell production.' }
];

const CURATED_PACKAGES = [
  {
    id: 'pkg-fullbody',
    title: 'Full Body Wellness Comprehensive',
    subtitle: 'NABL Certified Complete Checkup',
    parameters: 84,
    mrp: 3999,
    price: 1199,
    discount: '70% OFF',
    features: ['CBC, LFT, KFT, Lipid Profile', 'Thyroid Profile (T3, T4, TSH)', 'Urine Routine & Glucose', 'Free Cold-Chain Home Pickup']
  },
  {
    id: 'pkg-senior',
    title: 'Senior Citizen Vital Care Package',
    subtitle: 'Specialized Geriatric Health Profile',
    parameters: 92,
    mrp: 4999,
    price: 1699,
    discount: '66% OFF',
    features: ['Cardiac Risk Markers & Extended LFT', 'Bone Health (Vitamin D & Calcium)', 'Kidney Function & Electrolytes', 'Guaranteed 18-Hour Report']
  },
  {
    id: 'pkg-diab-cardio',
    title: 'Diabetes & Heart Shield Checkup',
    subtitle: 'Metabolic & Cardiovascular Health',
    parameters: 68,
    mrp: 2999,
    price: 899,
    discount: '70% OFF',
    features: ['HbA1c + Fasting Blood Sugar', 'Lipid Profile (Cholesterol & Triglycerides)', 'Renal Function Screening', 'Doctor Summary on WhatsApp']
  }
];

const LAB_CHAINS = [
  {
    labId: 'thyrocare',
    labName: 'Thyrocare Technologies',
    shortCode: 'TC',
    badge: 'Centralized Robotics Processing',
    accreditation: 'NABL & CAP Certified',
    reportHours: 24,
    baseRateMultiplier: 1.0,
    discountRate: 58,
    techHighlight: 'Barcoded Vacutainer Tubes'
  },
  {
    labId: 'healthians',
    labName: 'Healthians Network',
    shortCode: 'HN',
    badge: 'Smart Digital Cold-Chain',
    accreditation: 'NABL Accredited',
    reportHours: 18,
    baseRateMultiplier: 1.08,
    discountRate: 60,
    techHighlight: 'Live Temp Monitored Gel-Kit'
  },
  {
    labId: 'redcliffe',
    labName: 'Redcliffe Lifetech',
    shortCode: 'RL',
    badge: 'AI Smart Health Report',
    accreditation: 'NABL & ISO Certified',
    reportHours: 16,
    baseRateMultiplier: 1.05,
    discountRate: 55,
    techHighlight: 'Dual-Verified Medical Analytics'
  },
  {
    labId: 'drlal',
    labName: 'Dr. Lal PathLabs Partner',
    shortCode: 'LP',
    badge: 'National Reference Standard',
    accreditation: 'NABL & CAP Gold',
    reportHours: 12,
    baseRateMultiplier: 1.35,
    discountRate: 35,
    techHighlight: 'Regional Diagnostic Center'
  }
];

export default function TestBeatProductionPlatform() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Patient Auth Modal States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authStep, setAuthStep] = useState<'MOBILE' | 'OTP'>('MOBILE');
  const [patientMobile, setPatientMobile] = useState('');
  const [patientOtp, setPatientOtp] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Test Selection Engine
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTests, setSelectedTests] = useState<TestItem[]>([
    AVAILABLE_TESTS[0], // CBC
    AVAILABLE_TESTS[1], // Thyroid
    AVAILABLE_TESTS[6]  // Vitamin D
  ]);

  // Affiliate Partner Form State
  const [affiliateData, setAffiliateData] = useState({
    name: '',
    phone: '',
    city: '',
    category: 'Doctor / Clinic',
  });
  const [affiliateSubmitted, setAffiliateSubmitted] = useState(false);

  // Filter Catalog
  const filteredCatalog = useMemo(() => {
    return AVAILABLE_TESTS.filter(item => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleTest = (test: TestItem) => {
    if (selectedTests.some(t => t.id === test.id)) {
      setSelectedTests(selectedTests.filter(t => t.id !== test.id));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const totalSelectedParameters = useMemo(() => {
    return selectedTests.reduce((acc, t) => acc + t.parametersCount, 0);
  }, [selectedTests]);

  // Real-time Value Calculation Engine
  const calculatedLabQuotes = useMemo(() => {
    const baseAggregatedCost = selectedTests.reduce((acc) => acc + 480, 0);

    return LAB_CHAINS.map(lab => {
      const grossMrp = Math.round(baseAggregatedCost * lab.baseRateMultiplier * 1.7);
      const discountedNet = Math.round(grossMrp * (1 - lab.discountRate / 100));
      const valueMetric = (totalSelectedParameters / (discountedNet || 1)) * 1000;

      return {
        ...lab,
        mrp: grossMrp,
        finalPrice: discountedNet,
        valueMetric
      };
    }).sort((a, b) => b.valueMetric - a.valueMetric);
  }, [selectedTests, totalSelectedParameters]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (patientMobile.length !== 10) return alert('Please enter 10-digit mobile number');
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setAuthStep('OTP');
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (patientOtp.length < 4) return alert('Enter valid OTP');
    alert(`Logged in to Patient Portal! Welcome +91 ${patientMobile}`);
    setIsAuthOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 selection:bg-sky-600 selection:text-white">
      
      {/* 1. PAN-INDIA ACCREDITATION & TRUST STRIP */}
      <div className="bg-slate-950 text-slate-200 text-xs py-2.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-4 overflow-x-auto text-[11px] sm:text-xs">
            <span className="flex items-center text-emerald-400 font-semibold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> 100% NABL & CAP Accredited Laboratory Network
            </span>
            <span className="hidden md:inline text-slate-700">•</span>
            <span className="hidden md:flex items-center text-slate-300">
              <Activity className="w-3.5 h-3.5 mr-1 text-sky-400" /> Cold-Chain Specimen Logistics (2°C - 8°C)
            </span>
            <span className="hidden lg:inline text-slate-700">•</span>
            <span className="flex items-center text-amber-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Smart Barcoded Collection at Home
            </span>
          </div>

          <div className="flex items-center space-x-5 text-xs">
            <div className="flex items-center text-slate-300 font-medium">
              <MapPin className="w-3.5 h-3.5 mr-1 text-rose-400" />
              <span>Pan-India Coverage (50+ Cities)</span>
            </div>
            <a href="tel:+918368887011" className="flex items-center text-sky-400 font-bold hover:underline">
              <PhoneCall className="w-3.5 h-3.5 mr-1" /> +91 83688 87011
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER & FOCUSED MEDICAL MENUS */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Updated Slogan */}
          <a href="#" className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-sky-500/20">
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

          {/* Genuine Diagnostic Navigation Menus */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-bold text-slate-700">
            <a href="#compare" className="flex items-center space-x-1.5 text-sky-600 hover:text-sky-700">
              <FlaskConical className="w-4 h-4" />
              <span>Compare Labs</span>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-1.5 py-0.5 rounded-full">Live</span>
            </a>
            <a href="#packages" className="flex items-center space-x-1.5 hover:text-sky-600">
              <Package className="w-4 h-4 text-slate-400" />
              <span>Health Packages</span>
            </a>
            <a href="#compare" className="flex items-center space-x-1.5 hover:text-sky-600">
              <Microscope className="w-4 h-4 text-slate-400" />
              <span>Blood Tests</span>
            </a>
            <a href="#prescription" className="flex items-center space-x-1.5 text-indigo-600 hover:text-indigo-700">
              <UploadCloud className="w-4 h-4" />
              <span>Upload Prescription</span>
            </a>
            <a href="#affiliate" className="flex items-center space-x-1 text-slate-600 hover:text-emerald-600">
              <Handshake className="w-4 h-4 text-emerald-600" />
              <span>Partner With Us</span>
            </a>
          </nav>

          {/* Dedicated Customer Profile Login */}
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
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold shadow-md shadow-sky-600/20 transition-all"
            >
              Book Home Collection
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-5 pt-3 pb-6 space-y-3 shadow-xl">
            <a href="#compare" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-800 py-1">Compare Labs Live</a>
            <a href="#packages" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-800 py-1">Health Packages</a>
            <a href="#prescription" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-800 py-1">Upload Prescription</a>
            <a href="#affiliate" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-800 py-1">Partner With Us</a>
            <button
              onClick={() => { setMobileMenuOpen(false); setIsAuthOpen(true); }}
              className="w-full mt-2 py-3 bg-sky-600 text-white rounded-xl text-sm font-bold shadow-md"
            >
              Patient Sign In / Register
            </button>
          </div>
        )}
      </header>

      {/* 3. HERO SECTION */}
      <section className="bg-gradient-to-b from-sky-50 to-white pt-12 pb-14 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-4">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>India&apos;s Multi-Lab Diagnostic Aggregator • Up to 70% Savings</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              One Blood Sample. <br />
              <span className="text-sky-600">
                India&apos;s Top Diagnostic Labs Compared.
              </span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-4 max-w-2xl mx-auto font-medium">
              Select multiple blood tests or full body health packages. Compare accredited diagnostic partners instantly to get the highest parameter depth at the most honest price.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-10">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
              <p className="text-2xl font-black text-slate-900">100%</p>
              <p className="text-xs font-semibold text-slate-500">NABL & CAP Certified</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
              <p className="text-2xl font-black text-sky-600">₹0 Fee</p>
              <p className="text-xs font-semibold text-slate-500">Free Home Sample Pickup</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
              <p className="text-2xl font-black text-emerald-600">12 - 24 Hrs</p>
              <p className="text-xs font-semibold text-slate-500">Digital Report Turnaround</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
              <p className="text-2xl font-black text-slate-900">4°C Monitored</p>
              <p className="text-xs font-semibold text-slate-500">Cold-Chain Specimen Vials</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MULTI-TEST SEARCH & LAB COMPARISON ENGINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" id="compare">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-black text-sky-700 bg-sky-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Biomarker Search Engine
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-2">Select Your Tests or Organ Panels</h2>
          <p className="text-slate-500 text-sm mt-1">Select one or more tests below to automatically calculate multi-lab prices.</p>
        </div>

        {/* Organ / Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {['All', 'Full Body', 'Heart', 'Diabetes', 'Thyroid', 'Liver', 'Kidney', 'Vitamins'].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                selectedCategory === category
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-sky-400'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 relative">
          <div className="relative flex items-center bg-white border-2 border-slate-200 focus-within:border-sky-600 rounded-2xl p-2 shadow-sm">
            <Search className="w-5 h-5 text-sky-600 ml-3 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tests: CBC, Vitamin D, HbA1c, Liver, Lipid..."
              className="w-full px-3 py-2 text-slate-900 placeholder-slate-400 font-semibold focus:outline-none text-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600 mr-2">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Selectable Test Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {filteredCatalog.map(test => {
            const isSelected = selectedTests.some(t => t.id === test.id);
            return (
              <div
                key={test.id}
                onClick={() => toggleTest(test)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-sky-50 border-sky-600 shadow-md ring-2 ring-sky-600'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                      {test.category}
                    </span>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${isSelected ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300 bg-white'}`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{test.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{test.description}</p>
                </div>
                
                <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>{test.parametersCount} Parameters</span>
                  <span>{test.fastingRequired ? '10-12 Hr Fasting' : 'No Fasting'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Test Summary Bar */}
        <div className="max-w-4xl mx-auto bg-slate-900 text-white rounded-2xl p-4 mb-14 shadow-lg flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center font-bold text-white">
              {selectedTests.length}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-300">Biomarkers Configured</p>
              <p className="text-sm font-extrabold text-white">{totalSelectedParameters} Total Parameters Selected</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {selectedTests.length > 0 && (
              <button onClick={() => setSelectedTests([])} className="text-xs text-rose-400 font-bold hover:underline">
                Reset Selection
              </button>
            )}
            <a href="#lab-matrix" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1.5 transition-all">
              <span>View Lab Comparison</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Comparative Quotations Cards */}
        <div id="lab-matrix" className="pt-4">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
              Step 2: Real-Time Comparative Quotations
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Select Your Preferred Diagnostic Partner
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Our algorithm calculates the best value lab based on parameter coverage and honest pricing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {calculatedLabQuotes.map((lab, index) => {
              const isBestValue = index === 0;
              return (
                <div
                  key={lab.labId}
                  className={`bg-white rounded-3xl p-6 border flex flex-col justify-between transition-all relative ${
                    isBestValue
                      ? 'border-2 border-emerald-500 shadow-xl ring-4 ring-emerald-50'
                      : 'border-slate-200 shadow hover:shadow-lg'
                  }`}
                >
                  {isBestValue && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-black uppercase tracking-wider py-1 px-3.5 rounded-full flex items-center shadow-md">
                      <Award className="w-3.5 h-3.5 mr-1" />
                      Best Value Choice
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-800 text-lg">
                        {lab.shortCode}
                      </div>
                      <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                        {lab.accreditation}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-base leading-snug">{lab.labName}</h4>
                    <p className="text-xs text-sky-600 font-semibold mb-4">{lab.badge}</p>

                    <div className="space-y-2 border-t border-b border-slate-100 py-3.5 mb-4 text-xs">
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-slate-500">Parameters:</span>
                        <span className="font-black text-slate-900">{totalSelectedParameters} Tests</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-slate-500">Report In:</span>
                        <span className="font-bold text-slate-900 flex items-center">
                          <Clock className="w-3 h-3 mr-1 text-slate-400" />
                          Within {lab.reportHours} Hrs
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-slate-500">Packaging:</span>
                        <span className="font-semibold text-slate-900">{lab.techHighlight}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-slate-500">Doorstep Collection:</span>
                        <span className="font-black text-emerald-600">FREE</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-4">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-slate-900">₹{lab.finalPrice}</span>
                        <span className="text-xs line-through text-slate-400">₹{lab.mrp}</span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {lab.discountRate}% OFF
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Free home pickup & verified digital report</p>
                    </div>

                    <button
                      onClick={() => alert(`Appointment initiated with ${lab.labName}.`)}
                      className={`w-full py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md ${
                        isBestValue
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-slate-900 hover:bg-sky-600 text-white'
                      }`}
                    >
                      <span>Book with {lab.shortCode}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. POPULAR HEALTH PACKAGES SECTION */}
      <section className="bg-slate-100/70 border-t border-slate-200/80 py-16 px-4 sm:px-6 lg:px-8" id="packages">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-sky-700 uppercase tracking-widest bg-sky-100 px-3 py-1 rounded-full">
              Full Body Screening
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              Curated Preventive Health Packages
            </h2>
            <p className="text-slate-600 text-sm mt-2">Comprehensive health checkup plans designed for families, working professionals, and seniors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CURATED_PACKAGES.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all">
                <div>
                  <span className="text-[10px] font-black text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {pkg.subtitle}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-3">{pkg.title}</h3>
                  <p className="text-xs text-slate-500 font-semibold mb-4">Includes {pkg.parameters} Vital Biomarkers</p>

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
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {pkg.discount}
                    </span>
                  </div>

                  <button 
                    onClick={() => alert(`Package ${pkg.title} selected! Proceeding to slot selection.`)}
                    className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm transition-all"
                  >
                    Book Package Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. UPLOAD PRESCRIPTION ASSISTANCE */}
      <section className="bg-white border-t border-slate-200 py-16 px-4 sm:px-6 lg:px-8" id="prescription">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-slate-900 to-sky-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              Prescription Assistance
            </span>
            <h2 className="text-3xl font-black mt-4">Have a Doctor&apos;s Prescription?</h2>
            <p className="text-slate-300 text-sm mt-2">
              Don&apos;t know which tests to choose? Upload your doctor&apos;s prescription slip. Our clinical coordinator will extract the tests and match the best lab rates for you.
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

      {/* 7. AFFILIATE / PARTNER NETWORK SECTION */}
      <section id="affiliate" className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3 shadow-sm">
              <Handshake className="w-4 h-4 text-emerald-600" />
              <span>TestBeat B2B & Affiliate Partner Program</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Partner With India&apos;s Multi-Lab Diagnostic Network
            </h2>
            <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto">
              Clinics, General Physicians, Medical Stores & Digital Affiliates: Monetize diagnostic bookings with transparent tracking and high partner revenue sharing.
            </p>
          </div>

          {affiliateSubmitted ? (
            <div className="bg-white border-2 border-emerald-500 rounded-3xl p-8 text-center max-w-lg mx-auto shadow-xl">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto mb-3" />
              <h3 className="text-2xl font-black text-slate-900">Application Registered!</h3>
              <p className="text-xs text-slate-600 mt-2">
                Our partnership executive will call you on <span className="font-bold text-slate-900">+91 {affiliateData.phone}</span> within 2 business hours.
              </p>
            </div>
          ) : (
            <form 
              onSubmit={(e) => { e.preventDefault(); setAffiliateSubmitted(true); }}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 max-w-2xl mx-auto shadow-md"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name / Clinic Name</label>
                  <input 
                    type="text" 
                    required 
                    value={affiliateData.name}
                    onChange={(e) => setAffiliateData({ ...affiliateData, name: e.target.value })}
                    placeholder="Dr. / Clinic Name" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-sky-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Contact</label>
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
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">City of Operation</label>
                  <input 
                    type="text" 
                    required 
                    value={affiliateData.city}
                    onChange={(e) => setAffiliateData({ ...affiliateData, city: e.target.value })}
                    placeholder="e.g. Greater Noida, Delhi, Lucknow" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-sky-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Affiliate Type</label>
                  <select 
                    value={affiliateData.category}
                    onChange={(e) => setAffiliateData({ ...affiliateData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-sky-600"
                  >
                    <option>Doctor / Private Clinic</option>
                    <option>Local Collection Centre / Pathology Lab</option>
                    <option>Pharmacy / Medical Chemist</option>
                    <option>Digital Health Influencer / Web Partner</option>
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

      {/* 8. FOOTER */}
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
                India&apos;s Trusted Multi-Lab Diagnostic Aggregator. Unifying accredited diagnostic chains (Thyrocare, Healthians, Redcliffe, Dr. Lal PathLabs) for transparent pricing, certified cold-chain logistics, and digital reports.
              </p>
              <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>NABL & CAP Certified Partner Laboratories</span>
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
                <li><a href="#affiliate" className="hover:text-white">Doctor & Clinic Integrations</a></li>
                <li><a href="#affiliate" className="hover:text-white">Franchise Collection Points</a></li>
                <li><a href="#prescription" className="hover:text-white">Prescription Direct Desk</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Diagnostic Support</h4>
              <ul className="space-y-2.5">
                <li className="flex items-center space-x-2">
                  <PhoneCall className="w-4 h-4 text-slate-400" />
                  <span>+91 83688 87011</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Pan-India Diagnostics Hub</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
            <p>© 2026 TestBeat Health Technologies Pvt Ltd. All rights reserved.</p>
            <p>Pan-India Medical Diagnostic Platform.</p>
          </div>
        </div>
      </footer>

      {/* 9. PATIENT-ONLY AUTH MODAL */}
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
              <span className="text-xs font-bold uppercase tracking-wider">Patient Portal Login</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-1">
              {authStep === 'MOBILE' ? 'Access Health Records' : 'Verify Mobile OTP'}
            </h3>
            <p className="text-slate-500 text-xs mb-6">
              Track phlebotomist home arrival, view smart PDF lab reports, and manage family profiles.
            </p>

            {authStep === 'MOBILE' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Patient Mobile Number</label>
                  <div className="flex items-center border border-slate-300 rounded-xl px-3 py-2.5 focus-within:border-sky-600">
                    <span className="text-slate-500 font-bold text-sm mr-2">+91</span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={patientMobile}
                      onChange={(e) => setPatientMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit mobile number"
                      className="w-full text-slate-900 font-bold focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <span>{authLoading ? 'Sending SMS OTP...' : 'Send Login OTP'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Enter 6-Digit SMS Code</label>
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
                  Verify & Enter Portal
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
