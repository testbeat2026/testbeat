'use client';
import './globals.css';
import React, { useState } from 'react';
import Link from 'next/link';
import { AuthProvider, useAuth } from '@/lib/authContext';

function Header() {
  const { customerPhone, customerName, logoutCustomer, adminLoggedIn } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [phone, setPhone] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const { loginCustomer } = useAuth();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) setOtpStep(true);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-cyan-500/20">TB</span>
            <span className="text-2xl font-black tracking-tight text-slate-900">TEST<span className="text-cyan-600">BEAT</span></span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-600">
            <Link href="/#tests" className="hover:text-cyan-600 transition">Individual Tests</Link>
            <Link href="/#packages" className="hover:text-cyan-600 transition">Full Body Packages</Link>
            <Link href="/prescription" className="text-teal-600 hover:text-teal-700 transition flex items-center gap-1">
              <span>📄 AI Prescription</span>
            </Link>
            <Link href="/home-ecg" className="hover:text-cyan-600 transition">Home ECG</Link>
            <Link href="/affiliate" className="hover:text-cyan-600 transition">Clinic Partner (QR)</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-xs px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition">
              {adminLoggedIn ? "Admin Panel ⚡" : "Admin Login"}
            </Link>

            {customerPhone ? (
              <div className="flex items-center gap-2">
                <Link href="/orders" className="text-xs px-3.5 py-1.5 rounded-lg bg-cyan-600 text-white font-bold hover:bg-cyan-700 transition shadow-sm">
                  My Bookings
                </Link>
                <button onClick={logoutCustomer} className="text-[11px] text-rose-500 hover:underline font-bold">
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-xs px-4 py-1.5 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 transition"
              >
                Sign In / OTP
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Customer Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Customer Access</h3>
              <button onClick={() => setShowLoginModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            {!otpStep ? (
              <form onSubmit={handleSendOtp} className="mt-4 space-y-4">
                <p className="text-xs text-slate-500">Enter your 10-digit mobile number for instant verification.</p>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Mobile Number</label>
                  <div className="flex gap-2">
                    <span className="p-2.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">+91</span>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 text-xs border rounded-xl font-bold focus:outline-none focus:border-cyan-600"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold shadow-md transition">
                  Send OTP Code
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="mt-4 space-y-4">
                <div className="p-2.5 bg-cyan-50 rounded-xl text-xs text-cyan-900 border border-cyan-200">
                  Verification OTP sent to <b>+91 {phone}</b>.<br/>Mock OTP: <b className="font-mono text-cyan-800">123456</b>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    required
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-2.5 text-xs border rounded-xl font-bold text-center tracking-widest text-base focus:outline-none focus:border-cyan-600"
                  />
                </div>
                <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition">
                  Verify & Log In
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
      <body className="min-h-screen flex flex-col justify-between antialiased">
        <AuthProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <footer className="bg-slate-950 text-slate-400 text-xs mt-20 border-t border-slate-900 py-10">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <span className="text-white font-black text-lg block mb-2">TESTBEAT</span>
                <p className="text-slate-500 leading-relaxed">India's Premier Diagnostic Lab Aggregator. Transparent prices, certified NABL/CAP partner labs & safe home sample pickups.</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-2">Partner Labs</h4>
                <ul className="space-y-1 text-slate-500">
                  <li>Thyrocare Technologies</li>
                  <li>Healthians Diagnostic</li>
                  <li>Redcliffe Labs</li>
                  <li>Dr Lal PathLabs</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-2">Control & Portals</h4>
                <ul className="space-y-1 text-slate-500">
                  <li><Link href="/admin" className="hover:text-cyan-400">Super Admin Switchboard</Link></li>
                  <li><Link href="/affiliate" className="hover:text-cyan-400">Clinic Standee Generator</Link></li>
                  <li><Link href="/prescription" className="hover:text-cyan-400">Doctor Prescription AI</Link></li>
                  <li><Link href="/home-ecg" className="hover:text-cyan-400">12-Lead Home ECG</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-2">Support Helpline</h4>
                <p className="text-slate-500">24x7 Phlebotomist & Digital Reports WhatsApp Support: +91 99990 00000</p>
              </div>
            </div>
            <div className="border-t border-slate-900 mt-8 pt-6 text-center text-slate-600">
              © 2026 TestBeat Health Technologies Pvt Ltd. All rights reserved.
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
