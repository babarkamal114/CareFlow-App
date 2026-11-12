export const CARE_PLANS_PATH = "/care-plans";

export function getCarePlanAddUrl(patientId: string): string {
  const params = new URLSearchParams({ patientId, action: "add" });
  return `${CARE_PLANS_PATH}?${params.toString()}`;
}