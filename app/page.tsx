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
  CheckCircle2, 
  Lock, 
  UploadCloud, 
  Microscope, 
  ChevronRight, 
  Package, 
  Users, 
  Heart, 
  Droplet, 
  Zap, 
  Camera,
  Star,
  MessageCircle,
  FileCheck2,
  Building2,
  ShoppingCart,
  Check
} from 'lucide-react';

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

const EXTENDED_TESTS_CATALOG: TestItem[] = [
  { id: 't1', name: 'Complete Blood Count (CBC with ESR - 28 Params)', category: 'Full Body', parametersCount: 28, fastingRequired: false, sampleType: 'EDTA Blood', description: 'Screening for anemia, platelets, white blood cells & latent infections.', mrp: 450, offerPrice: 199 },
  { id: 't2', name: 'Thyroid Profile Total (T3, T4, TSH)', category: 'Thyroid', parametersCount: 3, fastingRequired: true, sampleType: 'Serum', description: 'Gold standard test for thyroid gland hormone synthesis and metabolism.', mrp: 650, offerPrice: 249 },
  { id: 't3', name: 'HbA1c Glycated Hemoglobin Test', category: 'Diabetes', parametersCount: 2, fastingRequired: false, sampleType: 'Whole Blood', description: 'Evaluates 3-month average blood glucose control with eAG values.', mrp: 550, offerPrice: 249 },
  { id: 't4', name: 'Lipid Profile Comprehensive (Cardiovascular Risk)', category: 'Heart', parametersCount: 8, fastingRequired: true, sampleType: 'Serum', description: 'HDL, LDL, VLDL, Total Cholesterol and Triglycerides ratio.', mrp: 850, offerPrice: 349 },
  { id: 't5', name: 'Liver Function Test (LFT 12 Parameters)', category: 'Liver', parametersCount: 12, fastingRequired: false, sampleType: 'Serum', description: 'Checks liver enzymes (SGOT, SGPT), Bilirubin & total protein levels.', mrp: 750, offerPrice: 299 },
  { id: 't6', name: 'Kidney Function Test (KFT with Electrolytes)', category: 'Kidney', parametersCount: 11, fastingRequired: false, sampleType: 'Serum', description: 'Screens Renal clearance, Serum Creatinine, Uric Acid & Electrolytes.', mrp: 950, offerPrice: 349 },
  { id: 't7', name: 'Vitamin D 25-Hydroxy (Bone & Immunity)', category: 'Vitamins', parametersCount: 1, fastingRequired: false, sampleType: 'Serum', description: 'Detects vitamin D deficiency causing joint fatigue and weak bone density.', mrp: 1400, offerPrice: 499 },
  { id: 't8', name: 'Vitamin B12 Active (Cyanocobalamin)', category: 'Vitamins', parametersCount: 1, fastingRequired: true, sampleType: 'Serum', description: 'Critical biomarker for nerve function, neurological health & energy levels.', mrp: 1100, offerPrice: 449 },
  { id: 't9', name: 'Fasting Blood Sugar (FBS / Glucose Fasting)', category: 'Diabetes', parametersCount: 1, fastingRequired: true, sampleType: 'Fluoride Plasma', description: 'Standard glucose screen for type 1 and type 2 diabetes evaluation.', mrp: 150, offerPrice: 69 },
  { id: 't10', name: 'Urine Routine & Microscopic Examination (Urine R/M)', category: 'Routine', parametersCount: 18, fastingRequired: false, sampleType: 'Mid-stream Urine', description: 'Evaluates urinary tract infection (UTI), kidney health & protein leak.', mrp: 300, offerPrice: 120 },
  { id: 't11', name: 'Serum Creatinine & eGFR Calculation', category: 'Kidney', parametersCount: 2, fastingRequired: false, sampleType: 'Serum', description: 'Precise measurement of kidney filtration and muscle metabolite breakdown.', mrp: 280, offerPrice: 119 },
  { id: 't12', name: 'Serum Uric Acid (Gout & Joint Screening)', category: 'Joints', parametersCount: 1, fastingRequired: false, sampleType: 'Serum', description: 'High levels indicate gouty arthritis and renal stone formation risks.', mrp: 260, offerPrice: 110 },
  { id: 't13', name: 'Iron Deficiency Profile (Iron, TIBC, Ferritin)', category: 'Anemia', parametersCount: 4, fastingRequired: true, sampleType: 'Serum', description: 'Evaluates cellular iron stores and uncovers microcytic anemia causes.', mrp: 1200, offerPrice: 599 },
  { id: 't14', name: 'Serum Calcium Total with Albumin Corrected', category: 'Bone', parametersCount: 2, fastingRequired: false, sampleType: 'Serum', description: 'Essential for neuromuscular transmission, heart rhythm & bone strength.', mrp: 320, offerPrice: 149 },
  { id: 't15', name: 'Total IgE Antibody (Allergy Comprehensive)', category: 'Allergy', parametersCount: 1, fastingRequired: false, sampleType: 'Serum', description: 'Measures generalized allergic response, asthma triggers and skin rashes.', mrp: 900, offerPrice: 499 },
  { id: 't16', name: 'hs-CRP (High-Sensitivity C-Reactive Protein)', category: 'Heart', parametersCount: 1, fastingRequired: false, sampleType: 'Serum', description: 'Ultra-sensitive inflammation marker predicting cardiovascular attack risk.', mrp: 850, offerPrice: 399 }
];

