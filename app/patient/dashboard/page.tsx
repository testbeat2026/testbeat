'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Clock, 
  User, 
  Download, 
  Plus, 
  Activity, 
  MapPin, 
  CheckCircle2, 
  ChevronRight 
} from 'lucide-react';

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState<'BOOKINGS' | 'REPORTS' | 'FAMILY'>('BOOKINGS');

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* User Welcome Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full mb-2">
              Verified Patient ID: #TB-9821
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Welcome, Patient Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Manage sample tracking, digital lab reports, and home visits.</p>
          </div>
          <button className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition-all">
            <Plus className="w-4 h-4" />
            <span>Book New Test</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('BOOKINGS')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'BOOKINGS'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Live Bookings & Tracking
          </button>
          <button
            onClick={() => setActiveTab('REPORTS')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'REPORTS'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Smart Medical Reports (PDF)
          </button>
          <button
            onClick={() => setActiveTab('FAMILY')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'FAMILY'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Family Members Profile
          </button>
        </div>

        {/* Tab Content: Live Bookings */}
        {activeTab === 'BOOKINGS' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Phlebotomist Assigned
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">Full Body Comprehensive Health Package</h3>
                  <p className="text-xs text-slate-500">Partner Lab: Thyrocare Technologies • Booking ID: #TB-48190</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-slate-900">₹1,199</span>
                  <p className="text-xs text-emerald-600 font-semibold">Paid Online</p>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="py-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Order Confirmed</p>
                    <p className="text-[10px] text-slate-400">10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-sky-600">
                  <Activity className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Sample Agent En Route</p>
                    <p className="text-[10px] text-slate-400">Arriving in 25 mins</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <Clock className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-400">Lab Processing</p>
                    <p className="text-[10px] text-slate-400">Barcoded Samples</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <FileText className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-400">Report Ready</p>
                    <p className="text-[10px] text-slate-400">Within 24 hrs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Reports */}
        {activeTab === 'REPORTS' && (
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-sm">
            <div className="p-4 sm:p-6 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">Thyroid Profile (Total) & Vitamin D</h4>
                <p className="text-xs text-slate-500">Collected: 02 Oct 2026 • Redcliffe Labs</p>
              </div>
              <button className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-bold transition-colors">
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab Content: Family Profile */}
        {activeTab === 'FAMILY' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm">
              <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold mb-3">
                SK
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Self</h4>
              <p className="text-xs text-slate-500">Age: 28 • Male</p>
            </div>
            <button className="border-2 border-dashed border-slate-300 rounded-2xl p-5 flex flex-col items-center justify-center text-slate-500 hover:border-sky-500 hover:text-sky-600 transition-all">
              <Plus className="w-6 h-6 mb-1" />
              <span className="text-xs font-bold">+ Add Family Member</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
