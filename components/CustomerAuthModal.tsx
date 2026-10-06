'use client';

import React, { useState } from 'react';
import { X, Phone, Lock, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function CustomerAuthModal({ onClose }: Props) {
  const [step, setStep] = useState<'MOBILE' | 'OTP'>('MOBILE');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile })
      });
      const data = await res.json();
      if (res.ok) {
        setStep('OTP');
      } else {
        setError(data.error || 'Failed to send OTP. Please try again.');
      }
    } catch {
      setError('Network error. Check connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setError('Please enter valid verification OTP');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp })
      });
      const data = await res.json();
      if (res.ok) {
        // Redirect to patient dashboard
        window.location.href = '/patient/dashboard';
      } else {
        setError(data.error || 'Invalid OTP code');
      }
    } catch {
      setError('Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 p-7 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-sky-600 mb-2">
          <UserCheck className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Patient Portal Login</span>
        </div>

        <h3 className="text-2xl font-black text-slate-900 mb-1">
          {step === 'MOBILE' ? 'Access Your Health Records' : 'Verify Mobile OTP'}
        </h3>
        <p className="text-slate-500 text-xs mb-6">
          {step === 'MOBILE'
            ? 'Track lab sample collection, view smart health reports, and manage family profiles.'
            : `Enter the 6-digit OTP sent via SMS to +91 ${mobile}`}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
            {error}
          </div>
        )}

        {step === 'MOBILE' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Mobile Number
              </label>
              <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-sky-600 focus-within:ring-2 focus-within:ring-sky-100 transition-all">
                <span className="text-slate-500 font-bold text-sm mr-2">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit number"
                  className="w-full text-slate-900 font-semibold focus:outline-none text-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-sky-600 to-teal-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-sky-600/20 hover:from-sky-700 hover:to-teal-700 transition-all flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Sending OTP...' : 'Continue with OTP'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                SMS Verification Code
              </label>
              <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-sky-600 focus-within:ring-2 focus-within:ring-sky-100 transition-all">
                <Lock className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit OTP"
                  className="w-full text-slate-900 font-semibold tracking-widest text-center focus:outline-none text-base"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
            >
              {loading ? 'Verifying...' : 'Verify & Enter Dashboard'}
            </button>

            <button
              type="button"
              onClick={() => setStep('MOBILE')}
              className="w-full text-center text-xs font-semibold text-slate-500 hover:text-sky-600"
            >
              Change Mobile Number
            </button>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center space-x-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Patient data protected under Indian Digital Health Privacy standards.</span>
        </div>
      </div>
    </div>
  );
}
