'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  Send, 
  UploadCloud, 
  Percent, 
  Wallet, 
  Users 
} from 'lucide-react';

export default function BecomeAffiliatePartnerPage() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [businessType, setBusinessType] = useState('CLINIC');
  const [orgName, setOrgName] = useState('');
  const [city, setCity] = useState('Greater Noida');
  const [panNumber, setPanNumber] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [upiId, setUpiId] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/affiliate/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          businessType,
          organizationName: orgName,
          city,
          panNumber,
          bankAccountNo: bankAccount,
          bankIfsc,
          upiId
        })
      });

      const data = await res.json();
      setSubmitting(false);

      if (data.success) {
        setSuccess(true);
      } else {
        alert(data.error || 'Failed to submit registration');
      }
    } catch (err: any) {
      setSubmitting(false);
      alert('Network submission error');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Banner */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-wider bg-teal-50 text-[#00A896] px-3 py-1 rounded-full border border-teal-200 inline-block">
            Doctor, Clinic & Pharmacy B2B Network
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-2">Become a TestBeat Referral Partner</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Empower your patients with instant diagnostic comparisons while earning up to 20% commission on every booked test.
          </p>
        </div>

        {/* 3 Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <Percent className="text-[#00A896]" size={22} />
            <h3 className="font-black text-sm text-slate-900 mt-2">Guaranteed Commission</h3>
            <p className="text-xs text-slate-500 mt-1">Direct cut on every lab booking originating from your clinic link or code.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <Wallet className="text-emerald-600" size={22} />
            <h3 className="font-black text-sm text-slate-900 mt-2">Direct Wallet Withdrawals</h3>
            <p className="text-xs text-slate-500 mt-1">One-click UPI/NEFT payout directly to your bank account as soon as sample completes.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <ShieldCheck className="text-blue-600" size={22} />
            <h3 className="font-black text-sm text-slate-900 mt-2">Verified Patient Reports</h3>
            <p className="text-xs text-slate-500 mt-1">NABL accredited results from Redcliffe, Dr Lal, and Thyrocare delivered to WhatsApp.</p>
          </div>
        </div>

        {/* Onboarding Form / Success Card */}
        {success ? (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm text-center space-y-4">
            <CheckCircle2 size={48} className="text-emerald-600 mx-auto" />
            <h2 className="text-2xl font-black text-slate-900">Partner Application Submitted!</h2>
            <p className="text-xs text-slate-500 font-semibold max-w-md mx-auto">
              Aapka B2B application aur KYC documents TestBeat verification team ke paas aa gaye hain. 
              Review complete hote hi aapka Unique Referral Code aur Partner Dashboard activate kar diya jayega.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-2xs">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Building2 size={18} className="text-[#00A896]" />
              Partner Registration & KYC Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs font-bold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 block mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. R.K. Verma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#00A896]"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">WhatsApp Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#00A896]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-700 block mb-1">Business / Partner Type</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[#0F1E36]"
                  >
                    <option value="CLINIC">Doctor / Clinic / GP</option>
                    <option value="PHARMACY">Retail Chemist / Pharmacy</option>
                    <option value="RWA">Society Health Representative</option>
                    <option value="INFLUENCER">Health Influencer</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">Clinic / Pharmacy Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CareWell Clinic"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#00A896]"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">City / Locality</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#00A896]"
                  />
                </div>
              </div>

              {/* KYC & Payout Details */}
              <div className="pt-4 border-t border-slate-100">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block mb-3">
                  KYC & Payout Settlement Details (For Instant Commission Transfer)
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-700 block mb-1">PAN Card Number</label>
                    <input
                      type="text"
                      placeholder="ABCDE1234F"
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none uppercase font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 block mb-1">Primary UPI ID (Instant Payout)</label>
                    <input
                      type="text"
                      placeholder="name@okaxis / 9876543210@paytm"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="text-slate-700 block mb-1">Bank Account Number (Optional)</label>
                    <input
                      type="text"
                      placeholder="Account number"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 block mb-1">Bank IFSC Code (Optional)</label>
                    <input
                      type="text"
                      placeholder="SBIN0001234"
                      value={bankIfsc}
                      onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none uppercase font-mono"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#00A896] hover:bg-[#008f80] text-white rounded-xl shadow-md transition font-black text-xs cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                <Send size={15} />
                <span>{submitting ? 'Submitting Application...' : 'Apply for Affiliate Partner Access'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