const PACKAGES_LIST = [
  {
    id: 'pkg-vital',
    badge: 'Popular • Best Seller',
    title: 'TestBeat Smart Full Body Checkup (Vital)',
    parameters: 84,
    fasting: '10-12 hrs Fasting',
    reportHours: '12-16 Hours',
    includes: ['Complete Blood Count (CBC 28)', 'Liver Function Test (LFT 12)', 'Kidney Function Test (KFT 11)', 'Lipid Profile Extended (8)', 'Thyroid Profile (T3, T4, TSH)', 'Urine Routine & Microscopic (18)'],
    singlePrice: 1099,
    singleMrp: 3890,
    twoMembersPrice: 1899,
    twoMembersMrp: 7780,
    perPersonTwoMembers: 949
  },
  {
    id: 'pkg-prime',
    badge: 'Comprehensive • With Vitamins',
    title: 'Executive Full Body Health Screen + Vitamin Duo',
    parameters: 86,
    fasting: '10-12 hrs Fasting',
    reportHours: '16-20 Hours',
    includes: ['Full Body Basic (CBC + LFT + KFT)', 'Vitamin D Total 25-Hydroxy', 'Vitamin B12 Cyanocobalamin', 'HbA1c Diabetic Screen', 'Thyroid Profile Total', 'Free Temperature-Safe Home Pickup'],
    singlePrice: 1499,
    singleMrp: 4990,
    twoMembersPrice: 2699,
    twoMembersMrp: 9980,
    perPersonTwoMembers: 1349
  },
  {
    id: 'pkg-senior',
    badge: 'Senior Citizens (60+)',
    title: 'Senior Citizen Vital Cardiac & Bone Care',
    parameters: 92,
    fasting: '12 hrs Fasting',
    reportHours: '12-18 Hours',
    includes: ['Cardiac Risk Assessment + Extended Lipid', 'Bone Mineral Density (Calcium + Vit D)', 'Renal Filtration Rate & Microalbumin', 'Pancreatic Screening + Sugar Fasting', 'Arthritis & Rheumatoid Factor (RA)', 'Senior Certified Phlebotomist'],
    singlePrice: 1899,
    singleMrp: 5990,
    twoMembersPrice: 3299,
    twoMembersMrp: 11980,
    perPersonTwoMembers: 1649
  }
];

const LAB_CHAINS = [
  {
    labId: 'thyrocare',
    name: 'Thyrocare Technologies',
    shortCode: 'TC',
    highlight: 'Centralized Robotics Lab',
    accreditation: 'NABH, NABL & CAP Certified',
    reportHours: 24,
    baseMultiplier: 1.0,
    discountRate: 58
  },
  {
    labId: 'healthians',
    name: 'Healthians Diagnostics',
    shortCode: 'HN',
    highlight: 'Smart Cool-Gel Bag (4°C)',
    accreditation: 'NABL & ISO Accredited',
    reportHours: 18,
    baseMultiplier: 1.05,
    discountRate: 60
  },
  {
    labId: 'redcliffe',
    name: 'Redcliffe Lifetech',
    shortCode: 'RL',
    highlight: 'AI Digital Smart Reports',
    accreditation: 'NABL & ISO 15189',
    reportHours: 16,
    baseMultiplier: 1.02,
    discountRate: 55
  },
  {
    labId: 'drlal',
    name: 'Dr. Lal PathLabs Partner',
    shortCode: 'LP',
    highlight: 'National Reference Quality',
    accreditation: 'NABL & CAP Gold Standard',
    reportHours: 12,
    baseMultiplier: 1.30,
    discountRate: 35
  }
];

