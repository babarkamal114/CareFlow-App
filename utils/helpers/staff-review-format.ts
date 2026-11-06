import type { StaffFormData } from "types";
import { formatDate } from "./date-utils";

/** Review surfaces show an em dash instead of the global "N/A" fallback. */
export function formatStaffDate(
  value: Date | string | null | undefined
): string {
  if (!value) return "—";
  return formatDate(value);
}

export function formatStaffAddress(data: StaffFormData): string {
  const { line1, line2, city, postcode } = data.address;
  const formatted = [line1, line2, city, postcode].filter(Boolean).join(", ");
  return formatted || "—";
}

export function formatStaffList(values: string[]): string {
  if (values.length === 0) return "—";
  if (values.length === 1) return values[0];
  return `${values.slice(0, -1).join(", ")} & ${values[values.length - 1]}`;
}

export function formatStaffPayRate(
  rate: number | ""
): string {
  if (rate === "") return "—";
  return `£${Number(rate).toFixed(2)} / hour`;
}

export function formatStaffHours(hours: number | ""): string {
  if (hours === "") return "—";
  return `${hours} hrs / week`;
}
