import type { BadgeProps } from "@/components/ui";

export interface PatientCommunicationInfo {
  preferredLanguage?: string;
  hearingImpairment?: string;
  visionImpairment?: string;
  mentalCapacity?: string;
  hearingAids?: boolean;
  glasses?: boolean;
  pictureBoard?: boolean;
  interpreter?: boolean;
  communicationNotes?: string;
  poaName?: string;
  poaRelationship?: string;
  poaPhone?: string;
}

type BadgeInfo = { variant: BadgeProps["variant"]; label: string };

const CAPACITY_BADGES: Record<string, BadgeInfo> = {
  full: { variant: "pastel-success", label: "Full Capacity" },
  partial: { variant: "pastel-warning", label: "Partial Capacity" },
};

const LACKS_CAPACITY: BadgeInfo = { variant: "pastel-danger", label: "Lacks Capacity" };

export function getCapacityBadge(capacity: string): BadgeInfo {
  return CAPACITY_BADGES[capacity] ?? LACKS_CAPACITY;
}

export function hasImpairment(value?: string): boolean {
  return !!value && value !== "none";
}

const AIDS = [
  { key: "hearingAids", label: "Hearing Aids" },
  { key: "glasses", label: "Glasses" },
  { key: "pictureBoard", label: "Picture Board" },
  { key: "interpreter", label: "Interpreter Needed" },
] as const;

export function getCommunicationAids(info: PatientCommunicationInfo): string[] {
  return AIDS.filter(({ key }) => info[key]).map(({ label }) => label);
}

export function hasCommunicationInfo(info: PatientCommunicationInfo): boolean {
  return (
    !!info.preferredLanguage ||
    hasImpairment(info.hearingImpairment) ||
    hasImpairment(info.visionImpairment) ||
    !!info.mentalCapacity ||
    getCommunicationAids(info).length > 0 ||
    !!info.communicationNotes ||
    !!(info.poaName || info.poaRelationship || info.poaPhone)
  );
}