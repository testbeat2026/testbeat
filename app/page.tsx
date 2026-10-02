'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { DB, MasterTest, HealthPackage } from '@/lib/dataStore';

export default function StorefrontHomePage() {
  const [search, setSearch] = useState('');
  const [selectedPincode, setSelectedPincode] = useState('201310');
  const [activeTab, setActiveTab] = useState<'TESTS' | 'PACKAGES'>('TESTS');

  // Interactive Booking Modal
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [bookingDone, setBookingDone] = useState<string | null>(null);
  const [patientName, setPatientName] = useState('Shubhranshu Kumar');
  const [patientPhone, setPatientPhone] = useState('9876543210');
  const [patientRelation, setPatientRelation] = useState('Self');
  const [slot, setSlot] = useState('07:00 AM - 08:00 AM (Fasting)');
  const [address, setAddress] = useState('Flat 402, Green Avenue, Greater Noida');

  const filteredTests = DB.tests.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrderId = "TB2026" + Math.floor(100000 + Math.random() * 900000);
    DB.orders.unshift({
      id: newOrderId,
      patientName,
      patientPhone,
      patientRelation,
      testName: selectedItem.name,
      labName: selectedItem.labName || "Thyrocare / Network",
      collectionDate: new Date().toISOString().split('T')[0],
      slot,
      address,
      pincode: selectedPincode,
      totalAmount: selectedItem.retailPrice || selectedItem.price,
      b2bCost: selectedItem.b2bCost || 250,
      platformMargin: (selectedItem.retailPrice || selectedItem.price) - (selectedItem.b2bCost || 250),
      status: "SCHEDULED",
      paymentStatus: "PAID",
      phleboName: "Phlebotomist Assigned on Dispatch",
      phleboPhone: "9810000000",
      reportUrl: null,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    });
    setBookingDone(newOrderId);
  };

  return (
    <div className="pb-20">
      {/* Premium Healthcare Hero Banner */}
      <section className="bg-gradient-to-b from-teal-50/70 via-white to-slate-50 border-b border-slate-200/80 pt-14 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-900 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 shadow-sm">
            <span>🛡️ Pan-India Certified Lab Aggregator</span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
            <span>NABL, CAP & ISO Verified</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Compare Certified Diagnostic Labs.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
              Save up to 70% with Free Home Collection.
            </span>
          </h1>

          <p className="mt-4 text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Book pre-negotiated B2B retail prices across Thyrocare, Healthians, Redcliffe & Dr Lal. Trained phlebotomists arrive at your door with barcoded vials and digital WhatsApp delivery.
          </p>

          {/* Location & Search Bar */}
          <div className="mt-8 max-w-3xl mx-auto bg-white p-2.5 rounded-2xl shadow-xl shadow-teal-900/5 border border-slate-200 flex flex-col sm:flex-row gap-2">
            <div className="flex items-center px-3 border-b sm:border-b-0 sm:border-r border-slate-200 pb-2 sm:pb-0">
              <span className="text-slate-400 mr-2">📍</span>
              <input
                type="text"
                value={selectedPincode}
                onChange={(e) => setSelectedPincode(e.target.value)}
                placeholder="Pincode"
                className="w-24 text-xs font-bold text-slate-800 focus:outline-none"
              />
            </div>
            <div className="flex-1 flex items-center px-3">
              <span className="text-slate-400 mr-2">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search test name, vitamin d, cbc, thyroid, lft, full body checkup..."
                className="w-full text-xs text-slate-800 focus:outline-none font-medium"
              />
            </div>
            <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-md shadow-teal-600/20">
              Find Labs
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-xs font-semibold text-slate-500">
            <span>✓ 100% NABL Accredited</span>
            <span>✓ Barcoded Vials & Cold Chain Logistics</span>
            <span>✓ Reports Within 12-24 Hours</span>
            <span>✓ Lowest Price Match Guarantee</span>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12" id="tests">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('TESTS')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition ${activeTab === 'TESTS' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Individual Diagnostic Tests (Multi-Lab Comparison)
          </button>
          <button
            onClick={() => setActiveTab('PACKAGES')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition ${activeTab === 'PACKAGES' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Curated Health Packages (Full Body Screening)
          </button>
        </div>

        {/* Tab 1: Individual Tests Comparison */}
        {activeTab === 'TESTS' && (
          <div className="space-y-6">
            {filteredTests.map((test) => {
              const labMappings = DB.labMappings.filter(m => m.masterTestId === test.id);
              return (
                <div key={test.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="p-6 bg-slate-50/70 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold uppercase">{test.category}</span>
                        {test.fastingRequired && (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                            ⚠️ Fasting Required ({test.fastingHours} Hrs)
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500 font-mono">Sample: {test.sampleType}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mt-1.5">{test.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{test.description}</p>
                    </div>
                  </div>

                  {/* Multi-Lab Real-time Pricing Comparison Rows */}
                  <div className="divide-y divide-slate-100">
                    {labMappings.map((map) => {
                      const lab = DB.labs.find(l => l.id === map.labId);
                      return (
                        <div key={map.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl">
                              {lab?.logo}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-900 text-sm">{lab?.name}</h4>
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.2 rounded">
                                  ★ {lab?.rating}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Accreditation: <b>{lab?.accreditations}</b> • Report TAT: <b>{lab?.tat}</b>
                              </p>
                              <p className="text-[11px] text-teal-700 font-semibold mt-0.5">✓ Free Home Sample Pickup on Pincode {selectedPincode}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                            <div className="text-right">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 line-through">₹{map.mrp}</span>
                                <span className="text-lg font-black text-slate-900">₹{map.retailPrice}</span>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-600 block">
                                Save {Math.round(((map.mrp - map.retailPrice) / map.mrp) * 100)}% OFF
                              </span>
                            </div>
                            <button
                              onClick={() => { setBookingDone(null); setSelectedItem({ ...map, name: test.name, labName: lab?.name }); }}
                              className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition"
                            >
                              Book Slot
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Health Packages */}
        {activeTab === 'PACKAGES' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="packages">
            {DB.packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold uppercase">{pkg.category}</span>
                  <h3 className="font-bold text-slate-900 text-lg mt-3">{pkg.name}</h3>
                  <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-600">
                    <p className="font-bold text-slate-900">Includes {pkg.testsCount} Vital Parameters:</p>
                    <ul className="space-y-1 text-slate-500 text-[11px]">
                      {pkg.parameters.map((p, i) => (
                        <li key={i}>• {p}</li>
                      ))}
                    </ul>
                    <div className="pt-2 border-t border-slate-200 text-slate-600">
                      <p>Processing Partner: <b>{pkg.labPartner}</b></p>
                      <p>Report Turnaround: <b>{pkg.tat}</b></p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 line-through">₹{pkg.mrp}</span>
                    <h4 className="text-2xl font-black text-slate-900">₹{pkg.price}</h4>
                  </div>
                  <button
                    onClick={() => { setBookingDone(null); setSelectedItem(pkg); }}
                    className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition"
                  >
                    Book Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Booking Checkout Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {!bookingDone ? (
              <form onSubmit={handleConfirmOrder} className="space-y-4 text-xs">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Confirm Home Sample Collection</h3>
                    <p className="text-[11px] text-slate-500">{selectedItem.name}</p>
                  </div>
                  <button type="button" onClick={() => setSelectedItem(null)} className="text-slate-400 font-bold">✕</button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Patient Full Name</label>
                    <input type="text" required value={patientName} onChange={(e) => setPatientName(e.target.value)} className="w-full p-2.5 border rounded-xl font-medium" />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Relationship</label>
                    <select value={patientRelation} onChange={(e) => setPatientRelation(e.target.value)} className="w-full p-2.5 border rounded-xl font-medium bg-white">
                      <option>Self</option><option>Spouse</option><option>Parent</option><option>Child</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mobile (WhatsApp Updates)</label>
                    <input type="tel" required value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} className="w-full p-2.5 border rounded-xl font-medium" />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Morning Slot</label>
                    <select value={slot} onChange={(e) => setSlot(e.target.value)} className="w-full p-2.5 border rounded-xl font-medium bg-white">
                      <option>06:30 AM - 07:30 AM (Fasting)</option>
                      <option>07:30 AM - 08:30 AM (Fasting)</option>
                      <option>08:30 AM - 10:00 AM</option>
                      <option>10:00 AM - 12:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pickup Address</label>
                  <textarea rows={2} required value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-2.5 border rounded-xl font-medium" />
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-slate-600">
                  <div className="flex justify-between"><span>Diagnostic Test Cost:</span> <span>₹{selectedItem.retailPrice || selectedItem.price}</span></div>
                  <div className="flex justify-between"><span>Phlebotomist Home Visit:</span> <span className="text-emerald-600 font-bold">FREE</span></div>
                  <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t">
                    <span>Total Amount Payable:</span>
                    <span>₹{selectedItem.retailPrice || selectedItem.price}</span>
                  </div>
                </div>

                <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md text-xs transition">
                  Confirm Booking & Dispatch Phlebotomist
                </button>
              </form>
            ) : (
              <div className="text-center py-6">
                <span className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">✓</span>
                <h3 className="text-lg font-black text-slate-900">Booking Confirmed Successfully!</h3>
                <p className="text-xs text-slate-500 mt-1">Order ID: <b className="font-mono text-slate-900">{bookingDone}</b></p>
                <div className="mt-5 flex gap-3">
                  <Link href="/customer/dashboard" className="flex-1 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs text-center">
                    Go to Patient Portal
                  </Link>
                  <button onClick={() => setSelectedItem(null)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs">
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
