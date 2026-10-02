export interface MasterTest {
  id: string;
  name: string;
  category: string;
  sampleType: string;
  fasting: boolean;
  fastingHours: number;
  synonyms: string[];
  description: string;
}

export interface LabMapping {
  id: string;
  masterTestId: string;
  labId: string;
  labName: string;
  labTestName: string;
  b2bPrice: number;
  mrp: number;
  retailPrice: number;
  tat: string;
  rating: number;
  accreditation: string;
}

export interface HealthPackage {
  id: string;
  name: string;
  category: string;
  parametersCount: number;
  mrp: number;
  price: number;
  b2bCost: number;
  fasting: boolean;
  tat: string;
  description: string;
  processingLab: string;
}

export interface OrderRecord {
  id: string;
  patientName: string;
  patientPhone: string;
  patientRelation: string;
  testName: string;
  labName: string;
  collectionDate: string;
  slot: string;
  address: string;
  pincode: string;
  totalAmount: number;
  b2bCost: number;
  status: string;
  paymentStatus: string;
  reportReady: boolean;
  createdAt: string;
}

export interface CouponItem {
  code: string;
  discount: number;
  type: 'FLAT' | 'PERCENT';
  minOrder: number;
  active: boolean;
}

export interface ApiSwitchItem {
  id: string;
  name: string;
  category: 'LAB' | 'PAYMENT' | 'NOTIFICATION' | 'AI' | 'ACCOUNTING';
  mode: 'MOCK' | 'LIVE' | 'DISABLED';
  endpoint: string;
  apiKey: string;
  status: 'ONLINE' | 'STANDBY' | 'ERROR';
}

export interface AffiliatePartner {
  id: string;
  name: string;
  businessName: string;
  refCode: string;
  phone: string;
  bookings: number;
  revenue: number;
  wallet: number;
  rate: string;
}

export interface PriceUprateAlert {
  id: string;
  lab: string;
  test: string;
  agreedB2B: number;
  newApiPrice: number;
  diff: number;
  percent: number;
  detectedAt: string;
  status: 'PENDING' | 'RESOLVED';
}

