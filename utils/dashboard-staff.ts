import type { BadgeProps } from "@/components/ui";
import { canAccess } from "./dashboard-helpers";


export type ShiftStatus = "active" | "break" | "en-route";

export interface CarerOnShiftDTO {
  id: string;
  name: string;
  avatar?: string | null;
  status?: ShiftStatus;
}

export interface OnShiftResponse {
  total: number; 
  carers: CarerOnShiftDTO[]; 
}

export interface StaffSnapshotResponse {
  onShift: number;
  available: number;
  onLeave: number;
}

export const canSeeStaff = (role: string) => canAccess(role, "staff");


const CARER_BADGE_VARIANTS: BadgeProps["variant"][] = [
  "pastel-success",
  "pastel-warning",
  "pastel-info",
  "pastel-danger",
  "pastel-purple",
  "pastel-pink",
  "pastel-indigo",
  "pastel-teal",
  "pastel-orange",
  "pastel-cyan",
  "pastel-lime",
  "pastel-amber",
  "pastel-emerald",
  "pastel-rose",
];

export function getCarerBadgeVariant(id: string): BadgeProps["variant"] {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return CARER_BADGE_VARIANTS[hash % CARER_BADGE_VARIANTS.length];
}


export type SnapshotTone = "success" | "info" | "muted";

const SNAPSHOT_SEGMENTS: {
  key: keyof StaffSnapshotResponse;
  label: string;
  tone: SnapshotTone;
}[] = [
  { key: "onShift", label: "On Shift", tone: "success" },
  { key: "available", label: "Available", tone: "info" },
  { key: "onLeave", label: "On Leave", tone: "muted" },
];

export interface SnapshotSegment {
  key: string;
  label: string;
  tone: SnapshotTone;
  value: number;
  percent: number; 
}

export function buildSnapshotSegments(data: StaffSnapshotResponse): SnapshotSegment[] {
  const total = SNAPSHOT_SEGMENTS.reduce((sum, s) => sum + (data[s.key] ?? 0), 0);

  return SNAPSHOT_SEGMENTS.map((s) => {
    const value = data[s.key] ?? 0;
    return {
      key: s.key,
      label: s.label,
      tone: s.tone,
      value,
      percent: total > 0 ? (value / total) * 100 : 0,
    };
  });
}