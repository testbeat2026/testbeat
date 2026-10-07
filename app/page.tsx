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
  Loader2,
  AlertCircle,
  LocateFixed,
  BookOpen,
  ChevronDown,
  Building2,
  FileCheck2,
  SlidersHorizontal,
  Home
} from 'lucide-react';

// Brand Colors Definition (Locked with TestBeat Logo):
// Primary Navy: #012C63 | Accent Teal: #039487 | Alert Coral: #F44236

// 23 Serviceable States & Districts from Redcliffe Serviceability PIN code list 2026nn.xlsx
const SERVICEABLE_LOCATIONS = [
  { state: 'Uttar Pradesh', cities: ['Gautambuddha Nagar (Greater Noida)', 'Noida', 'Ghaziabad', 'Lucknow', 'Varanasi', 'Kanpur', 'Prayagraj', 'Ballia', 'Agra', 'Meerut', 'Saharanpur', 'Mathura', 'Bareilly', 'Gorakhpur'] },
  { state: 'Delhi', cities: ['New Delhi', 'South West Delhi', 'North West Delhi', 'West Delhi', 'Dwarka', 'Rohini', 'Connaught Place'] },
  { state: 'Haryana', cities: ['Gurugram', 'Faridabad', 'Panchkula', 'Rohtak', 'Karnal', 'Panipat', 'Sonipat'] },
  { state: 'Maharashtra', cities: ['Mumbai Suburban', 'Mumbai City', 'Thane', 'Pune', 'Nashik', 'Nagpur', 'Navi Mumbai', 'Aurangabad'] },
  { state: 'Karnataka', cities: ['Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Mangaluru', 'Hubballi'] },
  { state: 'Bihar', cities: ['Patna', 'Muzaffarpur', 'Gopalganj', 'Gaya', 'Bhagalpur', 'Samastipur', 'Aurangabad', 'Darbhanga'] },
  { state: 'Telangana', cities: ['Hyderabad', 'Medchal Malkajgiri', 'Rangareddy', 'Sangareddy', 'Warangal'] },
  { state: 'West Bengal', cities: ['Kolkata', 'Howrah', 'Hooghly', 'Paschim Bardhaman', 'Siliguri'] },
  { state: 'Rajasthan', cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Bikaner', 'Ajmer', 'Kota'] },
  { state: 'Gujarat', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'] },
  { state: 'Punjab', cities: ['Amritsar', 'Ludhiana', 'Jalandhar', 'Bathinda', 'Hoshiarpur', 'Mohali'] },
  { state: 'Madhya Pradesh', cities: ['Indore', 'Bhopal', 'Gwalior', 'Jabalpur', 'Ujjain'] },
  { state: 'Jharkhand', cities: ['Ranchi', 'Dhanbad', 'East Singhbhum', 'Deoghar'] },
  { state: 'Uttarakhand', cities: ['Dehradun', 'Haridwar', 'Rishikesh'] },
  { state: 'Andhra Pradesh', cities: ['Visakhapatnam', 'Guntur', 'Krishna', 'Vijayawada'] }
];

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
  code: string;
  category: string;
  parametersCount: number;
  fastingRequired: boolean;
  sampleType: string;
  description: string;
  mrp: number;
  offerPrice: number;
}

// Data extracted directly from Pricing (Individual & Packages)_TestBeat.xlsx
const TESTS_CATALOG: TestItem[] = [
  { id: 't1', name: 'Complete Blood Count (CBC) Test', code: 'HM007', category: 'full-body', parametersCount: 28, fastingRequired: false, sampleType: 'EDTA Blood', description: 'Screening for anemia, platelets, white blood cells & latent infections.', mrp: 450, offerPrice: 299 },
  { id: 't2', name: 'Thyroid Profile Total (T3, T4, TSH)', code: 'BC063', category: 'thyroid', parametersCount: 3, fastingRequired: true, sampleType: 'Serum', description: 'Gold standard test for thyroid gland hormone synthesis and metabolic rate.', mrp: 650, offerPrice: 429 },
  { id: 't3', name: 'HBA1C Test', code: 'BC035', category: 'diabetes', parametersCount: 2, fastingRequired: false, sampleType: 'Whole Blood', description: 'Evaluates 3-month average blood glucose control with eAG values.', mrp: 550, offerPrice: 349 },
  { id: 't4', name: 'Lipid Profile Test', code: 'BC471', category: 'heart', parametersCount: 8, fastingRequired: true, sampleType: 'Serum', description: 'HDL, LDL, VLDL, Total Cholesterol and Triglycerides cardiovascular risk.', mrp: 850, offerPrice: 399 },
  { id: 't5', name: 'Liver Function Test (LFT)', code: 'PL94', category: 'liver', parametersCount: 12, fastingRequired: false, sampleType: 'Serum', description: 'Checks liver enzymes (SGOT, SGPT), Bilirubin & total protein levels.', mrp: 750, offerPrice: 399 },
  { id: 't6', name: 'Kidney Function Test (KFT)', code: 'BC360', category: 'kidney', parametersCount: 11, fastingRequired: false, sampleType: 'Serum', description: 'Screens Renal clearance, Serum Creatinine, Uric Acid & Electrolytes.', mrp: 950, offerPrice: 399 },
  { id: 't7', name: 'Vitamin D Test (25-Hydroxy)', code: 'BC075', category: 'vitamins', parametersCount: 1, fastingRequired: false, sampleType: 'Serum', description: 'Detects vitamin D deficiency causing joint fatigue and weak bone density.', mrp: 1400, offerPrice: 499 },
  { id: 't8', name: 'Vitamin B12 Test', code: 'BC074', category: 'vitamins', parametersCount: 1, fastingRequired: true, sampleType: 'Serum', description: 'Critical biomarker for nerve function, neurological health & energy levels.', mrp: 1100, offerPrice: 649 },
  { id: 't9', name: 'Blood Sugar Fasting', code: 'BC023', category: 'diabetes', parametersCount: 1, fastingRequired: true, sampleType: 'Fluoride Plasma', description: '10-12 hours fasting glucose level evaluation.', mrp: 150, offerPrice: 69 },
  { id: 't10', name: 'Blood Sugar Post Prandial (PP)', code: 'BC033', category: 'diabetes', parametersCount: 1, fastingRequired: false, sampleType: 'Fluoride Plasma', description: '2 hours post-meal glucose absorption test.', mrp: 150, offerPrice: 69 },
  { id: 't11', name: 'Urine Routine & Microscopic Examination Test', code: 'CP012', category: 'full-body', parametersCount: 22, fastingRequired: false, sampleType: 'Urine', description: 'Evaluates urinary tract infections, protein leakage & renal casts.', mrp: 300, offerPrice: 119 },
  { id: 't12', name: 'Complete Hemogram (CBC & ESR)', code: 'HM013', category: 'full-body', parametersCount: 29, fastingRequired: false, sampleType: 'EDTA Blood', description: 'CBC with automated Erythrocyte Sedimentation Rate.', mrp: 600, offerPrice: 449 }
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

interface FamilyMember {
  id: string;
  relation: 'Self' | 'Spouse' | 'Children' | 'Parents' | 'Other';
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const [selectedTests, setSelectedTests] = useState<TestItem[]>([
    TESTS_CATALOG[0],
    TESTS_CATALOG[1],
    TESTS_CATALOG[6]
  ]);

  // Cart Drawer State & Working Checkout
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [useWalletBalance, setUseWalletBalance] = useState(true);

  // Order Confirmation Modal State
  const [confirmedOrder, setConfirmedOrder] = useState<OrderConfirmationData | null>(null);

  // User Dropdown & Customer Panel Modals
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeAccountView, setActiveAccountView] = useState<'profile' | 'orders' | 'subscriptions' | 'wallet' | 'family' | null>(null);

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
    relation: 'Self' | 'Spouse' | 'Children' | 'Parents' | 'Other';
    name: string;
    age: string;
    gender: 'Male' | 'Female' | 'Other';
  }>({
    relation: 'Parents',
    name: '',
    age: '',
    gender: 'Male'
  });

  // TestBeat AI Vision Prescription Reader States
  const [isRxOpen, setIsRxOpen] = useState(false);
  const [rxScanning, setRxScanning] = useState(false);
  const [rxStatusMsg, setRxStatusMsg] = useState('');
  const [rxUnmatchedTests, setRxUnmatchedTests] = useState<string[]>([]);
  const [rxDetectedPrescriptions, setRxDetectedPrescriptions] = useState<string[]>([]);
  const rxFileInputRef = useRef<HTMLInputElement>(null);

  // Location Selector States
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [currentSelectedLocation, setCurrentSelectedLocation] = useState('Greater Noida (201310)');
  const [locationSearchInput, setLocationSearchInput] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Dedicated Partner With Us Modal States
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [affiliateSubmitted, setAffiliateSubmitted] = useState(false);
  const [affiliateData, setAffiliateData] = useState({
    name: '',
    phone: '',
    city: '',
    category: 'Doctor / Clinic'
  });

  // Full Cities Directory Modal State
  const [isCitiesDirectoryOpen, setIsCitiesDirectoryOpen] = useState(false);

  // Side Drawer Menu for Desktop & Mobile
  const [isDrawerMenuOpen, setIsDrawerMenuOpen] = useState(false);

  const totalCitiesCount = useMemo(() => {
    return SERVICEABLE_LOCATIONS.reduce((acc, curr) => acc + curr.cities.length, 0);
  }, []);

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

  // GPS Current Location Detection Handler
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setTimeout(() => {
          setIsDetectingLocation(false);
          const detected = `Greater Noida (201310)`;
          setCurrentSelectedLocation(detected);
          setProfileData(prev => ({ ...prev, city: 'Greater Noida', pincode: '201310' }));
          setIsLocationModalOpen(false);
        }, 800);
      },
      (error) => {
        setIsDetectingLocation(false);
        alert('Could not access live GPS location. Please choose your city manually from the list.');
      }
    );
  };

  // TestBeat AI Vision Prescription Reader Handler (Robust Extraction)
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
      setRxStatusMsg('TestBeat AI reading doctor handwriting & biomarkers...');

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

          // Auto-select matched tests into cart & aggregator
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
              ? `Success! ${matchedCatalogTests.length} tests matched and auto-selected into your cart.`
              : 'Prescription scanned successfully.'
          );
        } else {
          alert(data.error || 'Doctor handwriting was unclear. Please upload a brighter photo or select tests manually.');
        }
      } catch (err) {
        alert('Could not process prescription image right now. Please select tests manually.');
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

      {/* 1. TOP PAN-INDIA TRUST & HELPLINE BAR (Updated Contrast & Dynamic City Count) */}
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
              className="flex items-center text-slate-200 hover:text-white font-medium transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 mr-1 text-[#F44236]" />
              <span>Pan-India ({totalCitiesCount}+ Cities & 2,100+ PINs)</span>
            </button>
            <a href="tel:+918368887011" className="flex items-center text-teal-300 font-bold hover:underline">
              <PhoneCall className="w-3.5 h-3.5 mr-1" /> +91 83688 87011
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR WITH HAMBURGER DRAWER TRIGGER FOR BOTH DESKTOP & MOBILE */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Location Indicator */}
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

            {/* Pincode & City Selection Trigger */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#012C63] transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#F44236]" />
              <span className="truncate max-w-[150px]">{currentSelectedLocation}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Genuine Diagnostic Navigation (Partner With Us Removed from Header Bar) */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-bold text-slate-700">
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

          {/* Right Header: Cart, User Icon & Side 3-Line Hamburger Drawer for Desktop + Mobile */}
          <div className="flex items-center space-x-3.5">
            
            {/* Shopping Cart Button */}
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

            {/* User Profile Icon */}
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

            {/* Desktop & Mobile 3-Line Menu Trigger Button */}
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

      {/* 3-LINE SIDE DRAWER MENU (AVAILABLE ON BOTH DESKTOP & MOBILE WITH ICONS) */}
      {isDrawerMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-sm h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-[#012C63] text-white">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-5 h-5 text-teal-300" />
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
                href="#" 
                onClick={() => setIsDrawerMenuOpen(false)}
                className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-teal-50 hover:text-[#039487] transition-colors"
              >
                <Home className="w-5 h-5 text-[#012C63]" />
                <span>Home Portal</span>
              </a>

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
                <span>Full Body Health Packages</span>
              </a>

              <a 
                href="#habits" 
                onClick={() => setIsDrawerMenuOpen(false)}
                className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-teal-50 hover:text-[#039487] transition-colors"
              >
                <Activity className="w-5 h-5 text-rose-500" />
                <span>Tests by Health Risks</span>
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
                <span>Serviceable Cities ({totalCitiesCount}+)</span>
              </button>

              <button 
                onClick={() => { setIsDrawerMenuOpen(false); setIsPartnerModalOpen(true); }}
                className="w-full flex items-center space-x-3 p-3 rounded-2xl hover:bg-emerald-50 text-emerald-800 transition-colors text-left"
              >
                <Handshake className="w-5 h-5 text-emerald-600" />
                <span>Partner With Us (Doctors & Clinics)</span>
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

      {/* 3. HERO SECTION WITH ANIMATED & DECORATED TESTBEAT AI PRESCRIPTION READER */}
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

              {/* Main Search Input */}
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

                {/* Instant Search Suggestions Dropdown */}
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
                            onClick={() => {
                              toggleTest(test);
                              const compElem = document.getElementById('compare');
                              if (compElem) compElem.scrollIntoView({ behavior: 'smooth' });
                            }}
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

            {/* Right Column: DECORATED & ANIMATED TESTBEAT AI PRESCRIPTION READER */}
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
                  Doctor ka Parcha Upload Karein
                </h3>
                <p className="text-slate-200 text-xs mt-1.5 mb-5 leading-relaxed relative z-10">
                  Doctor ke hath se likhe parche ko <span className="text-teal-300 font-bold">TestBeat AI</span> scan karke tests auto-select karega aur cheapest lab rates match kar dega.
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
            <button 
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Open Cart ({selectedTests.length})</span>
            </button>
            <a href="#compare" className="px-4 py-2 bg-[#039487] hover:bg-[#027d72] text-white font-black rounded-xl text-xs flex items-center space-x-1.5 transition-all">
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
                      onClick={() => {
                        setIsCartOpen(true);
                      }}
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

      {/* 8. FOOTER WITH SERVICEABLE STATES, CITIES & HEALTH BLOG DIRECTORY */}
      <footer className="bg-[#012C63] text-slate-300 text-xs border-t border-[#0c3b65]">
        
        {/* Serviceable Locations Directory */}
        <div className="border-b border-[#0c3b65]/80 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base font-black text-white flex items-center">
                  <MapPin className="w-4 h-4 text-[#F44236] mr-1.5" />
                  Serviceable States & Cities Across India ({totalCitiesCount}+ Locations & 2,100+ Pincodes)
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Phlebotomist doorstep sample pickup network with cold-chain gel bags across northern and central hubs.
                </p>
              </div>
              <button
                onClick={() => setIsCitiesDirectoryOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-teal-300 text-xs font-bold transition-colors"
              >
                View Full City & Pincode Directory →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 text-[11px]">
              {SERVICEABLE_LOCATIONS.map((loc, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="font-extrabold text-teal-300 text-xs">{loc.state}</p>
                  <ul className="space-y-0.5 text-slate-300">
                    {loc.cities.slice(0, 4).map((city, cIdx) => (
                      <li key={cIdx}>
                        <button 
                          onClick={() => {
                            setCurrentSelectedLocation(`${city}`);
                            alert(`Location updated to ${city}. Doorstep sample collection active.`);
                          }} 
                          className="hover:text-white transition-colors text-left"
                        >
                          {city}
                        </button>
                      </li>
                    ))}
                  </ul>
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

      {/* ================= MODAL: LOCATION SELECTOR & AUTO-DETECT ================= */}
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

            <button
              onClick={handleDetectLocation}
              disabled={isDetectingLocation}
              className="w-full py-3 mb-4 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-[#012C63] font-bold text-xs rounded-2xl flex items-center justify-center space-x-2 transition-colors"
            >
              <LocateFixed className={`w-4 h-4 text-[#039487] ${isDetectingLocation ? 'animate-spin' : ''}`} />
              <span>{isDetectingLocation ? 'Detecting GPS Pincode...' : 'Detect My Current Location (GPS)'}</span>
            </button>

            <div className="relative mb-4">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={locationSearchInput}
                onChange={(e) => setLocationSearchInput(e.target.value)}
                placeholder="Search city or enter 6-digit Pincode..."
                className="w-full border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#039487]"
              />
            </div>

            <div className="space-y-1 text-xs max-h-56 overflow-y-auto divide-y divide-slate-100">
              {SERVICEABLE_LOCATIONS.flatMap(s => s.cities)
                .filter(c => c.toLowerCase().includes(locationSearchInput.toLowerCase()))
                .map((city, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentSelectedLocation(`${city}`);
                      setProfileData(prev => ({ ...prev, city }));
                      setIsLocationModalOpen(false);
                    }}
                    className="w-full py-2.5 px-3 flex items-center justify-between text-left hover:bg-slate-50 rounded-xl"
                  >
                    <span className="font-bold text-slate-800">{city}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Serviceable</span>
                  </button>
                ))}
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
                      onChange={(e) => setAffiliateData({ ...affiliateData, phone: e.target.value.replace(/\D/g, '') })}
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

      {/* ================= MODAL: COMPLETE CITIES DIRECTORY DRAWER ================= */}
      {isCitiesDirectoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl p-6 sm:p-8 relative border border-slate-100 max-h-[85vh] overflow-y-auto">
            <button onClick={() => setIsCitiesDirectoryOpen(false)} className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-1">Pan-India Diagnostic Network Directory</h3>
            <p className="text-xs text-slate-500 mb-6">Complete list of serviceable cities with doorstep cold-chain phlebotomy coverage.</p>

            <div className="space-y-6">
              {SERVICEABLE_LOCATIONS.map((loc, sIdx) => (
                <div key={sIdx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <h4 className="font-extrabold text-sm text-[#012C63] mb-2">{loc.state}</h4>
                  <div className="flex flex-wrap gap-2">
                    {loc.cities.map((city, cIdx) => (
                      <span 
                        key={cIdx} 
                        onClick={() => {
                          setCurrentSelectedLocation(city);
                          setIsCitiesDirectoryOpen(false);
                          alert(`Location set to ${city}.`);
                        }}
                        className="bg-white border border-slate-200 hover:border-[#039487] text-slate-700 hover:text-[#039487] cursor-pointer text-xs font-semibold px-3 py-1 rounded-xl transition-colors"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= FUNCTIONAL SHOPPING CART SLIDE-OVER DRAWER ================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-[#039487]" />
                <h3 className="text-lg font-black text-slate-900">Diagnostic Cart</h3>
                <span className="bg-teal-100 text-[#012C63] text-xs font-black px-2 py-0.5 rounded-full">
                  {selectedTests.length} Items
                </span>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {selectedTests.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-700">Your cart is empty</p>
                  <p className="text-xs text-slate-400 mt-1">Select blood tests or upload a prescription to begin.</p>
                </div>
              ) : (
                selectedTests.map(item => (
                  <div key={item.id} className="p-3.5 border border-slate-200 rounded-2xl flex items-center justify-between bg-white shadow-2xs">
                    <div>
                      <span className="text-[9px] font-black uppercase text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded">
                        {item.category}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs mt-1 leading-snug">{item.name}</h4>
                      <p className="text-[11px] text-slate-400">{item.parametersCount} Parameters</p>
                    </div>
                    <div className="text-right ml-3 flex-shrink-0">
                      <p className="text-sm font-black text-[#012C63]">₹{item.offerPrice}</p>
                      <button 
                        onClick={() => toggleTest(item)}
                        className="text-[11px] text-rose-500 hover:underline font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {selectedTests.length > 0 && (
              <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-3">
                {walletBalance > 0 && (
                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Wallet className="w-4 h-4 text-[#039487]" />
                      <div>
                        <p className="font-bold text-slate-800">Use TestBeat Wallet</p>
                        <p className="text-[10px] text-teal-700">Balance: ₹{walletBalance}</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={useWalletBalance} 
                      onChange={(e) => setUseWalletBalance(e.target.checked)}
                      className="w-4 h-4 accent-[#039487] cursor-pointer" 
                    />
                  </div>
                )}

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Tests Subtotal:</span>
                    <span className="font-bold text-slate-900">₹{cartSubtotal}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Total Discount Saved:</span>
                    <span>-₹{cartDiscount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phlebotomist Doorstep Collection:</span>
                    <span className="font-bold text-emerald-600">FREE ₹0</span>
                  </div>
                  {useWalletBalance && walletBalance > 0 && (
                    <div className="flex justify-between text-teal-700 font-bold">
                      <span>Wallet Deduction Applied:</span>
                      <span>-₹{Math.min(walletBalance, cartSubtotal)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                    <span>Final Amount Payable:</span>
                    <span className="text-[#012C63]">₹{finalPayable}</span>
                  </div>
                </div>

                <button
                  onClick={handleProceedCheckout}
                  className="w-full py-3.5 bg-[#039487] hover:bg-[#027d72] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-teal-900/30 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Home Collection Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ================= MODAL: ORDER CONFIRMED MODAL ================= */}
      {confirmedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-7 relative border border-slate-100 animate-in zoom-in-95 duration-200 text-center">
            
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
              <Check className="w-8 h-8 text-emerald-600 stroke-[3]" />
            </div>

            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-2">
              Appointment Scheduled
            </span>

            <h3 className="text-2xl font-black text-slate-900">Order Placed Successfully!</h3>
            <p className="text-slate-500 text-xs mt-1 mb-6">
              Your certified home sample collection appointment is confirmed.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2.5 mb-6">
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Booking Reference ID:</span>
                <span className="font-black text-[#012C63]">{confirmedOrder.bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Patient Name:</span>
                <span className="font-bold text-slate-900">{confirmedOrder.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Scheduled Slot:</span>
                <span className="font-bold text-emerald-700">{confirmedOrder.scheduledTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Biomarkers Included:</span>
                <span className="font-bold text-slate-900">{confirmedOrder.testCount} Tests Selected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Home Pickup Address:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[200px]" title={confirmedOrder.address}>{confirmedOrder.address}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-black text-sm">
                <span className="text-slate-900">Total Amount Paid:</span>
                <span className="text-[#039487]">₹{confirmedOrder.amountPaid}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setConfirmedOrder(null);
                  setActiveAccountView('orders');
                }}
                className="w-full py-3 bg-[#012C63] hover:bg-[#0c3b65] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Track in My Orders</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setConfirmedOrder(null);
                  setSelectedTests([]);
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                Done / Back to Home
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL: CUSTOMER ACCOUNT PANELS ================= */}
      {activeAccountView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setActiveAccountView(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 border-b border-slate-100 pb-4 overflow-x-auto text-xs font-black mb-6">
              <button 
                onClick={() => setActiveAccountView('profile')} 
                className={`px-3 py-2 rounded-xl transition-all ${activeAccountView === 'profile' ? 'bg-[#012C63] text-white shadow' : 'border border-slate-200 text-slate-600'}`}
              >
                My Profile
              </button>
              <button 
                onClick={() => setActiveAccountView('orders')} 
                className={`px-3 py-2 rounded-xl transition-all ${activeAccountView === 'orders' ? 'bg-[#012C63] text-white shadow' : 'border border-slate-200 text-slate-600'}`}
              >
                My Orders
              </button>
              <button 
                onClick={() => setActiveAccountView('subscriptions')} 
                className={`px-3 py-2 rounded-xl transition-all ${activeAccountView === 'subscriptions' ? 'bg-[#012C63] text-white shadow' : 'border border-slate-200 text-slate-600'}`}
              >
                My Subscriptions
              </button>
              <button 
                onClick={() => setActiveAccountView('wallet')} 
                className={`px-3 py-2 rounded-xl transition-all ${activeAccountView === 'wallet' ? 'bg-[#012C63] text-white shadow' : 'border border-slate-200 text-slate-600'}`}
              >
                Wallet (₹{walletBalance})
              </button>
              <button 
                onClick={() => setActiveAccountView('family')} 
                className={`px-3 py-2 rounded-xl transition-all ${activeAccountView === 'family' ? 'bg-[#012C63] text-white shadow' : 'border border-slate-200 text-slate-600'}`}
              >
                Family Members
              </button>
            </div>

            {/* PANEL: MY PROFILE */}
            {activeAccountView === 'profile' && (
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-1">Customer Profile & Address</h3>
                <p className="text-xs text-slate-500 mb-6">Manage your primary collection address for phlebotomist home visits.</p>
                
                <form onSubmit={(e) => { e.preventDefault(); alert('Profile details updated successfully!'); setActiveAccountView(null); }} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={profileData.name} 
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:border-[#039487] focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Number</label>
                      <input 
                        type="tel" 
                        value={profileData.phone} 
                        readOnly 
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold bg-slate-50 focus:outline-none text-slate-500" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Age</label>
                      <input 
                        type="number" 
                        value={profileData.age} 
                        onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:border-[#039487] focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">City</label>
                      <input 
                        type="text" 
                        value={profileData.city} 
                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:border-[#039487] focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Pincode</label>
                      <input 
                        type="text" 
                        value={profileData.pincode} 
                        onChange={(e) => setProfileData({ ...profileData, pincode: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:border-[#039487] focus:outline-none" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Detailed Home Address</label>
                    <textarea 
                      rows={2} 
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:border-[#039487] focus:outline-none" 
                    />
                  </div>

                  <button type="submit" className="px-6 py-2.5 bg-[#012C63] hover:bg-[#0c3b65] text-white text-xs font-bold rounded-xl shadow transition-all">
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* PANEL: MY ORDERS */}
            {activeAccountView === 'orders' && (
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-1">Live Bookings & Report Vault</h3>
                <p className="text-xs text-slate-500 mb-6">Real-time status of blood sample collection, lab processing, and report download.</p>

                <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Phlebotomist Assigned
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm mt-1">Full Body Comprehensive (Vital Checkup)</h4>
                      <p className="text-[11px] text-slate-500">Booking ID: #TB-98210 • Partner Lab: Thyrocare Technologies</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-slate-900">₹1,199</span>
                      <p className="text-[11px] text-emerald-600 font-bold">Paid via Wallet</p>
                    </div>
                  </div>
                  <div className="pt-3 flex flex-wrap items-center justify-between text-xs gap-3">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <User className="w-4 h-4 text-[#039487]" />
                      <span>Patient: <b>Self ({profileData.name})</b></span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Clock className="w-4 h-4 text-[#012C63]" />
                      <span>Scheduled: <b>Tomorrow, 07:30 AM</b></span>
                    </div>
                    <button onClick={() => alert('Sample tracking: Phlebotomist en route at 7:00 AM')} className="px-3.5 py-1.5 bg-[#039487] text-white rounded-lg text-xs font-bold">
                      Live Tracking
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PANEL: MY SUBSCRIPTIONS */}
            {activeAccountView === 'subscriptions' && (
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-1">Preventive Health Subscriptions</h3>
                <p className="text-xs text-slate-500 mb-6">Periodic quarterly diabetes and thyroid monitoring plans.</p>

                <div className="border border-slate-200 rounded-2xl p-5 bg-white">
                  <span className="text-[10px] font-black uppercase text-[#039487] bg-teal-50 px-2 py-0.5 rounded">Active Plan</span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">Quarterly Diabetic Care Shield (HbA1c + Fasting)</h4>
                  <p className="text-xs text-slate-500 mt-1">Next test due in: 45 Days • Automatic sample collection</p>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#012C63]">₹499 / Quarter</span>
                    <button className="text-rose-600 font-bold hover:underline">Manage Plan</button>
                  </div>
                </div>
              </div>
            )}

            {/* PANEL: WALLET BALANCE */}
            {activeAccountView === 'wallet' && (
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-1">TestBeat Health Wallet</h3>
                <p className="text-xs text-slate-500 mb-6">Manage cashback and wallet recharge for seamless diagnostic checkouts.</p>

                <div className="bg-gradient-to-tr from-[#012C63] to-[#0c3b65] text-white rounded-2xl p-6 shadow-md mb-6 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-teal-300">Available Balance</span>
                    <h2 className="text-4xl font-black mt-1 text-white">₹{walletBalance}</h2>
                  </div>
                  <button 
                    onClick={() => setIsAddMoneyOpen(true)}
                    className="px-5 py-2.5 bg-[#039487] hover:bg-teal-600 text-white font-bold text-xs rounded-xl transition-all shadow"
                  >
                    + Add Balance
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">+</div>
                      <div>
                        <p className="font-bold text-slate-900">Sign Up Welcome Health Bonus</p>
                        <p className="text-[10px] text-slate-400">Promotional Credit • Active</p>
                      </div>
                    </div>
                    <span className="font-black text-emerald-600 text-sm">+₹250</span>
                  </div>
                </div>
              </div>
            )}

            {/* PANEL: FAMILY MEMBERS */}
            {activeAccountView === 'family' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Family Members Diagnostic Profiles</h3>
                    <p className="text-xs text-slate-500">Book blood tests specifically for yourself or family members.</p>
                  </div>
                  <button 
                    onClick={() => setIsAddFamilyOpen(true)}
                    className="px-3.5 py-2 bg-[#039487] hover:bg-teal-600 text-white text-xs font-bold rounded-xl shadow flex items-center space-x-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Member</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {familyMembers.map(member => (
                    <div key={member.id} className="border border-slate-200 rounded-2xl p-4 bg-white shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black uppercase text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                            {member.relation}
                          </span>
                          <span className="text-xs font-bold text-slate-400">{member.gender}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">{member.name}</h4>
                        <p className="text-xs text-slate-500">Age: {member.age} Years</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <button onClick={() => alert(`Selected ${member.name} for upcoming booking`)} className="text-[#039487] font-bold">
                          Book Test For {member.relation}
                        </button>
                        {member.relation !== 'Self' && (
                          <button onClick={() => setFamilyMembers(prev => prev.filter(m => m.id !== member.id))} className="text-rose-500 hover:text-rose-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ================= MODAL: CUSTOMER AUTHENTICATION ================= */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 relative border border-slate-100">
            <button 
              onClick={() => { setIsAuthOpen(false); setAuthOtpSent(false); }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
              <button 
                onClick={() => { setAuthMode('LOGIN'); setAuthOtpSent(false); }}
                className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all ${authMode === 'LOGIN' ? 'bg-[#012C63] text-white' : 'text-slate-600'}`}
              >
                OTP Login
              </button>
              <button 
                onClick={() => { setAuthMode('SIGNUP'); setAuthOtpSent(false); }}
                className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all ${authMode === 'SIGNUP' ? 'bg-[#012C63] text-white' : 'text-slate-600'}`}
              >
                New Sign Up
              </button>
            </div>

            {authMode === 'LOGIN' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Mobile Number</label>
                  <div className="flex items-center border border-slate-300 rounded-xl px-3 py-2 focus-within:border-[#039487]">
                    <span className="text-slate-500 font-bold text-xs mr-2">+91</span>
                    <input 
                      type="tel" 
                      maxLength={10} 
                      required 
                      value={patientMobile}
                      onChange={(e) => setPatientMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit number" 
                      className="w-full text-slate-900 font-bold focus:outline-none text-sm" 
                    />
                  </div>
                </div>

                {authOtpSent && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Enter 6-Digit OTP</label>
                    <input 
                      type="text" 
                      maxLength={6} 
                      required
                      value={patientOtp}
                      onChange={(e) => setPatientOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456" 
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 text-center font-black tracking-widest text-base focus:border-[#039487] focus:outline-none" 
                    />
                  </div>
                )}

                <button type="submit" className="w-full py-2.5 bg-[#012C63] hover:bg-[#0c3b65] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all">
                  {authOtpSent ? 'Verify OTP & Enter' : 'Send Login OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-0.5">Mobile Number *</label>
                  <div className="flex items-center border border-slate-300 rounded-xl px-3 py-1.5">
                    <span className="text-slate-500 font-bold text-xs mr-2">+91</span>
                    <input 
                      type="tel" 
                      maxLength={10} 
                      required 
                      value={signupForm.phone}
                      onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value.replace(/\D/g, '') })}
                      placeholder="10-digit mobile" 
                      className="w-full text-slate-900 font-bold text-xs focus:outline-none" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-0.5">Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                    placeholder="Patient full name" 
                    className="w-full border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none" 
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-0.5">Age</label>
                    <input 
                      type="number" 
                      required 
                      value={signupForm.age}
                      onChange={(e) => setSignupForm({ ...signupForm, age: e.target.value })}
                      placeholder="28" 
                      className="w-full border border-slate-300 rounded-xl px-2 py-1.5 text-xs font-semibold focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-0.5">City</label>
                    <input 
                      type="text" 
                      required 
                      value={signupForm.city}
                      onChange={(e) => setSignupForm({ ...signupForm, city: e.target.value })}
                      placeholder="Noida" 
                      className="w-full border border-slate-300 rounded-xl px-2 py-1.5 text-xs font-semibold focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-0.5">Pincode</label>
                    <input 
                      type="text" 
                      maxLength={6} 
                      required 
                      value={signupForm.pincode}
                      onChange={(e) => setSignupForm({ ...signupForm, pincode: e.target.value.replace(/\D/g, '') })}
                      placeholder="201310" 
                      className="w-full border border-slate-300 rounded-xl px-2 py-1.5 text-xs font-semibold focus:outline-none" 
                    />
                  </div>
                </div>

                {authOtpSent && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-0.5">Enter OTP Code</label>
                    <input 
                      type="text" 
                      maxLength={6} 
                      value={patientOtp}
                      onChange={(e) => setPatientOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456" 
                      className="w-full border border-slate-300 rounded-xl px-2 py-1.5 text-center font-bold tracking-widest text-xs focus:outline-none" 
                    />
                  </div>
                )}

                <button type="submit" className="w-full py-2.5 bg-[#039487] hover:bg-teal-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all">
                  {authOtpSent ? 'Verify OTP & Finish' : 'Create Account & Send OTP'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD MONEY TO WALLET ================= */}
      {isAddMoneyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 relative border border-slate-100">
            <button onClick={() => setIsAddMoneyOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-black text-slate-900 mb-1">Add Money to TestBeat Wallet</h3>
            <p className="text-xs text-slate-500 mb-4">Pay securely across all partner labs with instant discount redemption.</p>

            <div className="flex gap-2 mb-4">
              {[500, 1000, 2000].map(amt => (
                <button 
                  key={amt} 
                  onClick={() => setRechargeAmt(amt)}
                  className={`flex-1 py-1.5 border rounded-xl text-xs font-bold transition-all ${rechargeAmt === amt ? 'bg-teal-50 border-[#039487] text-[#039487]' : 'border-slate-200 text-slate-700'}`}
                >
                  +₹{amt}
                </button>
              ))}
            </div>

            <input 
              type="number" 
              value={rechargeAmt}
              onChange={(e) => setRechargeAmt(parseInt(e.target.value) || 0)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-center text-xl font-black focus:outline-none mb-4" 
            />

            <button onClick={handleAddMoneyConfirm} className="w-full py-2.5 bg-[#039487] hover:bg-teal-600 text-white font-bold text-xs rounded-xl shadow">
              Proceed with Razorpay / UPI
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD FAMILY MEMBER ================= */}
      {isAddFamilyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 relative border border-slate-100">
            <button onClick={() => setIsAddFamilyOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400">
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-center space-x-1.5 text-[#039487] mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs font-extrabold uppercase tracking-wider">Family Member Setup</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">Add Person for Blood Test</h3>
            <p className="text-xs text-slate-500 mb-4">Select relation and patient details for certified lab reports.</p>

            <form onSubmit={handleAddFamilyConfirm} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Relation *</label>
                <select 
                  value={newFamilyMember.relation}
                  onChange={(e) => setNewFamilyMember({ ...newFamilyMember, relation: e.target.value as any })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                >
                  <option value="Self">Self</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Children">Children</option>
                  <option value="Parents">Parents</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                <input 
                  type="text" 
                  required 
                  value={newFamilyMember.name}
                  onChange={(e) => setNewFamilyMember({ ...newFamilyMember, name: e.target.value })}
                  placeholder="Patient Name" 
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Age *</label>
                  <input 
                    type="number" 
                    required 
                    value={newFamilyMember.age}
                    onChange={(e) => setNewFamilyMember({ ...newFamilyMember, age: e.target.value })}
                    placeholder="e.g. 58" 
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Gender *</label>
                  <select 
                    value={newFamilyMember.gender}
                    onChange={(e) => setNewFamilyMember({ ...newFamilyMember, gender: e.target.value as any })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full py-2.5 bg-[#012C63] hover:bg-[#0c3b65] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow transition-all">
                Save Family Member
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: TESTBEAT AI PRESCRIPTION SCANNER ================= */}
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
              Upload prescription image or PDF. TestBeat AI will read the doctor&apos;s handwriting and automatically select prescribed diagnostic tests into your cart.
            </p>

            <input 
              type="file" 
              ref={rxFileInputRef}
              accept="image/*,.pdf" 
              className="hidden" 
              onChange={handleRxFileChange}
            />

            {rxScanning ? (
              <div className="border-2 border-dashed border-[#039487] rounded-2xl p-8 text-center bg-teal-50/50 mb-4 animate-pulse">
                <Loader2 className="w-10 h-10 text-[#039487] mx-auto mb-3 animate-spin" />
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

            {/* Results Feedback & Unmatched Tests Notice */}
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
                          You can easily search and select these tests manually from the catalog list below.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex space-x-2">
              <button
                disabled={rxScanning}
                onClick={() => rxFileInputRef.current?.click()}
                className="flex-1 py-3 bg-[#039487] hover:bg-[#027d72] disabled:bg-slate-400 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow"
              >
                {rxScanning ? 'Scanning in Progress...' : 'Choose Prescription File'}
              </button>
              {rxDetectedPrescriptions.length > 0 && (
                <button
                  onClick={() => {
                    setIsRxOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="px-4 py-3 bg-[#012C63] hover:bg-[#0c3b65] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-1"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>View Cart</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
