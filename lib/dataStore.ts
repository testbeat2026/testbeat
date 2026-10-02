export interface Lab {
  id: string;
  name: string;
  code: string;
  logo: string;
  accreditation: string;
  tatHours: number;
  rating: number;
  reviewsCount: number;
  homeCollectionFee: number;
  contactEmail: string;
  contactPhone: string;
  status: 'ACTIVE' | 'INACTIVE';
  walletBalance: number;
}

export interface MasterTest {
  id: string;
  name: string;
  code: string;
  category: string;
  sampleType: string;
  fastingRequired: boolean;
  fastingHours: number;
  parametersCount: number;
  preparation: string;
  description: string;
  parameters: string[];
}

export interface LabPricing {
  id: string;
  masterTestId: string;
  labId: string;
  labName: string;
  b2bCost: number;
  mrp: number;
  retailPrice: number;
  discountPercent: number;
  tat: string;
  rating: number;
  accreditation: string;
}

export interface HealthPackage {
  id: string;
  name: string;
  badge: string;
  category: string;
  parametersCount: number;
  mrp: number;
  price: number;
  b2bCost: number;
  discountPercent: number;
  fastingHours: number;
  sampleType: string;
  tat: string;
  partnerLab: string;
  subProfiles: { name: string; count: number; tests: string[] }[];
}

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  pincode: string;
  totalOrders: number;
  totalSpent: number;
  familyMembersCount: number;
  registeredDate: string;
  status: 'ACTIVE' | 'BLOCKED';
}

export interface Order {
  id: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: string;
  patientRelation: string;
  itemName: string;
  itemType: 'TEST' | 'PACKAGE';
  labId: string;
  labName: string;
  collectionDate: string;
  slot: string;
  address: string;
  pincode: string;
  totalAmount: number;
  b2bCost: number;
  platformMargin: number;
  status: 'SCHEDULED' | 'PHLEBO_ASSIGNED' | 'SAMPLE_COLLECTED' | 'LAB_RECEIVED' | 'PROCESSING' | 'REPORT_READY' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PAID' | 'COD' | 'PENDING';
  phleboName: string;
  phleboPhone: string;
  reportUrl: string | null;
  createdAt: string;
}

