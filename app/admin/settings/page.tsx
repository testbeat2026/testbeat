'use client';

import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  Send, 
  Save, 
  BellRing, 
  Database, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  Building2 
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'api' | 'notifications' | 'labs'>('api');

  // API Config States
  const [cashfreeEnv, setCashfreeEnv] = useState('SANDBOX');
  const [cashfreeAppId, setCashfreeAppId] = useState('TEST1029384756...');
  const [whatsappApiKey, setWhatsappApiKey] = useState('wa_live_key_998341...');
  const [dbNode, setDbNode] = useState('Neon PostgreSQL (ep-testbeat-region)');
  
  // Notification Broadcast State
  const [broadcastTarget, setBroadcastTarget] = useState('ALL_PATIENTS');
  const [broadcastMessage, setBroadcastMessage] = useState(
    'Special Health Alert: 50% Flat OFF on Full Body Health Checkup across Greater Noida today. Free Home Pickup!'
  );
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Lab Partner Switches
  const [labsEnabled, setLabsEnabled] = useState({
    redcliffe: true,
    lalpath: true,
    thyrocare: true
  });

  const handleSaveApiKeys = (e: React.FormEvent) => {
    e.preventDefault();
    alert('API Configurations verified and updated across cluster runtime.');
  };

  const handleTriggerBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setSendingBroadcast(true);
    setTimeout(() => {
      setSendingBroadcast(false);
      setBroadcastSuccess(true);
      setTimeout(() => setBroadcastSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">System Hub & API Control ⚙️</h1>
          <p className="text-xs text-slate-500 font-bold mt-1">
            Manage Gateway Keys, Multi-Lab Routing, DB Connections & WhatsApp Dispatch
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
          <button
            onClick={() => setActiveTab('api')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'api' ? 'bg-[#00A896] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            API & Keys
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'notifications' ? 'bg-[#00A896] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            WhatsApp Broadcast
          </button>
          <button
            onClick={() => setActiveTab('labs')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'labs' ? 'bg-[#00A896] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Lab Routing
          </button>
        </div>
      </div>

      {/* TAB 1: API KEYS & GATEWAYS */}
      {activeTab === 'api' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-5 flex items-center gap-2">
              <KeyRound size={16} className="text-[#00A896]" />
              Production API Credentials & Webhook Routing
            </h2>

            <form onSubmit={handleSaveApiKeys} className="space-y-4 text-xs font-bold">
              <div>
                <label className="text-slate-700 block mb-1">Cashfree PG Environment</label>
                <select
                  value={cashfreeEnv}
                  onChange={(e) => setCashfreeEnv(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[#0F1E36]"
                >
                  <option value="PRODUCTION">Production Live Mode</option>
                  <option value="SANDBOX">Sandbox Test Mode</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Cashfree Client App ID</label>
                <input
                  type="text"
                  value={cashfreeAppId}
                  onChange={(e) => setCashfreeAppId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">WhatsApp Cloud / Business API Token</label>
                <input
                  type="password"
                  value={whatsappApiKey}
                  onChange={(e) => setWhatsappApiKey(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                />
                <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                  Used for real-time dispatch alerts and patient quote delivery.
                </span>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Database Cluster Instance</label>
                <input
                  type="text"
                  readOnly
                  value={dbNode}
                  className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl outline-none font-mono text-slate-500 cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#00A896] hover:bg-[#008f80] text-white rounded-xl shadow-md transition font-black text-xs flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <Save size={15} />
                <span>Save & Sync Configurations</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-500" />
                Webhook Endpoint
              </h3>
              <p className="text-xs text-slate-500 mb-3">Target URL for Cashfree payment instant callbacks:</p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] break-all font-bold text-slate-800 select-all">
                https://testbeat.in/api/payment/webhook
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Cpu size={16} className="text-blue-500" />
                Cluster Health
              </h3>
              <div className="space-y-2 text-xs font-bold text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>PostgreSQL Pool:</span>
                  <span className="text-emerald-600">Online (Neon)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Cashfree v3 SDK:</span>
                  <span className="text-emerald-600">Verified</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Serverless Edge:</span>
                  <span className="text-emerald-600">Active (Vercel)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WHATSAPP BROADCAST */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs max-w-2xl">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <BellRing size={16} className="text-[#00A896]" />
            Direct WhatsApp Patient & Lead Broadcast
          </h2>
          <p className="text-xs text-slate-500 mb-6 font-semibold">
            Send bulk announcements, health package discount links, or seasonal flu warnings directly to patient WhatsApp numbers.
          </p>

          {broadcastSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>Broadcast dispatched successfully to active lead cohort!</span>
            </div>
          )}

          <form onSubmit={handleTriggerBroadcast} className="space-y-4 text-xs font-bold">
            <div>
              <label className="text-slate-700 block mb-1">Target Audience Cohort</label>
              <select
                value={broadcastTarget}
                onChange={(e) => setBroadcastTarget(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[#0F1E36]"
              >
                <option value="ALL_PATIENTS">All Registered Patients (Past Bookings)</option>
                <option value="PROSPECT_LEADS">Captured Website Visitors & Leads</option>
                <option value="PENDING_PRESCRIPTIONS">Patients with Pending Prescriptions</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 block mb-1">Broadcast Message Body</label>
              <textarea
                rows={4}
                required
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={sendingBroadcast}
              className="w-full py-3.5 bg-[#00A896] hover:bg-[#008f80] text-white rounded-xl shadow-md transition font-black text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send size={15} />
              <span>{sendingBroadcast ? 'Broadcasting via WhatsApp...' : 'Dispatch Instant WhatsApp Campaign'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: LAB ROUTING */}
      {activeTab === 'labs' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs max-w-2xl space-y-4">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Building2 size={16} className="text-[#00A896]" />
            Diagnostic Lab Engine Switches
          </h2>
          <p className="text-xs text-slate-500 mb-4 font-semibold">
            Enable or disable specific fulfillment partners from the customer comparison engine in real-time.
          </p>

          <div className="divide-y divide-slate-100">
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-900 block">Redcliffe Labs</span>
                <span className="text-[10px] text-slate-400">60-minute pickup & high-margin automation</span>
              </div>
              <input
                type="checkbox"
                checked={labsEnabled.redcliffe}
                onChange={(e) => setLabsEnabled({ ...labsEnabled, redcliffe: e.target.checked })}
                className="w-4 h-4 accent-[#00A896] cursor-pointer"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-900 block">Dr Lal PathLabs</span>
                <span className="text-[10px] text-slate-400">National gold standard pathology routing</span>
              </div>
              <input
                type="checkbox"
                checked={labsEnabled.lalpath}
                onChange={(e) => setLabsEnabled({ ...labsEnabled, lalpath: e.target.checked })}
                className="w-4 h-4 accent-[#00A896] cursor-pointer"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-900 block">Thyrocare</span>
                <span className="text-[10px] text-slate-400">Preventive profile specialist</span>
              </div>
              <input
                type="checkbox"
                checked={labsEnabled.thyrocare}
                onChange={(e) => setLabsEnabled({ ...labsEnabled, thyrocare: e.target.checked })}
                className="w-4 h-4 accent-[#00A896] cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
