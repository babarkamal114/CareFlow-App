export const MEDICATIONS_PATH = "/medications";

export function getMedicationsPageUrl(patientId: string, action?: "add"): string {
  const params = new URLSearchParams({ patientId });
  if (action) params.set("action", action);
  return `${MEDICATIONS_PATH}?${params.toString()}`;
}

export function getMedicationCardId(patientId: string): string {
  return `patient-meds-${patientId}`;
}