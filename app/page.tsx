'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { DB, MasterTest, HealthPackage } from '@/lib/dataStore';

export default function StorefrontHomePage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Booking Modal
  const [bookingItem, setBookingItem] = useState<any | null>(null);
  const [bookingSuccessId, setBookingSuccessId] = useState<string | null>(null);
  const [pName, setPName] = useState('Shubhranshu Kumar');
  const [pPhone, setPPhone] = useState('9876543210');
  const [pAge, setPAge] = useState(32);
  const [pGender, setPGender] = useState('Male');
  const [pSlot, setPSlot] = useState('06:30 AM - 07:30 AM (Fasting)');
  const [pAddress, setPAddress] = useState('Flat 402, Green Avenue, Greater Noida');

  // Interactive Package Accordion
  const [expandedPkg, setExpandedPkg] = useState<string | null>(null);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = "TB2026" + Math.floor(100000 + Math.random() * 900000);
    DB.orders.unshift({
      id: newId,
      patientName: pName,
      patientPhone: pPhone,
      patientAge: Number(pAge),
      patientGender: pGender,
      patientRelation: "Self",
      itemName: bookingItem.name,
      labName: bookingItem.labName || "Healthians / Thyrocare Network",
      collectionDate: new Date().toISOString().split('T')[0],
      slot: pSlot,
      address: pAddress,
      pincode: "201310",
      totalAmount: bookingItem.price || bookingItem.retailPrice,
      b2bCost: bookingItem.b2bCost || 260,
      platformMargin: (bookingItem.price || bookingItem.retailPrice) - (bookingItem.b2bCost || 260),
      status: "SCHEDULED",
      paymentStatus: "PAID",
      phleboName: "Vikas Sharma (Assigned)",
      phleboPhone: "9899112233",
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    });
    setBookingSuccessId(newId);
  };

  const filteredTests = DB.tests.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pb-20">
      {/* Healthians Banner Hero */}
      <section className="bg-gradient-to-r from-[#002B49] to-[#0A476F] text-white py-12 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8">
            <span className="inline-block bg-[#FF5A00] text-white text-[11px] font-black uppercase px-3 py-1 rounded-full mb-4">
              NABL & CAP Certified Diagnostic Aggregator
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Health Test At Home.<br />
              <span className="text-amber-400">Save up to 70% With Free Sample Collection.</span>
            </h1>
            <p className="mt-3 text-slate-300 text-sm max-w-xl">
              Compare transparent diagnostic prices across Healthians, Thyrocare, Redcliffe & Dr Lal. Trained phlebotomists arrive with temperature-controlled cold chain bags.
            </p>

            {/* Big Search Bar */}
            <div className="mt-7 max-w-2xl bg-white rounded-2xl p-2 shadow-2xl flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center px-3">
                <span className="text-slate-400 mr-2">🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search test e.g. Vitamin D, CBC, Thyroid, Full Body, HbA1c..."
                  className="w-full text-xs text-slate-900 focus:outline-none font-semibold placeholder-slate-400"
                />
              </div>
              <button className="bg-[#FF5A00] hover:bg-[#E04E00] text-white font-bold px-7 py-3 rounded-xl text-xs transition">
                Find Tests
              </button>
            </div>

            {/* Quick Guarantees */}
            <div className="mt-6 flex flex-wrap gap-5 text-xs text-slate-300 font-semibold">
              <span>✓ Free Home Sample Pickup</span>
              <span>✓ Certified Phlebotomists</span>
              <span>✓ Accurate Digital Reports in 24 Hrs</span>
            </div>
          </div>

          {/* Quick Prescription Upload Card on Hero */}
          <div className="md:col-span-4 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl text-center">
            <span className="text-4xl block mb-2">📄</span>
            <h3 className="font-bold text-white text-base">Have a Doctor's Prescription?</h3>
            <p className="text-xs text-slate-300 mt-1">Upload handwriting prescription. AI will detect and book matching tests instantly.</p>
            <Link href="/prescription" className="mt-4 block w-full py-2.5 bg-[#FF5A00] hover:bg-[#E04E00] text-white font-bold rounded-xl text-xs transition shadow-md">
              Upload Prescription Now
            </Link>
          </div>
        </div>
      </section>

      {/* Category Icons Row (Healthians Style) */}
      <section className="max-w-7xl mx-auto px-4 mt-8">
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">Popular Health Categories</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {DB.categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.name ? 'ALL' : cat.name)}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                selectedCategory === cat.name ? 'bg-orange-50 border-[#FF5A00] shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-2xl mb-1">{cat.icon}</span>
              <span className="text-[11px] font-bold text-slate-800 leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Healthians Style Health Packages Section */}
      <section className="max-w-7xl mx-auto px-4 mt-12" id="packages">
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-xs font-black uppercase text-[#FF5A00] tracking-widest">Recommended Health Packages</span>
            <h2 className="text-2xl font-black text-[#002B49]">Comprehensive Health Screenings</h2>
            <p className="text-xs text-slate-500 mt-0.5">Covering major organs: Liver, Kidney, Heart, Diabetes, Thyroid, Bone & Vitamins</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DB.packages.map(pkg => (
            <div key={pkg.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition flex flex-col justify-between overflow-hidden">
              <div className="p-6">
                <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                  {pkg.badge}
                </span>

                <h3 className="font-bold text-[#002B49] text-lg mt-3 leading-snug">{pkg.name}</h3>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-2xl font-black text-slate-900">₹{pkg.price}</span>
                  <span className="text-xs text-slate-400 line-through">₹{pkg.mrp}</span>
                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    {pkg.discountPercent}% OFF
                  </span>
                </div>

                <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1.5">
                  <p className="font-bold text-slate-900">🔬 Includes <b>{pkg.parametersCount} Vital Parameters</b></p>
                  <p>⏳ Fasting: <b>{pkg.fastingHours > 0 ? `${pkg.fastingHours} Hrs Required` : 'Not Required'}</b></p>
                  <p>📄 TAT: <b>{pkg.tat}</b></p>
                  <p>💉 Sample: <b>{pkg.sampleType}</b></p>
                </div>

                {/* Sub-Packages Accordion Dropdown */}
                <div className="mt-4 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => setExpandedPkg(expandedPkg === pkg.id ? null : pkg.id)}
                    className="text-xs font-bold text-[#FF5A00] flex justify-between items-center w-full"
                  >
                    <span>{expandedPkg === pkg.id ? 'Hide Included Tests ▲' : `View All ${pkg.parametersCount} Tests ▼`}</span>
                  </button>

                  {expandedPkg === pkg.id && (
                    <div className="mt-3 space-y-2 text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl max-h-48 overflow-y-auto">
                      {pkg.subPackages.map((sub, i) => (
                        <div key={i} className="border-b border-slate-200 pb-1.5 last:border-b-0">
                          <p className="font-bold text-slate-900">{sub.title} ({sub.count})</p>
                          <p className="text-slate-500 text-[10px]">{sub.tests.join(', ')}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => { setBookingSuccessId(null); setBookingItem(pkg); }}
                  className="w-full py-3 bg-[#FF5A00] hover:bg-[#E04E00] text-white font-bold rounded-2xl text-xs transition shadow-md shadow-orange-500/20"
                >
                  Book Package Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Individual Blood Tests Multi-Lab Comparison */}
      <section className="max-w-7xl mx-auto px-4 mt-16" id="tests">
        <div className="mb-6">
          <span className="text-xs font-black uppercase text-[#FF5A00] tracking-widest">Single Test Comparison</span>
          <h2 className="text-2xl font-black text-[#002B49]">Individual Tests with Certified Lab Comparison</h2>
          <p className="text-xs text-slate-500 mt-0.5">Compare live rates across NABL accredited labs before booking</p>
        </div>

        <div className="space-y-6">
          {filteredTests.map(test => {
            const mappings = DB.labMappings.filter(m => m.masterTestId === test.id);
            return (
              <div key={test.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 bg-slate-50/60 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#002B49] text-[10px] font-bold uppercase">{test.category}</span>
                      {test.fastingRequired && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold">
                          ⚠️ Fasting {test.fastingHours} Hrs
                        </span>
                      )}
                      <span className="text-xs text-slate-500 font-medium">Sample: {test.sampleType}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-1.5">{test.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{test.description}</p>
                  </div>
                </div>

                <div className="divide-y divide-slate-100">
                  {mappings.map(map => (
                    <div key={map.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/40">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{map.labName}</h4>
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            ★ {map.rating}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Accreditation: <b>{map.accreditation}</b> • TAT: <b>{map.tat}</b>
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-5">
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 line-through">₹{map.mrp}</span>
                            <span className="text-lg font-black text-slate-900">₹{map.retailPrice}</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600 block">
                            Save {map.discountPercent}% OFF
                          </span>
                        </div>
                        <button
                          onClick={() => { setBookingSuccessId(null); setBookingItem({ ...map, name: test.name }); }}
                          className="bg-[#002B49] hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition"
                        >
                          Book Slot
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Booking Checkout Modal */}
      {bookingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {!bookingSuccessId ? (
              <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-base text-[#002B49]">Book Home Sample Collection</h3>
                    <p className="text-[11px] text-slate-500">{bookingItem.name}</p>
                  </div>
                  <button type="button" onClick={() => setBookingItem(null)} className="text-slate-400 font-bold">✕</button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Patient Full Name</label>
                    <input type="text" required value={pName} onChange={(e) => setPName(e.target.value)} className="w-full p-2.5 border rounded-xl font-medium" />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mobile (WhatsApp Updates)</label>
                    <input type="tel" required value={pPhone} onChange={(e) => setPPhone(e.target.value)} className="w-full p-2.5 border rounded-xl font-medium" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Patient Age</label>
                    <input type="number" required value={pAge} onChange={(e) => setPAge(Number(e.target.value))} className="w-full p-2.5 border rounded-xl font-medium" />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Gender</label>
                    <select value={pGender} onChange={(e) => setPGender(e.target.value)} className="w-full p-2.5 border rounded-xl font-medium bg-white">
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Morning Fasting Slot</label>
                  <select value={pSlot} onChange={(e) => setPSlot(e.target.value)} className="w-full p-2.5 border rounded-xl font-medium bg-white">
                    <option>06:30 AM - 07:30 AM (Fasting)</option>
                    <option>07:30 AM - 08:30 AM (Fasting)</option>
                    <option>08:30 AM - 10:00 AM</option>
                    <option>10:00 AM - 12:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Complete Home Pickup Address</label>
                  <textarea rows={2} required value={pAddress} onChange={(e) => setPAddress(e.target.value)} className="w-full p-2.5 border rounded-xl font-medium" />
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-slate-600">
                  <div className="flex justify-between"><span>Diagnostic Test Fee:</span> <span>₹{bookingItem.price || bookingItem.retailPrice}</span></div>
                  <div className="flex justify-between"><span>Phlebotomist Home Visit:</span> <span className="text-emerald-600 font-bold">FREE</span></div>
                  <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t">
                    <span>Payable Amount:</span>
                    <span>₹{bookingItem.price || bookingItem.retailPrice}</span>
                  </div>
                </div>

                <button type="submit" className="w-full py-3 bg-[#FF5A00] hover:bg-[#E04E00] text-white font-bold rounded-xl shadow-md text-xs transition">
                  Confirm Booking & Dispatch Phlebotomist
                </button>
              </form>
            ) : (
              <div className="text-center py-6">
                <span className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">✓</span>
                <h3 className="text-lg font-black text-slate-900">Booking Confirmed Successfully!</h3>
                <p className="text-xs text-slate-500 mt-1">Booking Order ID: <b className="font-mono text-slate-900">{bookingSuccessId}</b></p>
                <div className="mt-5 flex gap-3">
                  <Link href="/customer/dashboard" className="flex-1 py-2.5 bg-[#002B49] text-white font-bold rounded-xl text-xs text-center">
                    Open Patient Portal
                  </Link>
                  <button onClick={() => setBookingItem(null)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs">
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
