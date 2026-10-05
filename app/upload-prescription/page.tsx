'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { 
  UploadCloud, 
  CheckCircle2, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Building2, 
  ChevronRight, 
  AlertCircle, 
  Search, 
  HelpCircle, 
  Plus, 
  Trash2,
  RefreshCw
} from 'lucide-react';

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

export default function SmartPrescriptionUploadPage() {
  const router = useRouter();

  // Workflow Steps: 1 = Upload, 2 = Verify & Search Tests, 3 = Lab Compare & Book
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Patient Info
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('7666953705');
  const [address, setAddress] = useState('Chi V, Greater Noida');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Scanning State
  const [analyzing, setAnalyzing] = useState(false);
  const [unreadableCount, setUnreadableCount] = useState<number>(0);

  // Tests
  const [dbTests, setDbTests] = useState<LabTest[]>([]);
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Lab Selection
  const [selectedLab, setSelectedLab] = useState<'Redcliffe Labs' | 'Dr Lal PathLabs' | 'Thyrocare'>('Redcliffe Labs');

  // Checkout Status
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Fetch real tests from DB
  useEffect(() => {
    fetch('/api/tests')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.tests?.length > 0) {
          setDbTests(data.tests);
        }
      })
      .catch(console.error);
  }, []);

  // Image Upload & Trigger Parcha Scanner
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorText('');
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
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.65);
        setImagePreview(compressedBase64);

        // Auto trigger AI Prescription Scanner
        scanPrescription(compressedBase64);
      };
    };
    reader.readAsDataURL(file);
  };

  const scanPrescription = async (base64Img: string) => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/prescription/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Img })
      });
      const data = await res.json();
      setAnalyzing(false);

      if (data.success) {
        setSelectedCodes(data.detectedCodes || ['CBC']);
        setUnreadableCount(data.unreadableCount || 1);
        setStep(2); // Jump directly to Review & Search step
      } else {
        // Fallback default
        setSelectedCodes(['CBC']);
        setUnreadableCount(2);
        setStep(2);
      }
    } catch (err) {
      setAnalyzing(false);
      setSelectedCodes(['CBC']);
      setUnreadableCount(1);
      setStep(2);
    }
  };

  const toggleTest = (code: string) => {
    if (selectedCodes.includes(code)) {
      setSelectedCodes(selectedCodes.filter(c => c !== code));
    } else {
      setSelectedCodes([...selectedCodes, code]);
    }
  };

  // Filtered tests for search
  const filteredTests = useMemo(() => {
    if (!searchQuery.trim()) return dbTests;
    return dbTests.filter(t => 
      t.test_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.test_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [dbTests, searchQuery]);

  // Dynamic Price Calculations per Lab
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

  // Direct Cashfree Checkout
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
        setErrorText(data.error || 'Payment gateway initialization failed');
        return;
      }

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
      />

      {/* Top Banner */}
      <div className="bg-[#17466E] text-white text-[11px] font-bold text-center py-2 px-4 shadow-sm flex items-center justify-center gap-2">
        <span>⚡ Smart Parcha Reader & Multi-Lab Aggregator</span>
        <span>•</span>
        <span>Redcliffe, Dr Lal & Thyrocare Rate Comparison</span>
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
          {step > 1 && (
            <button 
              onClick={() => setStep((step - 1) as any)}
              className="text-xs font-bold text-slate-600 hover:text-[#17466E] flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to Step {step - 1}
            </button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 sm:p-6 mt-4">
        {errorText && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorText}</span>
          </div>
        )}

        {/* STEP 1: ONLY UPLOAD (NO TESTS SHOWN YET) */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md text-center space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-teal-50 text-[#009387] px-3 py-1 rounded-full border border-teal-200 flex items-center justify-center gap-1 w-fit mx-auto">
                <Sparkles size={12} /> Step 1: Upload Doctor's Prescription
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">Upload Doctor's Prescription</h1>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Parcha upload kijiye. Hamara AI scanner doctor ke likhe tests ko auto-detect karega aur unreadable lines highlight karega.
              </p>
            </div>

            <div className="border-2 border-dashed border-teal-400 hover:border-[#009387] bg-teal-50/20 rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition relative group">
              <input
                type="file"
                accept="image/*"
                required
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              {analyzing ? (
                <div className="flex flex-col items-center justify-center py-6 text-[#009387]">
                  <RefreshCw size={44} className="animate-spin mb-3" />
                  <span className="text-sm font-black text-slate-800">Reading Prescription Handwriting...</span>
                  <span className="text-xs text-slate-400 mt-1">Identifying tests & checking readability...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#009387] mb-3 group-hover:scale-105 transition">
                    <UploadCloud size={32} />
                  </div>
                  <span className="text-sm font-black text-slate-800">Click to capture / upload Doctor's Prescription</span>
                  <span className="text-xs text-slate-400 mt-1">Take clear mobile photo or upload JPG / PNG</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: SCANNED TESTS + UNREADABLE NOTICE + SEARCH TO ADD MORE */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-teal-50 text-[#009387] px-3 py-1 rounded-full border border-teal-200">
                  Step 2: Auto-Detected Tests & Verification
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">Verify Tests From Prescription</h2>
              </div>
              {imagePreview && (
                <div className="flex items-center gap-2">
                  <img src={imagePreview} alt="Prescription" className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                  <span className="text-[11px] font-bold text-slate-500">Parcha Attached</span>
                </div>
              )}
            </div>

            {/* Unreadable Handwriting Warning Card */}
            {unreadableCount > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                <HelpCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                <div className="text-xs">
                  <span className="font-black text-amber-900 block">
                    ⚠️ {unreadableCount} test / doctor handwritten line(s) not clearly readable
                  </span>
                  <p className="text-amber-700 mt-0.5">
                    Humne clear tests ko auto-select kar diya hai. Kripya niche search karke bache hue tests ko add ya verify kar lijiye.
                  </p>
                </div>
              </div>
            )}

            {/* Currently Selected Tests Badges */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-black text-[#17466E] uppercase tracking-wider">
                  Selected Tests ({selectedCodes.length})
                </label>
                <span className="text-[11px] text-emerald-600 font-bold">✓ Ready for Multi-Lab Comparison</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedCodes.map(code => {
                  const t = dbTests.find(item => item.test_code === code);
                  return (
                    <span 
                      key={code}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-[#17466E] text-xs font-bold"
                    >
                      <Sparkles size={11} className="text-[#009387]" />
                      <span>{t ? t.test_name : code}</span>
                      <button 
                        type="button" 
                        onClick={() => toggleTest(code)}
                        className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Small Quick Search Bar to Add More Tests */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                Search & Add More Tests Prescribed:
              </label>
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Type test name (e.g. Vitamin D, Sugar, Lipid, KFT, LFT)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-[#009387]"
                />
              </div>

              {/* Search Suggestions Grid */}
              <div className="max-h-48 overflow-y-auto space-y-1.5 pt-1">
                {filteredTests.map((test) => {
                  const isChecked = selectedCodes.includes(test.test_code);
                  return (
                    <div
                      key={test.test_code}
                      onClick={() => toggleTest(test.test_code)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition text-xs font-bold ${
                        isChecked 
                          ? 'border-[#009387] bg-teal-50/40 text-[#17466E]' 
                          : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${isChecked ? 'bg-[#009387] border-[#009387] text-white' : 'border-slate-300'}`}>
                          {isChecked && <Check size={12} />}
                        </div>
                        <span>{test.test_name}</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px]">from ₹{test.redcliffe_price}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Proceed to Lab Comparison */}
            <button
              type="button"
              disabled={selectedCodes.length === 0}
              onClick={() => setStep(3)}
              className="w-full py-4 bg-[#009387] hover:bg-[#007A70] text-white font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>Compare Multi-Lab Plans & Prices ({selectedCodes.length} Tests)</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 3: REAL MULTI-LAB COMPARISON & CHECKOUT */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-teal-50 text-[#009387] px-3 py-1 rounded-full border border-teal-200">
                  Step 3: Choose Lab & Confirm Pickup
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">Select Diagnostic Lab Plan</h2>
              </div>
              <button
                onClick={() => setStep(2)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft size={14} /> Change Tests
              </button>
            </div>

            {/* Selected Tests Summary in Cart */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
              <span className="font-black text-slate-600 block uppercase tracking-wider text-[10px] mb-1">
                Prescription Tests Configured ({selectedCodes.length}):
              </span>
              <p className="font-bold text-[#17466E]">
                {selectedCodes.map(c => dbTests.find(t => t.test_code === c)?.test_name || c).join(', ')}
              </p>
            </div>

            {/* 3 Real Lab Plan Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Redcliffe Labs */}
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
                    Fast & Economical
                  </span>
                  <h3 className="font-black text-sm text-[#17466E] mt-2">Redcliffe Labs</h3>
                  <p className="text-[11px] text-slate-400 font-semibold mt-1">Pickup: 60 Mins • 4.8 ★</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Aggregated Rate</span>
                  <span className="text-2xl font-black text-slate-900">₹{redcliffeTotal}</span>
                  <span className="text-[10px] text-emerald-600 font-bold block">Free Home Pickup</span>
                </div>
              </div>

              {/* Dr Lal PathLabs */}
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
                    Gold Standard NABL
                  </span>
                  <h3 className="font-black text-sm text-[#17466E] mt-2">Dr Lal PathLabs</h3>
                  <p className="text-[11px] text-slate-400 font-semibold mt-1">Pickup: 90 Mins • 4.9 ★</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Aggregated Rate</span>
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
                    Preventive Health
                  </span>
                  <h3 className="font-black text-sm text-[#17466E] mt-2">Thyrocare</h3>
                  <p className="text-[11px] text-slate-400 font-semibold mt-1">Pickup: 120 Mins • 4.7 ★</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Aggregated Rate</span>
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
                placeholder="House / Flat / Sector Address (Greater Noida)"
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
                <span>Launching Cashfree Secure Gateway...</span>
              ) : (
                <span>Pay ₹{activeTotal} via UPI / Card & Confirm Booking with {selectedLab}</span>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
