'use client';

import React, { useState } from 'react';
import { 
  BadgePercent, 
  UserPlus, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  Building2, 
  DollarSign 
} from 'lucide-react';

interface Affiliate {
  id: number;
  name: string;
  type: string;
  phone: string;
  code: string;
  commissionRate: string;
  totalReferrals: number;
  unpaidPayout: number;
}

export default function AdminAffiliatesPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Mock-backed active affiliates list
  const [affiliates, setAffiliates] = useState<Affiliate[]>([
    {
      id: 1,
      name: 'Dr. R.K. Verma Clinic',
      type: 'Local Clinic / GP',
      phone: '9811223344',
      code: 'DOC_VERMA',
      commissionRate: '15%',
      totalReferrals: 18,
      unpaidPayout: 2450
    },
    {
      id: 2,
      name: 'Apollo Pharmacy Greater Noida Sec-4',
      type: 'Retail Pharmacy',
      phone: '9877665544',
      code: 'APOLLO_GN',
      commissionRate: '10%',
      totalReferrals: 34,
      unpaidPayout: 4200
    },
    {
      id: 3,
      name: 'CareWell Diagnostic Center',
      type: 'Sample Collection Point',
      phone: '9988776655',
      code: 'CARE_GN',
      commissionRate: '12%',
      totalReferrals: 12,
      unpaidPayout: 1680
    }
  ]);

  const [partnerName, setPartnerName] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');
  const [partnerType, setPartnerType] = useState('Doctor / Clinic');
  const [partnerRate, setPartnerRate] = useState('15');

  const handleCopyLink = (code: string) => {
    navigator.clipboard.writeText(`https://testbeat.in/?ref=${code}`);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleCreateAffiliate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName || !partnerPhone) return;

    const generatedCode = partnerName.slice(0, 4).toUpperCase().replace(/\s/g, '') + '_' + Math.floor(100 + Math.random() * 900);
    const newAffiliate: Affiliate = {
      id: Date.now(),
      name: partnerName,
      type: partnerType,
      phone: partnerPhone,
      code: generatedCode,
      commissionRate: `${partnerRate}%`,
      totalReferrals: 0,
      unpaidPayout: 0
    };

    setAffiliates([newAffiliate, ...affiliates]);
    setPartnerName('');
    setPartnerPhone('');
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Affiliate & Referral Network 🤝</h1>
          <p className="text-xs text-slate-500 font-bold mt-1">
            Doctors, Local Clinics & Pharmacy B2B Commission Engine
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Active B2B Affiliates</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-slate-900">{affiliates.length}</span>
            <Building2 className="text-[#00A896]" size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Referred Test Bookings</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-blue-600">
              {affiliates.reduce((sum, a) => sum + a.totalReferrals, 0)}
            </span>
            <BadgePercent className="text-blue-500" size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Pending Commission Payouts</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-emerald-600">
              ₹{affiliates.reduce((sum, a) => sum + a.unpaidPayout, 0)}
            </span>
            <DollarSign className="text-emerald-500" size={20} />
          </div>
        </div>
      </div>

      {/* Form + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Onboarding Form */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs h-fit">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <UserPlus size={16} className="text-[#00A896]" />
            Onboard Clinic or Doctor Partner
          </h2>

          <form onSubmit={handleCreateAffiliate} className="space-y-3 text-xs font-bold">
            <div>
              <label className="text-slate-700 block mb-1">Partner / Clinic Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Gupta Clinic"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#00A896]"
              />
            </div>

            <div>
              <label className="text-slate-700 block mb-1">Contact Phone</label>
              <input
                type="tel"
                required
                placeholder="10-digit mobile number"
                value={partnerPhone}
                onChange={(e) => setPartnerPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#00A896]"
              />
            </div>

            <div>
              <label className="text-slate-700 block mb-1">Partner Type</label>
              <select
                value={partnerType}
                onChange={(e) => setPartnerType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[#0F1E36]"
              >
                <option value="Doctor / Clinic">Doctor / Clinic</option>
                <option value="Pharmacy / Chemist">Retail Pharmacy</option>
                <option value="Society Health Ambassador">Resident Welfare (RWA)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 block mb-1">Commission Share (%)</label>
              <input
                type="number"
                required
                value={partnerRate}
                onChange={(e) => setPartnerRate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#00A896] hover:bg-[#008f80] text-white rounded-xl shadow-md transition font-black text-xs cursor-pointer mt-2"
            >
              Generate Referral Link & Code
            </button>
          </form>
        </div>

        {/* Existing Partners Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 font-black text-xs uppercase text-slate-800">
            Registered Referral Partners ({affiliates.length})
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px]">
                  <th className="py-3 px-4">Partner</th>
                  <th className="py-3 px-4">Referral Code</th>
                  <th className="py-3 px-4">Commission</th>
                  <th className="py-3 px-4">Orders</th>
                  <th className="py-3 px-4">Payable</th>
                  <th className="py-3 px-4 text-center">Share Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {affiliates.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{a.name}</span>
                      <span className="text-[10px] text-slate-400">{a.type}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#00A896]">
                      {a.code}
                    </td>
                    <td className="py-3.5 px-4 font-bold">{a.commissionRate}</td>
                    <td className="py-3.5 px-4 font-bold text-blue-600">{a.totalReferrals}</td>
                    <td className="py-3.5 px-4 font-black text-emerald-600">₹{a.unpaidPayout}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleCopyLink(a.code)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition"
                      >
                        {copiedCode === a.code ? (
                          <>
                            <Check size={11} className="text-emerald-600" />
                            <span className="text-emerald-700">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
