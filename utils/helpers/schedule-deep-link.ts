export const SCHEDULING_PATH = "/scheduling";

export function getScheduleAddVisitUrl(patientId: string): string {
  const params = new URLSearchParams({ patientId, action: "add" });
  return `${SCHEDULING_PATH}?${params.toString()}`;
}