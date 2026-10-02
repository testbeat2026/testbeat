'use client';
import './globals.css';
import React, { useState } from 'react';
import Link from 'next/link';
import { AuthProvider, useAuth } from '@/lib/authContext';

function Header() {
  const { customerPhone, logoutCustomer, loginCustomer } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [phone, setPhone] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [pincode, setPincode] = useState('201310');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) setOtpStep(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    loginCustomer(phone, "Shubhranshu Kumar");
    setShowLoginModal(false);
    setOtpStep(false);
  };

  return (
    <>
      {/* Healthians Top Bar */}
      <div className="bg-[#002B49] text-white text-[11px] py-1.5 px-4 font-medium border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-bold">⚡ Up to 70% OFF Diagnostic Lab Aggregator</span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="hidden sm:inline text-slate-300">Free Home Sample Pickup in 60 Mins</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span>📞 24x7 Helpline: <b>+91 99990 00000</b></span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF5A00] to-amber-500 flex items-center justify-center text-white font-black text-2xl shadow-md shadow-orange-500/20">
                TB
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-[#002B49]">TEST<span className="text-[#FF5A00]">BEAT</span></span>
                <span className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest -mt-1">Diagnostic Aggregator</span>
              </div>
            </Link>

            {/* Pincode selector */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
              <span className="text-[#FF5A00]">📍</span>
              <span className="text-slate-400 text-[11px]">Deliver to:</span>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-16 bg-transparent font-bold text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Customer Specific Clean Menu */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-[#002B49] uppercase tracking-wide">
            <Link href="/#packages" className="hover:text-[#FF5A00] transition">Health Packages</Link>
            <Link href="/#compare" className="hover:text-[#FF5A00] transition">Compare Labs</Link>
            <Link href="/#tests" className="hover:text-[#FF5A00] transition">Individual Tests</Link>
            <Link href="/prescription" className="text-[#FF5A00] hover:text-[#E04E00] transition flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200">
              <span>📄 Upload Prescription</span>
            </Link>
            <Link href="/home-ecg" className="hover:text-[#FF5A00] transition">Home ECG (12-Lead)</Link>
          </nav>

          {/* Customer Login CTA */}
          <div className="flex items-center gap-3">
            {customerPhone ? (
              <div className="flex items-center gap-3">
                <Link href="/customer/dashboard" className="text-xs px-4 py-2.5 rounded-xl bg-[#002B49] text-white font-bold hover:bg-slate-800 transition shadow-sm flex items-center gap-1.5">
                  <span>👤 My Orders & Reports</span>
                </Link>
                <button onClick={logoutCustomer} className="text-xs text-rose-500 hover:underline font-bold">
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-xs px-5 py-2.5 rounded-xl bg-[#FF5A00] hover:bg-[#E04E00] text-white font-bold transition shadow-md shadow-orange-500/20"
              >
                Patient Login / OTP
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Customer Mobile OTP Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Patient Login / Verification</h3>
                <p className="text-[11px] text-slate-500">Track sample pickup & download smart reports</p>
              </div>
              <button onClick={() => setShowLoginModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            {!otpStep ? (
              <form onSubmit={handleSendOtp} className="mt-4 space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Mobile Number</label>
                  <div className="flex gap-2">
                    <span className="p-2.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-600 border border-slate-200">+91</span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 text-xs border rounded-xl font-bold focus:outline-none focus:border-[#FF5A00]"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-3 bg-[#FF5A00] hover:bg-[#E04E00] text-white rounded-xl text-xs font-bold shadow-md transition">
                  Send OTP via SMS
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="mt-4 space-y-4">
                <div className="p-3 bg-orange-50 rounded-xl text-xs text-orange-950 border border-orange-200">
                  OTP sent to <b>+91 {phone}</b>.<br />Demo Passcode: <b className="font-mono text-orange-800 text-sm">123456</b>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-2.5 text-xs border rounded-xl font-bold text-center tracking-widest text-base focus:outline-none focus:border-[#FF5A00]"
                  />
                </div>
                <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition">
                  Verify & Open Dashboard
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-between antialiased bg-[#F4F7F9] text-slate-900">
        <AuthProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          
          {/* Customer Centric Footer */}
          <footer className="bg-[#002B49] text-slate-400 text-xs mt-20 py-14 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FF5A00] flex items-center justify-center text-white font-black text-sm">TB</div>
                  <span className="text-white font-black text-lg">TESTBEAT</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  India's certified multi-lab diagnostic aggregator marketplace. Compare live prices across Thyrocare, Healthians, Redcliffe & Dr Lal with guaranteed cold chain sample collection.
                </p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Popular Health Screenings</h4>
                <ul className="space-y-2 text-slate-400 text-[11px]">
                  <li>• HealthShield Complete Full Body Checkup (84 Tests)</li>
                  <li>• Executive Senior Citizen Vital Organ Panel (92 Tests)</li>
                  <li>• Women Hormonal, PCOD & Thyroid Profile (72 Tests)</li>
                  <li>• Diabetes 90-Day Glycemic Control Panel</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Accredited Lab Partners</h4>
                <ul className="space-y-2 text-slate-400 text-[11px]">
                  <li>• Healthians Diagnostic (NABL, CAP)</li>
                  <li>• Thyrocare Technologies (NABL, CAP, ISO)</li>
                  <li>• Redcliffe Labs (NABL)</li>
                  <li>• Dr Lal PathLabs (NABL, CAP Gold)</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Workplace & Operations</h4>
                <p className="text-slate-300 mb-2">24x7 Phlebotomy Support: +91 99990 00000</p>
                <div className="pt-3 border-t border-slate-800 mt-3">
                  <Link href="/portal/login" className="text-slate-400 hover:text-amber-400 text-[11px] underline">
                    Authorized Staff & Workplace Console →
                  </Link>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-800 mt-10 pt-6 text-center text-slate-500 text-[11px]">
              © 2026 TestBeat Health Technologies Pvt Ltd. All rights reserved.
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
