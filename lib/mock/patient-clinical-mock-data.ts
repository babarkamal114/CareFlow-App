import type { PatientDailyNote, PatientRiskAssessment } from "types";

export const MOCK_PATIENT_NOTES: PatientDailyNote[] = [
  { id: "n1", patientId: "1", date: "2026-10-12", time: "09:15", author: "Sarah Johnson", domain: "mood", content: "Bright and chatty this morning, looking forward to her granddaughter visiting at the weekend." },
  { id: "n2", patientId: "1", date: "2026-10-12", time: "09:20", author: "Sarah Johnson", domain: "nutrition", content: "Ate full breakfast, porridge and tea. Good appetite today." },
  { id: "n3", patientId: "1", date: "2026-10-12", time: "09:30", author: "Sarah Johnson", domain: "mobility", content: "Used walking frame to move to the bathroom, steady but slow. No signs of unsteadiness." },
  { id: "n4", patientId: "1", date: "2026-10-11", time: "18:05", author: "Emma Williams", domain: "skin", content: "Small area of redness noted on left heel. Advised to monitor, no open skin.", flagged: true },
  { id: "n5", patientId: "1", date: "2026-10-11", time: "18:10", author: "Emma Williams", domain: "concern", content: "Mentioned feeling dizzy briefly when standing. Reported to coordinator for GP follow-up.", flagged: true },
  { id: "n6", patientId: "1", date: "2026-10-10", time: "12:40", author: "Sarah Johnson", domain: "social", content: "Enjoyed a long phone call with her son. Talked about the garden birds." },
  { id: "n7", patientId: "7", date: "2026-10-12", time: "08:20", author: "Lisa Garcia", domain: "mobility", content: "Tremor stronger than usual. Needed support to stand from the chair.", flagged: true },
  { id: "n8", patientId: "7", date: "2026-10-11", time: "10:15", author: "Lisa Garcia", domain: "nutrition", content: "Ate a small lunch. Needed encouragement to drink fluids." },
];

export const MOCK_PATIENT_RISK_ASSESSMENTS: PatientRiskAssessment[] = [
  {
    id: "r1", patientId: "1", type: "falls", date: "2026-10-01", assessor: "Sarah Johnson",
    score: 10, riskLevel: "medium", nextReview: "2026-11-01", status: "active",
    findings: [
      { factor: "Previous falls", score: 3 },
      { factor: "Walking aid required", score: 2 },
      { factor: "Unsteady gait", score: 2 },
      { factor: "Poor vision", score: 1 },
      { factor: "Medication side effects", score: 2 },
    ],
    interventions: ["Review medications with GP", "Ophthalmology referral", "Install grab rails in bathroom"],
  },
  {
    id: "r2", patientId: "1", type: "nutrition", date: "2026-10-03", assessor: "Emma Williams",
    score: 8, riskLevel: "medium", nextReview: "2026-11-03", status: "active",
    findings: [
      { factor: "Weight loss > 5%", score: 2 },
      { factor: "Poor appetite", score: 2 },
      { factor: "Difficulty chewing", score: 2 },
      { factor: "BMI < 18.5", score: 2 },
    ],
    interventions: ["Refer to dietitian", "Provide fortified foods", "Monitor weight weekly"],
  },
  {
    id: "r3", patientId: "1", type: "pressure-ulcer", date: "2026-09-25", assessor: "Dr. James Wilson",
    score: 12, riskLevel: "high", nextReview: "2026-10-25", status: "active",
    findings: [
      { factor: "Reduced mobility", score: 3 },
      { factor: "Incontinence", score: 2 },
      { factor: "Poor nutrition", score: 2 },
      { factor: "Skin condition", score: 3 },
      { factor: "Friction/shear", score: 2 },
    ],
    interventions: ["Pressure-relieving mattress", "Reposition every 2 hours", "Daily skin inspection"],
  },
  {
    id: "r4", patientId: "1", type: "medication", date: "2026-09-18", assessor: "Sarah Johnson",
    score: 4, riskLevel: "low", nextReview: "2026-12-18", status: "reviewed",
    findings: [
      { factor: "Number of medications", score: 2 },
      { factor: "Controlled drug in use", score: 2 },
    ],
    interventions: ["Monthly MAR audit", "Dual-witness for controlled drugs"],
  },
  {
    id: "r5", patientId: "7", type: "falls", date: "2026-09-20", assessor: "Lisa Garcia",
    score: 13, riskLevel: "high", nextReview: "2026-10-18", status: "active",
    findings: [
      { factor: "Two falls in last 3 months", score: 4 },
      { factor: "Parkinson's gait changes", score: 3 },
      { factor: "Blood thinner (bleed risk)", score: 3 },
      { factor: "Poor vision", score: 1 },
      { factor: "Walking aid required", score: 2 },
    ],
    interventions: ["Occupational therapy referral", "Bed sensor installed", "Night-time lighting"],
  },
];