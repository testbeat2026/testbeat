'use client';

import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  PhoneCall, 
  User, 
  Search, 
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
  Users,
  FileCheck,
  Heart,
  Droplet,
  Zap,
  HelpCircle
} from 'lucide-react';

// Health Risk & Organ Filters (Healthians Style)
const HEALTH_RISKS = [
  { id: 'all', name: 'All Tests', icon: FlaskConical },
  { id: 'full-body', name: 'Full Body', icon: Package },
  { id: 'diabetes', name: 'Diabetes', icon: Droplet },
  { id: 'thyroid', name: 'Thyroid', icon: Zap },
  { id: 'heart', name: 'Heart Care', icon: Heart },
  { id: 'liver', name: 'Liver Health', icon: Activity },
  { id: 'kidney', name: 'Kidney (KFT)', icon: Activity },
  { id: 'vitamins', name: 'Vitamins & Iron', icon: Sparkles }
];

interface TestItem {
  id: string;
  name: string;
  category: string;
  parametersCount: number;
  fastingRequired: boolean;
  sampleType: string;
  description: string;
  mrp: number;
  offerPrice: number;
}

const TESTS_CATALOG: TestItem[] = [
  { id: 't1', name: 'Complete Blood Count (CBC with ESR)', category: 'full-body', parametersCount: 28, fastingRequired: false, sampleType: 'EDTA Blood', description: 'Screening for anemia, platelets, white blood cells & hidden infections.', mrp: 450, offerPrice: 199 },
  { id: 't2', name: 'Thyroid Profile Total (T3, T4, TSH)', category: 'thyroid', parametersCount: 3, fastingRequired: true, sampleType: 'Serum', description: 'Complete evaluation of thyroid hormone balance & metabolic health.', mrp: 650, offerPrice: 249 },
  { id: 't3', name: 'HbA1c Glycated Hemoglobin Test', category: 'diabetes', parametersCount: 2, fastingRequired: false, sampleType: 'Whole Blood', description: 'Gold standard 3-month average blood glucose control marker.', mrp: 550, offerPrice: 249 },
  { id: 't4', name: 'Lipid Profile Comprehensive (Cardiac Risk)', category: 'heart', parametersCount: 8, fastingRequired: true, sampleType: 'Serum', description: 'Measures Good Cholesterol (HDL), Bad Cholesterol (LDL) & Triglycerides.', mrp: 850, offerPrice: 349 },
  { id: 't5', name: 'Liver Function Test (LFT 12 Parameters)', category: 'liver', parametersCount: 12, fastingRequired: false, sampleType: 'Serum', description: 'Screens liver enzymes (SGOT, SGPT), Bilirubin & total protein levels.', mrp: 750, offerPrice: 299 },
  { id: 't6', name: 'Kidney Function Test (KFT with Electrolytes)', category: 'kidney', parametersCount: 11, fastingRequired: false, sampleType: 'Serum', description: 'Checks Kidney filtration, Serum Creatinine, Uric Acid & Electrolytes.', mrp: 950, offerPrice: 349 },
  { id: 't7', name: 'Vitamin D 25-Hydroxy (Bone & Immunity)', category: 'vitamins', parametersCount: 1, fastingRequired: false, sampleType: 'Serum', description: 'Evaluates vitamin D levels for bone density, joint pain & fatigue recovery.', mrp: 1400, offerPrice: 499 },
  { id: 't8', name: 'Vitamin B12 Active (Cyanocobalamin)', category: 'vitamins', parametersCount: 1, fastingRequired: true, sampleType: 'Serum', description: 'Essential for nerve sheath health, brain energy & RBC formation.', mrp: 1100, offerPrice: 449 }
];

