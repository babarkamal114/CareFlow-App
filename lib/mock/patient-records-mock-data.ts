import type {
  PatientActivity,
  PatientDocument,
  PatientMedication,
} from "types";

export const MOCK_PATIENT_MEDICATIONS: Array<
  PatientMedication & { patientId: string }
> = [
  { patientId: "1", id: "m1", name: "Lisinopril", dosage: "10mg", frequency: "Once daily", timing: "Morning", route: "Oral", indication: "Hypertension", prescriber: "Dr. Sarah Ahmed", startDate: "2024-01-15", medicationType: "regular", instructions: "Take with water, avoid grapefruit" },
  { patientId: "1", id: "m2", name: "Metformin", dosage: "500mg", frequency: "Twice daily", timing: "With meals", route: "Oral", indication: "Type 2 Diabetes", prescriber: "Dr. Sarah Ahmed", startDate: "2023-11-20", medicationType: "regular", instructions: "" },
  { patientId: "1", id: "m3", name: "Amlodipine", dosage: "5mg", frequency: "Once daily", timing: "Evening", route: "Oral", indication: "Hypertension", prescriber: "Dr. James Wilson", startDate: "2024-02-01", medicationType: "regular", instructions: "" },
  { patientId: "1", id: "m4", name: "Paracetamol", dosage: "500mg", frequency: "Up to 4x daily", timing: "As needed", route: "Oral", indication: "Pain relief", prescriber: "Dr. James Wilson", startDate: "2024-01-05", medicationType: "prn", instructions: "Do not exceed 8 tablets in 24 hours" },
  { patientId: "1", id: "m5", name: "Morphine Sulfate", dosage: "10mg", frequency: "Every 4 hours", timing: "As directed", route: "Oral", indication: "Severe pain management", prescriber: "Dr. Sarah Ahmed", startDate: "2026-03-01", medicationType: "controlled", instructions: "Dual-witness administration required. Log stock balance after each dose." },
  { patientId: "2", id: "m6", name: "Metformin", dosage: "1g", frequency: "Twice daily", timing: "With meals", route: "Oral", indication: "Type 2 Diabetes", prescriber: "Dr. David Patel", startDate: "2024-06-10", medicationType: "regular", instructions: "" },
  { patientId: "2", id: "m7", name: "Ibuprofen gel", dosage: "5%", frequency: "Up to 3x daily", timing: "As needed", route: "Topical", indication: "Back pain", prescriber: "Dr. David Patel", startDate: "2025-02-14", medicationType: "prn", instructions: "Apply thinly to lower back" },
  { patientId: "7", id: "m8", name: "Co-careldopa", dosage: "25/100mg", frequency: "Three times daily", timing: "Before meals", route: "Oral", indication: "Parkinson's disease", prescriber: "Dr. Neil Carter", startDate: "2020-07-01", medicationType: "regular", instructions: "Keep timings consistent" },
  { patientId: "7", id: "m9", name: "Apixaban", dosage: "5mg", frequency: "Twice daily", timing: "Morning and evening", route: "Oral", indication: "Atrial fibrillation", prescriber: "Dr. Neil Carter", startDate: "2021-11-02", medicationType: "regular", instructions: "Report any bleeding or bruising" },
];

export const MOCK_PATIENT_ACTIVITY: PatientActivity[] = [
  { id: "a1", patientId: "1", carer: "Sarah Johnson", activity: "Morning medication administered", time: "2026-10-12T08:30:00", type: "medication" },
  { id: "a2", patientId: "1", carer: "Sarah Johnson", activity: "Breakfast prepared and served", time: "2026-10-12T09:00:00", type: "meal" },
  { id: "a3", patientId: "1", carer: "Michael Chen", activity: "Vitals checked - BP: 120/80", time: "2026-10-11T11:30:00", type: "vital" },
  { id: "a4", patientId: "1", carer: "Sarah Johnson", activity: "Lunch prepared and served", time: "2026-10-11T13:00:00", type: "meal" },
  { id: "a5", patientId: "1", carer: "Emma Williams", activity: "Physical therapy session completed", time: "2026-10-10T15:30:00", type: "therapy" },
  { id: "a6", patientId: "2", carer: "Michael Chen", activity: "Blood glucose checked - 7.2 mmol/L", time: "2026-10-12T09:15:00", type: "vital" },
  { id: "a7", patientId: "2", carer: "Michael Chen", activity: "Morning medication administered", time: "2026-10-12T09:30:00", type: "medication" },
  { id: "a8", patientId: "7", carer: "Lisa Garcia", activity: "Morning medication administered on time", time: "2026-10-12T08:05:00", type: "medication" },
  { id: "a9", patientId: "7", carer: "Lisa Garcia", activity: "Assisted with walking exercises", time: "2026-10-11T10:00:00", type: "therapy" },
];

export const MOCK_PATIENT_DOCUMENTS: PatientDocument[] = [
  { id: "d1", patientId: "1", name: "Care Plan - September 2026", docType: "care-plan", uploadedDate: "2026-09-01", size: "2.4 MB" },
  { id: "d2", patientId: "1", name: "Hospital Discharge Summary - Jan 2026", docType: "discharge-summary", uploadedDate: "2026-01-12", size: "1.8 MB" },
  { id: "d3", patientId: "1", name: "Medication List - Current", docType: "medication-list", uploadedDate: "2026-09-10", size: "456 KB" },
  { id: "d4", patientId: "1", name: "Power of Attorney - Registered", docType: "poa", uploadedDate: "2024-02-15", size: "892 KB" },
  { id: "d5", patientId: "2", name: "Care Plan - August 2026", docType: "care-plan", uploadedDate: "2026-08-04", size: "2.1 MB" },
  { id: "d6", patientId: "3", name: "Capacity Assessment", docType: "capacity-assessment", uploadedDate: "2026-09-25", size: "640 KB" },
  { id: "d7", patientId: "3", name: "DNAR Order", docType: "dnar", uploadedDate: "2026-09-25", size: "310 KB" },
];