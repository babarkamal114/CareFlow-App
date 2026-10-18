import type {
  IncidentEvidence,
  IncidentFormData,
  InjuryDetail,
} from "types";
import {
  INCIDENT_REPORT_STEPS,
  INCIDENT_SEVERITY_OPTIONS,
  INCIDENT_TYPE_OPTIONS,
  incidentSeverityConfig,
} from "./constants";

export type IncidentMarking = NonNullable<
  IncidentFormData["bodyMapData"]
>["markings"][number];

let formIdCounter = 0;

function createFormId(prefix: string): string {
  formIdCounter += 1;
  return `${prefix}-${Date.now()}-${formIdCounter}`;
}



export function createInjuryDetail(): InjuryDetail {
  return {
    id: createFormId("injury"),
    bodyPart: "",
    description: "",
    severity: "minor",
    photoUrls: [],
  };
}

export function createBodyMarking(): IncidentMarking {
  return { id: createFormId("marking"), bodyPart: "", markType: "bruise", notes: "" };
}

export function createIncidentEvidenceItem(
  url: string,
  type: IncidentEvidence["type"],
  uploadedBy: string,
  description?: string
): IncidentEvidence {
  return {
    id: createFormId("evidence"),
    type,
    url,
    uploadedAt: new Date().toISOString(),
    uploadedBy,
    description,
  };
}



export function getBodyMarkings(form: IncidentFormData): IncidentMarking[] {
  return form.bodyMapData?.markings ?? [];
}

export function addBodyMarking(form: IncidentFormData): IncidentFormData {
  return {
    ...form,
    bodyMapData: { markings: [...getBodyMarkings(form), createBodyMarking()] },
  };
}

export function updateBodyMarking(
  form: IncidentFormData,
  index: number,
  patch: Partial<IncidentMarking>
): IncidentFormData {
  return {
    ...form,
    bodyMapData: {
      markings: getBodyMarkings(form).map((marking, i) =>
        i === index ? { ...marking, ...patch } : marking
      ),
    },
  };
}

export function removeBodyMarking(
  form: IncidentFormData,
  index: number
): IncidentFormData {
  return {
    ...form,
    bodyMapData: {
      markings: getBodyMarkings(form).filter((_, i) => i !== index),
    },
  };
}

export function addInjuryDetail(form: IncidentFormData): IncidentFormData {
  return {
    ...form,
    injuriesObserved: true,
    injuryDetails: [...form.injuryDetails, createInjuryDetail()],
  };
}

export function updateInjuryDetail(
  form: IncidentFormData,
  index: number,
  patch: Partial<InjuryDetail>
): IncidentFormData {
  return {
    ...form,
    injuryDetails: form.injuryDetails.map((injury, i) =>
      i === index ? { ...injury, ...patch } : injury
    ),
  };
}

export function removeInjuryDetail(
  form: IncidentFormData,
  index: number
): IncidentFormData {
  return {
    ...form,
    injuryDetails: form.injuryDetails.filter((_, i) => i !== index),
  };
}

export function toggleContributingFactor(
  factors: string[],
  factor: string
): string[] {
  return factors.includes(factor)
    ? factors.filter((f) => f !== factor)
    : [...factors, factor];
}

export function removeEvidenceItem(
  items: IncidentEvidence[],
  id: string
): IncidentEvidence[] {
  return items.filter((item) => item.id !== id);
}



export function isIncidentDetailsValid(form: IncidentFormData): boolean {
  return Boolean(
    form.type &&
      form.severity &&
      form.patientId &&
      form.patientName.trim() &&
      form.dateTime &&
      form.location.trim() &&
      form.reportedByName.trim()
  );
}

export function isIncidentNarrativeValid(form: IncidentFormData): boolean {
  return Boolean(
    form.antecedent.trim() &&
      form.description.trim() &&
      form.consequence.trim()
  );
}

export function isIncidentInjuriesValid(form: IncidentFormData): boolean {
  if (!form.injuriesObserved) return true;
  const hasValidInjury = form.injuryDetails.some(
    (injury) => injury.bodyPart && injury.description.trim()
  );
  const hasInvalidMarking = getBodyMarkings(form).some(
    (marking) => !marking.bodyPart || !marking.markType
  );
  return hasValidInjury && !hasInvalidMarking;
}

export function isIncidentResponseValid(form: IncidentFormData): boolean {
  const needsDeviationReason = form.carePlanFollowed === false;
  const needsEmergencyDetail = form.emergencyServicesCalled;
  return Boolean(
    form.immediateActions.trim() &&
      form.carePlanFollowed !== null &&
      (!needsDeviationReason || form.carePlanDeviationReason?.trim()) &&
      (!needsEmergencyDetail || form.emergencyServicesDetails?.trim())
  );
}

export function isIncidentFollowUpValid(form: IncidentFormData): boolean {
  return Boolean(
    form.contributingFactors.length > 0 && form.followUpPlan.trim()
  );
}

const STEP_VALIDATORS = [
  isIncidentDetailsValid,
  isIncidentNarrativeValid,
  isIncidentInjuriesValid,
  isIncidentResponseValid,
  isIncidentFollowUpValid,
];

export function canAdvanceIncidentStep(
  stepIndex: number,
  form: IncidentFormData
): boolean {
  return STEP_VALIDATORS[stepIndex]?.(form) ?? true;
}

export function getIncidentStepCount(): number {
  return INCIDENT_REPORT_STEPS.length;
}

export function getIncidentStepProgress(stepIndex: number): number {
  return Math.round(((stepIndex + 1) / getIncidentStepCount()) * 100);
}



export function getIncidentTitleFromForm(form: IncidentFormData): string {
  const typeLabel =
    INCIDENT_TYPE_OPTIONS.find((option) => option.value === form.type)?.label ??
    "Incident";
  return form.patientName ? `${typeLabel} - ${form.patientName}` : typeLabel;
}

export function getIncidentDescriptionFromForm(form: IncidentFormData): string {
  return [
    form.antecedent.trim(),
    form.description.trim(),
    form.consequence.trim(),
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function getInjuriesSummary(form: IncidentFormData): string {
  if (!form.injuriesObserved) return "No injuries observed";
  if (form.injuryDetails.length === 0) return "Injuries observed";
  return form.injuryDetails
    .map(
      (injury) =>
        `${injury.bodyPart || "Unspecified"} - ${injury.severity}${
          injury.description ? `: ${injury.description}` : ""
        }`
    )
    .join("; ");
}

export function getFlagsSummary(form: IncidentFormData): string[] {
  const flags: string[] = [];
  if (form.isCqcNotifiable) flags.push("CQC notifiable");
  if (form.isRiddorReportable) flags.push("RIDDOR reportable");
  if (form.isSafeguardingConcern) flags.push("Safeguarding concern");
  return flags;
}

export function getSeveritySummary(form: IncidentFormData): string {
  if (!form.severity) return "-";
  return (
    INCIDENT_SEVERITY_OPTIONS.find((option) => option.value === form.severity)
      ?.label ??
    incidentSeverityConfig[form.severity].label
  );
}