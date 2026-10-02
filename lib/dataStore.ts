export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;
  address: string;
  pincode: string;
  totalOrders: number;
  totalSpend: number;
  familyMembers: { name: string; relation: string; age: number; gender: string }[];
}

export interface Lab {
  id: string;
  name: string;
  code: string;
  logo: string;
  accreditations: string;
  tat: string;
  rating: number;
  reviewsCount: number;
  homeCollectionFee: number;
  status: 'ACTIVE' | 'INACTIVE';
  b2bAgreementDate: string;
  walletBalance: number;
}

export interface MasterTest {
  id: string;
  name: string;
  canonicalCode: string;
  category: string;
  sampleType: string;
  fastingRequired: boolean;
  fastingHours: number;
  preparation: string;
  description: string;
}

export interface LabTestMapping {
  id: string;
  masterTestId: string;
  labId: string;
  labTestName: string;
  labTestCode: string;
  b2bCost: number;
  mrp: number;
  retailPrice: number;
  platformMargin: number;
  active: boolean;
}

export interface HealthPackage {
  id: string;
  name: string;
  category: string;
  testsCount: number;
  parameters: string[];
  mrp: number;
  price: number;
  b2bCost: number;
  fastingRequired: boolean;
  tat: string;
  labPartner: string;
}

export interface Order {
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
  platformMargin: number;
  status: 'SCHEDULED' | 'PHLEBO_EN_ROUTE' | 'SAMPLE_COLLECTED' | 'LAB_RECEIVED' | 'PROCESSING' | 'REPORT_READY' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PAID' | 'COD' | 'PENDING' | 'REFUNDED';
  phleboName: string;
  phleboPhone: string;
  reportUrl: string | null;
  createdAt: string;
}

export interface Affiliate {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  refCode: string;
  commissionType: 'PERCENT' | 'FLAT';
  rate: number;
  bookingsCount: number;
  totalCommission: number;
  walletBalance: number;
  payoutStatus: 'PAID' | 'PENDING';
}

