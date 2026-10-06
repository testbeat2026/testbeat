'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  PhoneCall, 
  User, 
  Activity, 
  FlaskConical, 
  Sparkles, 
  Clock, 
  Handshake, 
  CheckCircle2, 
  Lock, 
  UploadCloud, 
  Package, 
  Users, 
  Wallet,
  Calendar,
  UserCheck,
  Plus,
  Trash2,
  X,
  CreditCard,
  ShoppingCart
} from 'lucide-react';

interface FamilyMember {
  id: string;
  relation: 'Self' | 'Spouse' | 'Children' | 'Parents' | 'Other';
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
}

interface WalletTx {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
}

export default function TestBeatCompletePortal() {
  // Navigation & User Dropdown States
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'subscriptions' | 'wallet' | 'family'>('wallet');

  // Customer Authentication States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [mobileInput, setMobileInput] = useState('');
  const [otpInput, setOtpInput] = useState('');

  // Initial Signup Data (Starting me only Number, Name, Age, City, Pin Code)
  const [signupData, setSignupData] = useState({
    phone: '',
    name: '',
    age: '',
    city: '',
    pincode: ''
  });

  // Profile Data (bad me complete details manage karne ke liye)
  const [profileData, setProfileData] = useState({
    name: 'Guest Patient',
    phone: '8368887011',
    age: '28',
    city: 'Greater Noida',
    pincode: '201310',
    address: 'Chi V, Greater Noida, Uttar Pradesh'
  });

  // Functional Wallet System
  const [walletBalance, setWalletBalance] = useState(250);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [rechargeAmt, setRechargeAmt] = useState(500);
  const [transactions, setTransactions] = useState<WalletTx[]>([
    { id: 'tx-1', title: 'Sign Up Welcome Health Bonus', date: '06 Oct 2026', amount: 250, type: 'CREDIT' }
  ]);

  // Family Member Management
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: 'f-1', relation: 'Self', name: 'Guest Patient', age: 28, gender: 'Male' },
    { id: 'f-2', relation: 'Spouse', name: 'Pooja Kumari', age: 26, gender: 'Female' }
  ]);
  const [isAddFamilyOpen, setIsAddFamilyOpen] = useState(false);
  const [newMember, setNewMember] = useState<{
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

  // Auth Handlers
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      if (mobileInput.length !== 10) return alert('Enter valid 10-digit mobile number');
      setOtpSent(true);
      alert(`MSG91 OTP sent to +91 ${mobileInput}`);
    } else {
      if (otpInput.length < 4) return alert('Enter valid verification code');
      setIsLoggedIn(true);
      setProfileData({ ...profileData, phone: mobileInput, name: 'Verified Patient' });
      setIsAuthOpen(false);
      setOtpSent(false);
      alert('Login successful! Welcome to TestBeat.');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      if (signupData.phone.length !== 10) return alert('Enter valid 10-digit phone');
      setOtpSent(true);
      alert(`Account details received! OTP sent to +91 ${signupData.phone}`);
    } else {
      setIsLoggedIn(true);
      setProfileData({
        name: signupData.name,
        phone: signupData.phone,
        age: signupData.age,
        city: signupData.city,
        pincode: signupData.pincode,
        address: `${signupData.city}, ${signupData.pincode}`
      });
      // Add Self to family list automatically
      setFamilyMembers(prev => [
        { id: 'f-self', relation: 'Self', name: signupData.name, age: parseInt(signupData.age) || 28, gender: 'Male' },
        ...prev.filter(m => m.relation !== 'Self')
      ]);
      setIsAuthOpen(false);
      setOtpSent(false);
      alert('Sign Up completed! ₹250 promotional health credit added to your wallet.');
    }
  };

  // Wallet Handlers
  const handleAddMoney = () => {
    if (rechargeAmt <= 0) return;
    setWalletBalance(prev => prev + rechargeAmt);
    setTransactions(prev => [
      { id: `tx-${Date.now()}`, title: 'Wallet Top-up (Razorpay / UPI)', date: 'Just Now', amount: rechargeAmt, type: 'CREDIT' },
      ...prev
    ]);
    setIsAddMoneyOpen(false);
    alert(`₹${rechargeAmt} successfully credited to your TestBeat Wallet!`);
  };

  // Family Handlers
  const handleAddFamilyMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.age) return alert('Please enter required details');
    const created: FamilyMember = {
      id: `fam-${Date.now()}`,
      relation: newMember.relation,
      name: newMember.name,
      age: parseInt(newMember.age) || 30,
      gender: newMember.gender
    };
    setFamilyMembers(prev => [...prev, created]);
    setIsAddFamilyOpen(false);
    setNewMember({ relation: 'Parents', name: '', age: '', gender: 'Male' });
    alert(`${created.name} (${created.relation}) added successfully!`);
  };

  const removeFamilyMember = (id: string) => {
    if (confirm('Remove this family member profile?')) {
      setFamilyMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-[#039487] selection:text-white">
      
      {/* 1. TOP PAN-INDIA TRUST BAR */}
      <div className="bg-[#012C63] text-slate-200 text-xs py-2 px-4 border-b border-[#0c3b65]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 text-[11px] sm:text-xs">
            <span className="text-[#039487] font-semibold flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> 100% NABL & CAP Accredited Labs
            </span>
            <span className="hidden md:inline text-slate-400">•</span>
            <span className="hidden md:flex items-center text-slate-200">
              <Activity className="w-3.5 h-3.5 mr-1 text-[#039487]" /> 2°C - 8°C Cold-Chain Tracking
            </span>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <span className="flex items-center text-slate-200">
              <MapPin className="w-3.5 h-3.5 mr-1 text-[#F44236]" /> Pan-India (50+ Cities)
            </span>
            <a href="tel:+918368887011" className="text-teal-300 font-bold hover:underline">
              <PhoneCall className="w-3.5 h-3.5 mr-1" /> +91 83688 87011
            </a>
          </div>
        </div>
      </div>

      {/* 2. NAVBAR (ONLY USER ICON + MATCHING DROPDOWN) */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <a href="#" className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-[#012C63] flex items-center justify-center p-1.5 shadow-md shadow-[#012C63]/20">
              <svg viewBox="0 0 100 100" className="w-8 h-8" fill="none">
                <rect x="25" y="15" width="50" height="12" rx="6" stroke="white" strokeWidth="6" />
                <path d="M35 27V65C35 73.2843 41.7157 80 50 80C58.2843 80 65 73.2843 65 65V27" stroke="white" strokeWidth="6" />
                <path d="M42 50L46 54L50 44L54 52L58 48" stroke="#039487" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="50" cy="67" r="4" fill="#F44236" />
              </svg>
            </div>
            <div>
              <div className="flex items-baseline">
                <span className="text-2xl font-black text-[#012C63]">Test</span>
                <span className="text-2xl font-black text-[#039487]">Beat</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#F44236] ml-1"></span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 tracking-wider">
                Indias Trusted MultiLabs.Healthcare Platform
              </p>
            </div>
          </a>

          {/* Menus */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-bold text-slate-700">
            <a href="#compare" className="text-[#039487] hover:text-[#012C63] flex items-center space-x-1">
              <FlaskConical className="w-4 h-4" />
              <span>Compare Labs</span>
              <span className="bg-teal-50 text-[#039487] text-[10px] font-extrabold px-1.5 py-0.5 rounded-full border border-teal-200">Live</span>
            </a>
            <a href="#packages" className="hover:text-[#012C63]">Health Packages</a>
            <a href="#prescription" className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-1">
              <UploadCloud className="w-4 h-4" />
              <span>Upload Parcha</span>
            </a>
            <a href="#affiliate" className="text-slate-500 hover:text-emerald-600 flex items-center space-x-1">
              <Handshake className="w-4 h-4" />
              <span>Partner Program</span>
            </a>
          </nav>

          {/* USER ONLY ICON & CART */}
          <div className="flex items-center space-x-4">
            <div className="relative cursor-pointer p-2 rounded-xl text-slate-700 hover:bg-slate-100">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-[#012C63] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">0</span>
            </div>

            {/* User Icon Button */}
            <div className="relative">
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)} 
                className="w-10 h-10 rounded-full border-2 border-[#012C63] flex items-center justify-center text-[#012C63] hover:bg-teal-50 transition-all shadow-sm"
              >
                <User className="w-5 h-5" />
              </button>

              {/* IMAGE MATCHED DROPDOWN (Exact Options) */}
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
                      onClick={() => { setActiveTab('profile'); setUserDropdownOpen(false); }}
                      className="w-full flex items-center px-4 py-2.5 hover:bg-teal-50/50 hover:text-[#039487] transition-colors text-left"
                    >
                      <UserCheck className="w-4 h-4 mr-2.5 text-slate-400" />
                      <span>My Profile</span>
                    </button>
                    <button 
                      onClick={() => { setActiveTab('orders'); setUserDropdownOpen(false); }}
                      className="w-full flex items-center px-4 py-2.5 hover:bg-teal-50/50 hover:text-[#039487] transition-colors text-left"
                    >
                      <Package className="w-4 h-4 mr-2.5 text-slate-400" />
                      <span>My Orders</span>
                    </button>
                    <button 
                      onClick={() => { setActiveTab('subscriptions'); setUserDropdownOpen(false); }}
                      className="w-full flex items-center px-4 py-2.5 hover:bg-teal-50/50 hover:text-[#039487] transition-colors text-left"
                    >
                      <Calendar className="w-4 h-4 mr-2.5 text-slate-400" />
                      <span>My Subscriptions</span>
                    </button>
                    <button 
                      onClick={() => { setActiveTab('wallet'); setUserDropdownOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-teal-50/50 hover:text-[#039487] transition-colors text-left"
                    >
                      <div className="flex items-center">
                        <Wallet className="w-4 h-4 mr-2.5 text-slate-400" />
                        <span>Wallet Balance</span>
                      </div>
                      <span className="text-xs font-black text-[#039487]">₹{walletBalance}</span>
                    </button>
                    <button 
                      onClick={() => { setActiveTab('family'); setUserDropdownOpen(false); }}
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

          </div>

        </div>
      </header>

      {/* 3. MAIN DASHBOARD CONTENT */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Wallet Quick Bar */}
        <div className="bg-gradient-to-r from-[#012C63] to-[#0c3b65] rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold mb-3 border border-teal-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unified Customer Diagnostic Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">Family Health & Transparent Multi-Lab Portal</h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Real-time wallet balance management, family biomarker bookings (Self, Spouse, Children, Parents), and doorstep tracking.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl text-center min-w-[210px]">
            <p className="text-[11px] font-bold text-slate-200">TestBeat Active Wallet</p>
            <p className="text-3xl font-black text-teal-300 mt-1">₹{walletBalance}</p>
            <button 
              onClick={() => setIsAddMoneyOpen(true)}
              className="mt-2.5 px-4 py-1.5 bg-[#039487] hover:bg-teal-600 text-white text-xs font-bold rounded-xl transition-all shadow"
            >
              + Add Balance
            </button>
          </div>
        </div>

        {/* Dynamic Panels */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
          
          {/* Tab Selector */}
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-4 overflow-x-auto text-xs font-black mb-6">
            <button 
              onClick={() => setActiveTab('profile')} 
              className={`px-4 py-2.5 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-[#012C63] text-white shadow' : 'border border-slate-200 text-slate-600'}`}
            >
              My Profile
            </button>
            <button 
              onClick={() => setActiveTab('orders')} 
              className={`px-4 py-2.5 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-[#012C63] text-white shadow' : 'border border-slate-200 text-slate-600'}`}
            >
              My Orders
            </button>
            <button 
              onClick={() => setActiveTab('subscriptions')} 
              className={`px-4 py-2.5 rounded-xl transition-all ${activeTab === 'subscriptions' ? 'bg-[#012C63] text-white shadow' : 'border border-slate-200 text-slate-600'}`}
            >
              My Subscriptions
            </button>
            <button 
              onClick={() => setActiveTab('wallet')} 
              className={`px-4 py-2.5 rounded-xl transition-all ${activeTab === 'wallet' ? 'bg-[#012C63] text-white shadow' : 'border border-slate-200 text-slate-600'}`}
            >
              Wallet Balance (Functional)
            </button>
            <button 
              onClick={() => setActiveTab('family')} 
              className={`px-4 py-2.5 rounded-xl transition-all ${activeTab === 'family' ? 'bg-[#012C63] text-white shadow' : 'border border-slate-200 text-slate-600'}`}
            >
              Family Members (Self / Spouse / Children / Parents)
            </button>
          </div>

          {/* TAB 1: MY PROFILE */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl">
              <h3 className="text-lg font-black text-slate-900 mb-1">Customer Profile & Address</h3>
              <p className="text-xs text-slate-500 mb-6">Manage your primary collection address for phlebotomist home visits.</p>
              
              <form onSubmit={(e) => { e.preventDefault(); alert('Profile updated successfully!'); }} className="space-y-4">
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

          {/* TAB 2: MY ORDERS */}
          {activeTab === 'orders' && (
            <div>
              <h3 className="text-lg font-black text-slate-900 mb-1">Live Bookings & Report Vault</h3>
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

          {/* TAB 3: MY SUBSCRIPTIONS */}
          {activeTab === 'subscriptions' && (
            <div>
              <h3 className="text-lg font-black text-slate-900 mb-1">Preventive Health Subscriptions</h3>
              <p className="text-xs text-slate-500 mb-6">Periodic quarterly diabetes and thyroid monitoring plans.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>
          )}

          {/* TAB 4: WALLET BALANCE (FUNCTIONAL) */}
          {activeTab === 'wallet' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-tr from-[#012C63] to-[#0c3b65] text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-300">TestBeat Health Wallet</span>
                    <Wallet className="w-5 h-5 text-teal-300" />
                  </div>
                  <p className="text-xs text-slate-300 mt-2">Available Balance</p>
                  <h2 className="text-4xl font-black mt-1 text-white">₹{walletBalance}</h2>
                </div>
                <div className="mt-6 pt-4 border-t border-white/20 flex space-x-2">
                  <button 
                    onClick={() => setIsAddMoneyOpen(true)}
                    className="flex-1 py-2 bg-[#039487] hover:bg-teal-600 text-white font-bold text-xs rounded-xl transition-all shadow"
                  >
                    + Add Balance
                  </button>
                  <button 
                    onClick={() => alert('Cashback coupon code applied to your wallet!')}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl"
                  >
                    Redeem Code
                  </button>
                </div>
              </div>

              <div className="md:col-span-2 border border-slate-200 rounded-2xl p-5">
                <h4 className="text-sm font-black text-slate-900 mb-3">Wallet Activity & Cashback Passbook</h4>
                <div className="space-y-3 text-xs">
                  {transactions.map(tx => (
                    <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                          +
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{tx.title}</p>
                          <p className="text-[10px] text-slate-400">{tx.date}</p>
                        </div>
                      </div>
                      <span className="font-black text-emerald-600 text-sm">+₹{tx.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FAMILY MEMBERS (SELF, SPOUSE, CHILDREN, PARENTS, OTHER) */}
          {activeTab === 'family' && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Family Members Diagnostic Profiles</h3>
                  <p className="text-xs text-slate-500">Book and customize blood tests specifically for yourself or family members.</p>
                </div>
                <button 
                  onClick={() => setIsAddFamilyOpen(true)}
                  className="px-4 py-2 bg-[#039487] hover:bg-teal-600 text-white text-xs font-bold rounded-xl shadow flex items-center space-x-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Family Member</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        <button onClick={() => removeFamilyMember(member.id)} className="text-rose-500 hover:text-rose-700">
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

      </main>

      {/* FOOTER */}
      <footer className="bg-[#012C63] text-slate-300 text-xs border-t border-[#0c3b65] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-black text-white">Test</span>
            <span className="text-xl font-black text-[#039487]">Beat</span>
            <span className="w-2 h-2 rounded-full bg-[#F44236]"></span>
            <span className="text-slate-400 ml-2">| Indias Trusted MultiLabs.Healthcare Platform</span>
          </div>
          <p>© 2026 TestBeat Health Technologies Pvt Ltd. All rights reserved.</p>
        </div>
      </footer>

      {/* ================= MODAL 1: AUTHENTICATION (LOGIN & SIGN UP SWITCH) ================= */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 relative border border-slate-100">
            <button 
              onClick={() => { setIsAuthOpen(false); setOtpSent(false); }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Mode Switch Tabs */}
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

            {/* Form: LOGIN */}
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
                  {otpSent ? 'Verify OTP & Enter' : 'Send Login OTP'}
                </button>
              </form>
            ) : (
              /* Form: SIGN UP (Starting me only Number, Name, Age, City, Pin Code) */
              <form onSubmit={handleSignupSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-0.5">Mobile Number *</label>
                  <div className="flex items-center border border-slate-300 rounded-xl px-3 py-1.5">
                    <span className="text-slate-500 font-bold text-xs mr-2">+91</span>
                    <input 
                      type="tel" 
                      maxLength={10} 
                      required 
                      value={signupData.phone}
                      onChange={(e) => setSignupData({ ...signupData, phone: e.target.value.replace(/\D/g, '') })}
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
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
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
                      value={signupData.age}
                      onChange={(e) => setSignupData({ ...signupData, age: e.target.value })}
                      placeholder="28" 
                      className="w-full border border-slate-300 rounded-xl px-2 py-1.5 text-xs font-semibold focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-0.5">City</label>
                    <input 
                      type="text" 
                      required 
                      value={signupData.city}
                      onChange={(e) => setSignupData({ ...signupData, city: e.target.value })}
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
                      value={signupData.pincode}
                      onChange={(e) => setSignupData({ ...signupData, pincode: e.target.value.replace(/\D/g, '') })}
                      placeholder="201310" 
                      className="w-full border border-slate-300 rounded-xl px-2 py-1.5 text-xs font-semibold focus:outline-none" 
                    />
                  </div>
                </div>

                {otpSent && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-0.5">Enter OTP Code</label>
                    <input 
                      type="text" 
                      maxLength={6} 
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456" 
                      className="w-full border border-slate-300 rounded-xl px-2 py-1.5 text-center font-bold tracking-widest text-xs focus:outline-none" 
                    />
                  </div>
                )}

                <button type="submit" className="w-full py-2.5 bg-[#039487] hover:bg-teal-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all">
                  {otpSent ? 'Verify OTP & Finish' : 'Create Account & Send OTP'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL 2: ADD MONEY TO WALLET ================= */}
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

            <button onClick={handleAddMoney} className="w-full py-2.5 bg-[#039487] hover:bg-teal-600 text-white font-bold text-xs rounded-xl shadow">
              Proceed with Razorpay / UPI
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: ADD FAMILY MEMBER ================= */}
      {isAddFamilyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 relative border border-slate-100">
            <button onClick={() => setIsAddFamilyOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400">
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-center space-x-1.5 text-[#039487] mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs font-extrabold uppercase tracking-wider">Family Diagnostic Profile</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">Add Person for Blood Test</h3>
            <p className="text-xs text-slate-500 mb-4">Select relation and patient details for certified lab reports.</p>

            <form onSubmit={handleAddFamilyMember} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Relation *</label>
                <select 
                  value={newMember.relation}
                  onChange={(e) => setNewMember({ ...newMember, relation: e.target.value as any })}
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
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
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
                    value={newMember.age}
                    onChange={(e) => setNewMember({ ...newMember, age: e.target.value })}
                    placeholder="e.g. 58" 
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Gender *</label>
                  <select 
                    value={newMember.gender}
                    onChange={(e) => setNewMember({ ...newMember, gender: e.target.value as any })}
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

    </div>
  );
}
