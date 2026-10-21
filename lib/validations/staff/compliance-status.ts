import { FIRST_SUPERVISION_DAYS } from "types";
import type {
  ComplianceBreakdown,
  ComplianceResult,
  ComplianceStatus,
  StaffFormData,
} from "types";

export function addDaysToIsoDate(isoDate: string, days: number): string {
  if (!isoDate) return "";
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return "";
  parsed.setDate(parsed.getDate() + days);
  return parsed.toISOString().slice(0, 10);
}

export function isExpired(dateIso: string, today = new Date()): boolean {
  if (!dateIso) return false;
  const parsed = new Date(dateIso);
  if (Number.isNaN(parsed.getTime())) return false;
  const todayUtc = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  return parsed.getTime() < todayUtc;
}

export function computeCompliance(
  data: StaffFormData,
  today = new Date()
): ComplianceResult {
  const breakdown = computeBreakdown(data, today);
  const complianceStatus = resolveStatus(data, breakdown);

  return {
    complianceStatus,
    canBeScheduled: complianceStatus === "green" && breakdown.training,
    firstSupervisionDate: addDaysToIsoDate(
      data.startDate,
      FIRST_SUPERVISION_DAYS
    ),
    breakdown,
  };
}

function computeBreakdown(
  data: StaffFormData,
  today: Date
): ComplianceBreakdown {
  const rightToWork = Boolean(
    data.rightToWork.checkType &&
      data.rightToWork.checkDate &&
      data.rightToWork.documentType &&
      !isExpired(data.rightToWork.documentExpiryDate ?? "", today)
  );

  const dbsRecorded = Boolean(data.dbs.status && data.dbs.expiryDate);
  const dbsClear =
    (data.dbs.status === "clear" ||
      data.dbs.status === "temporarily_verified") &&
    !isExpired(data.dbs.expiryDate, today);

  const driving = data.driving.hasLicence
    ? Boolean(data.driving.licenceNumber && data.driving.travelMode)
    : Boolean(data.driving.travelMode);

  const training =
    data.mandatoryTraining.length > 0 &&
    data.mandatoryTraining.every((record) => record.status === "completed");

  const references =
    data.referees.length >= 2 &&
    data.referees.every((referee) => referee.referenceReceived);

  return {
    rightToWork,
    dbs: dbsRecorded && data.dbs.status !== "flagged_for_review",
    dbsClear,
    driving,
    training,
    references,
    documents: data.documents.some(
      (document) => document.type === "contract"
    ),
  };
}

function resolveStatus(
  data: StaffFormData,
  breakdown: ComplianceBreakdown
): ComplianceStatus {
  if (!breakdown.rightToWork || data.dbs.status === "flagged_for_review") {
    return "red";
  }

  if (
    !breakdown.dbs ||
    !breakdown.dbsClear ||
    !breakdown.driving ||
    !breakdown.references
  ) {
    return "amber";
  }

  return "green";
}
