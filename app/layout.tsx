import './globals.css';
import VisitorTracker from '@/components/VisitorTracker';
import Link from 'next/link';
import { MapPin, Phone, User, FileText, ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'TestBeat | Multi-Lab Health Aggregator',
  description: 'Book home lab tests from Redcliffe, Dr Lal, Thyrocare & Healthians in Greater Noida.',
};

function CleanCustomerNavbar() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Top Micro Strip */}
      <div className="bg-[#0F1E36] text-white text-[11px] font-semibold py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Free 60-Min Home Sample Collection across Greater Noida & NCR</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300 text-[11px]">
            <span className="flex items-center gap-1 text-teal-300 font-bold">
              <MapPin size={11} /> Greater Noida
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">100% NABL Accredited Labs</span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#00A896] text-white flex items-center justify-center font-black text-lg shadow-sm">
            TB
          </div>
          <div>
            <span className="text-xl font-black text-[#0F1E36] tracking-tight">
              Test<span className="text-[#00A896]">Beat</span>
            </span>
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest -mt-1">
              Multi-Lab Aggregator
            </span>
          </div>
        </Link>

        {/* Customer Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-black text-slate-700 uppercase tracking-wider">
          <Link href="/compare-labs" className="hover:text-[#00A896] transition flex items-center gap-1.5">
            <span>Compare Labs</span>
            <span className="bg-teal-50 text-[#00A896] border border-teal-200 text-[9px] px-1.5 py-0.2 rounded-full font-black">
              LIVE
            </span>
          </Link>
          <Link href="/upload-prescription" className="hover:text-[#00A896] transition">
            Upload Prescription
          </Link>
          <Link href="/#packages" className="hover:text-[#00A896] transition">
            Health Packages
          </Link>
        </nav>

        {/* Right Actions: Call + Sign In */}
        <div className="flex items-center gap-3">
          <a
            href="tel:7666953705"
            className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl"
          >
            <Phone size={13} className="text-[#00A896]" />
            <span>+91 76669 53705</span>
          </a>

          <Link
            href="/login"
            className="flex items-center gap-1.5 text-xs font-black text-slate-700 hover:text-[#00A896] border border-slate-200 px-3.5 py-2 rounded-xl transition"
          >
            <User size={14} />
            <span>Sign In</span>
          </Link>

          <Link
            href="/upload-prescription"
            className="px-4 py-2 bg-[#00A896] hover:bg-[#008f80] text-white rounded-xl font-black text-xs shadow-md transition flex items-center gap-1"
          >
            <FileText size={13} />
            <span>Upload Parcha</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function CleanCustomerFooter() {
  return (
    <footer className="bg-[#0F1E36] text-slate-400 text-xs border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00A896] text-white flex items-center justify-center font-black text-sm">
              TB
            </div>
            <span className="text-lg font-black text-white">Test<span className="text-[#00A896]">Beat</span></span>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
            India's transparent multi-lab diagnostic aggregator. Instant rates comparison from Redcliffe, Dr Lal, Thyrocare & Healthians with temperature-controlled home sample collection.
          </p>
        </div>

        <div>
          <h4 className="text-white font-black text-xs uppercase tracking-wider mb-3">Diagnostic Partners</h4>
          <ul className="space-y-2 text-[11px]">
            <li>Redcliffe Labs (60-Min Home Sample Pickup)</li>
            <li>Dr Lal PathLabs (Gold Standard Pathology)</li>
            <li>Thyrocare Technologies (Automated Panels)</li>
            <li>Healthians Express Diagnostics</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-black text-xs uppercase tracking-wider mb-3">Partnership & B2B</h4>
          <ul className="space-y-2 text-[11px]">
            <li>
              <Link href="/partner" className="text-teal-300 hover:text-white font-bold flex items-center gap-1">
                <span>Become an Affiliate Partner</span>
                <ArrowRight size={11} />
              </Link>
            </li>
            <li>Doctor & Clinic Sample Tie-ups</li>
            <li>Chemist / Pharmacy Affiliate Program</li>
            <li>Society & RWA Health Camps</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-black text-xs uppercase tracking-wider mb-3">Direct Support</h4>
          <p className="text-[11px] text-slate-400">Sample Pickup & Reports Query:</p>
          <p className="text-white font-mono font-bold text-sm mt-1">+91 76669 53705</p>
          <p className="text-[10px] text-slate-400 mt-2">Coverage: Greater Noida & NCR</p>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-[10px] text-slate-500 font-semibold">
        © 2026 TestBeat Healthcare Aggregator. All diagnostic pathology performed by verified NABL/ISO certified labs.
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased font-sans flex flex-col min-h-screen bg-[#F4F7FB] text-slate-900">
        <VisitorTracker />
        <CleanCustomerNavbar />
        <main className="flex-1">{children}</main>
        <CleanCustomerFooter />
      </body>
    </html>
  );
}
