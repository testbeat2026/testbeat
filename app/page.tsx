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
  Check, 
  UploadCloud, 
  Microscope, 
  ChevronRight, 
  Package, 
  Users, 
  Heart, 
  Droplet, 
  Zap, 
  Camera 
} from 'lucide-react';

// Brand Colors Definition (Locked with TestBeat Logo):
// Primary Navy: #012C63 | Accent Teal: #039487 | Alert Coral: #F44236

const CLINICAL_CATEGORIES = [
  { id: 'all', name: 'All Tests', icon: FlaskConical },
  { id: 'full-body', name: 'Full Body Checkup', icon: Package },
  { id: 'diabetes', name: 'Diabetes Screen', icon: Droplet },
  { id: 'thyroid', name: 'Thyroid Care', icon: Zap },
  { id: 'heart', name: 'Heart & Lipid', icon: Heart },
  { id: 'liver', name: 'Liver Health', icon: Activity },
  { id: 'kidney', name: 'Kidney (Renal)', icon: Activity },
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
  { id: 't1', name: 'Complete Blood Count (CBC with ESR - 28 Params)', category: 'full-body', parametersCount: 28, fastingRequired: false, sampleType: 'EDTA Blood', description: 'Screening for anemia, platelets, white blood cells & latent infections.', mrp: 450, offerPrice: 199 },
  { id: 't2', name: 'Thyroid Profile Total (T3, T4, TSH)', category: 'thyroid', parametersCount: 3, fastingRequired: true, sampleType: 'Serum', description: 'Gold standard test for thyroid gland hormone synthesis and metabolism.', mrp: 650, offerPrice: 249 },
  { id: 't3', name: 'HbA1c Glycated Hemoglobin Test', category: 'diabetes', parametersCount: 2, fastingRequired: false, sampleType: 'Whole Blood', description: 'Evaluates 3-month average blood glucose control with eAG values.', mrp: 550, offerPrice: 249 },
  { id: 't4', name: 'Lipid Profile Comprehensive (Cardiac Risk)', category: 'heart', parametersCount: 8, fastingRequired: true, sampleType: 'Serum', description: 'HDL, LDL, VLDL, Total Cholesterol and Triglycerides ratio.', mrp: 850, offerPrice: 349 },
  { id: 't5', name: 'Liver Function Test (LFT 12 Parameters)', category: 'liver', parametersCount: 12, fastingRequired: false, sampleType: 'Serum', description: 'Checks liver enzymes (SGOT, SGPT), Bilirubin & total protein levels.', mrp: 750, offerPrice: 299 },
  { id: 't6', name: 'Kidney Function Test (KFT with Electrolytes)', category: 'kidney', parametersCount: 11, fastingRequired: false, sampleType: 'Serum', description: 'Screens Renal clearance, Serum Creatinine, Uric Acid & Electrolytes.', mrp: 950, offerPrice: 349 },
  { id: 't7', name: 'Vitamin D 25-Hydroxy (Bone & Immunity)', category: 'vitamins', parametersCount: 1, fastingRequired: false, sampleType: 'Serum', description: 'Detects vitamin D deficiency causing joint fatigue and weak bone density.', mrp: 1400, offerPrice: 499 },
  { id: 't8', name: 'Vitamin B12 Active (Cyanocobalamin)', category: 'vitamins', parametersCount: 1, fastingRequired: true, sampleType: 'Serum', description: 'Critical biomarker for nerve function, neurological health & energy levels.', mrp: 1100, offerPrice: 449 }
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
    accreditation: 'NABL & CAP Certified',
    reportHours: 24,
    baseMultiplier: 1.0,
    discountRate: 58
  },
  {
    labId: 'healthians',
    name: 'Healthians Diagnostics',
    shortCode: 'HN',
    highlight: 'Smart Cool-Gel Bag (4°C)',
    accreditation: 'NABL Accredited',
    reportHours: 18,
    baseMultiplier: 1.05,
    discountRate: 60
  },
  {
    labId: 'redcliffe',
    name: 'Redcliffe Lifetech',
    shortCode: 'RL',
    highlight: 'AI Digital Smart Reports',
    accreditation: 'NABL & ISO Certified',
    reportHours: 16,
    baseMultiplier: 1.02,
    discountRate: 55
  },
  {
    labId: 'drlal',
    name: 'Dr. Lal PathLabs Partner',
    shortCode: 'LP',
    highlight: 'National Reference Quality',
    accreditation: 'NABL & CAP Gold',
    reportHours: 12,
    baseMultiplier: 1.30,
    discountRate: 35
  }
];