// Healthians-Style Multi-Member Packages
const HEALTHIANS_STYLE_PACKAGES = [
  {
    id: 'hp-vital',
    badge: 'Most Popular Across India',
    title: 'Healthy India Comprehensive Checkup Vital',
    parameters: 84,
    fasting: '10-12 hrs Fasting Required',
    reportHours: '12-18 Hours',
    includes: ['Complete Blood Count (CBC 28)', 'Liver Function Test (LFT 12)', 'Kidney Function Test (KFT 11)', 'Lipid Profile (Cholesterol 8)', 'Thyroid Profile (T3, T4, TSH)', 'Urine Routine & Microscopic (18)'],
    singlePrice: 1099,
    singleMrp: 3890,
    twoMembersPrice: 1899,
    twoMembersMrp: 7780,
    perPersonTwoMembers: 949
  },
  {
    id: 'hp-lite',
    badge: 'Recommended for Working Professionals',
    title: 'Healthians Active Wellness & Vitamin Combo',
    parameters: 86,
    fasting: '10-12 hrs Fasting Required',
    reportHours: '18-24 Hours',
    includes: ['Full Body Basic (CBC + LFT + KFT)', 'Vitamin D Total 25-Hydroxy', 'Vitamin B12 Cyanocobalamin', 'HbA1c Diabetic Screen', 'Thyroid Profile Total', 'Free Phlebotomist Visit'],
    singlePrice: 1499,
    singleMrp: 4990,
    twoMembersPrice: 2699,
    twoMembersMrp: 9980,
    perPersonTwoMembers: 1349
  },
  {
    id: 'hp-senior',
    badge: 'Specialized Geriatric Care',
    title: 'Senior Citizen Vital Cardiac & Bone Care',
    parameters: 92,
    fasting: '12 hrs Fasting Required',
    reportHours: '12-18 Hours',
    includes: ['Cardiac Risk Markers + Extended Lipid', 'Bone Mineral Density (Calcium + Vit D)', 'Renal Filtration Rate & Microalbumin', 'Pancreatic Screening + Sugar Fasting', 'Arthritis & Rheumatoid Factor (RA)', 'Senior-Care Certified Phlebotomist'],
    singlePrice: 1899,
    singleMrp: 5990,
    twoMembersPrice: 3299,
    twoMembersMrp: 11980,
    perPersonTwoMembers: 1649
  }
];

// Diagnostic Labs Aggregator Engine
const LAB_COMPARE_DATA = [
  {
    labId: 'thyrocare',
    name: 'Thyrocare Technologies',
    logoCode: 'TC',
    highlight: 'Centralized Robotics Lab',
    accreditation: 'NABL & CAP Certified',
    reportHours: 24,
    baseMultiplier: 1.0,
    discountRate: 58
  },
  {
    labId: 'healthians',
    name: 'Healthians Diagnostics',
    logoCode: 'HN',
    highlight: 'CoolSure 4°C Smart Bag',
    accreditation: 'NABL Accredited',
    reportHours: 18,
    baseMultiplier: 1.05,
    discountRate: 60
  },
  {
    labId: 'redcliffe',
    name: 'Redcliffe Lifetech',
    logoCode: 'RL',
    highlight: 'AI Digital Smart Reports',
    accreditation: 'NABL & ISO Certified',
    reportHours: 16,
    baseMultiplier: 1.02,
    discountRate: 55
  },
  {
    labId: 'drlal',
    name: 'Dr. Lal PathLabs Partner',
    logoCode: 'LP',
    highlight: 'National Reference Quality',
    accreditation: 'NABL & CAP Gold',
    reportHours: 12,
    baseMultiplier: 1.30,
    discountRate: 35
  }
];