export const DB = {
  customers: [
    {
      id: "CUST-101",
      name: "Shubhranshu Kumar",
      phone: "9876543210",
      email: "shubhranshu@example.com",
      dob: "1994-08-15",
      gender: "Male",
      address: "Flat 402, Green Avenue, Greater Noida",
      pincode: "201310",
      totalOrders: 3,
      totalSpend: 2437,
      familyMembers: [
        { name: "KM Babita", relation: "Spouse", age: 29, gender: "Female" },
        { name: "Ayansh Kumar", relation: "Son", age: 4, gender: "Male" }
      ]
    },
    {
      id: "CUST-102",
      name: "Rajesh Verma",
      phone: "9811223344",
      email: "rajesh.verma@example.com",
      dob: "1982-03-22",
      gender: "Male",
      address: "B-12, Sector 62, Noida",
      pincode: "201301",
      totalOrders: 1,
      totalSpend: 1199,
      familyMembers: [
        { name: "Sunita Verma", relation: "Spouse", age: 40, gender: "Female" }
      ]
    }
  ] as Customer[],

  labs: [
    {
      id: "lab-thyrocare",
      name: "Thyrocare Technologies",
      code: "THYRO",
      logo: "🧪",
      accreditations: "NABL, CAP, ISO 9001",
      tat: "24-36 Hours",
      rating: 4.8,
      reviewsCount: 1420,
      homeCollectionFee: 0,
      status: "ACTIVE",
      b2bAgreementDate: "2026-01-10",
      walletBalance: 84500
    },
    {
      id: "lab-healthians",
      name: "Healthians Diagnostic",
      code: "HLTH",
      logo: "🏥",
      accreditations: "NABL, CAP Certified",
      tat: "12-24 Hours",
      rating: 4.9,
      reviewsCount: 2180,
      homeCollectionFee: 0,
      status: "ACTIVE",
      b2bAgreementDate: "2026-02-15",
      walletBalance: 112000
    },
    {
      id: "lab-redcliffe",
      name: "Redcliffe Labs",
      code: "RED",
      logo: "🔬",
      accreditations: "NABL Accredited",
      tat: "8-12 Hours (Same Day)",
      rating: 4.8,
      reviewsCount: 950,
      homeCollectionFee: 0,
      status: "ACTIVE",
      b2bAgreementDate: "2026-03-01",
      walletBalance: 64000
    },
    {
      id: "lab-drlal",
      name: "Dr Lal PathLabs",
      code: "LAL",
      logo: "⚕️",
      accreditations: "NABL, CAP Gold Standard",
      tat: "12-24 Hours",
      rating: 4.9,
      reviewsCount: 3400,
      homeCollectionFee: 50,
      status: "ACTIVE",
      b2bAgreementDate: "2026-01-05",
      walletBalance: 49000
    }
  ] as Lab[],

  tests: [
    {
      id: "T-101",
      name: "Vitamin D (25-OH Total)",
      canonicalCode: "LOINC-1989-3",
      category: "Vitamins & Minerals",
      sampleType: "Blood (Serum)",
      fastingRequired: false,
      fastingHours: 0,
      preparation: "No special dietary restrictions required.",
      description: "Checks 25-hydroxy vitamin D level to evaluate bone fragility, fatigue, and immune health."
    },
    {
      id: "T-102",
      name: "Complete Blood Count (CBC) with ESR",
      canonicalCode: "LOINC-58410-2",
      category: "General Hematology",
      sampleType: "Blood (EDTA)",
      fastingRequired: false,
      fastingHours: 0,
      preparation: "Drink normal water before sample pickup.",
      description: "Screens for infections, anemia, leukemia, platelet counts, and immune system status."
    },
    {
      id: "T-103",
      name: "Thyroid Profile (Total T3, Total T4, TSH)",
      canonicalCode: "LOINC-8090-4",
      category: "Hormone & Endocrine",
      sampleType: "Blood (Serum)",
      fastingRequired: true,
      fastingHours: 8,
      preparation: "Overnight fasting recommended. Avoid thyroid medication before sample collection.",
      description: "Measures triiodothyronine (T3), thyroxine (T4), and thyroid-stimulating hormone (TSH)."
    },
    {
      id: "T-104",
      name: "HbA1c (Glycated Hemoglobin)",
      canonicalCode: "LOINC-4548-4",
      category: "Diabetes Monitoring",
      sampleType: "Blood (EDTA)",
      fastingRequired: false,
      fastingHours: 0,
      preparation: "Fasting not strictly required.",
      description: "Evaluates 3-month average plasma glucose concentration for diabetes diagnosis & control."
    },
    {
      id: "T-105",
      name: "Liver Function Test (LFT 12 Parameters)",
      canonicalCode: "LOINC-24325-3",
      category: "Organ Health Profiles",
      sampleType: "Blood (Serum)",
      fastingRequired: true,
      fastingHours: 10,
      preparation: "10-12 hours fasting. Avoid alcohol and greasy foods 24 hours prior.",
      description: "Measures SGPT, SGOT, Bilirubin Total/Direct, Alkaline Phosphatase, Protein, Albumin."
    },
    {
      id: "T-106",
      name: "Kidney Function Test (KFT / RFT Profile)",
      canonicalCode: "LOINC-24362-6",
      category: "Organ Health Profiles",
      sampleType: "Blood (Serum)",
      fastingRequired: false,
      fastingHours: 0,
      preparation: "Maintain regular hydration.",
      description: "Evaluates blood urea nitrogen (BUN), serum creatinine, uric acid, and calcium levels."
    }
  ] as MasterTest[],

  labMappings: [
    { id: "MAP-1", masterTestId: "T-101", labId: "lab-thyrocare", labTestName: "25-OH Vitamin D Total", labTestCode: "VIT_D_THY", b2bCost: 240, mrp: 1200, retailPrice: 449, platformMargin: 209, active: true },
    { id: "MAP-2", masterTestId: "T-101", labId: "lab-healthians", labTestName: "Vitamin D3 Ultra Assay", labTestCode: "VIT_D_HLT", b2bCost: 270, mrp: 1400, retailPrice: 489, platformMargin: 219, active: true },
    { id: "MAP-3", masterTestId: "T-101", labId: "lab-redcliffe", labTestName: "Vitamin D 25-Hydroxy", labTestCode: "VIT_D_RED", b2bCost: 280, mrp: 1500, retailPrice: 499, platformMargin: 219, active: true },
    { id: "MAP-4", masterTestId: "T-101", labId: "lab-drlal", labTestName: "Vitamin D (25 OH)", labTestCode: "VIT_D_LAL", b2bCost: 480, mrp: 1800, retailPrice: 850, platformMargin: 370, active: true },
    { id: "MAP-5", masterTestId: "T-102", labId: "lab-healthians", labTestName: "CBC with Automated ESR", labTestCode: "CBC_HLT", b2bCost: 110, mrp: 500, retailPrice: 249, platformMargin: 139, active: true },
    { id: "MAP-6", masterTestId: "T-102", labId: "lab-redcliffe", labTestName: "Complete Hemogram + ESR", labTestCode: "CBC_RED", b2bCost: 120, mrp: 550, retailPrice: 260, platformMargin: 140, active: true },
    { id: "MAP-7", masterTestId: "T-103", labId: "lab-thyrocare", labTestName: "Thyroid Profile Total (T3, T4, TSH)", labTestCode: "THY_T3T4TSH", b2bCost: 130, mrp: 650, retailPrice: 299, platformMargin: 169, active: true }
  ] as LabTestMapping[],

  packages: [
    {
      id: "PKG-1",
      name: "TestBeat Complete Full Body Checkup (84 Tests)",
      category: "Full Body Screening",
      testsCount: 84,
      parameters: ["Liver Function (12)", "Kidney Function (8)", "Lipid Profile (8)", "Thyroid Profile (3)", "CBC Hemogram (28)", "Blood Sugar Fasting (2)", "Vitamin D (1)", "Vitamin B12 (1)", "Iron Profile (4)"],
      mrp: 3999,
      price: 1199,
      b2bCost: 650,
      fastingRequired: true,
      tat: "24 Hours",
      labPartner: "Thyrocare / Healthians"
    },
    {
      id: "PKG-2",
      name: "Executive Senior Citizen Health Screening (92 Tests)",
      category: "Elderly Care",
      testsCount: 92,
      parameters: ["Advanced Cardiac Risk", "Bone Density Markers", "Uric Acid & Arthritis", "HbA1c & Fasting Glucose", "Complete LFT & KFT", "Electrolytes Profile", "Urine Complete Examination"],
      mrp: 5499,
      price: 1799,
      b2bCost: 950,
      fastingRequired: true,
      tat: "24-48 Hours",
      labPartner: "Healthians Diagnostic"
    },
    {
      id: "PKG-3",
      name: "Women Vitality & Hormonal Wellness (68 Tests)",
      category: "Women Health",
      testsCount: 68,
      parameters: ["TSH & Prolactin", "Iron Deficiency & Ferritin", "CBC with ESR", "Calcium & Vitamin D", "Lipid & Liver Screen"],
      mrp: 3499,
      price: 1399,
      b2bCost: 720,
      fastingRequired: true,
      tat: "24 Hours",
      labPartner: "Redcliffe Labs"
    }
  ] as HealthPackage[],

  orders: [
    {
      id: "TB2026849102",
      patientName: "Shubhranshu Kumar",
      patientPhone: "9876543210",
      patientRelation: "Self",
      testName: "Vitamin D (25-OH Total)",
      labName: "Healthians Diagnostic",
      collectionDate: "2026-10-03",
      slot: "07:00 AM - 08:00 AM (Fasting)",
      address: "Flat 402, Green Avenue, Greater Noida",
      pincode: "201310",
      totalAmount: 489,
      b2bCost: 270,
      platformMargin: 219,
      status: "PHLEBO_EN_ROUTE",
      paymentStatus: "PAID",
      phleboName: "Vikas Sharma",
      phleboPhone: "9899112233",
      reportUrl: null,
      createdAt: "2026-10-02 08:30"
    },
    {
      id: "TB2026710492",
      patientName: "KM Babita",
      patientPhone: "9506386371",
      patientRelation: "Spouse",
      testName: "TestBeat Complete Full Body Checkup (84 Tests)",
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
    },
    {
      id: "TB2026501923",
      patientName: "Ayansh Kumar",
      patientPhone: "9876543210",
      patientRelation: "Son",
      testName: "Complete Blood Count (CBC) with ESR",
      labName: "Redcliffe Labs",
      collectionDate: "2026-10-05",
      slot: "09:00 AM - 10:00 AM",
      address: "Sikanderpur, Ballia, UP",
      pincode: "277303",
      totalAmount: 260,
      b2bCost: 120,
      platformMargin: 140,
      status: "SCHEDULED",
      paymentStatus: "PAID",
      phleboName: "Not Assigned Yet",
      phleboPhone: "--",
      reportUrl: null,
      createdAt: "2026-10-02 11:20"
    }
  ] as Order[],

  affiliates: [
    {
      id: "AFF-101",
      businessName: "Dr. Sharma Family Medicare Clinic",
      ownerName: "Dr. A. K. Sharma",
      phone: "9811002233",
      email: "sharma.clinic@gmail.com",
      refCode: "CLINIC984",
      commissionType: "PERCENT",
      rate: 10,
      bookingsCount: 142,
      totalCommission: 18450,
      walletBalance: 14850,
      payoutStatus: "PENDING"
    },
    {
      id: "AFF-102",
      businessName: "Sanjivani 24x7 Chemist & Diagnostic",
      ownerName: "Manoj Rastogi",
      phone: "9822334455",
      email: "sanjivani.pharmacy@gmail.com",
      refCode: "SANJIVANI22",
      commissionType: "PERCENT",
      rate: 10,
      bookingsCount: 86,
      totalCommission: 11240,
      walletBalance: 9240,
      payoutStatus: "PAID"
    }
  ] as Affiliate[]
};