export const DATA = {
  tests: [
    { id: "T1", name: "Vitamin D (25-OH Total)", category: "Vitamins", sampleType: "Blood", fasting: false, fastingHours: 0, synonyms: ["vit d", "d3", "25-oh", "cholecalciferol"], description: "Evaluates bone health, immune vitality and calcium absorption levels." },
    { id: "T2", name: "Complete Blood Count (CBC) with ESR", category: "Hematology", sampleType: "Blood", fasting: false, fastingHours: 0, synonyms: ["cbc", "hemogram", "esr", "blood cell count"], description: "Comprehensive analysis of RBC, WBC, platelets, and hemoglobin count." },
    { id: "T3", name: "Thyroid Profile (Total T3, Total T4, TSH)", category: "Hormones", sampleType: "Blood", fasting: true, fastingHours: 8, synonyms: ["tsh", "thyroid", "t3 t4", "thyroid test"], description: "Monitors thyroid gland functions, energy balance and metabolic rates." },
    { id: "T4", name: "HbA1c Glycated Hemoglobin (Diabetes)", category: "Diabetes", sampleType: "Blood", fasting: false, fastingHours: 0, synonyms: ["sugar", "diabetes", "hba1c", "blood glucose"], description: "Measures 3-month average blood glucose control accurately." },
    { id: "T5", name: "Liver Function Test (LFT Profile)", category: "Organ Profile", sampleType: "Blood", fasting: true, fastingHours: 10, synonyms: ["lft", "liver", "sgpt", "sgot", "bilirubin"], description: "Screens liver enzymes, protein breakdown and bile duct health." },
    { id: "T6", name: "Kidney Function Test (KFT / RFT)", category: "Organ Profile", sampleType: "Blood", fasting: false, fastingHours: 0, synonyms: ["kft", "rft", "creatinine", "urea", "uric acid"], description: "Examines serum creatinine, urea and electrolytes for kidney efficiency." },
    { id: "T7", name: "Lipid Profile (Cholesterol & Triglycerides)", category: "Cardiac", sampleType: "Blood", fasting: true, fastingHours: 12, synonyms: ["lipid", "cholesterol", "triglycerides", "hdl", "ldl"], description: "Evaluates cardiovascular risks and arterial cholesterol levels." }
  ] as MasterTest[],

  labMappings: [
    { id: "M1", masterTestId: "T1", labId: "thyrocare", labName: "Thyrocare", labTestName: "25-OH Vitamin D Total", b2bPrice: 240, mrp: 1200, retailPrice: 449, tat: "24-36 Hours", rating: 4.8, accreditation: "NABL, ISO 9001" },
    { id: "M2", masterTestId: "T1", labId: "healthians", labName: "Healthians", labTestName: "Vitamin D3 Ultra Diagnostic", b2bPrice: 270, mrp: 1400, retailPrice: 489, tat: "12-24 Hours", rating: 4.9, accreditation: "NABL, CAP Certified" },
    { id: "M3", masterTestId: "T1", labId: "redcliffe", labName: "Redcliffe Labs", labTestName: "Vitamin D 25-Hydroxy Assay", b2bPrice: 280, mrp: 1500, retailPrice: 499, tat: "Same Day (10 Hrs)", rating: 4.8, accreditation: "NABL Certified" },
    { id: "M4", masterTestId: "T1", labId: "drlal", labName: "Dr Lal PathLabs", labTestName: "Vitamin D (25 OH)", b2bPrice: 480, mrp: 1800, retailPrice: 850, tat: "12-24 Hours", rating: 4.9, accreditation: "NABL, CAP" },
    { id: "M5", masterTestId: "T2", labId: "healthians", labName: "Healthians", labTestName: "CBC with ESR Automated Counter", b2bPrice: 110, mrp: 500, retailPrice: 249, tat: "8-12 Hours", rating: 4.9, accreditation: "NABL, CAP Certified" },
    { id: "M6", masterTestId: "T2", labId: "redcliffe", labName: "Redcliffe Labs", labTestName: "Complete Hemogram with ESR", b2bPrice: 120, mrp: 550, retailPrice: 260, tat: "8-10 Hours", rating: 4.8, accreditation: "NABL Certified" },
    { id: "M7", masterTestId: "T3", labId: "thyrocare", labName: "Thyrocare", labTestName: "Total Thyroid Profile (T3, T4, TSH)", b2bPrice: 130, mrp: 650, retailPrice: 299, tat: "24 Hours", rating: 4.8, accreditation: "NABL, ISO" },
    { id: "M8", masterTestId: "T3", labId: "healthians", labName: "Healthians", labTestName: "Thyroid Function Package", b2bPrice: 150, mrp: 750, retailPrice: 320, tat: "12 Hours", rating: 4.9, accreditation: "NABL, CAP Certified" }
  ] as LabMapping[],

  packages: [
    { id: "P1", name: "TestBeat Complete Full Body Checkup (84 Parameters)", category: "Health Packages", parametersCount: 84, mrp: 3999, price: 1199, b2bCost: 650, fasting: true, tat: "24 Hours", processingLab: "Thyrocare / Healthians", description: "Comprehensive body screening covering Liver, Kidney, Lipid, Thyroid, CBC, Diabetes, Iron & Vitamin Profile." },
    { id: "P2", name: "Executive Senior Citizen Wellness (92 Parameters)", category: "Health Packages", parametersCount: 92, mrp: 5499, price: 1799, b2bCost: 950, fasting: true, tat: "24-48 Hours", processingLab: "Healthians", description: "Dedicated for senior citizens with advanced cardiac, bone density, renal filtration & arthritis markers." },
    { id: "P3", name: "Women Vitality & Hormonal Health Checkup", category: "Women Health", parametersCount: 68, mrp: 3499, price: 1399, b2bCost: 720, fasting: true, tat: "24 Hours", processingLab: "Redcliffe Labs", description: "Targeted hormone screening (TSH, Prolactin, LH, FSH, Vitamin D) and iron deficiency panel." }
  ] as HealthPackage[],

  orders: [
    { id: "TB2026849102", patientName: "Shubhranshu Kumar", patientPhone: "9876543210", patientRelation: "Self", testName: "Vitamin D (25-OH Total)", labName: "Healthians", collectionDate: "Tomorrow", slot: "07:00 AM - 08:00 AM", address: "Flat 402, Green Avenue, Greater Noida", pincode: "201310", totalAmount: 489, b2bCost: 270, status: "SAMPLE_COLLECTION_ASSIGNED", paymentStatus: "PAID", reportReady: false, createdAt: "2026-10-02" },
    { id: "TB2026710492", patientName: "KM Babita", patientPhone: "9506386371", patientRelation: "Spouse", testName: "Complete Full Body Checkup (84 Param)", labName: "Thyrocare", collectionDate: "Yesterday", slot: "08:00 AM - 09:00 AM", address: "Sector 62, Noida", pincode: "201301", totalAmount: 1199, b2bCost: 650, status: "COMPLETED", paymentStatus: "PAID", reportReady: true, createdAt: "2026-10-01" },
    { id: "TB2026501923", patientName: "Ayansh Kumar", patientPhone: "9876543210", patientRelation: "Son", testName: "Complete Blood Count (CBC) with ESR", labName: "Redcliffe Labs", collectionDate: "Oct 05, 2026", slot: "09:30 AM - 10:30 AM", address: "Sikanderpur, Ballia, UP", pincode: "277303", totalAmount: 260, b2bCost: 120, status: "CONFIRMED", paymentStatus: "PAID", reportReady: false, createdAt: "2026-10-02" }
  ] as OrderRecord[],

  coupons: [
    { code: "TESTBEAT100", discount: 100, type: "FLAT", minOrder: 499, active: true },
    { code: "HEALTH20", discount: 20, type: "PERCENT", minOrder: 999, active: true },
    { code: "FIRST50", discount: 50, type: "FLAT", minOrder: 299, active: true }
  ] as CouponItem[],

  apis: [
    { id: "thyrocare", name: "Thyrocare Technologies API", category: "LAB", mode: "LIVE", endpoint: "https://api.thyrocare.com/order/v2", apiKey: "thyro_live_key_993412", status: "ONLINE" },
    { id: "healthians", name: "Healthians Diagnostic API", category: "LAB", mode: "MOCK", endpoint: "https://api.healthians.mock/orders", apiKey: "hlth_sec_mock_442911", status: "ONLINE" },
    { id: "redcliffe", name: "Redcliffe Labs Bridge", category: "LAB", mode: "LIVE", endpoint: "https://partner.redcliffelabs.com/api/v1", apiKey: "red_prod_902198", status: "ONLINE" },
    { id: "drlal", name: "Dr Lal PathLabs API", category: "LAB", mode: "MOCK", endpoint: "https://api.lalpathlabs.mock/v1", apiKey: "lal_sec_mock_0029", status: "STANDBY" },
    { id: "cashfree", name: "Cashfree Payment Gateway", category: "PAYMENT", mode: "MOCK", endpoint: "https://sandbox.cashfree.com/pg", apiKey: "cf_app_id_sandbox_99", status: "ONLINE" },
    { id: "razorpay", name: "Razorpay PG Route", category: "PAYMENT", mode: "MOCK", endpoint: "https://api.razorpay.com/v1", apiKey: "rzp_test_sec_33019", status: "STANDBY" },
    { id: "msg91", name: "MSG91 SMS Gateway", category: "NOTIFICATION", mode: "MOCK", endpoint: "https://control.msg91.com/api/v5", apiKey: "msg91_auth_mock_55", status: "ONLINE" },
    { id: "resend", name: "Resend Transactional Email", category: "NOTIFICATION", mode: "LIVE", endpoint: "https://api.resend.com/emails", apiKey: "re_live_891002341", status: "ONLINE" },
    { id: "whatsapp", name: "Meta Official WhatsApp Cloud API", category: "NOTIFICATION", mode: "MOCK", endpoint: "https://graph.facebook.com/v19.0", apiKey: "wa_token_mock_7721", status: "STANDBY" },
    { id: "ocr", name: "Medical OCR / Vision AI Engine", category: "AI", mode: "LIVE", endpoint: "https://api.openai.com/v1/chat/completions", apiKey: "sk_live_ocr_medical_ai", status: "ONLINE" }
  ] as ApiSwitchItem[],

  affiliates: [
    { id: "AFF1", name: "Dr. Sharma Family Clinic", businessName: "Sharma Medicare Clinic", refCode: "CLINIC984", phone: "9811002233", bookings: 142, revenue: 148500, wallet: 14850, rate: "10%" },
    { id: "AFF2", name: "Sanjivani Pharmacy", businessName: "Sanjivani Chemist & Wellness", refCode: "SANJIVANI22", phone: "9822334455", bookings: 86, revenue: 92400, wallet: 9240, rate: "10%" }
  ] as AffiliatePartner[],

  priceAlerts: [
    { id: "ALT1", lab: "Dr Lal PathLabs", test: "Vitamin D (25 OH)", agreedB2B: 450, newApiPrice: 540, diff: 90, percent: 20, detectedAt: "Today, 04:12 AM", status: "PENDING" },
    { id: "ALT2", lab: "Thyrocare", test: "Thyroid Stimulating Hormone (TSH)", agreedB2B: 120, newApiPrice: 150, diff: 30, percent: 25, detectedAt: "Yesterday, 11:30 PM", status: "PENDING" }
  ] as PriceUprateAlert[]
};