export default function HealthiansStyledTestBeatPortal() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeRiskFilter, setActiveRiskFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Multi-Test Selection State
  const [selectedTests, setSelectedTests] = useState<TestItem[]>([
    TESTS_CATALOG[0], // CBC
    TESTS_CATALOG[1], // Thyroid
    TESTS_CATALOG[6]  // Vitamin D
  ]);

  // Customer Auth Modal State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authStep, setAuthStep] = useState<'MOBILE' | 'OTP'>('MOBILE');
  const [patientMobile, setPatientMobile] = useState('');
  const [patientOtp, setPatientOtp] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Affiliate Partner State
  const [affiliateSubmitted, setAffiliateSubmitted] = useState(false);
  const [affiliateData, setAffiliateData] = useState({
    name: '',
    phone: '',
    city: '',
    category: 'Doctor / Clinic'
  });

  // Filter Catalog
  const filteredCatalog = useMemo(() => {
    return TESTS_CATALOG.filter(item => {
      const matchCategory = activeRiskFilter === 'all' || item.category === activeRiskFilter;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeRiskFilter, searchQuery]);

  const toggleTest = (test: TestItem) => {
    if (selectedTests.some(t => t.id === test.id)) {
      setSelectedTests(selectedTests.filter(t => t.id !== test.id));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const totalParams = useMemo(() => {
    return selectedTests.reduce((acc, t) => acc + t.parametersCount, 0);
  }, [selectedTests]);

  // Dynamic Multi-Lab Price Engine
  const labQuotes = useMemo(() => {
    const baseSum = selectedTests.reduce((acc, _) => acc + 480, 0);
    return LAB_COMPARE_DATA.map(lab => {
      const grossMrp = Math.round(baseSum * lab.baseMultiplier * 1.7);
      const discountedNet = Math.round(grossMrp * (1 - lab.discountRate / 100));
      const valueScore = (totalParams / (discountedNet || 1)) * 1000;
      return {
        ...lab,
        mrp: grossMrp,
        finalPrice: discountedNet,
        valueScore
      };
    }).sort((a, b) => b.valueScore - a.valueScore);
  }, [selectedTests, totalParams]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (patientMobile.length !== 10) return alert('Please enter valid 10-digit number');
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-sky-600 selection:text-white">

      {/* 1. TOP PAN-INDIA TRUST & HELPLINE BAR (Healthians Style) */}
      <div className="bg-slate-950 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-4 overflow-x-auto text-[11px] sm:text-xs">
            <span className="flex items-center text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> 100% NABL & CAP Accredited Partner Labs
            </span>
            <span className="hidden md:inline text-slate-700">•</span>
            <span className="hidden md:flex items-center text-slate-300">
              <Activity className="w-3.5 h-3.5 mr-1 text-sky-400" /> Smart Cold-Chain Specimen Logistics (2°C - 8°C)
            </span>
            <span className="hidden lg:inline text-slate-700">•</span>
            <span className="flex items-center text-amber-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Free Sample Collection at Doorstep
            </span>
          </div>

          <div className="flex items-center space-x-5 text-xs">
            <div className="flex items-center text-slate-300 font-medium">
              <MapPin className="w-3.5 h-3.5 mr-1 text-rose-400" />
              <span>Pan-India (50+ Cities)</span>
            </div>
            <a href="tel:+918368887011" className="flex items-center text-sky-400 font-bold hover:underline">
              <PhoneCall className="w-3.5 h-3.5 mr-1" /> +91 83688 87011
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR & HEALTHIANS NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Platform Identity */}
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

          {/* Genuine Diagnostic Navigation */}
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
            <a href="#risks" className="flex items-center space-x-1.5 hover:text-sky-600">
              <Activity className="w-4 h-4 text-slate-400" />
              <span>Tests by Risk</span>
            </a>
            <a href="#rx" className="flex items-center space-x-1.5 text-indigo-600 hover:text-indigo-700">
              <UploadCloud className="w-4 h-4" />
              <span>Upload Prescription</span>
            </a>
            <a href="#affiliate" className="flex items-center space-x-1 text-slate-600 hover:text-emerald-600">
              <Handshake className="w-4 h-4 text-emerald-600" />
              <span>Partner With Us</span>
            </a>
          </nav>

          {/* Customer Profile Authentication */}
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
              Book Home Pickup
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-5 pt-3 pb-6 space-y-3 shadow-xl">
            <a href="#compare" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-800 py-1">Compare Labs Live</a>
            <a href="#packages" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-800 py-1">Health Packages</a>
            <a href="#risks" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-800 py-1">Tests by Health Risk</a>
            <a href="#rx" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-800 py-1">Upload Prescription</a>
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

      {/* 3. HERO & SEARCH SECTION WITH HEALTHIANS LOOK */}
      <section className="bg-gradient-to-b from-sky-50/70 via-white to-slate-50 pt-12 pb-14 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-4 shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>India&apos;s Multi-Lab Diagnostic Network • Save Up to 70%</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Health Checkups at Home. <br />
              <span className="text-sky-600">
                Compare Top Labs. Pay Transparently.
              </span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-4 max-w-2xl mx-auto font-medium">
              Book certified blood tests from Thyrocare, Healthians, Redcliffe & Dr. Lal PathLabs. Enjoy free doorstep sample collection in cold-chain monitored boxes.
            </p>
          </div>

          {/* Main Search Bar */}
          <div className="max-w-2xl mx-auto mt-8 relative">
            <div className="relative flex items-center bg-white border-2 border-slate-200 focus-within:border-sky-600 rounded-2xl p-2.5 shadow-lg shadow-sky-600/5 transition-all">
              <Search className="w-6 h-6 text-sky-600 ml-3 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tests: Full Body, CBC, Vitamin D, HbA1c, Thyroid, Lipid..."
                className="w-full px-3 py-2 text-slate-900 placeholder-slate-400 font-semibold focus:outline-none text-base"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600 mr-2">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics (Healthians Style Trust Badges) */}
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
              <p className="text-xs font-semibold text-slate-500">Digital Smart Reports</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
              <p className="text-2xl font-black text-slate-900">2°C - 8°C</p>
              <p className="text-xs font-semibold text-slate-500">ColdSure Temperature Safety</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HEALTHIANS-STYLE "TESTS BY HEALTH RISKS & ORGANS" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="risks">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-black text-sky-700 bg-sky-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Clinical Specialities
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
            Tests by Health Risks & Organs
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Select an organ category to view individual biomarker test options.</p>
        </div>

        {/* Organ Risk Icons Carousel/Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          {HEALTH_RISKS.map(risk => {
            const Icon = risk.icon;
            const isActive = activeRiskFilter === risk.id;
            return (
              <button
                key={risk.id}
                onClick={() => setActiveRiskFilter(risk.id)}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-600/20' 
                    : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-sky-50/50'
                }`}
              >
                <Icon className={`w-6 h-6 mb-1.5 ${isActive ? 'text-white' : 'text-sky-600'}`} />
                <span className="text-xs font-bold text-center leading-tight">{risk.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selectable Test Cards */}
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
                
                <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-base font-black text-slate-900">₹{test.offerPrice}</span>
                    <span className="text-xs line-through text-slate-400">₹{test.mrp}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {test.parametersCount} Parameters
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Biomarkers Summary Strip */}
        <div className="max-w-4xl mx-auto bg-slate-900 text-white rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center font-bold text-white">
              {selectedTests.length}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-300">Biomarkers Configured</p>
              <p className="text-sm font-extrabold text-white">{totalParams} Total Clinical Parameters Selected</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {selectedTests.length > 0 && (
              <button onClick={() => setSelectedTests([])} className="text-xs text-rose-400 font-bold hover:underline">
                Reset Selection
              </button>
            )}
            <a href="#lab-compare" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1.5 transition-all">
              <span>Compare Diagnostic Labs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* 5. LIVE MULTI-LAB COMPARISON ENGINE (TestBeat Super-Feature) */}
      <section className="bg-white border-t border-b border-slate-200 py-16 px-4 sm:px-6 lg:px-8" id="compare">
        <div className="max-w-7xl mx-auto" id="lab-compare">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
              Real-Time Price Matching
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
              Compare India&apos;s Top Labs Side-by-Side
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Our engine highlights the &quot;Best Value Choice&quot; based on parameter coverage and certified lab pricing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {labQuotes.map((lab, index) => {
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
                        {lab.logoCode}
                      </div>
                      <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                        {lab.accreditation}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-base leading-snug">{lab.name}</h4>
                    <p className="text-xs text-sky-600 font-semibold mb-4">{lab.highlight}</p>

                    <div className="space-y-2 border-t border-b border-slate-100 py-3.5 mb-4 text-xs">
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-slate-500">Parameters:</span>
                        <span className="font-black text-slate-900">{totalParams} Tests</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-slate-500">Report In:</span>
                        <span className="font-bold text-slate-900 flex items-center">
                          <Clock className="w-3 h-3 mr-1 text-slate-400" />
                          Within {lab.reportHours} Hrs
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-slate-500">Sample Collection:</span>
                        <span className="font-black text-emerald-600">100% FREE</span>
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
                      <p className="text-[10px] text-slate-400 mt-1">Free doorstep pickup & verified digital report</p>
                    </div>

                    <button
                      onClick={() => alert(`Appointment booked for ${lab.name}! Proceeding to slot selection.`)}
                      className={`w-full py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md ${
                        isBestValue
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-slate-900 hover:bg-sky-600 text-white'
                      }`}
                    >
                      <span>Book with {lab.logoCode}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. HEALTHIANS SIGNATURE: FULL BODY PACKAGES WITH MEMBER PRICING */}
      <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200" id="packages">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-sky-700 uppercase tracking-widest bg-sky-100 px-3 py-1 rounded-full">
              Full Body Preventive Checkups
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              Popular Health Packages (Save with Family Members)
            </h2>
            <p className="text-slate-600 text-sm mt-2">Comprehensive health checkups covering vital organs, vitamins, diabetes, and kidney wellness.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HEALTHIANS_STYLE_PACKAGES.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all">
                <div>
                  <span className="text-[10px] font-black text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {pkg.badge}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-3">{pkg.title}</h3>
                  
                  <div className="flex items-center space-x-2 text-xs text-slate-500 font-semibold mt-1 mb-4">
                    <span className="text-sky-600 font-bold">{pkg.parameters} Tests Included</span>
                    <span>•</span>
                    <span>{pkg.fasting}</span>
                  </div>

                  <div className="space-y-2 border-t border-b border-slate-100 py-4 mb-6">
                    {pkg.includes.map((feature, i) => (
                      <div key={i} className="flex items-center text-xs text-slate-700">
                        <Check className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Healthians-Style 2-Member Slabs */}
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3 mb-6">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1 font-bold text-emerald-900">
                        <Users className="w-4 h-4 text-emerald-600" />
                        <span>Book for 2 Members:</span>
                      </div>
                      <span className="font-black text-emerald-700">₹{pkg.perPersonTwoMembers}/person</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 mt-0.5">Total ₹{pkg.twoMembersPrice} (Save ₹{pkg.twoMembersMrp - pkg.twoMembersPrice})</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline space-x-2 mb-4">
                    <span className="text-3xl font-black text-slate-900">₹{pkg.singlePrice}</span>
                    <span className="text-sm line-through text-slate-400">₹{pkg.singleMrp}</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      70% OFF
                    </span>
                  </div>

                  <button 
                    onClick={() => alert(`Package ${pkg.title} selected! Proceeding to booking.`)}
                    className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm transition-all"
                  >
                    Book for 1 or 2 Members
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. UPLOAD PRESCRIPTION ASSISTANCE BANNER */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200" id="rx">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-slate-900 to-sky-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              Prescription Direct Desk
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

      {/* 8. AFFILIATE / B2B PARTNER NETWORK */}
      <section id="affiliate" className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
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

      {/* 9. MEDICAL FOOTER */}
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
                <li><a href="#rx" className="hover:text-white">Prescription Direct Desk</a></li>
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

      {/* 10. CUSTOMER-ONLY OTP AUTH MODAL */}
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
