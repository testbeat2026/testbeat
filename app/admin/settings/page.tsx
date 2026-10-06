'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { 
  Settings, 
  CreditCard, 
  MessageSquare, 
  Sliders, 
  FileSpreadsheet, 
  Save, 
  CheckCircle2, 
  Building2, 
  ShieldCheck 
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'gateway' | 'sms' | 'margins' | 'zoho'>('gateway');
  const [savedMessage, setSavedMessage] = useState(false);

  // Cashfree Gateway State
  const [cfAppId, setCfAppId] = useState('');
  const [cfSecretKey, setCfSecretKey] = useState('');
  const [cfEnv, setCfEnv] = useState('TEST');

  // WhatsApp / SMS State
  const [waApiKey, setWaApiKey] = useState('');
  const [senderPhone, setSenderPhone] = useState('7666953705');

  // Lab Margins State
  const [redcliffeMargin, setRedcliffeMargin] = useState('20');
  const [lalMargin, setLalMargin] = useState('15');
  const [thyroMargin, setThyroMargin] = useState('25');

  // Zoho Books State
  const [zohoOrgId, setZohoOrgId] = useState('800192837');
  const [zohoClientId, setZohoClientId] = useState('');
  const [zohoClientSecret, setZohoClientSecret] = useState('');
  const [zohoGSTRate, setZohoGSTRate] = useState('0');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Platform Configuration & API Vault ⚙️</h1>
          <p className="text-xs text-slate-500 font-bold mt-1">
            Cashfree PG, WhatsApp dispatch credentials, Lab commissions & Zoho Books accounting
          </p>
        </div>

        {savedMessage && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold">
            <CheckCircle2 size={14} />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('gateway')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'gateway'
              ? 'bg-[#00A896] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <CreditCard size={15} />
          <span>Payment Gateway (Cashfree)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sms')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'sms'
              ? 'bg-[#00A896] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <MessageSquare size={15} />
          <span>WhatsApp & SMS Gateway</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('margins')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'margins'
              ? 'bg-[#00A896] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sliders size={15} />
          <span>Lab Discount Margins</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('zoho')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'zoho'
              ? 'bg-[#00A896] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileSpreadsheet size={15} />
          <span>Zoho Books (Accounting & GST)</span>
        </button>
      </div>

      {/* Main Settings Form Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs max-w-3xl">
        <form onSubmit={handleSave} className="space-y-5 text-xs font-bold">
          
          {/* TAB 1: CASHFREE GATEWAY */}
          {activeTab === 'gateway' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Cashfree Payment Gateway Integration
                </h2>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                  Direct UPI, Cards & NetBanking checkout engine
                </p>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Cashfree App ID (Client ID)</label>
                <input
                  type="text"
                  placeholder="TEST100234..."
                  value={cfAppId}
                  onChange={(e) => setCfAppId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Cashfree Secret Key</label>
                <input
                  type="password"
                  placeholder="cfsk_ma_test_..."
                  value={cfSecretKey}
                  onChange={(e) => setCfSecretKey(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Environment Mode</label>
                <select
                  value={cfEnv}
                  onChange={(e) => setCfEnv(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[#0F1E36]"
                >
                  <option value="TEST">Sandbox (Test Mode)</option>
                  <option value="PROD">Production (Live Mode)</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 2: WHATSAPP / SMS */}
          {activeTab === 'sms' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Automated WhatsApp & SMS Engine
                </h2>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                  Auto-dispatch prescription quotes and PDF reports to patient phone
                </p>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">WhatsApp Business Cloud API Key / Token</label>
                <input
                  type="password"
                  placeholder="Bearer EAABw..."
                  value={waApiKey}
                  onChange={(e) => setWaApiKey(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Support & Hotline Mobile</label>
                <input
                  type="text"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                />
              </div>
            </div>
          )}

          {/* TAB 3: LAB MARGINS */}
          {activeTab === 'margins' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Partner Pricing & Platform Markups
                </h2>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                  Set baseline platform margin percentage across diagnostic lab networks
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-700 block mb-1">Redcliffe Labs (%)</label>
                  <input
                    type="number"
                    value={redcliffeMargin}
                    onChange={(e) => setRedcliffeMargin(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-[#00A896] font-black"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">Dr Lal PathLabs (%)</label>
                  <input
                    type="number"
                    value={lalMargin}
                    onChange={(e) => setLalMargin(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-blue-600 font-black"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">Thyrocare (%)</label>
                  <input
                    type="number"
                    value={thyroMargin}
                    onChange={(e) => setThyroMargin(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-amber-600 font-black"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ZOHO BOOKS */}
          {activeTab === 'zoho' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Zoho Books Accounting & GST Invoicing API
                  </h2>
                  <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                    Automated patient invoices, GST reporting & lab payment reconciliation
                  </p>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  Zoho API v3
                </span>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Zoho Organization ID</label>
                <input
                  type="text"
                  placeholder="800192837"
                  value={zohoOrgId}
                  onChange={(e) => setZohoOrgId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Zoho Client ID</label>
                <input
                  type="text"
                  placeholder="1000.XXXXXXXXXXXXXX"
                  value={zohoClientId}
                  onChange={(e) => setZohoClientId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Zoho Client Secret</label>
                <input
                  type="password"
                  placeholder="Zoho Client Secret Key"
                  value={zohoClientSecret}
                  onChange={(e) => setZohoClientSecret(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Pathology Diagnostic GST Slab</label>
                <select
                  value={zohoGSTRate}
                  onChange={(e) => setZohoGSTRate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[#0F1E36]"
                >
                  <option value="0">0% (Nil Rated - Medical Diagnostic Exempted under GST)</option>
                  <option value="18">18% (Applicable for B2B Tech / Platform Convenience Fee)</option>
                </select>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="py-3 px-6 bg-[#00A896] hover:bg-[#008f80] text-white rounded-xl shadow-md transition font-black text-xs cursor-pointer flex items-center gap-2"
            >
              <Save size={15} />
              <span>Save Configuration Vault</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
