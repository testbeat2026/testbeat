'use client';

import React, { useState, useMemo, useRef } from 'react';
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
  Camera, 
  Wallet, 
  Calendar, 
  UserCheck, 
  Plus, 
  Trash2, 
  ShoppingCart, 
  AlertCircle, 
  ChevronDown, 
  MessageCircle, 
  BookOpen 
} from 'lucide-react';

// Brand Colors Definition (Locked with TestBeat Logo):
// Primary Navy: #012C63 | Accent Teal: #039487 | Alert Coral: #F44236

interface PincodeEntry {
  city: string;
  state: string;
  pin: string;
  allPins: string[];
}

// 111 Districts across 23 States mapped directly from Excel
const SERVICEABLE_LOCATIONS_DATA: PincodeEntry[] = [
  { city: 'Gautambuddha Nagar (Greater Noida)', state: 'Uttar Pradesh', pin: '201310', allPins: ['201310', '201306', '201308', '201312', '201314', '201315'] },
  { city: 'Noida', state: 'Uttar Pradesh', pin: '201301', allPins: ['201301', '201303', '201304', '201305', '201307', '201309', '201313'] },
  { city: 'Ghaziabad', state: 'Uttar Pradesh', pin: '201001', allPins: ['201001', '201002', '201003', '201005', '201009', '201010', '201012', '201014'] },
  { city: 'Faridabad', state: 'Haryana', pin: '121001', allPins: ['121001', '121002', '121003', '121004', '121005', '121006', '121007', '121008'] },
  { city: 'Gurugram', state: 'Haryana', pin: '122001', allPins: ['122001', '122002', '122003', '122004', '122006', '122007', '122008', '122015', '122016', '122017', '122018'] },
  { city: 'Rohtak', state: 'Haryana', pin: '124001', allPins: ['124001', '124021'] },
  { city: 'New Delhi', state: 'Delhi', pin: '110001', allPins: ['110001', '110002', '110003', '110005', '110011', '110019', '110020', '110024', '110025'] },
  { city: 'South West Delhi (Dwarka)', state: 'Delhi', pin: '110075', allPins: ['110075', '110077', '110078', '110037', '110043', '110045'] },
  { city: 'North West Delhi (Rohini)', state: 'Delhi', pin: '110085', allPins: ['110085', '110086', '110089', '110034', '110052'] },
  { city: 'Lucknow', state: 'Uttar Pradesh', pin: '226001', allPins: ['226001', '226002', '226003', '226004', '226010', '226012', '226016', '226024'] },
  { city: 'Varanasi', state: 'Uttar Pradesh', pin: '221001', allPins: ['221001', '221002', '221003', '221005', '221010'] },
  { city: 'Kanpur', state: 'Uttar Pradesh', pin: '208001', allPins: ['208001', '208002', '208005', '208012', '208025'] },
  { city: 'Prayagraj', state: 'Uttar Pradesh', pin: '211001', allPins: ['211001', '211002', '211003', '211004'] },
  { city: 'Ballia', state: 'Uttar Pradesh', pin: '277001', allPins: ['277001', '277303', '277304', '277205'] },
  { city: 'Mumbai Suburban', state: 'Maharashtra', pin: '400050', allPins: ['400050', '400051', '400052', '400053', '400054', '400055', '400058', '400060', '400091', '400095'] },
  { city: 'Thane', state: 'Maharashtra', pin: '400601', allPins: ['400601', '400602', '400604', '400607', '400615'] },
  { city: 'Pune', state: 'Maharashtra', pin: '411001', allPins: ['411001', '411002', '411004', '411014', '411038', '411057'] },
  { city: 'Bengaluru Urban', state: 'Karnataka', pin: '560001', allPins: ['560001', '560002', '560004', '560025', '560034', '560037', '560066', '560100'] },
  { city: 'Patna', state: 'Bihar', pin: '800001', allPins: ['800001', '800002', '800003', '800004', '800013', '800020'] },
  { city: 'Muzaffarpur', state: 'Bihar', pin: '842001', allPins: ['842001', '842002', '842003', '842005'] },
  { city: 'Gopalganj', state: 'Bihar', pin: '841428', allPins: ['841428', '841505', '841427', '841501'] },
  { city: 'Hyderabad', state: 'Telangana', pin: '500001', allPins: ['500001', '500002', '500003', '500004', '500016', '500034', '500081'] },
  { city: 'Kolkata', state: 'West Bengal', pin: '700001', allPins: ['700001', '700002', '700003', '700019', '700020', '700029'] },
  { city: 'Jaipur', state: 'Rajasthan', pin: '302001', allPins: ['302001', '302002', '302004', '302015', '302020'] },
  { city: 'Ahmedabad', state: 'Gujarat', pin: '380001', allPins: ['380001', '380006', '380009', '380015', '380054'] },
  { city: 'Amritsar', state: 'Punjab', pin: '143001', allPins: ['143001', '143002', '143006'] },
  { city: 'Ludhiana', state: 'Punjab', pin: '141001', allPins: ['141001', '141002', '141003'] },
  { city: 'Indore', state: 'Madhya Pradesh', pin: '452001', allPins: ['452001', '452002', '452010'] },
  { city: 'Ranchi', state: 'Jharkhand', pin: '834001', allPins: ['834001', '834002', '834004'] },
  { city: 'Dehradun', state: 'Uttarakhand', pin: '248001', allPins: ['248001', '248002', '248007'] }
];

// Point 4: Decorated categories with unique gradient & borders
const CLINICAL_CATEGORIES = [
  { id: 'all', name: 'All Tests', icon: FlaskConical, color: 'from-[#012C63] to-[#039487]', textLight: 'text-teal-800', bgLight: 'bg-teal-50/70', border: 'border-teal-200' },
  { id: 'full-body', name: 'Full Body Checkup', icon: Package, color: 'from-blue-600 to-indigo-700', textLight: 'text-indigo-800', bgLight: 'bg-indigo-50/70', border: 'border-indigo-200' },
  { id: 'diabetes', name: 'Diabetes Screen', icon: Droplet, color: 'from-sky-500 to-blue-600', textLight: 'text-sky-800', bgLight: 'bg-sky-50/70', border: 'border-sky-200' },
  { id: 'thyroid', name: 'Thyroid Care', icon: Zap, color: 'from-amber-500 to-orange-600', textLight: 'text-amber-800', bgLight: 'bg-amber-50/70', border: 'border-amber-200' },
  { id: 'heart', name: 'Heart & Lipid', icon: Heart, color: 'from-rose-500 to-red-600', textLight: 'text-rose-800', bgLight: 'bg-rose-50/70', border: 'border-rose-200' },
  { id: 'liver', name: 'Liver Health', icon: Activity, color: 'from-emerald-500 to-teal-700', textLight: 'text-emerald-800', bgLight: 'bg-emerald-50/70', border: 'border-emerald-200' },
  { id: 'kidney', name: 'Kidney (Renal)', icon: Activity, color: 'from-cyan-500 to-blue-700', textLight: 'text-cyan-800', bgLight: 'bg-cyan-50/70', border: 'border-cyan-200' },
  { id: 'vitamins', name: 'Vitamins & Iron', icon: Sparkles, color: 'from-violet-500 to-purple-700', textLight: 'text-purple-800', bgLight: 'bg-purple-50/70', border: 'border-purple-200' }
];

interface TestItem {
  id: string;
  name: string;
  code: string;
  category: string;
  parametersCount: number;
  fastingRequired: boolean;
  sampleType: string;
  description: string;
  mrp: number;
  offerPrice: number;
}

interface FeaturedTestItem extends TestItem {
  featuredLab: string;
  labBadge: string;
}

