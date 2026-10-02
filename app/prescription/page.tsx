'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function PrescriptionUploadPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [extracted, setExtracted] = useState<boolean>(false);

  const handleSimulateOCR = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAnalyzing(true);
      setTimeout(() => {
        setAnalyzing(false);
        setExtracted(true);
      }, 1500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-slate-900">AI Doctor Prescription Reader</h1>
        <p className="text-sm text-slate-500 mt-1">Upload doctor's prescription slip (Parcha). Medical OCR extracts and matches verified lab tests.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
        <div className="border-2 border-dashed border-cyan-200 rounded-2xl p-10 bg-cyan-50/30">
          <span className="text-4xl block mb-3">📄</span>
          <p className="text-sm font-bold text-slate-700">Drag & drop doctor prescription or Browse</p>
          <label className="mt-5 inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs px-6 py-2.5 rounded-xl cursor-pointer shadow-md transition">
            Choose Prescription Image
            <input type="file" className="hidden" onChange={handleSimulateOCR} accept="image/*,application/pdf" />
          </label>
        </div>

        {analyzing && (
          <div className="mt-6 p-4 bg-slate-50 rounded-2xl flex items-center justify-center gap-3">
            <div className="w-4 h-4 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-bold text-slate-700">OCR AI Reading Handwriting & Normalizing Medical Names...</span>
          </div>
        )}

        {extracted && (
          <div className="mt-8 text-left bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-emerald-700 uppercase">✓ Verified Medical Extraction</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">98.4% Confidence</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center text-xs">
              <div>
                <h4 className="font-bold text-slate-900">Vitamin D (25-OH Total)</h4>
                <p className="text-slate-400 text-[11px]">Line: "Rx: Vit D3 60k cap / 25-OH test"</p>
              </div>
              <span className="font-bold text-cyan-600">Matched in Master Catalog</span>
            </div>
            <Link href="/" className="block text-center w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs transition">
              Compare Lab Prices for Detected Tests →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
