'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { DATA } from '@/lib/dataStore';
import { useAuth } from '@/lib/authContext';

export default function HomePage() {
  const { customerPhone, loginCustomer } = useAuth();
  const [search, setSearch] = useState('');
  const [pincode, setPincode] = useState('110001');
  const [activeTab, setActiveTab] = useState<'TESTS' | 'PACKAGES'>('TESTS');

  // Booking Checkout State
  const [bookingItem, setBookingItem] = useState<any | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [patientName, setPatientName] = useState('Shubhranshu Kumar');
  const [patientPhone, setPatientPhone] = useState('9876543210');
  const [patientRelation, setPatientRelation] = useState('Self');
  const [address, setAddress] = useState('Flat 402, Green Avenue, Greater Noida');
  const [slot, setSlot] = useState('06:30 AM - 07:30 AM (Fasting)');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const applyCoupon = () => {
    const found = DATA.coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.active);
    if (found) {
      setDiscount(found.discount);
      alert(`Coupon ${found.code} Applied! Saved ₹${found.discount}`);
    } else {
      alert("Invalid or expired coupon code!");
    }
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone) loginCustomer(patientPhone, patientName);
    const newId = "TB2026" + Math.floor(100000 + Math.random() * 900000);
    DATA.orders.unshift({
      id: newId,
      patientName,
      patientPhone,
      patientRelation,
      testName: bookingItem.name,
      labName: bookingItem.labName || "Thyrocare & Network",
      collectionDate: "Scheduled Tomorrow",
      slot,
      address,
      pincode,
      totalAmount: Math.max(0, (bookingItem.retailPrice || bookingItem.price) - discount),
      b2bCost: bookingItem.b2bCost || bookingItem.b2bPrice || 300,
      status: "SAMPLE_COLLECTION_ASSIGNED",
      paymentStatus: "PAID",
      reportReady: false,
      createdAt: new Date().toISOString().split('T')[0]
    });
    setBookingSuccess(newId);
  };

  const filteredTests = DATA.tests.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase()) ||
    t.synonyms.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="pb-20">
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-cyan-50/70 via-white to-slate-50 border-b border-slate-200/80 pt-12 pb-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-900 px-3 py-1 rounded-full text-xs font-bold mb-4">
            ⚡ Pan-India Diagnostic Marketplace • Compare 10+ Certified Labs
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Compare Diagnostic Labs.<br />
            <span className="text-cyan-600">Save up to 70% with Free Home Sample Pickup.</span>
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Real-time transparent pricing across Thyrocare, Healthians, Redcliffe & Dr Lal. Certified phlebotomists, fasting slot reminders, digital reports delivered on WhatsApp.
          </p>

          {/* Search Box */}
          <div className="mt-8 max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-xl border border-slate-200 flex flex-col sm:flex-row gap-2">
            <div className="flex items-center px-3 border-b sm:border-b-0 sm:border-r border-slate-200">
              <span className="text-slate-400 mr-2">📍</span>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
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
                placeholder="Search test name, vitamin d, cbc, thyroid, full body checkup..."
                className="w-full text-xs text-slate-800 focus:outline-none font-medium"
              />
            </div>
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition">
              Find Diagnostic Labs
            </button>
          </div>
        </div>
      </section>

      {/* Main Tabbed Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10" id="tests">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-8">
          <button
            onClick={() => setActiveTab('TESTS')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition ${activeTab === 'TESTS' ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Individual Tests (Multi-Lab Comparison)
          </button>
          <button
            onClick={() => setActiveTab('PACKAGES')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition ${activeTab === 'PACKAGES' ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            TestBeat Health Packages (Curated)
          </button>
        </div>

        {/* Tab 1: Individual Tests */}
        {activeTab === 'TESTS' && (
          <div className="space-y-6">
            {filteredTests.map((test) => {
              const labOptions = DATA.labMappings.filter(m => m.masterTestId === test.id);
              return (
                <div key={test.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="p-5 bg-slate-50/70 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 text-[10px] font-bold uppercase">{test.category}</span>
                        {test.fasting && <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">⚠️ Fasting {test.fastingHours} Hrs Required</span>}
                        <span className="text-[11px] text-slate-400">Sample: {test.sampleType}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{test.name}</h3>
                      <p className="text-xs text-slate-500">{test.description}</p>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {labOptions.map((opt) => (
                      <div key={opt.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs">{opt.labName}</span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1 rounded font-bold">★ {opt.rating}</span>
                            <span className="text-[11px] text-slate-400 font-mono">({opt.accreditation})</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">Lab Title: <b>{opt.labTestName}</b> • Report in: <b>{opt.tat}</b></p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-5">
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400 line-through">₹{opt.mrp}</span>
                              <span className="text-base font-black text-cyan-900">₹{opt.retailPrice}</span>
                            </div>
                            <span className="text-[10px] text-emerald-600 font-bold">Free Home Pickup</span>
                          </div>
                          <button
                            onClick={() => { setBookingSuccess(null); setBookingItem({ ...opt, name: test.name }); }}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition"
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
        )}

        {/* Tab 2: Health Packages */}
        {activeTab === 'PACKAGES' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="packages">
            {DATA.packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold uppercase">{pkg.category}</span>
                  <h3 className="font-bold text-slate-900 text-base mt-2">{pkg.name}</h3>
                  <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1">
                    <p>✓ <b>{pkg.parametersCount} Comprehensive Parameters</b></p>
                    <p>✓ Lab: {pkg.processingLab}</p>
                    <p>✓ Fasting Required: {pkg.fasting ? "10-12 Hours" : "No"}</p>
                    <p>✓ Standard Digital Report in {pkg.tat}</p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 line-through">₹{pkg.mrp}</span>
                    <h4 className="text-xl font-black text-slate-900">₹{pkg.price}</h4>
                  </div>
                  <button
                    onClick={() => { setBookingSuccess(null); setBookingItem(pkg); }}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition"
                  >
                    Book Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Checkout Modal */}
      {bookingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {!bookingSuccess ? (
              <form onSubmit={handleConfirmOrder} className="space-y-4 text-xs">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Complete Home Sample Pickup Booking</h3>
                    <p className="text-[11px] text-slate-500">{bookingItem.name}</p>
                  </div>
                  <button type="button" onClick={() => setBookingItem(null)} className="text-slate-400 font-bold">✕</button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Patient Full Name</label>
                    <input type="text" required value={patientName} onChange={(e) => setPatientName(e.target.value)} className="w-full p-2 border rounded-xl font-medium" />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Relationship</label>
                    <select value={patientRelation} onChange={(e) => setPatientRelation(e.target.value)} className="w-full p-2 border rounded-xl font-medium bg-white">
                      <option>Self</option><option>Spouse</option><option>Parent</option><option>Child</option><option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mobile (WhatsApp Updates)</label>
                    <input type="tel" required value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} className="w-full p-2 border rounded-xl font-medium" />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Time Slot</label>
                    <select value={slot} onChange={(e) => setSlot(e.target.value)} className="w-full p-2 border rounded-xl font-medium bg-white">
                      <option>06:30 AM - 07:30 AM (Fasting)</option>
                      <option>07:30 AM - 08:30 AM (Fasting)</option>
                      <option>08:30 AM - 10:00 AM</option>
                      <option>10:00 AM - 12:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Complete Pickup Address</label>
                  <textarea rows={2} required value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-2 border rounded-xl font-medium" />
                </div>

                {/* Coupon Code Section */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. TESTBEAT100)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 p-2 uppercase border rounded-xl font-bold text-xs"
                    />
                    <button type="button" onClick={applyCoupon} className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold">
                      Apply
                    </button>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200 space-y-1 text-slate-600">
                    <div className="flex justify-between"><span>Base Price:</span> <span>₹{bookingItem.retailPrice || bookingItem.price}</span></div>
                    {discount > 0 && <div className="flex justify-between text-emerald-600"><span>Coupon Discount:</span> <span>-₹{discount}</span></div>}
                    <div className="flex justify-between"><span>Home Sample Phlebotomist:</span> <span className="text-emerald-600 font-bold">FREE</span></div>
                    <div className="flex justify-between font-black text-sm text-slate-900 pt-1 border-t">
                      <span>Payable Amount:</span>
                      <span>₹{Math.max(0, (bookingItem.retailPrice || bookingItem.price) - discount)}</span>
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-md text-xs">
                  Pay & Confirm Booking
                </button>
              </form>
            ) : (
              <div className="text-center py-6">
                <span className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">✓</span>
                <h3 className="text-lg font-black text-slate-900">Order Confirmed Successfully!</h3>
                <p className="text-xs text-slate-500 mt-1">Booking ID: <b className="font-mono text-slate-900">{bookingSuccess}</b></p>
                <p className="text-xs text-slate-500 mt-0.5">Assigned Lab Phlebotomist will arrive on scheduled time.</p>
                <div className="mt-5 flex gap-3">
                  <Link href="/orders" className="flex-1 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs text-center">
                    View in My Bookings
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