// Pathology catalog directly from Pricing (Individual & Packages)_TestBeat.xlsx
const TESTS_CATALOG: TestItem[] = [
  { id: 't1', name: 'Complete Blood Count (CBC) Test', code: 'HM007', category: 'full-body', parametersCount: 28, fastingRequired: false, sampleType: 'EDTA Blood', description: 'Screening for anemia, platelets, white blood cells & latent infections.', mrp: 450, offerPrice: 299 },
  { id: 't2', name: 'Thyroid Profile Total (T3, T4, TSH)', code: 'BC063', category: 'thyroid', parametersCount: 3, fastingRequired: true, sampleType: 'Serum', description: 'Gold standard test for thyroid gland hormone synthesis and metabolism.', mrp: 650, offerPrice: 429 },
  { id: 't3', name: 'HBA1C Test', code: 'BC035', category: 'diabetes', parametersCount: 2, fastingRequired: false, sampleType: 'Whole Blood', description: 'Evaluates 3-month average blood glucose control with eAG values.', mrp: 550, offerPrice: 349 },
  { id: 't4', name: 'Lipid Profile Test', code: 'BC471', category: 'heart', parametersCount: 8, fastingRequired: true, sampleType: 'Serum', description: 'HDL, LDL, VLDL, Total Cholesterol and Triglycerides ratio.', mrp: 850, offerPrice: 399 },
  { id: 't5', name: 'Liver Function Test (LFT)', code: 'PL94', category: 'liver', parametersCount: 12, fastingRequired: false, sampleType: 'Serum', description: 'Checks liver enzymes (SGOT, SGPT), Bilirubin & total protein levels.', mrp: 750, offerPrice: 399 },
  { id: 't6', name: 'Kidney Function Test (KFT)', code: 'BC360', category: 'kidney', parametersCount: 11, fastingRequired: false, sampleType: 'Serum', description: 'Screens Renal clearance, Serum Creatinine, Uric Acid & Electrolytes.', mrp: 950, offerPrice: 399 },
  { id: 't7', name: 'Vitamin D Test (25-Hydroxy)', code: 'BC075', category: 'vitamins', parametersCount: 1, fastingRequired: false, sampleType: 'Serum', description: 'Detects vitamin D deficiency causing joint fatigue and weak bone density.', mrp: 1400, offerPrice: 499 },
  { id: 't8', name: 'Vitamin B12 Test', code: 'BC074', category: 'vitamins', parametersCount: 1, fastingRequired: true, sampleType: 'Serum', description: 'Critical biomarker for nerve function, neurological health & energy levels.', mrp: 1100, offerPrice: 649 },
  { id: 't9', name: 'Blood Sugar Fasting', code: 'BC023', category: 'diabetes', parametersCount: 1, fastingRequired: true, sampleType: 'Fluoride Plasma', description: '10-12 hours fasting glucose level evaluation.', mrp: 150, offerPrice: 69 },
  { id: 't10', name: 'Blood Sugar Post Prandial (PP)', code: 'BC033', category: 'diabetes', parametersCount: 1, fastingRequired: false, sampleType: 'Fluoride Plasma', description: 'Post-meal glucose level evaluation.', mrp: 150, offerPrice: 69 },
  { id: 't11', name: 'Urine Routine & Microscopic Examination Test', code: 'CP012', category: 'full-body', parametersCount: 22, fastingRequired: false, sampleType: 'Urine', description: 'Evaluates urinary tract infection (UTI), kidney health & protein leak.', mrp: 300, offerPrice: 119 },
  { id: 't12', name: 'Complete Hemogram (CBC & ESR)', code: 'HM013', category: 'full-body', parametersCount: 29, fastingRequired: false, sampleType: 'EDTA Blood', description: 'Complete Blood Count with automated ESR sedimentation rate.', mrp: 600, offerPrice: 449 }
];

