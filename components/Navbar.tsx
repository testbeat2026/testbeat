'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Sparkles
} from 'lucide-react';
import CustomerAuthModal from './CustomerAuthModal';

export default function Navbar() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* 1. All-India Medical-Grade Trust Bar */}
      <div className="bg-slate-950 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-4 overflow-x-auto text-[11px] sm:text-xs">
            <span className="flex items-center text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> 100% NABL & CAP Accredited Labs
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:flex items-center text-slate-300">
              <Activity className="w-3.5 h-3.5 mr-1 text-sky-400" /> Temperature-Controlled Cold-Chain Logistics
            </span>
            <span className="hidden lg:inline text-slate-500">•</span>
            <span className="flex items-center text-amber-300">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Pan-India Home Sample Pickup
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center text-slate-300 hover:text-white cursor-pointer">
              <MapPin className="w-3.5 h-3.5 mr-1 text-rose-400" />
              <span className="font-medium">All India (50+ Cities)</span>
            </div>
            <a href="tel:+918368887011" className="flex items-center text-sky-400 font-semibold hover:underline">
              <PhoneCall className="w-3.5 h-3.5 mr-1" /> +91 83688 87011
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo & Updated Slogan */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              TB
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-2xl font-black tracking-tight text-slate-900">Test<span className="text-sky-600">Beat</span></span>
                <span className="bg-sky-100 text-sky-700 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">Unified</span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
                India&apos;s Trusted Multi-Lab Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-semibold text-slate-700">
            <Link href="/compare" className="flex items-center space-x-1.5 hover:text-sky-600 transition-colors">
              <FlaskConical className="w-4 h-4 text-sky-500" />
              <span>Compare Labs</span>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">Live</span>
            </Link>
            <Link href="/packages" className="hover:text-sky-600 transition-colors">
              Health Packages
            </Link>
            <Link href="/tests" className="hover:text-sky-600 transition-colors">
              All Blood Tests
            </Link>
            <Link href="/upload-prescription" className="flex items-center space-x-1 text-slate-700 hover:text-sky-600 transition-colors">
              <FileText className="w-4 h-4 text-indigo-500" />
              <span>Upload Prescription</span>
            </Link>
          </nav>

          {/* Customer Profile & CTA */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsAuthOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm font-semibold hover:border-sky-500 hover:text-sky-600 hover:bg-sky-50/50 transition-all shadow-sm"
            >
              <User className="w-4 h-4 text-sky-600" />
              <span>Patient Sign In</span>
            </button>

            <Link
              href="/packages"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 text-white text-sm font-semibold shadow-md shadow-sky-600/20 hover:from-sky-700 hover:to-teal-700 transition-all"
            >
              Book Test
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-5 space-y-3">
            <Link href="/compare" className="block text-sm font-semibold text-slate-700 py-1">Compare Labs</Link>
            <Link href="/packages" className="block text-sm font-semibold text-slate-700 py-1">Health Packages</Link>
            <Link href="/tests" className="block text-sm font-semibold text-slate-700 py-1">Blood Tests</Link>
            <Link href="/upload-prescription" className="block text-sm font-semibold text-slate-700 py-1">Upload Prescription</Link>
            <button
              onClick={() => { setMobileMenuOpen(false); setIsAuthOpen(true); }}
              className="w-full mt-2 py-2.5 bg-sky-600 text-white rounded-lg text-sm font-semibold"
            >
              Patient Sign In / Register
            </button>
          </div>
        )}
      </header>

      {/* Dedicated Customer Auth Modal */}
      {isAuthOpen && <CustomerAuthModal onClose={() => setIsAuthOpen(false)} />}
    </>
  );
}
