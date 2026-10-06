'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Check, 
  X, 
  TrendingUp, 
  Award, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface TestItem {
  id: string;
  name: string;
  category: string;
  parametersCount: number;
}

const AVAILABLE_TESTS: TestItem[] = [
  { id: 't1', name: 'Complete Blood Count (CBC with ESR)', category: 'Blood', parametersCount: 28 },
  { id: 't2', name: 'Thyroid Profile Total (T3, T4, TSH)', category: 'Thyroid', parametersCount: 3 },
  { id: 't3', name: 'HbA1c (Glycated Hemoglobin)', category: 'Diabetes', parametersCount: 2 },
  { id: 't4', name: 'Lipid Profile (Cholesterol & Triglycerides)', category: 'Heart', parametersCount: 8 },
  { id: 't5', name: 'Liver Function Test (LFT)', category: 'Liver', parametersCount: 12 },
  { id: 't6', name: 'Kidney Function Test (KFT with Electrolytes)', category: 'Kidney', parametersCount: 11 },
  { id: 't7', name: 'Vitamin D (25-Hydroxy)', category: 'Vitamins', parametersCount: 1 },
  { id: 't8', name: 'Vitamin B12 (Cyanocobalamin)', category: 'Vitamins', parametersCount: 1 },
];

interface LabQuote {
  labName: string;
  labLogo: string;
  accreditation: string;
  reportHours: number;
  basePrice: number;
  discountPercentage: number;
  homeCollectionFee: number;
}

const LABS_DATA: LabQuote[] = [
  {
    labName: 'Thyrocare Technologies',
    labLogo: 'TC',
    accreditation: 'NABL & CAP',
    reportHours: 24,
    basePrice: 1999,
    discountPercentage: 55,
    homeCollectionFee: 0
  },
  {
    labName: 'Healthians Network',
    labLogo: 'HN',
    accreditation: 'NABL Certified',
    reportHours: 18,
    basePrice: 2200,
    discountPercentage: 58,
    homeCollectionFee: 0
  },
  {
    labName: 'Redcliffe Lifetech',
    labLogo: 'RL',
    accreditation: 'NABL & ISO',
    reportHours: 16,
    basePrice: 2100,
    discountPercentage: 52,
    homeCollectionFee: 0
  },
  {
    labName: 'Dr. Lal PathLabs Partner',
    labLogo: 'LP',
    accreditation: 'NABL & CAP Gold',
    reportHours: 12,
    basePrice: 2800,
    discountPercentage: 35,
    homeCollectionFee: 100
  }
];

