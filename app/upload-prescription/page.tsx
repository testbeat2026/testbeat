'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { 
  UploadCloud, CheckCircle2, ShieldCheck, Sparkles, Building2, 
  Trash2, Plus, ArrowLeft, ArrowRight, Check 
} from 'lucide-react';

declare global {
  interface Window {
    Cashfree: any;
  }
}

interface DetectedTest {
  id: string;
  name: string;
  redcliffe: number;
  lalPath: number;
  thyrocare: number;
  selected: boolean;
}

export default function PrescriptionScannerPage() {
  const router = useRouter();

  // Steps: 1 = Upload, 2 = Scanned Tests & Lab Selection, 3 = Confirm
  const [step, setStep] = useState<1 | 2>(1);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('7666953705');
  const [address, setAddress] = useState('Chi V, Greater Noida');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [scanning, setScanning] = useState(false);
  const [detectedTests, setDetectedTests] = useState<DetectedTest[]>([]);
  const [selectedLab, setSelectedLab] = useState<'redcliffe' | 'lalPath' | 'thyrocare'>('redcliffe');
  const [paying, setPaying] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScanPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      alert('Kripya prescription ki photo attach karein.');
      return;
    }

    setScanning(true);

    try {
      const res = await fetch('/api/prescription/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileBase64: imagePreview })
      });

      const data = await res.json();
      setScanning(false);

      if (data.success && data.tests?.length) {
        setDetectedTests(data.tests);
        setStep(2); // Jump directly to Review & Lab Selection
      } else {
        alert('Parche se test scan nahi ho paye, please manually check.');
      }
    } catch (err: any) {
      setScanning(false);
      alert('Scanning failed: ' + err.message);
    }
  };

  const toggleTest = (id: string) => {
    setDetectedTests(prev => prev.map(t => t.id === id ? { ...t, selected: !t.selected } : t));
  };

  // Calculate Lab Total
  const calculateTotal = (lab: 'redcliffe' | 'lalPath' | 'thyrocare') => {
    return detectedTests
      .filter(t => t.selected)
      .reduce((sum, t) => sum + t[lab], 0);
  };

  const currentTotal = calculateTotal(selectedLab);
  const activeTestsCount = detectedTests.filter(t => t.selected).length;

  const handlePayAndBook = async () => {
    if (activeTestsCount === 0) {
      alert('Kam se kam 1 test select hona chahiye.');
      return;
    }

    setPaying(true);

    const labNames = {
      redcliffe: 'Redcliffe Labs',
      lalPath: 'Dr Lal PathLabs',
      thyrocare: 'Thyrocare'
    };

    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: fullName || 'Patient',
          customerPhone: phone,
          amount: currentTotal,
          labAssigned: labNames[selectedLab]
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.paymentSessionId) {
        setPaying(false);
        alert('Payment session creation failed: ' + (data.error || 'Gateway issue'));
        return;
      }

      // Launch Cashfree
      const isProd = data.env === 'PRODUCTION';
      const cashfree = window.Cashfree({
        mode: isProd ? 'production' : 'sandbox'
      });

      setPaying(false);

      cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: '_self'
      });

    } catch (err: any) {
      setPaying(false);
      alert('Payment execution error: ' + err.message);
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
        <span>⚡ AI Prescription Intelligence</span>
        <span>•</span>
        <span>Instant OCR Doctor Handwriting Reader & Multi-Lab Pricing</span>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
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
            <ArrowLeft size={14} /> Back to Catalog
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 sm:p-6 mt-4">
        {step === 1 ? (
          /* STEP 1: Upload & Scan Form */
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
            <div className="text-center mb-6">
              <span className="text-[10px] font-black uppercase tracking-wider bg-teal-50 text-[#009387] px-3 py-1 rounded-full border border-teal-200 inline-flex items-center gap-1">
                <Sparkles size={12} /> AI Doctor Parcha Scanner
              </span>
              <h1 className="text-2xl font-black text-slate-900 mt-2">Upload Prescription</h1>
              <p className="text-xs text-slate-500 mt-1">Photo upload karte hi AI tests auto-detect karke sabhi labs ke rate dikhayega.</p>
            </div>

            <form onSubmit={handleScanPrescription} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Prescription Photo / Slip *</label>
                <div className="border-2 border-dashed border-slate-200 hover:border-[#009387] rounded-2xl p-4 text-center cursor-pointer transition bg-slate-50 relative">
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {imagePreview ? (
                    <div className="flex flex-col items-center">
                      <img src={imagePreview} alt="Prescription" className="max-h-48 rounded-xl object-contain mb-2 shadow-xs" />
                      <span className="text-xs font-bold text-emerald-600">✓ Parcha attached (Click to change)</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-6 text-slate-400">
                      <UploadCloud size={36} className="text-[#009387] mb-2" />
                      <span className="text-xs font-black text-slate-700">Click to upload doctor prescription</span>
                      <span className="text-[11px] text-slate-400 mt-0.5">JPG ya PNG</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#009387]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit phone number"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#009387]"
                />
              </div>

              <button
                type="submit"
                disabled={scanning}
                className="w-full mt-4 py-4 bg-[#009387] hover:bg-[#007A70] text-white font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {scanning ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="animate-spin" size={16} /> Scanning Doctor Parcha...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Scan Prescription & Compare Labs <ArrowRight size={16} />
                  </span>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* STEP 2: Scanned Tests Review & Partner Lab Selection */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  ✓ AI Scan Complete
                </span>
                <h2 className="text-base font-black text-slate-900 mt-1">Tests Extracted from Prescription</h2>
              </div>
              <button 
                onClick={() => setStep(1)}
                className="text-xs font-bold text-slate-500 hover:text-[#17466E] underline w-fit cursor-pointer"
              >
                Upload Different Parcha
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Test Checkboxes */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                  Verified Tests ({activeTestsCount} Selected)
                </h3>

                {detectedTests.map((test) => (
                  <div
                    key={test.id}
                    onClick={() => toggleTest(test.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      test.selected ? 'bg-teal-50/50 border-[#009387]' : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                        test.selected ? 'bg-[#009387] text-white' : 'border border-slate-300'
                      }`}>
                        {test.selected && <Check size={14} />}
                      </div>
                      <span className="font-extrabold text-xs text-slate-900">{test.name}</span>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-xs text-[#17466E]">
                        ₹{test[selectedLab]}
                      </span>
                    </div>
                  </div>
                ))}

                <p className="text-[11px] text-slate-400 font-semibold pt-2">
                  💡 Parche ke hisab se kisi test ko uncheck ya add kar sakte hain.
                </p>
              </div>

              {/* Right: Lab Selector & Live Booking Total */}
              <div className="space-y-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">
                    Select Diagnostic Lab
                  </h3>

                  {/* Redcliffe */}
                  <div
                    onClick={() => setSelectedLab('redcliffe')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                      selectedLab === 'redcliffe' ? 'border-[#009387] bg-teal-50/60 ring-2 ring-[#009387]/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-black text-xs text-[#17466E] block">Redcliffe Labs</span>
                        <span className="text-[10px] text-emerald-600 font-bold">Fastest 60-Min Pickup</span>
                      </div>
                      <span className="font-black text-sm text-slate-900">₹{calculateTotal('redcliffe')}</span>
                    </div>
                  </div>

                  {/* Dr Lal PathLabs */}
                  <div
                    onClick={() => setSelectedLab('lalPath')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                      selectedLab === 'lalPath' ? 'border-[#009387] bg-teal-50/60 ring-2 ring-[#009387]/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-black text-xs text-[#17466E] block">Dr Lal PathLabs</span>
                        <span className="text-[10px] text-slate-500 font-bold">NABL & CAP Certified</span>
                      </div>
                      <span className="font-black text-sm text-slate-900">₹{calculateTotal('lalPath')}</span>
                    </div>
                  </div>

                  {/* Thyrocare */}
                  <div
                    onClick={() => setSelectedLab('thyrocare')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                      selectedLab === 'thyrocare' ? 'border-[#009387] bg-teal-50/60 ring-2 ring-[#009387]/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-black text-xs text-[#17466E] block">Thyrocare</span>
                        <span className="text-[10px] text-slate-500 font-bold">Automated Central Lab</span>
                      </div>
                      <span className="font-black text-sm text-slate-900">₹{calculateTotal('thyrocare')}</span>
                    </div>
                  </div>

                  <hr className="border-slate-100 my-2" />

                  <div className="flex justify-between items-center text-sm font-black text-slate-900">
                    <span>Payable Total:</span>
                    <span className="text-xl text-[#009387]">₹{currentTotal}</span>
                  </div>

                  <button
                    onClick={handlePayAndBook}
                    disabled={paying || activeTestsCount === 0}
                    className="w-full py-4 bg-[#009387] hover:bg-[#007A70] text-white font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {paying ? 'Connecting Cashfree...' : `Pay ₹${currentTotal} & Book Home Collection`}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold text-center">
                    <ShieldCheck size={14} className="text-[#009387]" />
                    <span>Free Home Pickup Included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
