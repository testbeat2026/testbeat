'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  BadgePercent, 
  Wallet, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Send, 
  Copy, 
  Check, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';

export default function AdminAffiliateKYCDesk() {
  const [partners, setPartners] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'partners' | 'payouts'>('partners');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchAffiliateData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/affiliates/manage').catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        setPartners(data.partners || []);
        setPayouts(data.payouts || []);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAffiliateData();
  }, []);

  const updatePartnerKYC = async (id: number, status: 'VERIFIED' | 'REJECTED', rate: number) => {
    try {
      const res = await fetch('/api/admin/affiliates/manage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, kycStatus: status, commissionRate: rate })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Affiliate status updated to ${status}`);
        fetchAffiliateData();
      }
    } catch (e) {
      alert('Failed to update KYC');
    }
  };

  const processPayout = async (payoutId: number) => {
    try {
      const res = await fetch('/api/admin/affiliates/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payoutId, action: 'MARK_PAID' })
      });
      const data = await res.json();
      if (data.success) {
        alert('Payout marked as paid and deducted from partner wallet.');
        fetchAffiliateData();
      }
    } catch (e) {
      alert('Failed to process payout');
    }
  };

  const handleCopy = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`https://testbeat.in/?ref=${code}`);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Affiliate KYC, Commission & Payouts 🤝</h1>
          <p className="text-xs text-slate-500 font-bold mt-1">
            Verify Doctor/Clinic documents, customize commission rate & approve wallet withdrawals
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('partners')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'partners' ? 'bg-[#00A896] text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Affiliate Partners ({partners.length})
            </button>
            <button
              onClick={() => setActiveTab('payouts')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'payouts' ? 'bg-[#00A896] text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Withdrawal Requests ({payouts.filter(p => p.status === 'REQUESTED').length})
            </button>
          </div>
          <button
            onClick={fetchAffiliateData}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Verified Partners</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-slate-900">
              {partners.filter(p => p.kyc_status === 'VERIFIED').length}
            </span>
            <ShieldCheck className="text-[#00A896]" size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Pending KYC Reviews</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-amber-600">
              {partners.filter(p => p.kyc_status === 'PENDING').length}
            </span>
            <Clock className="text-amber-500" size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Pending Payout Amount</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-emerald-600">
              ₹{payouts.filter(p => p.status === 'REQUESTED').reduce((s, p) => s + Number(p.amount || 0), 0)}
            </span>
            <Wallet className="text-emerald-500" size={20} />
          </div>
        </div>
      </div>

      {/* Tab 1: Partners List & KYC */}
      {activeTab === 'partners' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 font-black text-xs uppercase text-slate-800">
            Registered B2B Partner Directory
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px]">
                  <th className="py-3 px-4">Partner Details</th>
                  <th className="py-3 px-4">Referral Code</th>
                  <th className="py-3 px-4">PAN & UPI Info</th>
                  <th className="py-3 px-4">Commission</th>
                  <th className="py-3 px-4">Wallet Balance</th>
                  <th className="py-3 px-4">KYC Status</th>
                  <th className="py-3 px-4 text-center">Verify Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {partners.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No affiliate partners registered yet.
                    </td>
                  </tr>
                ) : (
                  partners.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{p.full_name}</span>
                        <span className="text-[11px] text-slate-500">{p.organization_name} • {p.city}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">+91 {p.phone}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-[#00A896] block">{p.referral_code}</span>
                        <button
                          onClick={() => handleCopy(p.referral_code)}
                          className="text-[10px] text-slate-400 hover:text-slate-700 font-bold inline-flex items-center gap-1 cursor-pointer mt-0.5"
                        >
                          {copiedCode === p.referral_code ? <Check size={10} className="text-emerald-600" /> : <Copy size={10} />}
                          <span>Copy Link</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div>PAN: {p.pan_number || 'N/A'}</div>
                        <div className="text-emerald-700">UPI: {p.upi_id || 'N/A'}</div>
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-900">{p.commission_rate}%</td>
                      <td className="py-3.5 px-4 font-black text-emerald-600">₹{p.wallet_balance || 0}</td>
                      <td className="py-3.5 px-4">
                        {p.kyc_status === 'VERIFIED' ? (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full">
                            VERIFIED
                          </span>
                        ) : (
                          <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black px-2 py-0.5 rounded-full">
                            PENDING
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {p.kyc_status === 'PENDING' ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => updatePartnerKYC(p.id, 'VERIFIED', Number(p.commission_rate) || 15)}
                              className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-black hover:bg-emerald-700 cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updatePartnerKYC(p.id, 'REJECTED', 0)}
                              className="px-2 py-1 bg-rose-50 text-rose-700 rounded-lg text-[10px] font-black hover:bg-rose-100 cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-bold">Approved</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Withdrawal Requests */}
      {activeTab === 'payouts' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 font-black text-xs uppercase text-slate-800">
            Affiliate Commission Withdrawal Queue
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px]">
                  <th className="py-3 px-4">Partner</th>
                  <th className="py-3 px-4">Requested Amount</th>
                  <th className="py-3 px-4">Payout Destination</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Transfer Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {payouts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No withdrawal requests in queue.
                    </td>
                  </tr>
                ) : (
                  payouts.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{w.full_name}</td>
                      <td className="py-3.5 px-4 font-black text-emerald-600">₹{w.amount}</td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">{w.payout_details || 'UPI'}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-black">
                          {w.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => processPayout(w.id)}
                          className="px-3 py-1.5 bg-[#00A896] hover:bg-[#008f80] text-white rounded-xl text-[10px] font-black cursor-pointer shadow-xs"
                        >
                          Mark Transferred
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