export default function MultiTestSearchComparator() {
  const [query, setQuery] = useState('');
  const [selectedTests, setSelectedTests] = useState<TestItem[]>([
    AVAILABLE_TESTS[0], // Preselect CBC
    AVAILABLE_TESTS[1]  // Preselect Thyroid
  ]);

  const filteredTests = useMemo(() => {
    if (!query.trim()) return [];
    return AVAILABLE_TESTS.filter(t => 
      t.name.toLowerCase().includes(query.toLowerCase()) &&
      !selectedTests.some(st => st.id === t.id)
    );
  }, [query, selectedTests]);

  const toggleTest = (test: TestItem) => {
    if (selectedTests.some(t => t.id === test.id)) {
      setSelectedTests(selectedTests.filter(t => t.id !== test.id));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
    setQuery('');
  };

  const totalParams = useMemo(() => {
    return selectedTests.reduce((acc, t) => acc + t.parametersCount, 0);
  }, [selectedTests]);

  // Compute pricing per lab dynamically based on count of tests selected
  const labCalculations = useMemo(() => {
    return LABS_DATA.map((lab, index) => {
      // Scale price with test volume
      const multiplier = Math.max(1, selectedTests.length * 0.75);
      const calculatedMrp = Math.round(lab.basePrice * multiplier);
      const finalPrice = Math.round(calculatedMrp * (1 - lab.discountPercentage / 100)) + lab.homeCollectionFee;
      
      // Value Score = parameters covered / final price * 100
      const valueScore = (totalParams / finalPrice) * 1000;

      return {
        ...lab,
        mrp: calculatedMrp,
        finalPrice,
        valueScore
      };
    }).sort((a, b) => b.valueScore - a.valueScore);
  }, [selectedTests, totalParams]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Search Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Real-Time Multi-Lab Price Matching</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Select Your Tests. <span className="text-sky-600">Compare NABL Labs Instantly.</span>
        </h2>
        <p className="text-slate-600 text-sm sm:text-base mt-2">
          Add single blood tests or full body profiles. See instant price comparisons, parameter depth, and report turnaround times across India&apos;s leading diagnostic networks.
        </p>
      </div>

      {/* Multi-Select Search Bar */}
      <div className="max-w-3xl mx-auto relative mb-6">
        <div className="relative flex items-center bg-white border-2 border-sky-600/40 rounded-2xl shadow-xl shadow-sky-600/5 focus-within:border-sky-600 transition-all p-2">
          <Search className="w-6 h-6 text-sky-600 ml-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type any test name: CBC, Vitamin D, HbA1c, Lipid, KFT..."
            className="w-full px-4 py-2 text-slate-800 placeholder-slate-400 focus:outline-none text-base font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600 mr-2">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Live Search Auto-suggestions Dropdown */}
        {filteredTests.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-30 overflow-hidden divide-y divide-slate-100">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                onClick={() => toggleTest(test)}
                className="flex items-center justify-between p-3.5 hover:bg-sky-50/70 cursor-pointer transition-colors"
              >
                <div>
                  <span className="font-semibold text-slate-800 text-sm">{test.name}</span>
                  <div className="text-xs text-slate-500">{test.category} • {test.parametersCount} Parameters Included</div>
                </div>
                <span className="text-xs font-bold text-sky-600 bg-sky-100 px-2 py-1 rounded-md">
                  + Add Test
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Tests Pills */}
      <div className="max-w-3xl mx-auto mb-10 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2">Selected Tests:</span>
        {selectedTests.map((test) => (
          <span
            key={test.id}
            className="inline-flex items-center bg-slate-900 text-white text-xs font-medium pl-3 pr-2 py-1.5 rounded-lg shadow-sm"
          >
            <span>{test.name} ({test.parametersCount} P)</span>
            <button
              onClick={() => toggleTest(test)}
              className="ml-2 p-0.5 hover:bg-slate-700 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        {selectedTests.length > 0 && (
          <button
            onClick={() => setSelectedTests([])}
            className="text-xs text-rose-600 font-semibold hover:underline ml-2"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Real-Time Multi-Lab Comparison Matrix */}
      {selectedTests.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl max-w-3xl mx-auto">
          <FlaskConical className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">Select one or more tests above to see multi-lab price comparison.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {labCalculations.map((lab, idx) => {
            const isBestValue = idx === 0; // Top ranked value score
            return (
              <div 
                key={lab.labName}
                className={`relative rounded-3xl p-6 bg-white border transition-all duration-300 flex flex-col justify-between ${
                  isBestValue 
                    ? 'border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 scale-102 ring-4 ring-emerald-50' 
                    : 'border-slate-200 shadow-md hover:border-sky-300 hover:shadow-lg'
                }`}
              >
                {/* Best Value Badge */}
                {isBestValue && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-extrabold uppercase tracking-wider py-1 px-3.5 rounded-full flex items-center shadow-md">
                    <Award className="w-3.5 h-3.5 mr-1" />
                    Best Value Choice
                  </div>
                )}

                <div>
                  {/* Lab Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-800 text-lg border border-slate-200">
                      {lab.labLogo}
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                      {lab.accreditation}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg leading-snug mb-1">{lab.labName}</h3>
                  <p className="text-xs text-slate-500 mb-4">Certified Doorstep Collection</p>

                  {/* Highlights */}
                  <div className="space-y-2 border-t border-b border-slate-100 py-3.5 mb-4 text-xs text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Parameters Covered:</span>
                      <span className="font-bold text-slate-900">{totalParams} Tests</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Report Turnaround:</span>
                      <span className="font-semibold text-slate-900 flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-slate-400" />
                        Within {lab.reportHours} hrs
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Home Pickup:</span>
                      <span className="font-semibold text-emerald-600">FREE</span>
                    </div>
                  </div>
                </div>

                {/* Price & Book Action */}
                <div>
                  <div className="mb-4">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-black text-slate-900">₹{lab.finalPrice}</span>
                      <span className="text-sm line-through text-slate-400">₹{lab.mrp}</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {lab.discountPercentage}% OFF
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">Inclusive of home sample pickup & digital report</p>
                  </div>

                  <button 
                    onClick={() => alert(`Redirecting to booking workflow for ${lab.labName}`)}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 transition-all shadow-md ${
                      isBestValue 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20' 
                        : 'bg-slate-900 hover:bg-sky-600 text-white'
                    }`}
                  >
                    <span>Book with {lab.labLogo}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
