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
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-teal-500/20">
              TB
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900">TEST<span className="text-teal-600">BEAT</span></span>
              <span className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest -mt-1">Diagnostics Marketplace</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-slate-600">
            <Link href="/#tests" className="hover:text-teal-600 transition">Individual Tests</Link>
            <Link href="/#packages" className="hover:text-teal-600 transition">Health Packages</Link>
            <Link href="/prescription" className="text-teal-700 hover:text-teal-800 transition flex items-center gap-1.5 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-200">
              <span>📄 Upload Prescription</span>
            </Link>
            <Link href="/home-ecg" className="hover:text-teal-600 transition">Home ECG (12-Lead)</Link>
            <Link href="/affiliate" className="hover:text-teal-600 transition">Partner Standee</Link>
          </nav>

          <div className="flex items-center gap-3">
            {customerPhone ? (
              <div className="flex items-center gap-3">
                <Link href="/customer/dashboard" className="text-xs px-4 py-2 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition shadow-sm">
                  👤 Patient Dashboard
                </Link>
                <button onClick={logoutCustomer} className="text-xs text-rose-500 hover:underline font-bold">
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-xs px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition shadow-sm"
              >
                Patient Login / OTP
              </button>
            )}
          </div>
        </div>
      </header>

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Patient Login / Signup</h3>
                <p className="text-[11px] text-slate-400">View live reports & manage family members</p>
              </div>
              <button onClick={() => setShowLoginModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
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
                      className="w-full p-2.5 text-xs border rounded-xl font-bold focus:outline-none focus:border-teal-600"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition">
                  Send Instant Verification OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="mt-4 space-y-4">
                <div className="p-3 bg-teal-50 rounded-xl text-xs text-teal-900 border border-teal-200">
                  OTP sent to <b>+91 {phone}</b>.<br />Demo Passcode: <b className="font-mono text-teal-800 text-sm">123456</b>
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
                    className="w-full p-2.5 text-xs border rounded-xl font-bold text-center tracking-widest text-base focus:outline-none focus:border-teal-600"
                  />
                </div>
                <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition">
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
      <body className="min-h-screen flex flex-col justify-between antialiased bg-slate-50 text-slate-900">
        <AuthProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <footer className="bg-slate-950 text-slate-400 text-xs mt-20 border-t border-slate-900 py-12">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-black text-sm">TB</span>
                  <span className="text-white font-black text-lg">TESTBEAT</span>
                </div>
                <p className="text-slate-500 leading-relaxed">
                  Pan-India Diagnostic Marketplace aggregating accredited NABL/CAP laboratory partners with 100% price transparency and temperature-controlled home sample collections.
                </p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Accredited Lab Network</h4>
                <ul className="space-y-1.5 text-slate-400">
                  <li>• Thyrocare Technologies</li>
                  <li>• Healthians Diagnostic</li>
                  <li>• Redcliffe Labs</li>
                  <li>• Dr Lal PathLabs</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Quick Services</h4>
                <ul className="space-y-1.5 text-slate-400">
                  <li><Link href="/prescription" className="hover:text-teal-400">AI Prescription Reader</Link></li>
                  <li><Link href="/home-ecg" className="hover:text-teal-400">12-Lead Home ECG Service</Link></li>
                  <li><Link href="/affiliate" className="hover:text-teal-400">Printable Clinic QR Standee</Link></li>
                  <li><Link href="/customer/dashboard" className="hover:text-teal-400">Customer Family Dashboard</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Workplace Portals</h4>
                <p className="text-slate-400 mb-2">24x7 Support Helpline: +91 99990 00000</p>
                <div className="pt-2 border-t border-slate-900 mt-3">
                  <Link href="/portal/login" className="text-slate-500 hover:text-teal-400 text-[11px] underline">
                    Staff, Operations & Admin Workplace Portal →
                  </Link>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-900 mt-10 pt-6 text-center text-slate-600">
              © 2026 TestBeat Health Technologies Pvt Ltd. All rights reserved.
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