export const DB = {
  labs: [
    {
      id: "lab-healthians",
      name: "Healthians Diagnostic",
      code: "HLTH",
      logo: "🏥",
      accreditation: "NABL, CAP Certified",
      tatHours: 18,
      rating: 4.9,
      reviewsCount: 2450,
      homeCollectionFee: 0,
      contactEmail: "ops@healthians.com",
      contactPhone: "+91 9899001122",
      status: "ACTIVE",
      walletBalance: 124500
    },
    {
      id: "lab-thyrocare",
      name: "Thyrocare Technologies",
      code: "THYRO",
      logo: "🧪",
      accreditation: "NABL, CAP, ISO 9001",
      tatHours: 24,
      rating: 4.8,
      reviewsCount: 4120,
      homeCollectionFee: 0,
      contactEmail: "b2b@thyrocare.com",
      contactPhone: "+91 9811223344",
      status: "ACTIVE",
      walletBalance: 98400
    },
    {
      id: "lab-redcliffe",
      name: "Redcliffe Labs",
      code: "RED",
      logo: "🔬",
      accreditation: "NABL Accredited",
      tatHours: 12,
      rating: 4.8,
      reviewsCount: 1890,
      homeCollectionFee: 0,
      contactEmail: "ops@redcliffekabs.com",
      contactPhone: "+91 9822334455",
      status: "ACTIVE",
      walletBalance: 76200
    },
    {
      id: "lab-drlal",
      name: "Dr Lal PathLabs",
      code: "LAL",
      logo: "⚕️",
      accreditation: "NABL, CAP Gold Standard",
      tatHours: 24,
      rating: 4.9,
      reviewsCount: 5200,
      homeCollectionFee: 50,
      contactEmail: "corporate@lalpathlabs.com",
      contactPhone: "+91 9833445566",
      status: "ACTIVE",
      walletBalance: 53100
    }
  ] as Lab[],

  tests: [
    {
      id: "T-101",
      name: "Vitamin D (25-OH Total)",
      code: "VIT_D_25",
      category: "Vitamins & Minerals",
      sampleType: "Blood (Serum)",
      fastingRequired: false,
      fastingHours: 0,
      parametersCount: 1,
      preparation: "No dietary restrictions. Drink normal water.",
      description: "Checks 25-hydroxy vitamin D concentration to diagnose deficiency, bone weakness, joint ache, and lowered immunity.",
      parameters: ["Vitamin D Total (25-Hydroxy D2 + D3)"]
    },
    {
      id: "T-102",
      name: "Complete Blood Count (CBC) with Automated ESR",
      code: "CBC_ESR",
      category: "Fever & Infection",
      sampleType: "Blood (EDTA)",
      fastingRequired: false,
      fastingHours: 0,
      parametersCount: 26,
      preparation: "Stay adequately hydrated before morning pickup.",
      description: "Complete hemogram detecting viral infections, dengue platelet trends, anemia, immune status, and inflammatory ESR index.",
      parameters: ["Hemoglobin", "RBC Count", "WBC Total Count", "Platelet Count", "Neutrophils", "Lymphocytes", "Monocytes", "Eosinophils", "Basophils", "PCV / Hematocrit", "MCV", "MCH", "MCHC", "RDW-CV", "RDW-SD", "ESR Automated (Westergren)"]
    },
    {
      id: "T-103",
      name: "Thyroid Profile (Total T3, Total T4, TSH Ultrasensitive)",
      code: "THY_T3T4TSH",
      category: "Thyroid & Hormones",
      sampleType: "Blood (Serum)",
      fastingRequired: true,
      fastingHours: 8,
      parametersCount: 3,
      preparation: "Overnight fasting (8 hours). Do not take thyroid medications before morning blood draw.",
      description: "Measures 3 critical metabolic endocrine hormones to diagnose Hypo or Hyperthyroidism.",
      parameters: ["Triiodothyronine (Total T3)", "Thyroxine (Total T4)", "Thyroid Stimulating Hormone (TSH Ultrasensitive)"]
    },
    {
      id: "T-104",
      name: "HbA1c (Glycated Hemoglobin) Diabetes 90-Day Index",
      code: "HBA1C",
      category: "Diabetes Care",
      sampleType: "Blood (EDTA)",
      fastingRequired: false,
      fastingHours: 0,
      parametersCount: 2,
      preparation: "Fasting not strictly required.",
      description: "Gold standard diagnostic test evaluating 3-month average blood glucose concentration without daily fluctuation bias.",
      parameters: ["Glycated Hemoglobin (HbA1c)", "Estimated Average Glucose (eAG)"]
    },
    {
      id: "T-105",
      name: "Liver Function Test (LFT Complete 12 Parameters)",
      code: "LFT_12",
      category: "Full Body Checkup",
      sampleType: "Blood (Serum)",
      fastingRequired: true,
      fastingHours: 10,
      parametersCount: 12,
      preparation: "10-12 hours fasting. Avoid fatty dinner and alcohol 24 hours prior.",
      description: "Comprehensive hepatic panel diagnosing fatty liver, jaundice, enzymatic inflammation, and protein synthesis health.",
      parameters: ["Bilirubin Total", "Bilirubin Direct", "Bilirubin Indirect", "SGOT / AST", "SGPT / ALT", "Alkaline Phosphatase (ALP)", "Total Protein", "Albumin", "Globulin", "A:G Ratio", "Gamma GT (GGTP)"]
    },
    {
      id: "T-106",
      name: "Kidney Function Test (KFT / Renal Profile 8 Parameters)",
      code: "KFT_RFT",
      category: "Full Body Checkup",
      sampleType: "Blood (Serum)",
      fastingRequired: false,
      fastingHours: 0,
      parametersCount: 8,
      preparation: "Normal hydration recommended.",
      description: "Evaluates renal filtration efficacy, creatinine excretion rate, uric acid crystallization, and blood electrolytes.",
      parameters: ["Serum Creatinine", "Blood Urea Nitrogen (BUN)", "Uric Acid", "Calcium Total", "Phosphorus", "Sodium", "Potassium", "Chloride"]
    },
    {
      id: "T-107",
      name: "Lipid Profile (Complete Cardiac Cholesterol Panel)",
      code: "LIPID_CARD",
      category: "Heart & Cardiac",
      sampleType: "Blood (Serum)",
      fastingRequired: true,
      fastingHours: 12,
      parametersCount: 8,
      preparation: "Strict 12 hours overnight fasting.",
      description: "Cardiovascular risk evaluation identifying arterial plaque, bad LDL, triglycerides, and protective HDL.",
      parameters: ["Total Cholesterol", "Triglycerides", "HDL Good Cholesterol", "LDL Bad Cholesterol", "VLDL", "Cholesterol / HDL Ratio", "LDL / HDL Ratio", "Non-HDL Cholesterol"]
    },
    {
      id: "T-108",
      name: "Vitamin B12 (Cyanocobalamin / Nerve Health)",
      code: "VIT_B12",
      category: "Vitamins & Minerals",
      sampleType: "Blood (Serum)",
      fastingRequired: false,
      fastingHours: 0,
      parametersCount: 1,
      preparation: "No dietary restrictions.",
      description: "Essential neurological vitamin test evaluating nerve sheath integrity, cognitive focus, tingling sensations, and RBC synthesis.",
      parameters: ["Vitamin B12 Active"]
    }
  ] as MasterTest[],

  labPricing: [
    // Vitamin D comparisons
    { id: "P-1", masterTestId: "T-101", labId: "lab-healthians", labName: "Healthians Diagnostic", b2bCost: 260, mrp: 1400, retailPrice: 489, discountPercent: 65, tat: "12-24 Hours", rating: 4.9, accreditation: "NABL, CAP Certified" },
    { id: "P-2", masterTestId: "T-101", labId: "lab-thyrocare", labName: "Thyrocare Technologies", b2bCost: 240, mrp: 1200, retailPrice: 449, discountPercent: 62, tat: "24-36 Hours", rating: 4.8, accreditation: "NABL, ISO 9001" },
    { id: "P-3", masterTestId: "T-101", labId: "lab-redcliffe", labName: "Redcliffe Labs", b2bCost: 280, mrp: 1500, retailPrice: 499, discountPercent: 66, tat: "Same Day (8-10 Hrs)", rating: 4.8, accreditation: "NABL Accredited" },
    { id: "P-4", masterTestId: "T-101", labId: "lab-drlal", labName: "Dr Lal PathLabs", b2bCost: 480, mrp: 1800, retailPrice: 850, discountPercent: 52, tat: "12-24 Hours", rating: 4.9, accreditation: "NABL, CAP Gold" },

    // CBC comparisons
    { id: "P-5", masterTestId: "T-102", labId: "lab-healthians", labName: "Healthians Diagnostic", b2bCost: 110, mrp: 500, retailPrice: 249, discountPercent: 50, tat: "8-12 Hours", rating: 4.9, accreditation: "NABL, CAP Certified" },
    { id: "P-6", masterTestId: "T-102", labId: "lab-redcliffe", labName: "Redcliffe Labs", b2bCost: 120, mrp: 550, retailPrice: 260, discountPercent: 52, tat: "6-8 Hours (Fast Track)", rating: 4.8, accreditation: "NABL Accredited" },
    { id: "P-7", masterTestId: "T-102", labId: "lab-thyrocare", labName: "Thyrocare Technologies", b2bCost: 115, mrp: 480, retailPrice: 239, discountPercent: 50, tat: "24 Hours", rating: 4.8, accreditation: "NABL, ISO 9001" },

    // Thyroid comparisons
    { id: "P-8", masterTestId: "T-103", labId: "lab-thyrocare", labName: "Thyrocare Technologies", b2bCost: 130, mrp: 650, retailPrice: 299, discountPercent: 54, tat: "24 Hours", rating: 4.8, accreditation: "NABL, ISO 9001" },
    { id: "P-9", masterTestId: "T-103", labId: "lab-healthians", labName: "Healthians Diagnostic", b2bCost: 150, mrp: 750, retailPrice: 320, discountPercent: 57, tat: "12 Hours", rating: 4.9, accreditation: "NABL, CAP Certified" },

    // HbA1c comparisons
    { id: "P-10", masterTestId: "T-104", labId: "lab-healthians", labName: "Healthians Diagnostic", b2bCost: 160, mrp: 700, retailPrice: 349, discountPercent: 50, tat: "12 Hours", rating: 4.9, accreditation: "NABL, CAP Certified" },
    { id: "P-11", masterTestId: "T-104", labId: "lab-redcliffe", labName: "Redcliffe Labs", b2bCost: 170, mrp: 750, retailPrice: 360, discountPercent: 52, tat: "8 Hours", rating: 4.8, accreditation: "NABL Accredited" },

    // LFT comparisons
    { id: "P-12", masterTestId: "T-105", labId: "lab-thyrocare", labName: "Thyrocare Technologies", b2bCost: 220, mrp: 1000, retailPrice: 449, discountPercent: 55, tat: "24 Hours", rating: 4.8, accreditation: "NABL, ISO 9001" },
    { id: "P-13", masterTestId: "T-105", labId: "lab-healthians", labName: "Healthians Diagnostic", b2bCost: 240, mrp: 1100, retailPrice: 480, discountPercent: 56, tat: "12-18 Hours", rating: 4.9, accreditation: "NABL, CAP Certified" },

    // KFT comparisons
    { id: "P-14", masterTestId: "T-106", labId: "lab-healthians", labName: "Healthians Diagnostic", b2bCost: 210, mrp: 950, retailPrice: 420, discountPercent: 55, tat: "12 Hours", rating: 4.9, accreditation: "NABL, CAP Certified" },
    { id: "P-15", masterTestId: "T-106", labId: "lab-redcliffe", labName: "Redcliffe Labs", b2bCost: 215, mrp: 980, retailPrice: 430, discountPercent: 56, tat: "10 Hours", rating: 4.8, accreditation: "NABL Accredited" },

    // Lipid comparisons
    { id: "P-16", masterTestId: "T-107", labId: "lab-thyrocare", labName: "Thyrocare Technologies", b2bCost: 190, mrp: 900, retailPrice: 399, discountPercent: 55, tat: "24 Hours", rating: 4.8, accreditation: "NABL, ISO 9001" },
    { id: "P-17", masterTestId: "T-107", labId: "lab-healthians", labName: "Healthians Diagnostic", b2bCost: 200, mrp: 950, retailPrice: 420, discountPercent: 55, tat: "12 Hours", rating: 4.9, accreditation: "NABL, CAP Certified" },

    // Vitamin B12
    { id: "P-18", masterTestId: "T-108", labId: "lab-healthians", labName: "Healthians Diagnostic", b2bCost: 250, mrp: 1300, retailPrice: 499, discountPercent: 61, tat: "18 Hours", rating: 4.9, accreditation: "NABL, CAP Certified" }
  ] as LabPricing[],

  packages: [
    {
      id: "PKG-FULLBODY-84",
      name: "TestBeat HealthShield Complete Full Body Checkup",
      badge: "⭐ MOST POPULAR • 70% OFF",
      category: "Full Body Checkup",
      parametersCount: 84,
      mrp: 3999,
      price: 1199,
      b2bCost: 650,
      discountPercent: 70,
      fastingHours: 10,
      sampleType: "Blood & Urine",
      tat: "Reports in 24 Hours",
      partnerLab: "Healthians / Thyrocare Aggregated",
      subProfiles: [
        { name: "Liver Function Profile (LFT)", count: 12, tests: ["SGOT", "SGPT", "Bilirubin Total", "Bilirubin Direct", "Alkaline Phosphatase", "Albumin", "Total Protein", "Globulin", "A/G Ratio", "GGTP"] },
        { name: "Kidney Function Profile (KFT)", count: 8, tests: ["Serum Creatinine", "Blood Urea Nitrogen", "Uric Acid", "Calcium", "Phosphorus", "BUN/Creatinine Ratio"] },
        { name: "Lipid Cardiac Cholesterol Profile", count: 8, tests: ["Total Cholesterol", "Triglycerides", "HDL Good Cholesterol", "LDL Bad Cholesterol", "VLDL", "Cholesterol/HDL Ratio"] },
        { name: "Thyroid Profile (Ultrasensitive)", count: 3, tests: ["Total T3", "Total T4", "TSH Ultrasensitive"] },
        { name: "Complete Hemogram (CBC + ESR)", count: 26, tests: ["Hemoglobin", "WBC Total", "Platelet Count", "RBC Count", "ESR Automated", "Differential Leukocyte Count"] },
        { name: "Diabetic Glucose Screen", count: 2, tests: ["Blood Sugar Fasting (FBS)", "Average Blood Sugar Index"] },
        { name: "Vital Bone & Vitamin Immunity", count: 2, tests: ["Vitamin D3 (25-OH)", "Vitamin B12 Cyanocobalamin"] },
        { name: "Complete Urine Analysis (Routine & Microscopic)", count: 23, tests: ["Urine Protein", "Glucose", "Urobilinogen", "Pus Cells", "Epithelial Cells", "Crystals"] }
      ]
    },
    {
      id: "PKG-SENIOR-92",
      name: "Executive Senior Citizen Vital Organ & Arthritis Profile",
      badge: "👴 ELDERLY CARE SPECIAL",
      category: "Senior Citizen Special",
      parametersCount: 92,
      mrp: 5499,
      price: 1799,
      b2bCost: 950,
      discountPercent: 67,
      fastingHours: 10,
      sampleType: "Blood & Urine",
      tat: "Reports in 24-36 Hours",
      partnerLab: "Healthians Diagnostic",
      subProfiles: [
        { name: "Advanced Joint, Bone & Gout Markers", count: 6, tests: ["Calcium Total", "Phosphorus", "Uric Acid for Gout", "Alkaline Phosphatase", "Rheumatoid Factor Screen"] },
        { name: "HbA1c & Fasting Glucose Extended", count: 3, tests: ["HbA1c 3-Month Average", "Blood Sugar Fasting", "eAG Index"] },
        { name: "Cardiac & Electrolytes Balance", count: 10, tests: ["Serum Sodium", "Serum Potassium", "Serum Chloride", "Complete Lipid Profile"] },
        { name: "Vital Organ Panels (LFT 12 + KFT 8)", count: 20, tests: ["Liver Screen 12 Parameters", "Kidney Function 8 Parameters"] },
        { name: "CBC & Urine Microscopic Screen", count: 53, tests: ["Complete Hemogram 26 tests", "Complete Urine Examination 27 tests"] }
      ]
    },
    {
      id: "PKG-WOMEN-72",
      name: "Women Vitality, PCOD & Hormonal Wellness Profile",
      badge: "🌸 DESIGNED FOR WOMEN",
      category: "Women's Wellness",
      parametersCount: 72,
      mrp: 3499,
      price: 1399,
      b2bCost: 720,
      discountPercent: 60,
      fastingHours: 10,
      sampleType: "Blood",
      tat: "Reports in 24 Hours",
      partnerLab: "Redcliffe Labs",
      subProfiles: [
        { name: "Thyroid & Reproductive Hormones", count: 4, tests: ["TSH Ultrasensitive", "Total T3", "Total T4", "Prolactin Hormone"] },
        { name: "Anemia & Iron Store Profile", count: 5, tests: ["Serum Iron", "Ferritin Level", "Total Iron Binding Capacity (TIBC)", "Transferrin Saturation"] },
        { name: "Bone & Energy Vitamins", count: 3, tests: ["Vitamin D (25-OH)", "Vitamin B12", "Calcium Total"] },
        { name: "Essential CBC & Organ Health", count: 60, tests: ["CBC 26 tests", "Liver Panel", "Kidney Panel", "Cholesterol Screen"] }
      ]
    },
    {
      id: "PKG-DIABETES-48",
      name: "Diabetes Comprehensive Care & Organ Shield Panel",
      badge: "🩸 DIABETES CARE",
      category: "Diabetes Care",
      parametersCount: 48,
      mrp: 2799,
      price: 999,
      b2bCost: 510,
      discountPercent: 64,
      fastingHours: 8,
      sampleType: "Blood & Urine",
      tat: "Reports in 18 Hours",
      partnerLab: "Thyrocare Technologies",
      subProfiles: [
        { name: "Glycemic Control Profile", count: 3, tests: ["HbA1c Glycated Hemoglobin", "Blood Sugar Fasting (FBS)", "Average Blood Glucose"] },
        { name: "Diabetic Kidney Complication Screen", count: 8, tests: ["Serum Creatinine", "Blood Urea", "Urine Microalbumin", "eGFR Calculation"] },
        { name: "Cardiac Lipid Risk", count: 8, tests: ["Cholesterol Total", "Triglycerides", "HDL", "LDL", "VLDL"] },
        { name: "CBC & Urine Screen", count: 29, tests: ["CBC Hemogram with automated ESR", "Urine Analysis"] }
      ]
    }
  ] as HealthPackage[],

  customers: [
    {
      id: "CUST-1001",
      name: "Shubhranshu Kumar",
      phone: "9876543210",
      email: "shubhranshu@example.com",
      address: "Flat 402, Green Avenue, Greater Noida",
      pincode: "201310",
      totalOrders: 3,
      totalSpent: 2687,
      familyMembersCount: 2,
      registeredDate: "2026-08-14",
      status: "ACTIVE"
    },
    {
      id: "CUST-1002",
      name: "Rajesh Verma",
      phone: "9811223344",
      email: "rajesh.verma@example.com",
      address: "B-12, Sector 62, Noida",
      pincode: "201301",
      totalOrders: 1,
      totalSpent: 1199,
      familyMembersCount: 1,
      registeredDate: "2026-09-02",
      status: "ACTIVE"
    },
    {
      id: "CUST-1003",
      name: "Sunita Sharma",
      phone: "9822334455",
      email: "sunita.sharma@gmail.com",
      address: "House 54, Indirapuram, Ghaziabad",
      pincode: "201014",
      totalOrders: 2,
      totalSpent: 2798,
      familyMembersCount: 3,
      registeredDate: "2026-09-18",
      status: "ACTIVE"
    }
  ] as CustomerRecord[],

  orders: [
    {
      id: "TB2026849102",
      patientName: "Shubhranshu Kumar",
      patientPhone: "9876543210",
      patientAge: 32,
      patientGender: "Male",
      patientRelation: "Self",
      itemName: "Vitamin D (25-OH Total)",
      itemType: "TEST",
      labId: "lab-healthians",
      labName: "Healthians Diagnostic",
      collectionDate: "2026-10-03",
      slot: "07:00 AM - 08:00 AM (Fasting)",
      address: "Flat 402, Green Avenue, Greater Noida",
      pincode: "201310",
      totalAmount: 489,
      b2bCost: 260,
      platformMargin: 229,
      status: "PHLEBO_ASSIGNED",
      paymentStatus: "PAID",
      phleboName: "Vikas Sharma",
      phleboPhone: "9899112233",
      reportUrl: null,
      createdAt: "2026-10-02 18:30"
    },
    {
      id: "TB2026710492",
      patientName: "KM Babita",
      patientPhone: "9506386371",
      patientAge: 29,
      patientGender: "Female",
      patientRelation: "Spouse",
      itemName: "TestBeat HealthShield Complete Full Body Checkup",
      itemType: "PACKAGE",
      labId: "lab-thyrocare",
      labName: "Thyrocare Technologies",
      collectionDate: "2026-10-01",
      slot: "07:30 AM - 08:30 AM",
      address: "Sector 62, Noida",
      pincode: "201301",
      totalAmount: 1199,
      b2bCost: 650,
      platformMargin: 549,
      status: "COMPLETED",
      paymentStatus: "PAID",
      phleboName: "Amit Kumar",
      phleboPhone: "9810223344",
      reportUrl: "https://testbeat.in/reports/TB2026710492.pdf",
      createdAt: "2026-10-01 07:15"
    }
  ] as Order[]
};

export const DATA = DB;