export default function TestBeatPortal() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedTests, setSelectedTests] = useState<TestItem[]>([
    TESTS_CATALOG[0],
    TESTS_CATALOG[1],
    TESTS_CATALOG[6]
  ]);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authStep, setAuthStep] = useState<'MOBILE' | 'OTP'>('MOBILE');
  const [patientMobile, setPatientMobile] = useState('');
  const [patientOtp, setPatientOtp] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [isRxOpen, setIsRxOpen] = useState(false);

  const [affiliateSubmitted, setAffiliateSubmitted] = useState(false);
  const [affiliateData, setAffiliateData] = useState({
    name: '',
    phone: '',
    city: '',
    category: 'Doctor / Clinic'
  });

  const filteredCatalog = useMemo(() => {
    return TESTS_CATALOG.filter(item => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [activeCategory, searchQuery]);

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

  const calculatedQuotes = useMemo(() => {
    const baseSum = selectedTests.reduce((acc, _) => acc + 480, 0);
    return LAB_CHAINS.map(lab => {
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
    if (patientMobile.length !== 10) return alert('Please enter valid 10-digit mobile number');
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-[#039487] selection:text-white">

      {/* 1. TOP PAN-INDIA TRUST & HELPLINE BAR */}
      <div className="bg-[#012C63] text-slate-200 text-xs py-2 px-4 border-b border-[#0c3b65]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-4 overflow-x-auto text-[11px] sm:text-xs">
            <span className="flex items-center text-[#039487] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#039487]" /> 100% NABL & CAP Accredited Partner Labs
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:flex items-center text-slate-200">
              <Activity className="w-3.5 h-3.5 mr-1 text-[#039487]" /> Cold-Chain Specimen Logistics (2°C - 8°C)
            </span>
            <span className="hidden lg:inline text-slate-500">•</span>
            <span className="flex items-center text-amber-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Free Doorstep Sample Pickup
            </span>
          </div>

          <div className="flex items-center space-x-5 text-xs">
            <div className="flex items-center text-slate-200 font-medium">
              <MapPin className="w-3.5 h-3.5 mr-1 text-[#F44236]" />
              <span>Pan-India (50+ Cities)</span>
            </div>
            <a href="tel:+918368887011" className="flex items-center text-teal-300 font-bold hover:underline">
              <PhoneCall className="w-3.5 h-3.5 mr-1" /> +91 83688 87011
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR WITH OFFICIAL TESTBEAT LOGO & LOCKED THEME */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Official Brand Logo */}
          <a href="#" className="flex items-center space-x-3 group">
            {/* Logo Icon Mark (Test tube with ECG pulse) */}
            <div className="w-11 h-11 rounded-2xl bg-[#012C63] flex items-center justify-center p-1.5 shadow-md shadow-[#012C63]/20 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 100 100" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="25" y="15" width="50" height="12" rx="6" stroke="white" strokeWidth="6" />
                <path d="M35 27V65C35 73.2843 41.7157 80 50 80C58.2843 80 65 73.2843 65 65V27" stroke="white" strokeWidth="6" />
                <path d="M42 50L46 54L50 44L54 52L58 48" stroke="#039487" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M50 63C47.7909 63 46 64.7909 46 67C46 69.2091 47.7909 71 50 71C52.2091 71 54 69.2091 54 67C54 64.7909 52.2091 63 50 63Z" fill="#F44236" />
              </svg>
            </div>

            {/* Logo Typography */}
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
            <a href="#habits" className="flex items-center space-x-1.5 hover:text-[#012C63] transition-colors">
              <Activity className="w-4 h-4 text-slate-400" />
              <span>Tests by Risk</span>
            </a>
            <a href="#compare" className="flex items-center space-x-1.5 hover:text-[#012C63] transition-colors">
              <Microscope className="w-4 h-4 text-slate-400" />
              <span>All Blood Tests</span>
            </a>
          </nav>

          {/* Compact Customer Profile Login */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => { setAuthStep('MOBILE'); setIsAuthOpen(true); }}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:border-[#039487] hover:text-[#012C63] hover:bg-teal-50/40 transition-all text-xs font-bold shadow-xs"
            >
              <User className="w-4 h-4 text-[#012C63]" />
              <span>Login / Sign Up</span>
            </button>

            <a
              href="#compare"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[#012C63] hover:bg-[#0c3b65] text-white text-xs font-black shadow-md shadow-[#012C63]/20 transition-all uppercase tracking-wider"
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

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-5 pt-3 pb-6 space-y-3 shadow-xl">
            <a href="#compare" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-800 py-1">Compare Labs Live</a>
            <a href="#packages" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-800 py-1">Health Packages</a>
            <a href="#habits" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-800 py-1">Tests by Health Risk</a>
            <button
              onClick={() => { setMobileMenuOpen(false); setIsRxOpen(true); }}
              className="block text-sm font-bold text-[#039487] py-1"
            >
              Upload Doctor Prescription
            </button>
            <a href="#affiliate" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-500 py-1">Affiliate Partner Network</a>
            <button
              onClick={() => { setMobileMenuOpen(false); setIsAuthOpen(true); }}
              className="w-full mt-2 py-3 bg-[#012C63] text-white rounded-xl text-sm font-bold shadow-md"
            >
              Patient Sign In / Register
            </button>
          </div>
        )}
      </header>

      {/* 3. HERO SECTION WITH EMBEDDED PRESCRIPTION QUICK-BOX */}
      <section className="bg-gradient-to-b from-teal-50/50 via-white to-slate-50 pt-10 pb-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Headline & Multi-Search */}
            <div className="lg:col-span-8">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-100 text-[#012C63] text-xs font-bold mb-4 shadow-xs">
                <Sparkles className="w-4 h-4 text-[#039487]" />
                <span>India&apos;s Multi-Lab Aggregator • Up to 70% Real Savings</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Accredited Lab Tests at Home. <br />
                <span className="text-[#039487]">
                  Compare Top Diagnostic Chains.
                </span>
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-2xl font-medium">
                Choose tests from Thyrocare, Healthians, Redcliffe & Dr. Lal PathLabs. Enjoy free doorstep sample pickup with 2°C - 8°C cold-chain tracking.
              </p>

              {/* Main Search Input */}
              <div className="mt-6 relative max-w-xl">
                <div className="relative flex items-center bg-white border-2 border-slate-200 focus-within:border-[#039487] rounded-2xl p-2 shadow-lg shadow-teal-600/5 transition-all">
                  <Search className="w-5 h-5 text-[#039487] ml-3 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search: Full Body, CBC, Vitamin D, HbA1c, Thyroid, Lipid..."
                    className="w-full px-3 py-2 text-slate-900 placeholder-slate-400 font-semibold focus:outline-none text-sm"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600 mr-2">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Trust Strip */}
              <div className="flex flex-wrap items-center gap-4 mt-6 text-xs font-bold text-slate-600">
                <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-[#039487]" />
                  <span>100% NABL / CAP Certified</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                  <Clock className="w-4 h-4 text-[#012C63]" />
                  <span>Reports within 12 - 24 Hrs</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#F44236]" />
                  <span>₹0 Home Collection Fee</span>
                </div>
              </div>
            </div>

            {/* Right Column: EMBEDDED PRESCRIPTION QUICK-BOX */}
            <div className="lg:col-span-4">
              <div className="bg-[#012C63] rounded-3xl p-6 text-white shadow-xl border border-[#0c3b65] relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-[#039487]/30 rounded-full blur-xl pointer-events-none"></div>

                <div className="flex items-center space-x-2 text-teal-300 mb-2">
                  <Camera className="w-5 h-5 text-teal-300" />
                  <span className="text-xs font-extrabold uppercase tracking-wider">Quick Prescription Booking</span>
                </div>
                
                <h3 className="text-xl font-black leading-snug">Doctor ka Parcha Upload Karein</h3>
                <p className="text-slate-200 text-xs mt-1 mb-5 leading-relaxed">
                  Test ka naam nahi pata? Bas parcha ki photo click karke upload karein. Hamare lab advisor best price par test book kar denge.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => setIsRxOpen(true)}
                    className="w-full py-3 bg-[#039487] hover:bg-[#027d72] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-lg shadow-teal-900/40"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload Prescription (Scan)</span>
                  </button>

                  <a
                    href="https://wa.me/918368887011?text=Hello%20TestBeat,%20I%20want%20to%20book%20tests%20from%20my%20prescription"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-[#0c3b65] hover:bg-[#124b7e] text-teal-300 border border-teal-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Send via WhatsApp (+91 83688 87011)</span>
                  </a>
                </div>

                <p className="text-[10px] text-slate-300 text-center mt-3">
                  ✓ 100% Privacy Protected • Within 5 mins confirmation
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. TESTS BY HEALTH RISKS & ORGANS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="habits">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-black text-[#039487] bg-teal-50 border border-teal-200 px-3 py-1 rounded-full uppercase tracking-wider">
            Clinical Specialities
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
            Tests by Health Risks & Organs
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Select an organ category or individual biomarker to calculate multi-lab prices.</p>
        </div>

        {/* Category Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          {CLINICAL_CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-[#039487] text-white border-[#039487] shadow-md ring-2 ring-[#039487]/20' 
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#039487] hover:bg-teal-50/40'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1.5 ${isActive ? 'text-white' : 'text-[#012C63]'}`} />
                <span className="text-xs font-bold text-center leading-tight">{cat.name}</span>
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
                    ? 'bg-teal-50/80 border-[#039487] shadow-md ring-2 ring-[#039487]/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#012C63] bg-teal-100 px-2 py-0.5 rounded">
                      {test.category}
                    </span>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${isSelected ? 'bg-[#039487] border-[#039487] text-white' : 'border-slate-300 bg-white'}`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{test.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{test.description}</p>
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

        {/* Selected Biomarkers Summary Strip */}
        <div className="max-w-4xl mx-auto bg-[#012C63] text-white rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#039487] flex items-center justify-center font-bold text-white">
              {selectedTests.length}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">Biomarkers Configured</p>
              <p className="text-sm font-extrabold text-white">{totalParams} Total Clinical Parameters Selected</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {selectedTests.length > 0 && (
              <button onClick={() => setSelectedTests([])} className="text-xs text-rose-300 font-bold hover:underline">
                Reset Selection
              </button>
            )}
            <a href="#lab-compare" className="px-4 py-2 bg-[#039487] hover:bg-[#027d72] text-white font-black rounded-xl text-xs flex items-center space-x-1.5 transition-all">
              <span>Compare Diagnostic Labs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* 5. MULTI-LAB AGGREGATOR LIVE COMPARISON MATRIX */}
      <section className="bg-white border-t border-b border-slate-200 py-16 px-4 sm:px-6 lg:px-8" id="compare">
        <div className="max-w-7xl mx-auto" id="lab-compare">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black text-teal-800 bg-teal-100 px-3 py-1 rounded-full uppercase tracking-wider">
              Real-Time Comparative Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
              Compare India&apos;s Top Diagnostic Labs
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Algorithm automatically identifies the &quot;Best Value Choice&quot; based on parameter coverage and lab pricing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {calculatedQuotes.map((lab, index) => {
              const isBestValue = index === 0;
              return (
                <div
                  key={lab.labId}
                  className={`bg-white rounded-3xl p-6 border flex flex-col justify-between transition-all relative ${
                    isBestValue
                      ? 'border-2 border-[#039487] shadow-xl ring-4 ring-teal-50'
                      : 'border-slate-200 shadow hover:shadow-lg'
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
                        {lab.accreditation}
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
                      onClick={() => alert(`Appointment initiated for ${lab.name}! Proceeding to appointment schedule.`)}
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
        </div>
      </section>

      {/* 6. HEALTH PACKAGES WITH DUAL MEMBER PRICING */}
      <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200" id="packages">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-[#039487] bg-teal-50 border border-teal-200 px-3 py-1 rounded-full uppercase tracking-widest">
              Full Body Screening
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              Curated Preventive Packages (Save for 2 Members)
            </h2>
            <p className="text-slate-600 text-sm mt-2">Comprehensive health checkup plans covering vital organs, vitamins, diabetes & lipid profiles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PACKAGES_LIST.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all">
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

                  {/* Dual Member Slab */}
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
                    onClick={() => alert(`Package ${pkg.title} selected! Proceeding to booking.`)}
                    className="w-full py-3.5 bg-[#012C63] hover:bg-[#0c3b65] text-white font-bold rounded-xl text-sm transition-all"
                  >
                    Book for 1 or 2 Members
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. AFFILIATE / B2B PARTNER NETWORK */}
      <section id="affiliate" className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-100 text-[#012C63] text-xs font-bold mb-3 shadow-xs">
              <Handshake className="w-4 h-4 text-[#039487]" />
              <span>TestBeat B2B & Affiliate Partner Network</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Partner With India&apos;s Multi-Lab Diagnostic Network
            </h2>
            <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto">
              Doctors, Clinics, Pathology Centers & Medical Stores: Monetize diagnostic bookings with transparent tracking and high partner revenue sharing.
            </p>
          </div>

          {affiliateSubmitted ? (
            <div className="bg-white border-2 border-[#039487] rounded-3xl p-8 text-center max-w-lg mx-auto shadow-xl">
              <CheckCircle2 className="w-14 h-14 text-[#039487] mx-auto mb-3" />
              <h3 className="text-2xl font-black text-slate-900">Application Registered!</h3>
              <p className="text-xs text-slate-600 mt-2">
                Our onboarding team will call you on <span className="font-bold text-slate-900">+91 {affiliateData.phone}</span> within 2 business hours.
              </p>
            </div>
          ) : (
            <form 
              onSubmit={(e) => { e.preventDefault(); setAffiliateSubmitted(true); }}
              className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 max-w-2xl mx-auto shadow-sm"
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
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#039487]"
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
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#039487]"
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
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#039487]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Affiliate Type</label>
                  <select 
                    value={affiliateData.category}
                    onChange={(e) => setAffiliateData({ ...affiliateData, category: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#039487]"
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
                className="w-full py-3.5 bg-[#012C63] hover:bg-[#0c3b65] text-white rounded-xl font-bold text-sm shadow-xl transition-all flex items-center justify-center space-x-2"
              >
                <span>Submit Partner Application</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 8. FOOTER WITH LOGO AND SITEMAP */}
      <footer className="bg-[#012C63] text-slate-300 text-xs border-t border-[#0c3b65]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black text-white">Test</span>
                <span className="text-2xl font-black text-[#039487]">Beat</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#F44236]"></span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
                Indias Trusted MultiLabs.Healthcare Platform. Unifying accredited diagnostic chains (Thyrocare, Healthians, Redcliffe, Dr. Lal PathLabs) for transparent pricing, certified cold-chain logistics, and digital reports.
              </p>
              <div className="flex items-center space-x-1.5 text-teal-300 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>NABL & CAP Certified Partner Laboratories</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Partner Program</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#affiliate" className="text-teal-300 font-bold hover:underline flex items-center space-x-1">
                    <span>★ Affiliate Partner Form</span>
                  </a>
                </li>
                <li><a href="#affiliate" className="hover:text-white">Doctor & Clinic Integrations</a></li>
                <li><a href="#affiliate" className="hover:text-white">Franchise Collection Points</a></li>
                <li><button onClick={() => setIsRxOpen(true)} className="hover:text-white">Prescription Direct Desk</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Diagnostic Support</h4>
              <ul className="space-y-2.5">
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

          <div className="pt-8 border-t border-[#0c3b65] flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
            <p>© 2026 TestBeat Health Technologies Pvt Ltd. All rights reserved.</p>
            <p>Pan-India Medical Diagnostic Platform.</p>
          </div>
        </div>
      </footer>

      {/* 9. COMPACT CUSTOMER-ONLY OTP AUTH MODAL */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 relative border border-slate-100">
            <button
              onClick={() => setIsAuthOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-1.5 text-[#039487] mb-1">
              <User className="w-4 h-4" />
              <span className="text-[11px] font-black uppercase tracking-wider">Patient Portal</span>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-0.5">
              {authStep === 'MOBILE' ? 'Login or Sign Up' : 'Verify Mobile OTP'}
            </h3>
            <p className="text-slate-500 text-xs mb-5">
              Track phlebotomist arrival, view reports, & book tests.
            </p>

            {authStep === 'MOBILE' ? (
              <form onSubmit={handleSendOtp} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Mobile Number</label>
                  <div className="flex items-center border border-slate-300 rounded-xl px-3 py-2 focus-within:border-[#039487]">
                    <span className="text-slate-500 font-bold text-xs mr-2">+91</span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={patientMobile}
                      onChange={(e) => setPatientMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit number"
                      className="w-full text-slate-900 font-bold focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 bg-[#012C63] hover:bg-[#0c3b65] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-1.5"
                >
                  <span>{authLoading ? 'Sending OTP...' : 'Send Login OTP'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Enter 6-Digit OTP</label>
                  <div className="flex items-center border border-slate-300 rounded-xl px-3 py-2 focus-within:border-[#039487]">
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
                  className="w-full py-2.5 bg-[#039487] hover:bg-[#027d72] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all"
                >
                  Verify & Enter
                </button>

                <button
                  type="button"
                  onClick={() => setAuthStep('MOBILE')}
                  className="w-full text-center text-[11px] font-semibold text-slate-500 hover:underline"
                >
                  Change Mobile Number
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 10. PRESCRIPTION UPLOAD DIALOG */}
      {isRxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 relative border border-slate-100">
            <button
              onClick={() => setIsRxOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
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
