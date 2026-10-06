import './globals.css';
import VisitorTracker from '@/components/VisitorTracker';
import Link from 'next/link';

export const metadata = {
  title: 'TestBeat | India\'s Multi-Lab Diagnostic Aggregator',
  description: 'Compare Redcliffe, Dr Lal, Thyrocare & Healthians. Free 60-min home sample collection in Greater Noida & NCR.',
};

function PublicNavbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top micro bar */}
      <div className="bg-[#0F1E36] text-white text-[11px] font-bold py-1.5 px-4 text-center flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Express 60-Min Home Sample Collection across Greater Noida & NCR</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-300">
          <span>NABL & ISO Certified Labs Only</span>
          <span>•</span>
          <Link href="/login" className="text-teal-400 hover:text-white transition">Staff Login</Link>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
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

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-black text-slate-700 uppercase tracking-wider">
          <Link href="/compare-labs" className="hover:text-[#00A896] transition flex items-center gap-1.5">
            <span>Compare Labs</span>
            <span className="bg-teal-50 text-[#00A896] border border-teal-200 text-[9px] px-1.5 py-0.5 rounded-full font-black">
              LIVE
            </span>
          </Link>
          <Link href="/upload-prescription" className="hover:text-[#00A896] transition">
            Upload Prescription
          </Link>
          <Link href="/#packages" className="hover:text-[#00A896] transition">
            Health Packages
          </Link>
          <Link href="/admin" className="text-slate-400 hover:text-slate-700 transition">
            Admin Desk
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="tel:7666953705"
            className="hidden sm:flex flex-col text-right text-xs font-bold leading-tight"
          >
            <span className="text-[10px] text-slate-400 uppercase">Free Lab Advice</span>
            <span className="text-[#0F1E36] font-black">+91 76669 53705</span>
          </a>

          <Link
            href="/upload-prescription"
            className="px-4 py-2.5 bg-[#00A896] hover:bg-[#008f80] text-white rounded-xl font-black text-xs shadow-md transition flex items-center gap-1.5"
          >
            <span>Upload Parcha</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function PublicFooter() {
  return (
    <footer className="bg-[#0F1E36] text-slate-400 text-xs border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00A896] text-white flex items-center justify-center font-black text-sm">
              TB
            </div>
            <span className="text-lg font-black text-white">Test<span className="text-[#00A896]">Beat</span></span>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
            India's neutral multi-lab diagnostic rate aggregator. Compare prices, turnaround time, and book free home sample pickup from Redcliffe, Dr Lal, Thyrocare & Healthians.
          </p>
        </div>

        <div>
          <h4 className="text-white font-black text-xs uppercase tracking-wider mb-3">Diagnostic Partners</h4>
          <ul className="space-y-1.5 text-[11px]">
            <li>Redcliffe Labs (60-Min Home Pickup)</li>
            <li>Dr Lal PathLabs (Gold Standard)</li>
            <li>Thyrocare Technologies</li>
            <li>Healthians Diagnostics</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-black text-xs uppercase tracking-wider mb-3">Service Areas</h4>
          <ul className="space-y-1.5 text-[11px]">
            <li>Greater Noida (Chi V, Pari Chowk, Alpha, Beta)</li>
            <li>Greater Noida West (Noida Extension)</li>
            <li>Noida Express Corridor</li>
            <li>Ghaziabad & Delhi NCR</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-black text-xs uppercase tracking-wider mb-3">Operations & Helpdesk</h4>
          <p className="text-[11px] text-slate-400">Home Sample Collection Helpline:</p>
          <p className="text-white font-mono font-bold text-sm mt-1">+91 76669 53705</p>
          <div className="mt-3">
            <Link href="/login" className="text-teal-400 hover:underline text-[11px] font-bold">
              Staff & Phlebotomist Login →
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-[10px] text-slate-500 font-semibold">
        © 2026 TestBeat Healthcare Aggregator. All medical tests processed by certified NABL accredited partner pathology labs.
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-sans flex flex-col min-h-screen bg-[#F4F7FB] text-slate-900">
        <VisitorTracker />
        <PublicNavbar />
        <main className="flex-1">
          {children}
        </main>
        <PublicFooter />
      </body>
    </html>
  );
}
