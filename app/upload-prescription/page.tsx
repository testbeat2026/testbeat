'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { UploadCloud, CheckCircle2, ArrowLeft, Check, Sparkles, Building2, ChevronRight, AlertCircle } from 'lucide-react';

interface LabTest {
  id: number;
  test_code: string;
  test_name: string;
  category: string;
  fasting_required: boolean;
  redcliffe_price: string;
  lalpath_price: string;
  thyrocare_price: string;
}

declare global {
  interface Window {
    Cashfree: any;
  }
}

export default function RealPrescriptionAggregatorPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('7666953705');
  const [address, setAddress] = useState('Chi V, Greater Noida');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // DB Tests
  const [dbTests, setDbTests] = useState<LabTest[]>([]);
  const [selectedCodes, setSelectedCodes] = useState<string[]>(['CBC', 'THYROID']);
  const [selectedLab, setSelectedLab] = useState<'Redcliffe Labs' | 'Dr Lal PathLabs' | 'Thyrocare'>('Redcliffe Labs');

  const [loading, setLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Fetch real tests from DB
  useEffect(() => {
    fetch('/api/tests')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.tests.length > 0) {
          setDbTests(data.tests);
        }
      })
      .catch(console.error);
  }, []);

  // Compute actual lab prices dynamically based on DB records
  const calculateTotal = (labName: string) => {
    return selectedCodes.reduce((total, code) => {
      const item = dbTests.find(t => t.test_code === code);
      if (!item) return total + 300;
      if (labName === 'Redcliffe Labs') return total + Number(item.redcliffe_price);
      if (labName === 'Dr Lal PathLabs') return total + Number(item.lalpath_price);
      if (labName === 'Thyrocare') return total + Number(item.thyrocare_price);
      return total + Number(item.redcliffe_price);
    }, 0);
  };

  const redcliffeTotal = calculateTotal('Redcliffe Labs');
  const lalpathTotal = calculateTotal('Dr Lal PathLabs');
  const thyrocareTotal = calculateTotal('Thyrocare');

  const activeTotal = selectedLab === 'Redcliffe Labs' 
    ? redcliffeTotal 
    : selectedLab === 'Dr Lal PathLabs' 
      ? lalpathTotal 
      : thyrocareTotal;

  // Compress image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 900;
        let w = img.width;
        let h = img.height;
        if (w > h && w > MAX_DIM) { h *= MAX_DIM / w; w = MAX_DIM; }
        else if (h > MAX_DIM) { w *= MAX_DIM / h; h = MAX_DIM; }

        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d')?.drawImage(img, 0, 0, w, h);
        setImagePreview(canvas.toDataURL('image/jpeg', 0.65));
      };
    };
    reader.readAsDataURL(file);
  };

  const toggleTest = (code: string) => {
    if (selectedCodes.includes(code)) {
      setSelectedCodes(selectedCodes.filter(c => c !== code));
    } else {
      setSelectedCodes([...selectedCodes, code]);
    }
  };

  // Real Pay via Cashfree
  const handleDirectCheckout = async () => {
    if (!imagePreview) {
      alert('Kripya prescription parcha upload karein.');
      setStep(1);
      return;
    }

    if (!phone || phone.replace(/\D/g, '').length < 10) {
      alert('Kripya valid 10-digit mobile number bhariye.');
      return;
    }

    if (!window.Cashfree) {
      alert('Cashfree Gateway loading, please wait 2 seconds...');
      return;
    }

    setLoading(true);
    setErrorText('');

    try {
      const testNames = selectedCodes.map(code => {
        const t = dbTests.find(item => item.test_code === code);
        return t ? t.test_name : code;
      });

      const res = await fetch('/api/prescription/create-and-pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: fullName || 'Patient',
          patientPhone: phone,
          patientAddress: address,
          fileBase64: imagePreview,
          selectedLab,
          selectedTests: testNames,
          totalAmount: activeTotal
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.paymentSessionId) {
        setLoading(false);
        setErrorText(data.error || 'Failed to start payment');
        return;
      }

      // Initialize real SDK checkout
      const cashfree = window.Cashfree({
        mode: data.env === 'PRODUCTION' ? 'production' : 'sandbox'
      });

      setLoading(false);

      cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: '_self'
      });

    } catch (err: any) {
      setLoading(false);
      setErrorText(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] font-sans pb-16">
      <Script
        src="https://sdk.cashfree.com/js/v3/cashfree.js"
        strategy="afterInteractive"
        onLoad={() => setSdkReady(true)}
      />

      <div className="bg-[#17466E] text-white text-[11px] font-bold text-center py-2 px-4 shadow-sm flex items-center justify-center gap-2">
        <span>⚡ Live Aggregator: Redcliffe vs Dr Lal PathLabs vs Thyrocare</span>
        <span>•</span>
        <span>Real Rate Comparison & Free Pickup</span>
      </div>

      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-9 h-9 rounded-xl bg-[#009387] text-white flex items-center justify-center font-black text-base shadow">
              TB
            </div>
            <div>
              <span className="text-xl font-black text-[#17466E] tracking-tight">Test<span className="text-[#009387]">Beat</span></span>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Diagnostic Aggregator</span>
            </div>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="text-xs font-bold text-slate-600 hover:text-[#17466E] flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft size={14} /> Back
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 sm:p-6 mt-4">
        {errorText && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorText}</span>
          </div>
        )}

        {step === 1 ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="text-center">
              <span className="text-[10px] font-black uppercase tracking-wider bg-teal-50 text-[#009387] px-3 py-1 rounded-full border border-teal-200">
                Step 1: Upload Parcha & Select Diagnosed Tests
              </span>
              <h1 className="text-2xl font-black text-slate-900 mt-2">Upload Prescription & Match Tests</h1>
              <p className="text-xs text-slate-500 mt-1">Neon DB live database se mapped rates</p>
            </div>

            {/* Parcha Upload */}
            <div className="border-2 border-dashed border-slate-300 hover:border-[#009387] rounded-2xl p-4 text-center cursor-pointer transition bg-slate-50 relative">
              <input
                type="file"
                accept="image/*"
                required
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <img src={imagePreview} alt="Prescription" className="max-h-48 rounded-xl object-contain mb-2 shadow" />
                  <span className="text-xs font-bold text-emerald-600">✓ Parcha Attached! (Click to replace)</span>
                </div>
              ) : (
                <div className="flex flex-col items-center py-6 text-slate-400">
                  <UploadCloud size={38} className="text-[#009387] mb-2" />
                  <span className="text-xs font-black text-slate-700">Click to upload Doctor's Prescription Photo</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">Camera photo ya image file</span>
                </div>
              )}
            </div>

            {/* Dynamic DB Tests List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-black text-[#17466E] uppercase tracking-wider">
                  Live Available Pathology Tests ({selectedCodes.length} Selected)
                </label>
                <span className="text-[11px] text-slate-400">Select prescribed tests</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {dbTests.map((t) => {
                  const isChecked = selectedCodes.includes(t.test_code);
                  return (
                    <div
                      key={t.test_code}
                      onClick={() => toggleTest(t.test_code)}
                      className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition text-xs font-bold ${
                        isChecked 
                          ? 'border-[#009387] bg-teal-50/50 text-[#17466E]' 
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${isChecked ? 'bg-[#009387] border-[#009387] text-white' : 'border-slate-300'}`}>
                          {isChecked && <Check size={12} />}
                        </div>
                        <div>
                          <span className="block leading-snug">{t.test_name}</span>
                          {t.fasting_required && (
                            <span className="text-[9px] text-amber-600 font-extrabold">Fasting Req.</span>
                          )}
                        </div>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px]">from ₹{t.redcliffe_price}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              disabled={selectedCodes.length === 0 || !imagePreview}
              onClick={() => setStep(2)}
              className="w-full py-4 bg-[#009387] hover:bg-[#007A70] text-white font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>Compare Live Lab Rates ({selectedCodes.length} Tests)</span>
              <ChevronRight size={16} />
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-teal-50 text-[#009387] px-3 py-1 rounded-full border border-teal-200">
                  Step 2: Real Lab Price Comparison
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">Choose Diagnostic Lab Partner</h2>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft size={14} /> Back
              </button>
            </div>

            {/* 3 Real Lab Cards with Exact Calculated Prices */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Redcliffe */}
              <div
                onClick={() => setSelectedLab('Redcliffe Labs')}
                className={`p-5 rounded-3xl border-2 cursor-pointer transition flex flex-col justify-between relative ${
                  selectedLab === 'Redcliffe Labs' 
                    ? 'border-[#009387] bg-teal-50/20 shadow-md ring-2 ring-[#009387]/20' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {selectedLab === 'Redcliffe Labs' && (
                  <span className="absolute -top-3 right-4 bg-[#009387] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                    Selected
                  </span>
                )}
                <div>
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                    Most Economical
                  </span>
                  <h3 className="font-black text-sm text-[#17466E] mt-2">Redcliffe Labs</h3>
                  <p className="text-[11px] text-slate-400 font-semibold mt-1">Sample Pickup: 60 Mins • 4.8 ★</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Aggregated Price</span>
                  <span className="text-2xl font-black text-slate-900">₹{redcliffeTotal}</span>
                  <span className="text-[10px] text-emerald-600 font-bold block">Free Home Pickup</span>
                </div>
              </div>

              {/* Lal PathLabs */}
              <div
                onClick={() => setSelectedLab('Dr Lal PathLabs')}
                className={`p-5 rounded-3xl border-2 cursor-pointer transition flex flex-col justify-between relative ${
                  selectedLab === 'Dr Lal PathLabs' 
                    ? 'border-[#009387] bg-teal-50/20 shadow-md ring-2 ring-[#009387]/20' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {selectedLab === 'Dr Lal PathLabs' && (
                  <span className="absolute -top-3 right-4 bg-[#009387] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                    Selected
                  </span>
                )}
                <div>
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    NABL Gold Standard
                  </span>
                  <h3 className="font-black text-sm text-[#17466E] mt-2">Dr Lal PathLabs</h3>
                  <p className="text-[11px] text-slate-400 font-semibold mt-1">Sample Pickup: 90 Mins • 4.9 ★</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Aggregated Price</span>
                  <span className="text-2xl font-black text-slate-900">₹{lalpathTotal}</span>
                  <span className="text-[10px] text-emerald-600 font-bold block">Free Home Pickup</span>
                </div>
              </div>

              {/* Thyrocare */}
              <div
                onClick={() => setSelectedLab('Thyrocare')}
                className={`p-5 rounded-3xl border-2 cursor-pointer transition flex flex-col justify-between relative ${
                  selectedLab === 'Thyrocare' 
                    ? 'border-[#009387] bg-teal-50/20 shadow-md ring-2 ring-[#009387]/20' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {selectedLab === 'Thyrocare' && (
                  <span className="absolute -top-3 right-4 bg-[#009387] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                    Selected
                  </span>
                )}
                <div>
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                    Automation Lab
                  </span>
                  <h3 className="font-black text-sm text-[#17466E] mt-2">Thyrocare</h3>
                  <p className="text-[11px] text-slate-400 font-semibold mt-1">Sample Pickup: 120 Mins • 4.7 ★</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Aggregated Price</span>
                  <span className="text-2xl font-black text-slate-900">₹{thyrocareTotal}</span>
                  <span className="text-[10px] text-emerald-600 font-bold block">Free Home Pickup</span>
                </div>
              </div>
            </div>

            {/* Patient Pickup Details */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Patient Pickup Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Patient Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                />
                <input
                  type="tel"
                  required
                  placeholder="Mobile Number (WhatsApp/Reports) *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                />
              </div>
              <input
                type="text"
                required
                placeholder="House / Street / Sector Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
              />
            </div>

            {/* Pay via Cashfree Button */}
            <button
              type="button"
              disabled={loading}
              onClick={handleDirectCheckout}
              className="w-full py-4 bg-[#009387] hover:bg-[#007A70] text-white font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Generating Cashfree Checkout Session...</span>
              ) : (
                <span>Pay ₹{activeTotal} & Confirm Booking with {selectedLab}</span>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
