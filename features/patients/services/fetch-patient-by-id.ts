// features/patients/services/fetch-patient-by-id.ts
// Client-side fetch — hits the API route, used inside useQuery.
// No changes needed — PatientDto now carries the extra Figma fields.

import type { PatientDto } from "../schemas/patient.schema";

export async function fetchPatientById(id: string): Promise<PatientDto> {
  const res = await fetch(`/api/patients/${id}`);
  if (!res.ok) {
    throw new Error("Failed to load patient");
  }
  return res.json() as Promise<PatientDto>;
}