export default function TestBeatPortal() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Clean initial state: zero pre-selected tests (No auto-selection)
  const [selectedTests, setSelectedTests] = useState<TestItem[]>([]);
  const [cartItemsCount, setCartItemsCount] = useState<number>(0);

  // Compact Auth Modal
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [mobileInput, setMobileInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Rx modal
  const [isRxOpen, setIsRxOpen] = useState(false);

  // Filter 1500+ tests dynamically
  const filteredCatalog = useMemo(() => {
    if (!searchQuery.trim()) return EXTENDED_TESTS_CATALOG.slice(0, 8);
    return EXTENDED_TESTS_CATALOG.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleTest = (test: TestItem) => {
    if (selectedTests.some(t => t.id === test.id)) {
      setSelectedTests(selectedTests.filter(t => t.id !== test.id));
      setCartItemsCount(prev => Math.max(0, prev - 1));
    } else {
      setSelectedTests([...selectedTests, test]);
      setCartItemsCount(prev => prev + 1);
    }
  };

  const totalParams = useMemo(() => {
    return selectedTests.reduce((acc, t) => acc + t.parametersCount, 0);
  }, [selectedTests]);

  // Live Multi-Lab Quotes calculation
  const calculatedQuotes = useMemo(() => {
    if (selectedTests.length === 0) return [];
    const baseSum = selectedTests.reduce((acc, t) => acc + (t.offerPrice * 1.1), 0);
    return LAB_CHAINS.map(lab => {
      const grossMrp = Math.round(baseSum * lab.baseMultiplier * 1.6);
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-[#039487] selection:text-white relative overflow-x-hidden">

      {/* SUBTLE MEDICAL WATERMARK & AMBIENT ANIMATION PATTERNS */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.035] bg-[radial-gradient(#012C63_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="fixed top-20 -left-48 w-96 h-96 bg-[#039487]/10 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="fixed bottom-20 -right-48 w-96 h-96 bg-[#012C63]/10 rounded-full blur-3xl pointer-events-none z-0"></div>

      {/* 1. TOP PAN-INDIA TRUST & HELPLINE BAR WITH NABH / GOVT COMPLIANCE */}
      <div className="relative z-10 bg-[#012C63] text-slate-200 text-xs py-2 px-4 border-b border-[#0c3b65]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-4 overflow-x-auto text-[11px] sm:text-xs">
            <span className="flex items-center text-[#039487] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#039487]" /> 
              NABH & NABL Accredited Diagnostics (ISO 15189)
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:flex items-center text-slate-200">
              <Building2 className="w-3.5 h-3.5 mr-1 text-[#039487]" /> 
              Govt. Recognized Digital Health Aggregator
            </span>
            <span className="hidden lg:inline text-slate-500">•</span>
            <span className="flex items-center text-amber-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> 100% Cold-Chain Monitored Logistics
            </span>
          </div>

          <div className="flex items-center space-x-5 text-xs">
            <div className="flex items-center text-slate-200 font-medium">
              <MapPin className="w-3.5 h-3.5 mr-1 text-[#F44236]" />
              <span>Pan-India Network (50+ Cities)</span>
            </div>
            <a href="tel:+918368887011" className="flex items-center text-teal-300 font-bold hover:underline">
              <PhoneCall className="w-3.5 h-3.5 mr-1" /> +91 83688 87011
            </a>
          </div>
        </div>
      </div>

      {/* 2. REFINED NAVBAR */}
      <header className="relative z-20 sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <a href="#" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-[#012C63] flex items-center justify-center p-1.5 shadow-md shadow-[#012C63]/20 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 100 100" className="w-8 h-8" fill="none">
                <rect x="25" y="15" width="50" height="12" rx="6" stroke="white" strokeWidth="6" />
                <path d="M35 27V65C35 73.2843 41.7157 80 50 80C58.2843 80 65 73.2843 65 65V27" stroke="white" strokeWidth="6" />
                <path d="M42 50L46 54L50 44L54 52L58 48" stroke="#039487" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="50" cy="67" r="4" fill="#F44236" />
              </svg>
            </div>
            <div>
              <div className="flex items-baseline">
                <span className="text-2xl font-black tracking-tight text-[#012C63]">Test</span>
                <span className="text-2xl font-black tracking-tight text-[#039487]">Beat</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#F44236] ml-1"></span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 tracking-wider">
                Indias Trusted MultiLabs.Healthcare Platform
              </p>
            </div>
          </a>

          {/* Genuine Diagnostic Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-bold text-slate-700">
            <a href="#compare" className="flex items-center space-x-1.5 text-[#039487] hover:text-[#012C63] transition-colors">
              <FlaskConical className="w-4 h-4" />
              <span>Compare Labs</span>
              <span className="bg-teal-50 text-[#039487] border border-[#039487]/30 text-[10px] font-black px-1.5 py-0.5 rounded-full">Live</span>
            </a>
            <a href="#packages" className="flex items-center space-x-1.5 hover:text-[#012C63] transition-colors">
              <Package className="w-4 h-4 text-slate-400" />
              <span>Health Packages</span>
            </a>
            <a href="#wellness" className="flex items-center space-x-1.5 hover:text-[#012C63] transition-colors">
              <Activity className="w-4 h-4 text-slate-400" />
              <span>Wellness & Biomarkers</span>
            </a>
            <button onClick={() => setIsRxOpen(true)} className="flex items-center space-x-1.5 text-indigo-600 hover:text-indigo-800 transition-colors">
              <UploadCloud className="w-4 h-4" />
              <span>Upload Parcha</span>
            </button>
          </nav>

          {/* Action Icons: Cart & Compact User Profile */}
          <div className="flex items-center space-x-3">
            <div className="relative cursor-pointer p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors">
              <ShoppingCart className="w-5 h-5 text-slate-700" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#012C63] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </div>

            <button
              onClick={() => setIsAuthOpen(true)}
              className="w-10 h-10 rounded-full border-2 border-[#012C63] flex items-center justify-center text-[#012C63] hover:bg-teal-50 transition-all shadow-sm"
              title="Patient Login / Sign Up"
            >
              <User className="w-5 h-5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-5 pt-3 pb-6 space-y-3 shadow-xl">
            <a href="#compare" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-800 py-1">Compare Labs Live</a>
            <a href="#packages" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-800 py-1">Health Packages</a>
            <a href="#wellness" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-800 py-1">Wellness Guidelines</a>
            <button
              onClick={() => { setMobileMenuOpen(false); setIsRxOpen(true); }}
              className="block text-sm font-bold text-[#039487] py-1"
            >
              Upload Doctor Prescription
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); setIsAuthOpen(true); }}
              className="w-full mt-2 py-3 bg-[#012C63] text-white rounded-xl text-sm font-bold shadow-md"
            >
              Patient Sign In / Register
            </button>
          </div>
        )}
      </header>

      {/* 3. HERO & 1500+ TESTS SMART SEARCH ENGINE */}
      <section className="relative z-10 pt-10 pb-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Search & Headline */}
            <div className="lg:col-span-8">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-100 text-[#012C63] text-xs font-bold mb-4 shadow-xs">
                <Sparkles className="w-4 h-4 text-[#039487]" />
                <span>India&apos;s Multi-Lab Aggregator • Up to 70% Real Savings</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Accredited Diagnostic Labs. <br />
                <span className="text-[#039487]">Compare 1500+ Blood Tests at Home.</span>
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-2xl font-medium">
                Search any medical biomarker. Compare real-time pricing between Thyrocare, Healthians, Redcliffe & Dr. Lal PathLabs with zero home collection fee.
              </p>

              {/* Comprehensive Search Bar (1500+ Tests Ready) */}
              <div className="mt-6 relative max-w-xl">
                <div className="relative flex items-center bg-white border-2 border-slate-200 focus-within:border-[#039487] rounded-2xl p-2.5 shadow-lg shadow-teal-600/5 transition-all">
                  <Search className="w-5 h-5 text-[#039487] ml-3 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search from 1500+ tests: CBC, Vitamin D, HbA1c, LFT, KFT, Thyroid..."
                    className="w-full px-3 py-1.5 text-slate-900 placeholder-slate-400 font-semibold focus:outline-none text-sm"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600 mr-2">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Official NABH, NABL, CAP & Quality Badges */}
              <div className="flex flex-wrap items-center gap-3 mt-6 text-xs font-bold text-slate-700">
                <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>NABH Accredited Centers</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                  <FileCheck2 className="w-4 h-4 text-[#012C63]" />
                  <span>NABL (ISO 15189 Certified)</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>CAP Gold Standard Network</span>
                </div>
              </div>
            </div>

            {/* Right: Embedded Parcha Scan Quick Box */}
            <div className="lg:col-span-4">
              <div className="bg-[#012C63] rounded-3xl p-6 text-white shadow-xl border border-[#0c3b65] relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-[#039487]/30 rounded-full blur-xl pointer-events-none"></div>

                <div className="flex items-center space-x-2 text-teal-300 mb-2">
                  <Camera className="w-5 h-5 text-teal-300" />
                  <span className="text-xs font-extrabold uppercase tracking-wider">Prescription Booking</span>
                </div>
                
                <h3 className="text-xl font-black leading-snug">Doctor ka Parcha Upload Karein</h3>
                <p className="text-slate-200 text-xs mt-1 mb-5 leading-relaxed">
                  Test ka exact naam nahi pata? Bas photo upload karein. Hamare certified medical lab advisor cheapest rates par test book kar denge.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => setIsRxOpen(true)}
                    className="w-full py-3 bg-[#039487] hover:bg-[#027d72] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-lg shadow-teal-900/40"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload Parcha (Photo / PDF)</span>
                  </button>

                  <a
                    href="https://wa.me/918368887011?text=Hello%20TestBeat,%20I%20want%20to%20book%20tests%20from%20my%20prescription"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-[#0c3b65] hover:bg-[#124b7e] text-teal-300 border border-teal-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp Booking (+91 83688 87011)</span>
                  </a>
                </div>

                <p className="text-[10px] text-slate-300 text-center mt-3">
                  ✓ 100% Privacy • Within 5 mins doctor callback
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. SELECTABLE TEST CATALOG (Add to Cart / Select to Compare) */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-black text-[#039487] uppercase tracking-wider bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              Live Test Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Select Tests to Compare Labs in Real-Time
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Select one or multiple tests below. Multi-lab comparative rates will show instantly.
            </p>
          </div>
          
          {selectedTests.length > 0 && (
            <button 
              onClick={() => { setSelectedTests([]); setCartItemsCount(0); }}
              className="text-xs font-bold text-rose-600 hover:underline"
            >
              Clear All ({selectedTests.length} Selected)
            </button>
          )}
        </div>

        {/* Dynamic Tests Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCatalog.map(test => {
            const isSelected = selectedTests.some(t => t.id === test.id);
            return (
              <div
                key={test.id}
                onClick={() => toggleTest(test)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-teal-50/80 border-[#039487] shadow-md ring-2 ring-[#039487]/30 scale-[1.01]'
                    : 'bg-white border-slate-200 hover:border-[#039487]/50 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#012C63] bg-teal-100 px-2 py-0.5 rounded">
                      {test.category}
                    </span>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${isSelected ? 'bg-[#039487] border-[#039487] text-white' : 'border-slate-300 bg-white'}`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{test.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{test.description}</p>
                </div>
                
                <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-base font-black text-[#012C63]">₹{test.offerPrice}</span>
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

        {/* BLUE SUMMARY STRIP: Renders ONLY when at least 1 test is selected (Conditional Rendering) */}
        {selectedTests.length > 0 && (
          <div className="mt-8 max-w-4xl mx-auto bg-[#012C63] text-white rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#039487] flex items-center justify-center font-bold text-white text-base">
                {selectedTests.length}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">Biomarkers Configured</p>
                <p className="text-sm font-extrabold text-white">{totalParams} Total Clinical Parameters Selected</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => { setSelectedTests([]); setCartItemsCount(0); }} 
                className="text-xs text-rose-300 font-bold hover:underline"
              >
                Reset Selection
              </button>
              <a 
                href="#compare" 
                className="px-4 py-2 bg-[#039487] hover:bg-[#027d72] text-white font-black rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow"
              >
                <span>View Comparative Rates Below</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </section>

      {/* 5. MULTI-LAB COMPARISON ENGINE (Placed Above the Fold & Automatically Shows Live Comparison) */}
      <section className="relative z-10 bg-white border-t border-b border-slate-200 py-12 px-4 sm:px-6 lg:px-8" id="compare">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-black text-teal-800 bg-teal-100 px-3 py-1 rounded-full uppercase tracking-wider">
              Real-Time Comparative Pricing
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">
              Compare India&apos;s Top Diagnostic Labs Live
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Select one or more tests above to see real-time discounted prices and parameter depth across accredited chains.
            </p>
          </div>

          {selectedTests.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl max-w-2xl mx-auto bg-slate-50/50">
              <FlaskConical className="w-12 h-12 text-[#039487] mx-auto mb-2 opacity-50" />
              <h4 className="font-bold text-slate-700 text-base">Koi Test Select Nahi Hai</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Upar catalog ya search bar se koi bhi test select karein, sabhi certified labs ki live comparison report turant yahan generate ho jayegi.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
              {calculatedQuotes.map((lab, index) => {
                const isBestValue = index === 0;
                return (
                  <div
                    key={lab.labId}
                    className={`bg-white rounded-3xl p-6 border flex flex-col justify-between transition-all relative ${
                      isBestValue
                        ? 'border-2 border-[#039487] shadow-xl ring-4 ring-teal-50'
                        : 'border-slate-200 shadow-xs hover:shadow-md'
                    }`}
                  >
                    {isBestValue && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#039487] text-white text-[10px] font-black uppercase tracking-wider py-1 px-3.5 rounded-full flex items-center shadow-md">
                        <Award className="w-3.5 h-3.5 mr-1" />
                        Best Value Choice
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-[#012C63] text-lg">
                          {lab.shortCode}
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                          {lab.accreditation.split('&')[0]}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-base leading-snug">{lab.name}</h4>
                      <p className="text-xs text-[#039487] font-semibold mb-4">{lab.highlight}</p>

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
                          <span className="text-slate-500">Doorstep Collection:</span>
                          <span className="font-black text-[#039487]">FREE</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-4">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-3xl font-black text-[#012C63]">₹{lab.finalPrice}</span>
                          <span className="text-xs line-through text-slate-400">₹{lab.mrp}</span>
                          <span className="text-xs font-bold text-[#039487] bg-teal-50 px-1.5 py-0.5 rounded">
                            {lab.discountRate}% OFF
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Free home pickup & verified digital report</p>
                      </div>

                      <button
                        onClick={() => alert(`Test booking confirmed with ${lab.name}! Proceeding to appointment slots.`)}
                        className={`w-full py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md ${
                          isBestValue
                            ? 'bg-[#039487] hover:bg-[#027d72] text-white'
                            : 'bg-[#012C63] hover:bg-[#0c3b65] text-white'
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
          )}
        </div>
      </section>

      {/* 6. HEALTH PACKAGES WITH DUAL MEMBER PRICING */}
      <section className="relative z-10 bg-slate-50/70 py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200" id="packages">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-[#039487] bg-teal-50 border border-teal-200 px-3 py-1 rounded-full uppercase tracking-widest">
              Full Body Preventive Care
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              Curated Preventive Packages (Save for 2 Members)
            </h2>
            <p className="text-slate-600 text-sm mt-2">Certified master checkup profiles covering organs, vitamins, sugar & cardiac markers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PACKAGES_LIST.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <span className="text-[10px] font-black text-[#012C63] bg-teal-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {pkg.badge}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-3">{pkg.title}</h3>
                  
                  <div className="flex items-center space-x-2 text-xs text-slate-500 font-semibold mt-1 mb-4">
                    <span className="text-[#039487] font-bold">{pkg.parameters} Tests Included</span>
                    <span>•</span>
                    <span>{pkg.fasting}</span>
                  </div>

                  <div className="space-y-2 border-t border-b border-slate-100 py-4 mb-6">
                    {pkg.includes.map((feature, i) => (
                      <div key={i} className="flex items-center text-xs text-slate-700">
                        <Check className="w-4 h-4 text-[#039487] mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Dual Member Pricing Slab */}
                  <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-3 mb-6">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1 font-bold text-[#012C63]">
                        <Users className="w-4 h-4 text-[#039487]" />
                        <span>Book for 2 Members:</span>
                      </div>
                      <span className="font-black text-[#039487]">₹{pkg.perPersonTwoMembers}/person</span>
                    </div>
                    <p className="text-[11px] text-teal-800 mt-0.5">Total ₹{pkg.twoMembersPrice} (Save ₹{pkg.twoMembersMrp - pkg.twoMembersPrice})</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline space-x-2 mb-4">
                    <span className="text-3xl font-black text-[#012C63]">₹{pkg.singlePrice}</span>
                    <span className="text-sm line-through text-slate-400">₹{pkg.singleMrp}</span>
                    <span className="text-xs font-bold text-[#039487] bg-teal-50 px-1.5 py-0.5 rounded">
                      70% OFF
                    </span>
                  </div>

                  <button 
                    onClick={() => alert(`Package ${pkg.title} added! Choose appointment date.`)}
                    className="w-full py-3.5 bg-[#012C63] hover:bg-[#0c3b65] text-white font-bold rounded-xl text-sm transition-all shadow-sm"
                  >
                    Book for 1 or 2 Members
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. WELLNESS HEALTH & PREVENTIVE ADVISORY SECTION (Replaced Affiliate Form) */}
      <section className="relative z-10 bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200" id="wellness">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black text-[#039487] bg-teal-50 border border-teal-200 px-3 py-1 rounded-full uppercase tracking-wider">
              Diagnostic Health Literacy
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">
              Essential Clinical Guidelines for Blood Testing
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Ensure highest test accuracy with simple standard preparation instructions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-slate-200 rounded-3xl p-6 bg-slate-50/50">
              <Clock className="w-8 h-8 text-[#039487] mb-3" />
              <h4 className="font-extrabold text-slate-900 text-base mb-2">10 - 12 Hours Fasting Rules</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fasting blood sugar, Lipid profiles, and Liver panels require complete overnight fasting. Plain drinking water is allowed, but tea, milk, or juices must be avoided.
              </p>
            </div>

            <div className="border border-slate-200 rounded-3xl p-6 bg-slate-50/50">
              <Activity className="w-8 h-8 text-[#012C63] mb-3" />
              <h4 className="font-extrabold text-slate-900 text-base mb-2">Morning Medication Protocol</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Thyroid medication (Levothyroxine) should be taken only after blood sample collection. Routine blood pressure medications can be consumed with water unless instructed otherwise.
              </p>
            </div>

            <div className="border border-slate-200 rounded-3xl p-6 bg-slate-50/50">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mb-3" />
              <h4 className="font-extrabold text-slate-900 text-base mb-2">Cold-Chain Sample Protection</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                All TestBeat samples are barcoded at your home and transferred in certified 2°C - 8°C gel-pack boxes to preserve enzyme viability and deliver 100% accurate lab readings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. REAL USER REVIEWS & 4.9★ RATING SECTION */}
      <section className="relative z-10 bg-slate-50/60 py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="flex items-center justify-center space-x-1 text-amber-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <h3 className="text-2xl font-black text-slate-900">Rated 4.9 / 5 by Over 45,000+ Families</h3>
            <p className="text-slate-500 text-xs mt-1">Honest reviews from patients across Delhi NCR, Greater Noida, and Pan-India.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
              <div className="flex items-center space-x-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                &quot;Thyrocare aur Lal PathLabs ke rates ek hi jagah compare ho gaye. Phlebotomist subah 7:30 sharp aa gaye the aur sham tak WhatsApp par report mil gayi!&quot;
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Dr. Rajesh Verma</span>
                <span className="text-emerald-600 font-semibold text-[11px]">Verified Booking</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
              <div className="flex items-center space-x-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                &quot;2 members wala Full Body checkup package bohot economical pada. Parents ke tests bhi ghar baithe bina kisi jhanjhat ke complete ho gaye.&quot;
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Pooja Sharma</span>
                <span className="text-emerald-600 font-semibold text-[11px]">Greater Noida</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
              <div className="flex items-center space-x-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                &quot;Maine prescription photo upload ki thi, unke team ne 5 minute me call karke sahi tests select karwa diye. Best aggregator experience!&quot;
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Amit Trivedi</span>
                <span className="text-emerald-600 font-semibold text-[11px]">Verified Booking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="relative z-10 bg-[#012C63] text-slate-300 text-xs border-t border-[#0c3b65] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black text-white">Test</span>
                <span className="text-2xl font-black text-[#039487]">Beat</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#F44236]"></span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
                Indias Trusted MultiLabs.Healthcare Platform. Aggregating NABH, NABL, and CAP accredited diagnostic chains (Thyrocare, Healthians, Redcliffe, Dr. Lal PathLabs) for transparent pricing and cold-chain sample safety.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Accredited Chains</h4>
              <ul className="space-y-1.5 text-slate-300">
                <li>Thyrocare Technologies</li>
                <li>Healthians Pathology</li>
                <li>Redcliffe Lifetech</li>
                <li>Dr. Lal PathLabs Network</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Diagnostic Support</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <PhoneCall className="w-4 h-4 text-slate-300" />
                  <span>+91 83688 87011</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-slate-300" />
                  <span>Pan-India Diagnostics Hub</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[#0c3b65] flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <p>© 2026 TestBeat Health Technologies Pvt Ltd. All rights reserved.</p>
            <p>Certified Pan-India Diagnostic Aggregator.</p>
          </div>
        </div>
      </footer>

      {/* 10. WHATSAPP FLOATING BUTTON (Right Bottom) */}
      <a
        href="https://wa.me/918368887011?text=Hello%20TestBeat,%20I%20want%20to%20inquire%20about%20blood%20tests"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center group transition-all duration-300 hover:scale-105"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white text-white" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-2">
          Chat with Lab Advisor
        </span>
      </a>

      {/* 11. COMPACT CUSTOMER AUTH MODAL (OTP LOGIN & SIGN UP) */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 relative border border-slate-100">
            <button 
              onClick={() => { setIsAuthOpen(false); setOtpSent(false); }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
              <button 
                onClick={() => { setAuthMode('LOGIN'); setOtpSent(false); }}
                className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all ${authMode === 'LOGIN' ? 'bg-[#012C63] text-white' : 'text-slate-600'}`}
              >
                OTP Login
              </button>
              <button 
                onClick={() => { setAuthMode('SIGNUP'); setOtpSent(false); }}
                className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all ${authMode === 'SIGNUP' ? 'bg-[#012C63] text-white' : 'text-slate-600'}`}
              >
                New Sign Up
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!otpSent) {
                if (mobileInput.length !== 10) return alert('Enter valid 10-digit number');
                setOtpSent(true);
                alert(`MSG91 OTP sent to +91 ${mobileInput}`);
              } else {
                alert('Authentication successful!');
                setIsAuthOpen(false);
                setOtpSent(false);
              }
            }} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Mobile Number</label>
                <div className="flex items-center border border-slate-300 rounded-xl px-3 py-2 focus-within:border-[#039487]">
                  <span className="text-slate-500 font-bold text-xs mr-2">+91</span>
                  <input 
                    type="tel" 
                    maxLength={10} 
                    required 
                    value={mobileInput}
                    onChange={(e) => setMobileInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit number" 
                    className="w-full text-slate-900 font-bold focus:outline-none text-sm" 
                  />
                </div>
              </div>

              {otpSent && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Enter 6-Digit OTP</label>
                  <input 
                    type="text" 
                    maxLength={6} 
                    required
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456" 
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-center font-black tracking-widest text-base focus:border-[#039487] focus:outline-none" 
                  />
                </div>
              )}

              <button type="submit" className="w-full py-2.5 bg-[#012C63] hover:bg-[#0c3b65] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all">
                {otpSent ? 'Verify OTP & Continue' : 'Send Login OTP'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 12. PRESCRIPTION UPLOAD MODAL */}
      {isRxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 relative border border-slate-100">
            <button 
              onClick={() => setIsRxOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-1.5 text-[#039487] mb-1">
              <Camera className="w-4 h-4" />
              <span className="text-[11px] font-black uppercase tracking-wider">Prescription Assistant</span>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-1">Upload Doctor Prescription</h3>
            <p className="text-slate-500 text-xs mb-4">
              Upload prescription photo or PDF. Our medical lab team will select the right tests for you.
            </p>

            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50 hover:bg-teal-50/40 transition-all cursor-pointer mb-4">
              <UploadCloud className="w-8 h-8 text-[#039487] mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-800">Tap to select photo from mobile / gallery</p>
              <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, PDF up to 10MB</p>
            </div>

            <button
              onClick={() => { alert('Prescription received! Our lab doctor will call you in 5 minutes.'); setIsRxOpen(false); }}
              className="w-full py-3 bg-[#039487] hover:bg-[#027d72] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all"
            >
              Submit Prescription
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
