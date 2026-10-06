import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, PhoneCall, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white font-extrabold text-base">
                TB
              </div>
              <span className="text-xl font-black text-white">Test<span className="text-sky-500">Beat</span></span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              India&apos;s Trusted Multi-Lab Diagnostic Aggregator. We empower families and doctors to compare prices, verify accreditations, and schedule certified phlebotomists with seamless cold-chain delivery.
            </p>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>NABL, CAP & ISO 9001:2015 Diagnostic Partners</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Popular Tests</h4>
            <ul className="space-y-2">
              <li><Link href="/tests" className="hover:text-white transition-colors">Complete Blood Count (CBC)</Link></li>
              <li><Link href="/tests" className="hover:text-white transition-colors">Thyroid Profile (T3, T4, TSH)</Link></li>
              <li><Link href="/tests" className="hover:text-white transition-colors">Diabetes Screening (HbA1c)</Link></li>
              <li><Link href="/tests" className="hover:text-white transition-colors">Vitamin D & B12 Combo</Link></li>
              <li><Link href="/packages" className="hover:text-white transition-colors">Full Body Comprehensive</Link></li>
            </ul>
          </div>

          {/* Partner & B2B (Affiliate Program Added) */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Partner With Us</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/affiliate-partner" className="text-sky-400 font-bold hover:underline flex items-center space-x-1">
                  <span>★ Affiliate Partner Program</span>
                </Link>
              </li>
              <li><Link href="/affiliate-partner" className="hover:text-white transition-colors">For Doctors & Clinics</Link></li>
              <li><Link href="/affiliate-partner" className="hover:text-white transition-colors">Corporate Health Camps</Link></li>
              <li><Link href="/compare" className="hover:text-white transition-colors">Multi-Lab Aggregator API</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Headquarters</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <span>Pan-India Operations • Greater Noida NCR Hub</span>
              </li>
              <li className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span>+91 83688 87011</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span>care@testbeat.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© 2026 TestBeat Health Technologies Pvt Ltd. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-400">Terms of Service</Link>
            <Link href="/refunds" className="hover:text-slate-400">Cancellation & Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
