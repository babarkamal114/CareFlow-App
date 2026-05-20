// features/patients/index.ts
// Public barrel — everything the app imports from "@/features/patients"

// ── Actions ──────────────────────────────────────────────────────────────────
export { updatePatientDisplayNameAction } from "./actions/update-patient.action";

// ── Components ───────────────────────────────────────────────────────────────
export { PatientDetailPanel } from "./components/patient-detail-panel";
export { PatientList }        from "./components/patient-list";

// ── Query keys ───────────────────────────────────────────────────────────────
export { patientKeys } from "./queries/patient-query-keys";

// ── Types ─────────────────────────────────────────────────────────────────────
export type { PatientDto, PatientUpdateInput } from "./schemas/patient.schema";

// ── Server helpers (used in page.tsx / [patientId]/page.tsx) ─────────────────
export { listPatients, getPatientById } from "./server/get-patient";
