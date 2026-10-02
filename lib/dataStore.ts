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
  includes: string[];
}

export interface LabMapping {
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
  tags: string[];
  subPackages: { title: string; count: number; tests: string[] }[];
}

export interface Order {
  id: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: string;
  patientRelation: string;
  itemName: string;
  labName: string;
  collectionDate: string;
  slot: string;
  address: string;
  pincode: string;
  totalAmount: number;
  b2bCost: number;
  platformMargin: number;
  status: 'SCHEDULED' | 'PHLEBO_ASSIGNED' | 'SAMPLE_COLLECTED' | 'PROCESSING' | 'REPORT_READY' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PAID' | 'COD' | 'PENDING';
  phleboName: string;
  phleboPhone: string;
  createdAt: string;
}

export const DB = {
  categories: [
    { id: "fullbody", name: "Full Body Checkup", icon: "🩺", desc: "Liver, Kidney, CBC, Sugar, Lipids & Vitamins" },
    { id: "diabetes", name: "Diabetes Care", icon: "🩸", desc: "HbA1c, Fasting Sugar, Insulin & Urine Screen" },
    { id: "thyroid", name: "Thyroid & Hormones", icon: "🦋", desc: "T3, T4, TSH, Anti-TPO & Vitamin D" },
    { id: "heart", name: "Cardiac & Lipid", icon: "❤️", desc: "Cholesterol, Triglycerides, HDL, LDL, VLDL" },
    { id: "vitamins", name: "Vitamins & Calcium", icon: "💊", desc: "Vitamin D3 (25-OH), B12 & Calcium Total" },
    { id: "women", name: "Women's Wellness", icon: "🌸", desc: "Hormone Profile, Iron, Ferritin & PCOD Screen" },
    { id: "senior", name: "Senior Citizen Special", icon: "👴", desc: "Bone Density, Arthritis, Kidney & Heart" },
    { id: "fever", name: "Fever & Infection", icon: "🌡️", desc: "CBC, Dengue, Typhoid, Malaria & ESR" }
  ],

  tests: [
    {
      id: "T-101",
      name: "Vitamin D (25-OH Total)",
      code: "VIT_D",
      category: "Vitamins & Minerals",
      sampleType: "Blood",
      fastingRequired: false,
      fastingHours: 0,
      parametersCount: 1,
      preparation: "No dietary restrictions. Drink normal water.",
      description: "Measures 25-hydroxycholecalciferol to detect deficiency causing bone pain, fatigue, and lower immunity.",
      includes: ["Vitamin D Total (25-Hydroxy D2 + D3)"]
    },
    {
      id: "T-102",
      name: "Complete Blood Count (CBC) with ESR",
      code: "CBC_ESR",
      category: "Fever & Infection",
      sampleType: "Blood (EDTA)",
      fastingRequired: false,
      fastingHours: 0,
      parametersCount: 26,
      preparation: "Normal hydration recommended.",
      description: "Comprehensive automated cell count detecting viral/bacterial infections, platelet drop, and anemia.",
      includes: ["Hemoglobin", "RBC Count", "WBC Total Count", "Platelet Count", "Neutrophils", "Lymphocytes", "Monocytes", "Eosinophils", "Basophils", "PCV/Hematocrit", "MCV", "MCH", "MCHC", "RDW", "ESR Automated"]
    },
    {
      id: "T-103",
      name: "Thyroid Profile (Total T3, Total T4, TSH)",
      code: "THY_T3T4TSH",
      category: "Thyroid & Hormones",
      sampleType: "Blood",
      fastingRequired: true,
      fastingHours: 8,
      parametersCount: 3,
      preparation: "8 hours overnight fasting. Avoid thyroid medication before morning blood pickup.",
      description: "Golden standard tri-hormone screening to detect Hypothyroidism, Hyperthyroidism, and metabolism balance.",
      includes: ["Triiodothyronine (Total T3)", "Thyroxine (Total T4)", "Thyroid Stimulating Hormone (Ultrasensitive TSH)"]
    },
    {
      id: "T-104",
      name: "HbA1c (Glycated Hemoglobin) Diabetes Monitor",
      code: "HBA1C",
      category: "Diabetes Care",
      sampleType: "Blood",
      fastingRequired: false,
      fastingHours: 0,
      parametersCount: 2,
      preparation: "No mandatory fasting.",
      description: "Gold standard 90-day average blood glucose concentration index for diagnosis and long-term diabetes control.",
      includes: ["Glycated Hemoglobin (HbA1c)", "Estimated Average Glucose (eAG)"]
    },
    {
      id: "T-105",
      name: "Liver Function Test (LFT 12 Parameters)",
      code: "LFT_12",
      category: "Full Body Checkup",
      sampleType: "Blood",
      fastingRequired: true,
      fastingHours: 10,
      parametersCount: 12,
      preparation: "10-12 hours fasting. Avoid greasy food and alcohol 24 hours prior.",
      description: "Evaluates liver inflammation, bile flow, protein synthesis, and jaundice markers.",
      includes: ["Bilirubin Total", "Bilirubin Direct", "Bilirubin Indirect", "SGOT / AST", "SGPT / ALT", "Alkaline Phosphatase (ALP)", "Total Protein", "Albumin", "Globulin", "A:G Ratio", "GGTP"]
    },
    {
      id: "T-106",
      name: "Kidney Function Test (KFT / Renal Profile)",
      code: "KFT_RFT",
      category: "Full Body Checkup",
      sampleType: "Blood",
      fastingRequired: false,
      fastingHours: 0,
      parametersCount: 8,
      preparation: "Maintain regular hydration.",
      description: "Checks renal filtration efficiency, electrolyte levels, and waste excretion.",
      includes: ["Serum Creatinine", "Blood Urea Nitrogen (BUN)", "Uric Acid", "Calcium Total", "Phosphorus", "Sodium", "Potassium", "Chloride"]
    }
  ] as MasterTest[],

  labMappings: [
    { id: "M-1", masterTestId: "T-101", labId: "lab-healthians", labName: "Healthians Diagnostic", b2bCost: 260, mrp: 1400, retailPrice: 489, discountPercent: 65, tat: "12-24 Hours", rating: 4.9, accreditation: "NABL, CAP Certified" },
    { id: "M-2", masterTestId: "T-101", labId: "lab-thyrocare", labName: "Thyrocare Technologies", b2bCost: 240, mrp: 1200, retailPrice: 449, discountPercent: 62, tat: "24-36 Hours", rating: 4.8, accreditation: "NABL, ISO 9001" },
    { id: "M-3", masterTestId: "T-101", labId: "lab-redcliffe", labName: "Redcliffe Labs", b2bCost: 280, mrp: 1500, retailPrice: 499, discountPercent: 66, tat: "Same Day (8-10 Hrs)", rating: 4.8, accreditation: "NABL Certified" },
    { id: "M-4", masterTestId: "T-101", labId: "lab-drlal", labName: "Dr Lal PathLabs", b2bCost: 480, mrp: 1800, retailPrice: 850, discountPercent: 52, tat: "12-24 Hours", rating: 4.9, accreditation: "NABL, CAP Gold" },

    { id: "M-5", masterTestId: "T-102", labId: "lab-healthians", labName: "Healthians Diagnostic", b2bCost: 110, mrp: 500, retailPrice: 249, discountPercent: 50, tat: "8-12 Hours", rating: 4.9, accreditation: "NABL, CAP Certified" },
    { id: "M-6", masterTestId: "T-102", labId: "lab-redcliffe", labName: "Redcliffe Labs", b2bCost: 120, mrp: 550, retailPrice: 260, discountPercent: 52, tat: "6-8 Hours (Fast Track)", rating: 4.8, accreditation: "NABL Certified" },

    { id: "M-7", masterTestId: "T-103", labId: "lab-thyrocare", labName: "Thyrocare Technologies", b2bCost: 130, mrp: 650, retailPrice: 299, discountPercent: 54, tat: "24 Hours", rating: 4.8, accreditation: "NABL, ISO" },
    { id: "M-8", masterTestId: "T-103", labId: "lab-healthians", labName: "Healthians Diagnostic", b2bCost: 150, mrp: 750, retailPrice: 320, discountPercent: 57, tat: "12 Hours", rating: 4.9, accreditation: "NABL, CAP Certified" }
  ] as LabMapping[],

  packages: [
    {
      id: "PKG-COMPLETE-84",
      name: "HealthShield Complete Full Body Checkup (84 Parameters)",
      badge: "MOST POPULAR • BESTSELLER",
      category: "Full Body Checkup",
      parametersCount: 84,
      mrp: 3999,
      price: 1199,
      b2bCost: 650,
      discountPercent: 70,
      fastingHours: 10,
      sampleType: "Blood & Urine",
      tat: "Reports in 24 Hours",
      tags: ["Free Phlebotomist Visit", "Smart Doctor Report", "Free Diet Plan"],
      subPackages: [
        { title: "Liver Function Profile (LFT)", count: 12, tests: ["SGOT", "SGPT", "Bilirubin Total", "Bilirubin Direct", "Alkaline Phosphatase", "Albumin", "Total Protein", "Globulin", "A/G Ratio", "GGTP"] },
        { title: "Kidney Function Profile (KFT)", count: 8, tests: ["Serum Creatinine", "Blood Urea Nitrogen", "Uric Acid", "Calcium", "Phosphorus", "BUN/Creatinine Ratio"] },
        { title: "Lipid Cardiac Profile", count: 8, tests: ["Total Cholesterol", "Triglycerides", "HDL Good Cholesterol", "LDL Bad Cholesterol", "VLDL", "Cholesterol/HDL Ratio"] },
        { title: "Thyroid Profile (Ultrasensitive)", count: 3, tests: ["Total T3", "Total T4", "TSH Ultrasensitive"] },
        { title: "Complete Hemogram (CBC + ESR)", count: 26, tests: ["Hemoglobin", "WBC Total", "Platelet Count", "RBC Count", "ESR Automated", "Differential Leukocyte Count"] },
        { title: "Diabetic Sugar Screen", count: 2, tests: ["Blood Sugar Fasting (FBS)", "Average Blood Sugar Index"] },
        { title: "Vital Vitamins & Bones", count: 2, tests: ["Vitamin D3 (25-OH)", "Vitamin B12 Cyanocobalamin"] },
        { title: "Complete Urine Analysis", count: 23, tests: ["Urine Protein", "Glucose", "Urobilinogen", "Microscopic Pus Cells", "Epithelial Cells"] }
      ]
    },
    {
      id: "PKG-SENIOR-92",
      name: "Senior Citizen Wellness & Vital Organ Profile (92 Parameters)",
      badge: "ELDERLY SPECIAL",
      category: "Senior Citizen Special",
      parametersCount: 92,
      mrp: 5499,
      price: 1799,
      b2bCost: 950,
      discountPercent: 67,
      fastingHours: 10,
      sampleType: "Blood & Urine",
      tat: "Reports in 24-36 Hours",
      tags: ["Arthritis Screen", "Bone Density", "Heart Muscle Health"],
      subPackages: [
        { title: "Advanced Bone & Joint Health", count: 6, tests: ["Calcium Total", "Phosphorus", "Uric Acid for Gout", "Alkaline Phosphatase", "Rheumatoid Factor Screen"] },
        { title: "HbA1c & Fasting Sugar Extended", count: 3, tests: ["HbA1c 3-Month Average", "Blood Sugar Fasting", "eAG"] },
        { title: "Cardiac & Electrolytes Balance", count: 10, tests: ["Serum Sodium", "Serum Potassium", "Serum Chloride", "Complete Lipid Profile"] },
        { title: "Liver & Renal Vital Screens", count: 20, tests: ["Full LFT 12 parameters", "Full KFT 8 parameters"] },
        { title: "CBC & Urine Microscopy", count: 53, tests: ["Complete Hemogram with automated ESR", "Urine Routine & Microscopic analysis"] }
      ]
    },
    {
      id: "PKG-WOMEN-72",
      name: "Women Vitality, PCOD & Hormonal Health (72 Parameters)",
      badge: "DESIGNED FOR WOMEN",
      category: "Women's Wellness",
      parametersCount: 72,
      mrp: 3499,
      price: 1399,
      b2bCost: 720,
      discountPercent: 60,
      fastingHours: 10,
      sampleType: "Blood",
      tat: "Reports in 24 Hours",
      tags: ["PCOD & Thyroid Check", "Iron & Ferritin Panel", "Vitamin Vitality"],
      subPackages: [
        { title: "Thyroid & Hormone Balance", count: 4, tests: ["TSH Ultrasensitive", "Total T3", "Total T4", "Prolactin Hormone"] },
        { title: "Anemia & Iron Stores Profile", count: 5, tests: ["Serum Iron", "Ferritin Level", "Total Iron Binding Capacity (TIBC)", "Transferrin Saturation"] },
        { title: "Bone & Energy Vitamins", count: 3, tests: ["Vitamin D (25-OH)", "Vitamin B12", "Calcium Total"] },
        { title: "Essential Body Screen", count: 60, tests: ["CBC 26 parameters", "Liver Screen", "Kidney Screen", "Cholesterol Screen"] }
      ]
    }
  ] as HealthPackage[],

  orders: [
    {
      id: "TB2026849102",
      patientName: "Shubhranshu Kumar",
      patientPhone: "9876543210",
      patientAge: 32,
      patientGender: "Male",
      patientRelation: "Self",
      itemName: "Vitamin D (25-OH Total)",
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
      createdAt: "2026-10-02 18:30"
    },
    {
      id: "TB2026710492",
      patientName: "KM Babita",
      patientPhone: "9506386371",
      patientAge: 29,
      patientGender: "Female",
      patientRelation: "Spouse",
      itemName: "HealthShield Complete Full Body Checkup (84 Parameters)",
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
      createdAt: "2026-10-01 07:15"
    }
  ] as Order[]
};

export const DATA = DB;
