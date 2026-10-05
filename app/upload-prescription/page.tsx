'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, CheckCircle2, ShieldCheck, ArrowLeft, Check, Sparkles, Building2, ChevronRight } from 'lucide-react';

interface LabOption {
  name: string;
  badge: string;
  pickupTime: string;
  rating: string;
  priceMultiplier: number;
}

const LABS: LabOption[] = [
  { name: 'Redcliffe Labs', badge: 'Most Economical', pickupTime: '60 Mins', rating: '4.8 ★', priceMultiplier: 1.0 },
  { name: 'Dr Lal PathLabs', badge: 'Gold Standard', pickupTime: '90 Mins', rating: '4.9 ★', priceMultiplier: 1.35 },
  { name: 'Thyrocare', badge: 'Preventive Specialist', pickupTime: '120 Mins', rating: '4.7 ★', priceMultiplier: 1.15 },
];

const COMMON_TESTS = [
  { id: 'cbc', name: 'Complete Blood Count (CBC)', basePrice: 299 },
  { id: 'sugar', name: 'HbA1c & Fasting Sugar', basePrice: 350 },
  { id: 'thyroid', name: 'Thyroid Profile (T3, T4, TSH)', basePrice: 320 },
  { id: 'lipid', name: 'Lipid Profile (Cholesterol)', basePrice: 399 },
  { id: 'lft', name: 'Liver Function Test (LFT)', basePrice: 450 },
  { id: 'kft', name: 'Kidney Function Test (KFT)', basePrice: 450 },
  { id: 'vitd', name: 'Vitamin D & B12 Combo', basePrice: 799 }
];

export default function SmartPrescriptionUploadPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1); // 1: Upload & Select Tests, 2: Lab Compare & Book

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('7666953705');
  const [address, setAddress] = useState('Chi V, Greater Noida');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Auto-selected tests from parcha
  const [selectedTests, setSelectedTests] = useState<string[]>([
    'Complete Blood Count (CBC)',
    'Thyroid Profile (T3, T4, TSH)'
  ]);
  const [customTestInput, setCustomTestInput] = useState('');

  // Selected Lab
  const [selectedLab, setSelectedLab] = useState('Redcliffe Labs');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Calculate Base Price
  const basePriceSum = selectedTests.reduce((sum, testName) => {
    const found = COMMON_TESTS.find(t => t.name === testName);
    return sum + (found ? found.basePrice : 350);
  }, 0);

  const activeLab = LABS.find(l => l.name === selectedLab) || LABS[0];
  const finalPrice = Math.round(basePriceSum * activeLab.priceMultiplier);

  // Compress Image Handler
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

  const toggleTest = (testName: string) => {
    if (selectedTests.includes(testName)) {
      setSelectedTests(selectedTests.filter(t => t !== testName));
    } else {
      setSelectedTests([...selectedTests, testName]);
    }
  };

  const handleAddCustomTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTestInput.trim()) return;
    if (!selectedTests.includes(customTestInput.trim())) {
      setSelectedTests([...selectedTests, customTestInput.trim()]);
    }
    setCustomTestInput('');
  };

  const handleSubmitBooking = async () => {
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      alert('Kripya valid 10-digit mobile number bhariye.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/prescription/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: fullName || 'Patient',
          patientPhone: phone,
          patientAddress: address,
          fileBase64: imagePreview || '',
          selectedTests,
          selectedLab,
          totalAmount: finalPrice
        })
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setSubmitted(true);
      } else {
        alert('Submission failed: ' + (data.error || 'Server error'));
      }
    } catch (err: any) {
      setLoading(false);
      alert('Network error: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] font-sans pb-16">
      {/* Top Banner */}
      <div className="bg-[#17466E] text-white text-[11px] font-bold text-center py-2 px-4 shadow-sm flex items-center justify-center gap-2">
        <span>⚡ Multi-Lab Aggregator: Compare Redcliffe, Lal PathLabs & Thyrocare</span>
        <span>•</span>
        <span>Free Home Pickup</span>
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
        {submitted ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Booking & Parcha Received
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-3">Prescription & Lab Selected!</h2>
            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs max-w-md mx-auto">
              <p className="font-bold text-slate-700">🔬 <strong>Assigned Lab:</strong> {selectedLab}</p>
              <p className="font-bold text-slate-700 mt-1">📋 <strong>Tests ({selectedTests.length}):</strong> {selectedTests.join(', ')}</p>
              <p className="font-bold text-emerald-700 mt-1">💰 <strong>Total Amount:</strong> ₹{finalPrice}</p>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              Humare medical coordinator ne parcha verify kar liya hai. Phlebotomist dispatch aur WhatsApp payment link <strong>+91 {phone}</strong> par bheja ja raha hai.
            </p>
            <button
              onClick={() => router.push('/admin/prescriptions')}
              className="mt-6 py-3.5 px-6 bg-[#009387] hover:bg-[#007A70] text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer"
            >
              Check in Admin Console →
            </button>
          </div>
        ) : step === 1 ? (
          /* STEP 1: UPLOAD PARCHA & TEST SELECTION */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="text-center">
              <span className="text-[10px] font-black uppercase tracking-wider bg-teal-50 text-[#009387] px-3 py-1 rounded-full border border-teal-200 flex items-center justify-center gap-1 w-fit mx-auto">
                <Sparkles size={12} /> Step 1 of 2: Parcha & Tests
              </span>
              <h1 className="text-2xl font-black text-slate-900 mt-2">Upload Parcha & Confirm Tests</h1>
              <p className="text-xs text-slate-500 mt-1">Parcha ki photo dalein aur diagnosed tests tick karein</p>
            </div>

            {/* Parcha Upload */}
            <div className="border-2 border-dashed border-slate-300 hover:border-[#009387] rounded-2xl p-4 text-center cursor-pointer transition bg-slate-50 relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <img src={imagePreview} alt="Prescription" className="max-h-48 rounded-xl object-contain mb-2 shadow" />
                  <span className="text-xs font-bold text-emerald-600">✓ Parcha Attached! (Click to change)</span>
                </div>
              ) : (
                <div className="flex flex-col items-center py-6 text-slate-400">
                  <UploadCloud size={38} className="text-[#009387] mb-2" />
                  <span className="text-xs font-black text-slate-700">Click to upload Doctor's Parcha Photo</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">JPEG / PNG from Mobile Camera</span>
                </div>
              )}
            </div>

            {/* Test Selection Checkboxes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-black text-[#17466E] uppercase tracking-wider">
                  Select Diagnosed Tests ({selectedTests.length} Selected)
                </label>
                <span className="text-[11px] text-slate-400">Tick tests prescribed by doctor</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {COMMON_TESTS.map((test) => {
                  const isChecked = selectedTests.includes(test.name);
                  return (
                    <div
                      key={test.id}
                      onClick={() => toggleTest(test.name)}
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
                        <span>{test.name}</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px]">₹{test.basePrice}</span>
                    </div>
                  );
                })}
              </div>

              {/* Add Custom Test */}
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="+ Add another test from prescription..."
                  value={customTestInput}
                  onChange={(e) => setCustomTestInput(e.target.value)}
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCustomTest}
                  className="px-4 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-black cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            <button
              type="button"
              disabled={selectedTests.length === 0}
              onClick={() => setStep(2)}
              className="w-full py-4 bg-[#009387] hover:bg-[#007A70] text-white font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>Compare Labs & See Prices ({selectedTests.length} Tests)</span>
              <ChevronRight size={16} />
            </button>
          </div>
        ) : (
          /* STEP 2: MULTI-LAB COMPARISON & FINAL CONFIRMATION */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-teal-50 text-[#009387] px-3 py-1 rounded-full border border-teal-200">
                  Step 2 of 2: Lab Price Compare
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">Choose Preferred Lab</h2>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft size={14} /> Edit Tests
              </button>
            </div>

            {/* 3 LAB COMPARISON CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {LABS.map((lab) => {
                const labPrice = Math.round(basePriceSum * lab.priceMultiplier);
                const isSelected = selectedLab === lab.name;

                return (
                  <div
                    key={lab.name}
                    onClick={() => setSelectedLab(lab.name)}
                    className={`p-5 rounded-3xl border-2 cursor-pointer transition flex flex-col justify-between relative ${
                      isSelected 
                        ? 'border-[#009387] bg-teal-50/20 shadow-md ring-2 ring-[#009387]/20' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute -top-3 right-4 bg-[#009387] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Selected
                      </span>
                    )}

                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {lab.badge}
                      </span>
                      <h3 className="font-black text-sm text-[#17466E] mt-2">{lab.name}</h3>
                      <div className="text-[11px] text-slate-400 font-semibold mt-1">
                        Pickup: <span className="text-slate-700 font-bold">{lab.pickupTime}</span> • {lab.rating}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Aggregator Price</span>
                      <span className="text-xl font-black text-slate-900">₹{labPrice}</span>
                      <span className="text-[10px] text-emerald-600 font-bold block">Free Sample Collection</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Patient Contact Info */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Pickup & Report Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Patient Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                />
                <input
                  type="tel"
                  placeholder="WhatsApp Mobile Number *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                />
              </div>
              <input
                type="text"
                placeholder="Pickup Address / Sector"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="button"
              disabled={loading}
              onClick={handleSubmitBooking}
              className="w-full py-4 bg-[#009387] hover:bg-[#007A70] text-white font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Confirming Booking with {selectedLab}...</span>
              ) : (
                <span>Confirm Booking with {selectedLab} (₹{finalPrice})</span>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