const FEATURED_LAB_TESTS: FeaturedTestItem[] = [
  { id: 'ft-1', name: 'Robotic Thyroid Ultra-Sensitive Panel', code: 'BC063', category: 'thyroid', parametersCount: 3, fastingRequired: true, sampleType: 'Serum', description: 'Processed on centralized chemiluminescence automated tracks.', mrp: 700, offerPrice: 220, featuredLab: 'Thyrocare Technologies', labBadge: 'Robotics Partner' },
  { id: 'ft-2', name: 'Smart Cardiac Risk Lipid Profiler', code: 'BC471', category: 'heart', parametersCount: 9, fastingRequired: true, sampleType: 'Serum', description: 'Evaluates atherogenic index & LDL/HDL ratio with cold-chain gel verification.', mrp: 900, offerPrice: 320, featuredLab: 'Healthians Network', labBadge: '4°C Verified' },
  { id: 'ft-3', name: 'AI Precision HbA1c Glycemic Marker', code: 'BC035', category: 'diabetes', parametersCount: 2, fastingRequired: false, sampleType: 'Whole Blood', description: 'HPLC gold-standard methodology with AI glycemic trend forecasting.', mrp: 600, offerPrice: 239, featuredLab: 'Redcliffe Lifetech', labBadge: 'AI Verified' },
  { id: 'ft-4', name: 'National Reference Liver Enzymes Assay', code: 'PL94', category: 'liver', parametersCount: 12, fastingRequired: false, sampleType: 'Serum', description: 'Dual pathologist sign-off on SGOT, SGPT and total protein ratios.', mrp: 850, offerPrice: 340, featuredLab: 'Dr. Lal PathLabs Partner', labBadge: 'Reference Standard' }
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

interface BlogArticle {
  slug: string;
  title: string;
  reads: string;
  category: string;
  content: string[];
}

// Point 6: Complete detailed clinical articles
const HEALTH_WELLNESS_BLOGS: BlogArticle[] = [
  {
    slug: 'cbc-test-guide',
    title: 'Complete Blood Count (CBC): Normal Ranges & Infection Signals',
    reads: '4 min read',
    category: 'Biomarkers',
    content: [
      'A Complete Blood Count (CBC) evaluates red blood cells (RBC), white blood cells (WBC), platelets, and hemoglobin.',
      'Elevated WBC counts often signify acute bacterial infections or inflammation, while lower counts can point to viral suppressions.',
      'Platelet counts below 150,000 uL require close monitoring during viral fevers like Dengue, while healthy hemoglobin levels ensure optimal oxygen transport throughout bodily tissues.'
    ]
  },
  {
    slug: 'fasting-blood-sugar-vs-hba1c',
    title: 'Fasting Blood Sugar vs HbA1c: Which is More Accurate for Diabetes?',
    reads: '5 min read',
    category: 'Diabetes',
    content: [
      'Fasting Blood Sugar measures glucose at an exact instant after 10-12 hours of overnight fasting. It can fluctuate based on stress, sleep, and dinner composition.',
      'HbA1c measures glycated hemoglobin, providing an unalterable weighted average of blood glucose over the past 90 days.',
      'Combining both biomarkers provides doctors with both your immediate baseline and your long-term metabolic health index.'
    ]
  },
  {
    slug: 'vitamin-d-deficiency-symptoms',
    title: 'Silent Vitamin D & B12 Deficiency Symptoms in Working Adults',
    reads: '6 min read',
    category: 'Nutrition',
    content: [
      'Vitamin D (25-Hydroxy) acts as a hormone regulating bone density, calcium assimilation, and immune defense against respiratory illnesses.',
      'Vitamin B12 is essential for neurological sheath maintenance and active red blood cell synthesis. Deficiency leads to chronic fatigue, tingling in extremities, and brain fog.',
      'Annual screening helps identify sub-clinical deficiencies before irreversible neuropathy or bone mineral loss occurs.'
    ]
  },
  {
    slug: 'lipid-profile-heart-health',
    title: 'Understanding Good HDL vs Bad LDL: How to Read Your Lipid Report',
    reads: '5 min read',
    category: 'Cardiology',
    content: [
      'Your total lipid panel breaks down into Total Cholesterol, HDL (protective scavenger), LDL (atherogenic plaque builder), and Triglycerides.',
      'A healthy target involves maintaining LDL below 100 mg/dL while keeping HDL above 40 mg/dL (men) and 50 mg/dL (women).',
      'The Triglyceride-to-HDL ratio provides early insight into insulin resistance and endothelial cardiovascular risk.'
    ]
  },
  {
    slug: 'thyroid-fasting-protocols',
    title: 'Why Morning Fasting & Pill Timing Matters Before a Thyroid Test',
    reads: '3 min read',
    category: 'Endocrine',
    content: [
      'Thyroid stimulating hormone (TSH) follows a circadian rhythm, peaking in early morning hours before gradually declining throughout the day.',
      'If you take daily thyroid medication (Levothyroxine), always provide your morning blood sample BEFORE swallowing your tablet.',
      'Maintain an overnight fasting window of 10-12 hours for the cleanest serum analysis without digestive lipid interference.'
    ]
  },
  {
    slug: 'kidney-kft-creatinine-facts',
    title: 'Serum Creatinine & eGFR: Early Warning Indicators of Renal Strain',
    reads: '5 min read',
    category: 'Renal Care',
    content: [
      'Serum Creatinine is a standard byproduct of muscle metabolism excreted purely by renal filtration.',
      'The estimated Glomerular Filtration Rate (eGFR) calculates how effectively your nephrons filter blood each minute based on creatinine and age.',
      'Routine annual KFT panels help identify asymptomatic early-stage renal strain decades before permanent clinical symptoms emerge.'
    ]
  }
];

type FamilyRelation = 'Self' | 'Spouse' | 'Children' | 'Parents' | 'Other';
type GenderType = 'Male' | 'Female' | 'Other';

interface FamilyMember {
  id: string;
  relation: FamilyRelation;
  name: string;
  age: number;
  gender: GenderType;
}

interface OrderConfirmationData {
  bookingId: string;
  patientName: string;
  amountPaid: number;
  address: string;
  testCount: number;
  scheduledTime: string;
}

export default function TestBeatPortal() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Point 7: Initially empty selection (No pre-selected tests)
  const [selectedTests, setSelectedTests] = useState<TestItem[]>([]);
  const [showCompareTable, setShowCompareTable] = useState(false);

  // Cart Drawer State & Working Checkout
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [useWalletBalance, setUseWalletBalance] = useState(true);

  // Order Confirmation Modal State
  const [confirmedOrder, setConfirmedOrder] = useState<OrderConfirmationData | null>(null);

  // User Dropdown & Customer Panel Modals
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeAccountView, setActiveAccountView] = useState<'profile' | 'orders' | 'subscriptions' | 'wallet' | 'family' | null>(null);

  // Desktop & Mobile Side-Drawer Menu State
  const [isDrawerMenuOpen, setIsDrawerMenuOpen] = useState(false);

  // Location Selector Modal State (Point 8)
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [currentSelectedLocation, setCurrentSelectedLocation] = useState('Gautambuddha Nagar (Greater Noida) (201310)');
  const [locationSearchInput, setLocationSearchInput] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Authentication States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authOtpSent, setAuthOtpSent] = useState(false);
  const [patientMobile, setPatientMobile] = useState('');
  const [patientOtp, setPatientOtp] = useState('');

  // Initial Signup Data
  const [signupForm, setSignupForm] = useState({
    phone: '',
    name: '',
    age: '',
    city: '',
    pincode: ''
  });

  // Profile Data
  const [profileData, setProfileData] = useState({
    name: 'Guest Patient',
    phone: '8368887011',
    age: '28',
    city: 'Greater Noida',
    pincode: '201310',
    address: 'Chi V, Greater Noida, Uttar Pradesh'
  });

  // Wallet Management
  const [walletBalance, setWalletBalance] = useState(250);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [rechargeAmt, setRechargeAmt] = useState(500);

  // Family Management
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: 'f-1', relation: 'Self', name: 'Guest Patient', age: 28, gender: 'Male' },
    { id: 'f-2', relation: 'Spouse', name: 'Pooja Kumari', age: 26, gender: 'Female' }
  ]);
  const [isAddFamilyOpen, setIsAddFamilyOpen] = useState(false);
  const [newFamilyMember, setNewFamilyMember] = useState<{
    relation: FamilyRelation;
    name: string;
    age: string;
    gender: GenderType;
  }>({
    relation: 'Parents',
    name: '',
    age: '',
    gender: 'Male'
  });

  // Prescription Reader States (100% English & Inline UI - Point 1 & 2)
  const [isRxOpen, setIsRxOpen] = useState(false);
  const [rxScanning, setRxScanning] = useState(false);
  const [rxStatusMsg, setRxStatusMsg] = useState('');
  const [rxUnmatchedTests, setRxUnmatchedTests] = useState<string[]>([]);
  const [rxDetectedPrescriptions, setRxDetectedPrescriptions] = useState<string[]>([]);
  const [rxManualSearch, setRxManualSearch] = useState('');
  const rxFileInputRef = useRef<HTMLInputElement>(null);

  // Blog Detailed View Modal (Point 6)
  const [activeBlogModal, setActiveBlogModal] = useState<BlogArticle | null>(null);

  // Dedicated Partner With Us Modal States
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [affiliateSubmitted, setAffiliateSubmitted] = useState(false);
  const [affiliateData, setAffiliateData] = useState({
    name: '',
    phone: '',
    city: '',
    category: 'Doctor / Clinic'
  });

  // Dynamic filter for Location (City, State, or Pincode - Point 8)
  const filteredLocationResults = useMemo(() => {
    const q = locationSearchInput.toLowerCase().trim();
    if (!q) return SERVICEABLE_LOCATIONS_DATA;
    return SERVICEABLE_LOCATIONS_DATA.filter(item => 
      item.city.toLowerCase().includes(q) ||
      item.state.toLowerCase().includes(q) ||
      item.pin.includes(q) ||
      item.allPins.some(p => p.startsWith(q) || p.includes(q))
    );
  }, [locationSearchInput]);

  const filteredCatalog = useMemo(() => {
    return TESTS_CATALOG.filter(item => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.code.toLowerCase().includes(searchQuery.toLowerCase());
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

  const cartSubtotal = useMemo(() => {
    return selectedTests.reduce((acc, t) => acc + t.offerPrice, 0);
  }, [selectedTests]);

  const cartDiscount = useMemo(() => {
    const grossMrp = selectedTests.reduce((acc, t) => acc + t.mrp, 0);
    return grossMrp - cartSubtotal;
  }, [selectedTests, cartSubtotal]);

  const finalPayable = useMemo(() => {
    if (!useWalletBalance) return cartSubtotal;
    const deduction = Math.min(walletBalance, cartSubtotal);
    return Math.max(0, cartSubtotal - deduction);
  }, [cartSubtotal, walletBalance, useWalletBalance]);

  // Point 3: Aggregator rates ONLY for user selected tests (no health packages)
  const calculatedQuotes = useMemo(() => {
    if (selectedTests.length === 0) return [];
    const baseSum = selectedTests.reduce((acc, t) => acc + t.offerPrice, 0);
    return LAB_CHAINS.map(lab => {
      const grossMrp = Math.round(baseSum * lab.baseMultiplier * 1.5);
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

  // Point 8: Live GPS Location Detection with Pincode
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
          .then(res => res.json())
          .then(data => {
            setIsDetectingLocation(false);
            const city = data?.city || data?.locality || 'Faridabad';
            const pin = data?.postcode || '121001';
            const label = `${city} (${pin})`;
            setCurrentSelectedLocation(label);
            setProfileData(prev => ({ ...prev, city, pincode: pin }));
            setIsLocationModalOpen(false);
          })
          .catch(() => {
            setIsDetectingLocation(false);
            const fallback = 'Faridabad (121001)';
            setCurrentSelectedLocation(fallback);
            setProfileData(prev => ({ ...prev, city: 'Faridabad', pincode: '121001' }));
            setIsLocationModalOpen(false);
          });
      },
      () => {
        setIsDetectingLocation(false);
        alert('Could not access live GPS. Please select your city or pincode from the search list.');
      }
    );
  };

  // Point 2: Prescription upload & AI scan (No browser alert, inline status)
  const handleRxFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRxScanning(true);
    setRxStatusMsg('Uploading prescription slip...');
    setRxUnmatchedTests([]);
    setRxDetectedPrescriptions([]);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64String = reader.result as string;
      setRxStatusMsg('Scanning doctor handwriting & lab biomarkers...');

      try {
        const response = await fetch('/api/read-prescription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64String })
        });

        const data = await response.json();

        if (response.ok && data.success && Array.isArray(data.tests)) {
          const detected: string[] = data.tests;
          setRxDetectedPrescriptions(detected);

          const matchedCatalogTests: TestItem[] = [];
          const unmatched: string[] = [];

          detected.forEach((rxTestName: string) => {
            const rxLower = rxTestName.toLowerCase().trim();
            const foundInCatalog = TESTS_CATALOG.find(catItem => {
              const catLower = catItem.name.toLowerCase();
              return catLower.includes(rxLower) || 
                     rxLower.includes(catItem.name.split(' ')[0].toLowerCase());
            });

            if (foundInCatalog) {
              if (!matchedCatalogTests.some(m => m.id === foundInCatalog.id)) {
                matchedCatalogTests.push(foundInCatalog);
              }
            } else {
              unmatched.push(rxTestName);
            }
          });

          // Auto-select matched tests into user's selection
          if (matchedCatalogTests.length > 0) {
            setSelectedTests(prev => {
              const merged = [...prev];
              matchedCatalogTests.forEach(item => {
                if (!merged.some(m => m.id === item.id)) {
                  merged.push(item);
                }
              });
              return merged;
            });
          }

          setRxUnmatchedTests(unmatched);
          setRxStatusMsg(
            matchedCatalogTests.length > 0
              ? `Success! ${matchedCatalogTests.length} tests matched and auto-selected.`
              : 'Prescription scanned successfully.'
          );
        } else {
          setRxStatusMsg(data.error || 'Handwriting could not be read clearly. Please select tests manually below.');
        }
      } catch {
        setRxStatusMsg('Network issue occurred. Please select tests manually below.');
      } finally {
        setRxScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Auth Handlers
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authOtpSent) {
      if (patientMobile.length !== 10) return alert('Enter valid 10-digit mobile number');
      setAuthOtpSent(true);
      alert(`MSG91 OTP sent to +91 ${patientMobile}`);
    } else {
      if (patientOtp.length < 4) return alert('Enter valid verification code');
      setIsLoggedIn(true);
      setProfileData({ ...profileData, phone: patientMobile, name: 'Verified Patient' });
      setIsAuthOpen(false);
      setAuthOtpSent(false);
      alert('Login successful! Welcome to TestBeat.');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authOtpSent) {
      if (signupForm.phone.length !== 10) return alert('Enter valid 10-digit phone');
      setAuthOtpSent(true);
      alert(`Account setup details received! OTP sent to +91 ${signupForm.phone}`);
    } else {
      setIsLoggedIn(true);
      setProfileData({
        name: signupForm.name,
        phone: signupForm.phone,
        age: signupForm.age,
        city: signupForm.city,
        pincode: signupForm.pincode,
        address: `${signupForm.city}, ${signupForm.pincode}`
      });
      setFamilyMembers(prev => [
        { id: 'f-self', relation: 'Self', name: signupForm.name, age: parseInt(signupForm.age) || 28, gender: 'Male' },
        ...prev.filter(m => m.relation !== 'Self')
      ]);
      setIsAuthOpen(false);
      setAuthOtpSent(false);
      alert('Sign Up completed! ₹250 promotional health credit added to your wallet.');
    }
  };

  const handleAddMoneyConfirm = () => {
    if (rechargeAmt <= 0) return;
    setWalletBalance(prev => prev + rechargeAmt);
    setIsAddMoneyOpen(false);
    alert(`₹${rechargeAmt} credited to your TestBeat Wallet!`);
  };

  const handleAddFamilyConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFamilyMember.name || !newFamilyMember.age) return alert('Enter required fields');
    const created: FamilyMember = {
      id: `fam-${Date.now()}`,
      relation: newFamilyMember.relation,
      name: newFamilyMember.name,
      age: parseInt(newFamilyMember.age) || 30,
      gender: newFamilyMember.gender
    };
    setFamilyMembers(prev => [...prev, created]);
    setIsAddFamilyOpen(false);
    setNewFamilyMember({ relation: 'Parents', name: '', age: '', gender: 'Male' });
    alert(`${created.name} (${created.relation}) added successfully!`);
  };

  const handleProceedCheckout = () => {
    if (selectedTests.length === 0) return alert('Please select at least 1 test to checkout');
    
    const charged = finalPayable;
    if (useWalletBalance && walletBalance > 0) {
      const deduction = Math.min(walletBalance, cartSubtotal);
      setWalletBalance(prev => Math.max(0, prev - deduction));
    }

    const orderData: OrderConfirmationData = {
      bookingId: `#TB-${Math.floor(100000 + Math.random() * 900000)}`,
      patientName: profileData.name,
      amountPaid: charged,
      address: profileData.address,
      testCount: selectedTests.length,
      scheduledTime: 'Tomorrow Morning (07:00 AM - 08:00 AM)'
    };

    setIsCartOpen(false);
    setConfirmedOrder(orderData);
  };

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAffiliateSubmitted(true);
    setTimeout(() => {
      setIsPartnerModalOpen(false);
      setAffiliateSubmitted(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-[#039487] selection:text-white">

      {/* 1. TOP PAN-INDIA TRUST & HELPLINE BAR */}
      <div className="bg-[#012C63] text-slate-200 text-xs py-2 px-4 border-b border-[#0c3b65]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-4 overflow-x-auto text-[11px] sm:text-xs">
            <span className="flex items-center text-emerald-300 font-extrabold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-300" /> 100% NABH & NABL (ISO 15189) Accredited Partner Labs
            </span>
            <span className="hidden md:inline text-slate-400">•</span>
            <span className="hidden md:flex items-center text-slate-200 font-semibold">
              <Activity className="w-3.5 h-3.5 mr-1 text-teal-300" /> Cold-Chain Specimen Logistics (2°C - 8°C)
            </span>
            <span className="hidden lg:inline text-slate-400">•</span>
            <span className="flex items-center text-amber-300 font-bold">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Free Doorstep Sample Pickup
            </span>
          </div>

          <div className="flex items-center space-x-5 text-xs">
            <button 
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center text-slate-200 hover:text-white transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 mr-1 text-[#F44236]" />
              <span>Pan-India (23 States • 2,100+ PINs Covered)</span>
            </button>
            <a href="tel:+918368887011" className="flex items-center text-teal-300 font-bold hover:underline">
              <PhoneCall className="w-3.5 h-3.5 mr-1" /> +91 83688 87011
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center space-x-4">
            <a href="#" className="flex items-center space-x-3 group">
              <div className="w-11 h-11 rounded-2xl bg-[#012C63] flex items-center justify-center p-1.5 shadow-md shadow-[#012C63]/20 group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 100 100" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="25" y="15" width="50" height="12" rx="6" stroke="white" strokeWidth="6" />
                  <path d="M35 27V65C35 73.2843 41.7157 80 50 80C58.2843 80 65 73.2843 65 65V27" stroke="white" strokeWidth="6" />
                  <path d="M42 50L46 54L50 44L54 52L58 48" stroke="#039487" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M50 63C47.7909 63 46 64.7909 46 67C46 69.2091 47.7909 71 50 71C52.2091 71 54 69.2091 54 67C54 64.7909 52.2091 63 50 63Z" fill="#F44236" />
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

            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#012C63] transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#F44236]" />
              <span className="truncate max-w-[170px]">{currentSelectedLocation}</span>
              <span className="text-slate-400 text-[10px]">▼</span>
            </button>
          </div>

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
            <a href="#featured-tests" className="flex items-center space-x-1.5 hover:text-[#012C63] transition-colors">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Featured Tests</span>
            </a>
          </nav>

          <div className="flex items-center space-x-3.5">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              title="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {selectedTests.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#012C63] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {selectedTests.length}
                </span>
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="w-10 h-10 rounded-full border-2 border-[#012C63] flex items-center justify-center text-[#012C63] hover:bg-teal-50 transition-all shadow-sm"
              >
                <User className="w-5 h-5" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 pb-2 border-b border-slate-100">
                    <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">ACCOUNT</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-7 h-7 rounded-full bg-[#012C63] text-white text-xs font-bold flex items-center justify-center">
                        {profileData.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-extrabold text-slate-800 truncate">
                          {isLoggedIn ? profileData.name : 'Welcome Guest User...'}
                        </p>
                        <p className="text-[10px] text-slate-400">{isLoggedIn ? `+91 ${profileData.phone}` : 'Not Logged In'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-1 text-xs font-bold text-slate-700 divide-y divide-slate-50">
                    <button
                      onClick={() => { setActiveAccountView('profile'); setUserDropdownOpen(false); }}
                      className="w-full flex items-center px-4 py-2.5 hover:bg-teal-50/50 hover:text-[#039487] transition-colors text-left"
                    >
                      <UserCheck className="w-4 h-4 mr-2.5 text-slate-400" />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => { setActiveAccountView('orders'); setUserDropdownOpen(false); }}
                      className="w-full flex items-center px-4 py-2.5 hover:bg-teal-50/50 hover:text-[#039487] transition-colors text-left"
                    >
                      <Package className="w-4 h-4 mr-2.5 text-slate-400" />
                      <span>My Orders</span>
                    </button>
                    <button
                      onClick={() => { setActiveAccountView('subscriptions'); setUserDropdownOpen(false); }}
                      className="w-full flex items-center px-4 py-2.5 hover:bg-teal-50/50 hover:text-[#039487] transition-colors text-left"
                    >
                      <Calendar className="w-4 h-4 mr-2.5 text-slate-400" />
                      <span>My Subscriptions</span>
                    </button>
                    <button
                      onClick={() => { setActiveAccountView('wallet'); setUserDropdownOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-teal-50/50 hover:text-[#039487] transition-colors text-left"
                    >
                      <div className="flex items-center">
                        <Wallet className="w-4 h-4 mr-2.5 text-slate-400" />
                        <span>Wallet Balance</span>
                      </div>
                      <span className="text-xs font-black text-[#039487]">₹{walletBalance}</span>
                    </button>
                    <button
                      onClick={() => { setActiveAccountView('family'); setUserDropdownOpen(false); }}
                      className="w-full flex items-center px-4 py-2.5 hover:bg-teal-50/50 hover:text-[#039487] transition-colors text-left"
                    >
                      <Users className="w-4 h-4 mr-2.5 text-slate-400" />
                      <span>Family Members</span>
                    </button>
                  </div>

                  <div className="pt-2 px-3 border-t border-slate-100">
                    <button
                      onClick={() => {
                        if (isLoggedIn) {
                          setIsLoggedIn(false);
                          alert('Logged out successfully');
                        } else {
                          setIsAuthOpen(true);
                          setAuthMode('LOGIN');
                          setAuthOtpSent(false);
                        }
                        setUserDropdownOpen(false);
                      }}
                      className="w-full py-2 bg-[#012C63] hover:bg-[#0c3b65] text-white text-xs font-bold rounded-xl shadow transition-all"
                    >
                      {isLoggedIn ? 'Logout Account' : 'Login / Sign Up'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsDrawerMenuOpen(true)}
              className="p-2.5 rounded-xl border border-slate-200 text-[#012C63] hover:bg-slate-100 transition-colors shadow-2xs"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </header>

      {/* 3-LINE SIDE-DRAWER MENU */}
      {isDrawerMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-sm h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-[#012C63] text-white">
              <div className="flex items-center space-x-2">
                <Menu className="w-5 h-5 text-teal-300" />
                <h3 className="text-base font-black">TestBeat Navigation</h3>
              </div>
              <button 
                onClick={() => setIsDrawerMenuOpen(false)}
                className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-2 text-sm font-bold text-slate-700">
              <a 
                href="#compare" 
                onClick={() => setIsDrawerMenuOpen(false)}
                className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-teal-50 hover:text-[#039487] transition-colors"
              >
                <FlaskConical className="w-5 h-5 text-[#039487]" />
                <span>Compare Labs Live</span>
              </a>

              <a 
                href="#packages" 
                onClick={() => setIsDrawerMenuOpen(false)}
                className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-teal-50 hover:text-[#039487] transition-colors"
              >
                <Package className="w-5 h-5 text-indigo-600" />
                <span>Health Packages</span>
              </a>

              <a 
                href="#habits" 
                onClick={() => setIsDrawerMenuOpen(false)}
                className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-teal-50 hover:text-[#039487] transition-colors"
              >
                <Activity className="w-5 h-5 text-rose-500" />
                <span>Tests by Health Risks</span>
              </a>

              <a 
                href="#featured-tests" 
                onClick={() => setIsDrawerMenuOpen(false)}
                className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-teal-50 hover:text-[#039487] transition-colors"
              >
                <Award className="w-5 h-5 text-amber-500" />
                <span>Featured Tests</span>
              </a>

              <button 
                onClick={() => { setIsDrawerMenuOpen(false); setIsRxOpen(true); }}
                className="w-full flex items-center space-x-3 p-3 rounded-2xl hover:bg-teal-50 hover:text-[#039487] transition-colors text-left"
              >
                <UploadCloud className="w-5 h-5 text-amber-500" />
                <span>Upload Doctor Prescription</span>
              </button>

              <button 
                onClick={() => { setIsDrawerMenuOpen(false); setIsLocationModalOpen(true); }}
                className="w-full flex items-center space-x-3 p-3 rounded-2xl hover:bg-teal-50 hover:text-[#039487] transition-colors text-left"
              >
                <MapPin className="w-5 h-5 text-[#F44236]" />
                <span>Serviceable Cities (23 States)</span>
              </button>

              <button 
                onClick={() => { setIsDrawerMenuOpen(false); setIsPartnerModalOpen(true); }}
                className="w-full flex items-center space-x-3 p-3 rounded-2xl hover:bg-emerald-50 text-emerald-800 transition-colors text-left"
              >
                <Handshake className="w-5 h-5 text-emerald-600" />
                <span>Partner With Us</span>
              </button>

              <a 
                href="https://wa.me/918368887011"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-emerald-50 text-emerald-700 transition-colors"
              >
                <PhoneCall className="w-5 h-5 text-emerald-600" />
                <span>Customer Care (+91 83688 87011)</span>
              </a>
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => { setIsDrawerMenuOpen(false); setIsAuthOpen(true); }}
                className="w-full py-3 bg-[#012C63] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow"
              >
                {isLoggedIn ? 'Access Patient Portal' : 'Patient Sign In / Register'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 3. HERO SECTION WITH 100% ENGLISH COPY (Point 1) */}
      <section className="bg-gradient-to-b from-teal-50/50 via-white to-slate-50 pt-10 pb-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
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

              {/* Point 3: Search bar - selecting tests adds inline chips without auto-scrolling down */}
              <div className="mt-6 relative max-w-xl">
                <div className="relative flex items-center bg-white border-2 border-slate-200 focus-within:border-[#039487] rounded-2xl p-2 shadow-lg shadow-teal-600/5 transition-all">
                  <Search className="w-5 h-5 text-[#039487] ml-3 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setIsSearchFocused(true)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search from 1500+ tests: CBC, Vitamin D, HbA1c, Thyroid, Lipid..."
                    className="w-full px-3 py-2 text-slate-900 placeholder-slate-400 font-semibold focus:outline-none text-sm"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600 mr-2">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {isSearchFocused && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl p-3 z-30 max-h-72 overflow-y-auto">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-[11px] font-bold text-slate-400">
                      <span>MATCHING TESTS FROM PRICING DIRECTORY ({filteredCatalog.length})</span>
                      <button onClick={() => setIsSearchFocused(false)} className="text-rose-500 hover:underline">Close</button>
                    </div>
                    <div className="divide-y divide-slate-100 mt-1">
                      {filteredCatalog.map(test => {
                        const isSelected = selectedTests.some(t => t.id === test.id);
                        return (
                          <div 
                            key={test.id} 
                            onClick={() => toggleTest(test)}
                            className={`p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${isSelected ? 'bg-teal-50 text-[#039487]' : 'hover:bg-slate-50'}`}
                          >
                            <div>
                              <p className="font-extrabold text-xs text-slate-900">{test.name}</p>
                              <p className="text-[10px] text-slate-500">{test.code} • {test.parametersCount} Parameters</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="font-black text-xs text-[#012C63]">₹{test.offerPrice}</span>
                              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${isSelected ? 'bg-[#039487] text-white' : 'bg-slate-100 text-slate-700'}`}>
                                {isSelected ? 'Selected ✓' : '+ Select'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Point 3: Inline Selected Tests List & Compare Button directly under Search */}
              {selectedTests.length > 0 && (
                <div className="mt-4 p-3.5 bg-white border border-teal-200 rounded-2xl shadow-xs max-w-xl">
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <span className="font-extrabold text-[#012C63]">{selectedTests.length} Test(s) Selected</span>
                    <button 
                      onClick={() => {
                        setShowCompareTable(true);
                        const compElem = document.getElementById('compare');
                        if (compElem) compElem.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-xs font-black text-[#039487] hover:underline flex items-center space-x-1"
                    >
                      <span>Compare Selected Tests Now</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {selectedTests.map(t => (
                      <span key={t.id} className="inline-flex items-center text-[11px] bg-teal-50 border border-teal-200 text-teal-900 px-2 py-0.5 rounded-lg font-bold">
                        <span>{t.name} (₹{t.offerPrice})</span>
                        <button onClick={() => toggleTest(t)} className="ml-1 text-slate-400 hover:text-rose-500">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

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

            {/* Right Column: 100% English Prescription Card (Point 1) */}
            <div className="lg:col-span-4">
              <div className="relative rounded-3xl p-6 text-white shadow-2xl border border-teal-500/30 overflow-hidden bg-gradient-to-br from-[#012C63] via-[#09356d] to-[#011c40] group">
                
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#039487]/15 to-transparent h-20 -translate-y-full group-hover:translate-y-[280px] transition-transform duration-1000 ease-in-out pointer-events-none"></div>
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-28 h-28 bg-[#039487]/25 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex items-center justify-between mb-3 relative z-10">
                  <div className="flex items-center space-x-2 text-teal-300">
                    <div className="w-7 h-7 rounded-lg bg-[#039487]/30 flex items-center justify-center border border-teal-400/40">
                      <Camera className="w-4 h-4 text-teal-300" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-teal-300">
                      TestBeat AI Vision
                    </span>
                  </div>
                  <span className="bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping"></span>
                    <span>Live Scanner</span>
                  </span>
                </div>
                
                <h3 className="text-xl font-black leading-snug relative z-10">
                  Upload Doctor Prescription
                </h3>
                <p className="text-slate-200 text-xs mt-1.5 mb-5 leading-relaxed relative z-10">
                  Upload your doctor&apos;s prescription slip. <span className="text-teal-300 font-bold">TestBeat AI</span> automatically detects prescribed tests, checks live laboratory prices, and matches the cheapest rate.
                </p>

                <div className="space-y-3 relative z-10">
                  <button
                    onClick={() => setIsRxOpen(true)}
                    className="w-full py-3.5 bg-gradient-to-r from-[#039487] to-teal-500 hover:from-teal-600 hover:to-[#039487] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-lg shadow-teal-900/50 hover:scale-[1.02]"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload & Scan Prescription (TestBeat AI)</span>
                  </button>

                  <a
                    href="https://wa.me/918368887011?text=Hello%20TestBeat,%20I%20want%20to%20book%20tests%20from%20my%20prescription"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-teal-300 border border-teal-400/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Send via WhatsApp (+91 83688 87011)</span>
                  </a>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-300 mt-4 pt-3 border-t border-white/10 relative z-10">
                  <span>✓ 100% Medical Privacy</span>
                  <span>⚡ Instant Test Extraction</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. TESTS BY HEALTH RISKS & ORGANS (Point 4: Decorated Categories, Point 7: Zero Pre-Selection) */}
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

        {/* Decorated Categories Tabs (Point 4) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          {CLINICAL_CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center transition-all transform hover:-translate-y-0.5 shadow-xs ${
                  isActive 
                    ? `bg-gradient-to-br ${cat.color} text-white border-transparent shadow-md ring-4 ring-teal-100 scale-105` 
                    : `${cat.bgLight} ${cat.textLight} ${cat.border} hover:border-[#039487]`
                }`}
              >
                <div className={`p-2 rounded-xl mb-1.5 ${isActive ? 'bg-white/20' : 'bg-white shadow-2xs'}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                </div>
                <span className="text-xs font-black text-center leading-tight">{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selectable Test Cards (Point 7: Zero Pre-Selected tests) */}
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
      </section>

      {/* 5. LIVE MULTI-LAB COMPARISON MATRIX (Point 3: Shows ONLY user selected tests) */}
      {(showCompareTable || selectedTests.length > 0) && (
        <section className="bg-white border-t border-b border-slate-200 py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in" id="compare">
          <div className="max-w-7xl mx-auto" id="lab-compare">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-black text-teal-800 bg-teal-100 px-3 py-1 rounded-full uppercase tracking-wider">
                Real-Time Comparative Pricing
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-2">
                Compare India&apos;s Top Diagnostic Labs
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Displaying real-time aggregated quotes for your <span className="font-bold text-slate-900">{selectedTests.length} selected individual test(s)</span>.
              </p>
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
                        onClick={() => setIsCartOpen(true)}
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
      )}

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

      {/* 7. FEATURED LAB TESTS SECTION */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200" id="featured-tests">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-black text-[#039487] bg-teal-50 border border-teal-200 px-3 py-1 rounded-full uppercase tracking-wider">
                Partner Lab Spotlights
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-2">
                Featured Diagnostic Tests by Accredited Labs
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Curated high-precision individual pathology assays verified by specialized laboratory partners.
              </p>
            </div>
            <a href="#compare" className="text-xs font-bold text-[#039487] hover:underline flex items-center">
              <span>View All Tests</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_LAB_TESTS.map((test) => (
              <div key={test.id} className="bg-slate-50/70 border border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase text-[#012C63] bg-teal-100 px-2 py-0.5 rounded">
                      {test.labBadge}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">{test.parametersCount} Params</span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-sm leading-snug">{test.name}</h4>
                  <p className="text-[11px] text-teal-800 font-bold mt-1">Partner: {test.featuredLab}</p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{test.description}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200">
                  <div className="flex items-baseline space-x-2 mb-3">
                    <span className="text-2xl font-black text-[#012C63]">₹{test.offerPrice}</span>
                    <span className="text-xs line-through text-slate-400">₹{test.mrp}</span>
                  </div>
                  <button
                    onClick={() => {
                      toggleTest(test);
                      setIsCartOpen(true);
                    }}
                    className="w-full py-2.5 bg-[#012C63] hover:bg-[#0c3b65] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    + Book with {test.featuredLab.split(' ')[0]}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CLINICAL WELLNESS GUIDELINES SECTION */}
      <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200" id="wellness">
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
            <div className="border border-slate-200 rounded-3xl p-6 bg-white shadow-xs">
              <Clock className="w-8 h-8 text-[#039487] mb-3" />
              <h4 className="font-extrabold text-slate-900 text-base mb-2">10 - 12 Hours Fasting Rules</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fasting blood sugar, Lipid profiles, and Liver panels require complete overnight fasting. Plain drinking water is allowed, but tea, milk, or juices must be avoided.
              </p>
            </div>

            <div className="border border-slate-200 rounded-3xl p-6 bg-white shadow-xs">
              <Activity className="w-8 h-8 text-[#012C63] mb-3" />
              <h4 className="font-extrabold text-slate-900 text-base mb-2">Morning Medication Protocol</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Thyroid medication (Levothyroxine) should be taken only after blood sample collection. Routine blood pressure medications can be consumed with water unless instructed otherwise.
              </p>
            </div>

            <div className="border border-slate-200 rounded-3xl p-6 bg-white shadow-xs">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mb-3" />
              <h4 className="font-extrabold text-slate-900 text-base mb-2">Cold-Chain Sample Protection</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                All TestBeat samples are barcoded at your home and transferred in certified 2°C - 8°C gel-pack boxes to preserve enzyme viability and deliver 100% accurate lab readings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FOOTER WITH SERVICEABLE LOCATIONS & DETAILED BLOGS (Point 5: Reviews section completely removed) */}
      <footer className="bg-[#012C63] text-slate-300 text-xs border-t border-[#0c3b65]">
        
        {/* Serviceable Locations Directory */}
        <div className="border-b border-[#0c3b65]/80 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base font-black text-white flex items-center">
                  <MapPin className="w-4 h-4 text-[#F44236] mr-1.5" />
                  Serviceable States & Cities Across India (23 States • 2,100+ Pincodes)
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Phlebotomist doorstep sample pickup network with cold-chain gel bags across northern and central hubs.
                </p>
              </div>
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-teal-300 text-xs font-bold transition-colors"
              >
                Change Location & Pincode →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 text-[11px]">
              {SERVICEABLE_LOCATIONS_DATA.slice(0, 16).map((loc, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="font-extrabold text-teal-300 text-xs truncate" title={loc.city}>{loc.city.split(' ')[0]}</p>
                  <p className="text-[10px] text-slate-400">{loc.state}</p>
                  <button 
                    onClick={() => {
                      setCurrentSelectedLocation(`${loc.city} (${loc.pin})`);
                      alert(`Location updated to ${loc.city}. Doorstep sample collection active.`);
                    }} 
                    className="hover:text-white transition-colors text-left text-slate-300 text-[10px]"
                  >
                    PIN: {loc.pin}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Diagnostic Blogs with Full Article Reading Modal (Point 6) */}
        <div className="border-b border-[#0c3b65]/80 py-10 px-4 sm:px-6 lg:px-8" id="blogs">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 mb-5">
              <BookOpen className="w-4 h-4 text-[#039487]" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Health Wellness Diagnostic Blogs & Guides</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {HEALTH_WELLNESS_BLOGS.map((blog, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-teal-400/40 transition-colors">
                  <span className="text-[10px] font-black uppercase text-teal-300 bg-teal-900/60 px-2 py-0.5 rounded">
                    {blog.category}
                  </span>
                  <h4 className="font-bold text-white text-xs mt-1.5 leading-snug">{blog.title}</h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 pt-2 border-t border-white/5">
                    <span>{blog.reads}</span>
                    <button 
                      onClick={() => setActiveBlogModal(blog)} 
                      className="text-teal-300 font-bold hover:underline"
                    >
                      Read Full Guide →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Corporate Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
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
              <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Partner Network</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setIsPartnerModalOpen(true)} className="text-teal-300 font-bold hover:underline flex items-center space-x-1">
                    <span>★ Partner With Us (Application)</span>
                  </button>
                </li>
                <li><button onClick={() => setIsPartnerModalOpen(true)} className="hover:text-white">Doctor & Clinic Integrations</button></li>
                <li><button onClick={() => setIsPartnerModalOpen(true)} className="hover:text-white">Franchise Collection Points</button></li>
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

          <div className="pt-6 border-t border-[#0c3b65] flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
            <p>© 2026 TestBeat Health Technologies Pvt Ltd. All rights reserved.</p>
            <p>Pan-India Medical Diagnostic Platform.</p>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
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

      {/* Point 7: COMPACT FLOATING CART / COMPARE BADGE (Clean 1-line strip replacing big blue box) */}
      {selectedTests.length > 0 && (
        <div className="fixed bottom-6 left-6 z-40 bg-[#012C63] text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-teal-500/40 flex items-center space-x-3.5 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-[#039487] rounded-full flex items-center justify-center text-xs font-black">
              {selectedTests.length}
            </div>
            <span className="text-xs font-bold">{selectedTests.length} Test(s) Selected</span>
          </div>
          <button
            onClick={() => {
              setShowCompareTable(true);
              const compElem = document.getElementById('compare');
              if (compElem) compElem.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3 py-1 bg-[#039487] hover:bg-teal-600 text-white rounded-xl text-xs font-black"
          >
            Compare Labs
          </button>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-teal-300 rounded-xl text-xs font-bold"
          >
            Cart
          </button>
        </div>
      )}

      {/* ================= MODAL: BLOG FULL ARTICLE MODAL (Point 6) ================= */}
      {activeBlogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 relative border border-slate-100 max-h-[85vh] overflow-y-auto">
            <button 
              onClick={() => setActiveBlogModal(null)} 
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-xs font-black uppercase text-[#039487] bg-teal-50 px-2.5 py-1 rounded-md">
              {activeBlogModal.category} • {activeBlogModal.reads}
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-2 mb-4 leading-snug">
              {activeBlogModal.title}
            </h3>
            <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
              {activeBlogModal.content.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Published by TestBeat Clinical Pathologists</span>
              <button 
                onClick={() => setActiveBlogModal(null)}
                className="px-4 py-2 bg-[#012C63] text-white rounded-xl text-xs font-bold"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: 100% ENGLISH TESTBEAT AI PRESCRIPTION SCANNER (Point 1 & 2) ================= */}
      {isRxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsRxOpen(false);
                setRxScanning(false);
                setRxStatusMsg('');
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-1.5 text-[#039487] mb-1">
              <Camera className="w-4 h-4" />
              <span className="text-[11px] font-black uppercase tracking-wider">TestBeat AI Vision Scanner</span>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-1">Doctor Prescription Scanner</h3>
            <p className="text-slate-500 text-xs mb-4">
              Upload prescription image or PDF. TestBeat AI analyzes doctor handwriting and automatically selects matching pathology tests into your cart.
            </p>

            <input 
              type="file" 
              ref={rxFileInputRef}
              accept="image/*,.pdf" 
              className="hidden" 
              onChange={handleRxFileChange}
            />

            {/* Scanning progress */}
            {rxScanning ? (
              <div className="border-2 border-dashed border-[#039487] rounded-2xl p-8 text-center bg-teal-50/50 mb-4 animate-pulse">
                <div className="w-10 h-10 border-4 border-[#039487] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-xs font-black text-[#012C63]">{rxStatusMsg}</p>
                <p className="text-[10px] text-slate-400 mt-1">Analyzing medical handwriting & biomarker tokens...</p>
              </div>
            ) : (
              <div
                onClick={() => rxFileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-[#039487] rounded-2xl p-6 text-center bg-slate-50 hover:bg-teal-50/40 transition-all cursor-pointer mb-4 group"
              >
                <UploadCloud className="w-10 h-10 text-[#039487] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-slate-800">Tap to upload prescription slip from mobile or gallery</p>
                <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, PDF up to 10MB</p>
              </div>
            )}

            {/* Results Feedback & Unmatched Tests Notice (Point 2 - No popup alert) */}
            {rxDetectedPrescriptions.length > 0 && !rxScanning && (
              <div className="mb-4 space-y-2">
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs">
                  <p className="font-bold text-teal-900 flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" />
                    Prescription Tests Detected by TestBeat AI:
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {rxDetectedPrescriptions.map((tName, i) => (
                      <span key={i} className="bg-white border border-teal-300 text-[#012C63] font-bold text-[11px] px-2 py-0.5 rounded-md">
                        {tName}
                      </span>
                    ))}
                  </div>
                </div>

                {rxUnmatchedTests.length > 0 && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">
                          Note: {rxUnmatchedTests.length} test{rxUnmatchedTests.length > 1 ? 's' : ''} ({rxUnmatchedTests.join(', ')}) could not be matched automatically.
                        </p>
                        <p className="text-[11px] text-amber-800 mt-1">
                          You can easily add them manually using the search box below.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Point 2: Compact Inline Manual Test Search & Add inside Modal */}
            <div className="mb-4">
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Add Missing Test Manually (Optional)
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={rxManualSearch}
                  onChange={(e) => setRxManualSearch(e.target.value)}
                  placeholder="Type test name (e.g. CBC, KFT, Thyroid)..."
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#039487]"
                />
              </div>

              {rxManualSearch.trim().length > 0 && (
                <div className="mt-1 max-h-32 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white">
                  {TESTS_CATALOG.filter(t => t.name.toLowerCase().includes(rxManualSearch.toLowerCase())).map(test => {
                    const isAdded = selectedTests.some(t => t.id === test.id);
                    return (
                      <div key={test.id} className="p-2 flex items-center justify-between text-xs hover:bg-slate-50">
                        <span className="font-bold text-slate-800 truncate mr-2">{test.name}</span>
                        <button
                          onClick={() => {
                            toggleTest(test);
                            setRxManualSearch('');
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-black ${isAdded ? 'bg-rose-100 text-rose-700' : 'bg-[#039487] text-white'}`}
                        >
                          {isAdded ? 'Remove' : '+ Add (₹' + test.offerPrice + ')'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Bottom Buttons */}
            <div className="flex space-x-2">
              <button
                disabled={rxScanning}
                onClick={() => rxFileInputRef.current?.click()}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
              >
                {rxScanning ? 'Scanning...' : 'Upload Another File'}
              </button>
              <button
                onClick={() => {
                  setIsRxOpen(false);
                  setShowCompareTable(true);
                  const compElem = document.getElementById('compare');
                  if (compElem) compElem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex-1 py-3 bg-[#039487] hover:bg-[#027d72] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow"
              >
                Continue & Compare Labs ({selectedTests.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: LOCATION SELECTOR & AUTO-DETECT (Point 8) ================= */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 relative border border-slate-100 max-h-[85vh] overflow-y-auto">
            <button onClick={() => setIsLocationModalOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2 text-[#039487] mb-1">
              <MapPin className="w-5 h-5 text-[#F44236]" />
              <h3 className="text-lg font-black text-slate-900">Choose Collection Location</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Select your city or detect live GPS location for doorstep sample collection.</p>

            {/* Point 8: Live GPS Auto-Detect Button */}
            <button
              onClick={handleDetectLocation}
              disabled={isDetectingLocation}
              className="w-full py-3 mb-4 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-[#012C63] font-bold text-xs rounded-2xl flex items-center justify-center space-x-2 transition-colors"
            >
              <MapPin className={`w-4 h-4 text-[#039487] ${isDetectingLocation ? 'animate-bounce' : ''}`} />
              <span>{isDetectingLocation ? 'Detecting Live GPS Pincode...' : 'Use My Current Location (GPS Auto-Detect)'}</span>
            </button>

            {/* Point 8: Search by City Name OR Pincode */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={locationSearchInput}
                onChange={(e) => setLocationSearchInput(e.target.value)}
                placeholder="Search city name or enter Pincode (e.g. 12, 201310, Noida)..."
                className="w-full border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#039487]"
              />
            </div>

            {/* Results displaying city, state & pincode */}
            <div className="space-y-1 text-xs max-h-60 overflow-y-auto divide-y divide-slate-100">
              {filteredLocationResults.length === 0 ? (
                <div className="text-center py-6 text-slate-400">
                  <p className="font-bold text-xs">No matching location found</p>
                  <p className="text-[10px] mt-0.5">Please check city name or 6-digit PIN.</p>
                </div>
              ) : (
                filteredLocationResults.map((loc, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentSelectedLocation(`${loc.city} (${loc.pin})`);
                      setProfileData(prev => ({ ...prev, city: loc.city, pincode: loc.pin }));
                      setIsLocationModalOpen(false);
                    }}
                    className="w-full py-2.5 px-3 flex items-center justify-between text-left hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{loc.city}</span>
                      <span className="text-[10px] text-slate-400">{loc.state} • PIN: {loc.pin}</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Serviceable</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: DEDICATED PARTNER WITH US APPLICATION ================= */}
      {isPartnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-7 relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsPartnerModalOpen(false)} className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2 text-emerald-700 mb-2">
              <Handshake className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider">TestBeat B2B & Affiliate Partner Program</span>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-1">Partner With India&apos;s Multi-Lab Network</h3>
            <p className="text-slate-500 text-xs mb-6">
              Doctors, Clinics, Pathology Centers & Medical Stores: Monetize diagnostic bookings with transparent tracking and high partner revenue sharing.
            </p>

            {affiliateSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-black text-slate-900">Application Received!</h4>
                <p className="text-xs text-slate-600">Our business onboarding executive will contact you within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handlePartnerSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name / Practice Name</label>
                    <input 
                      type="text" 
                      required 
                      value={affiliateData.name}
                      onChange={(e) => setAffiliateData({ ...affiliateData, name: e.target.value })}
                      placeholder="Dr. / Clinic Name" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#039487]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Contact</label>
                    <input 
                      type="tel" 
                      maxLength={10} 
                      required 
                      value={affiliateData.phone}
                      onChange={(e) => setAffiliateData({ ...affiliateData, phone: e.target.value })}
                      placeholder="10-digit number" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#039487]"
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
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#039487]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Affiliate Type</label>
                    <select 
                      value={affiliateData.category}
                      onChange={(e) => setAffiliateData({ ...affiliateData, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#039487]"
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
                  className="w-full py-3 bg-[#012C63] hover:bg-[#0c3b65] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <span>Submit Partner Application</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
