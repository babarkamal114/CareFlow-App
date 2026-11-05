export type ComplianceFormErrors = Partial<Record<string, string>>;
export type CqcQuestionId = "safe" | "effective" | "caring" | "responsive" | "well-led";
export type ScoreBand = "good" | "needs-improvement" | "requires-action";
export type ReadinessFactorId =
  | "care-plans" | "risk-assessments" | "documentation" | "incident-response"
  | "training" | "dbs" | "supervision" | "medication";

export interface ReadinessFactor {
  id: ReadinessFactorId;
  label: string;
  description: string;
  score: number; 
  weight: number; 
  questions: CqcQuestionId[]; 
  detail: string;
  href: string;
}

export interface CqcQuestionScore {
  id: CqcQuestionId;
  label: string;
  score: number;
  improvements: string[];
}

export interface DocumentationGaps { unsignedPlans: number; missingMAR: number; lateNotes: number }
export interface TrainingIssues { expired: number; expiringSoon: number }
export interface IncidentResponseStats { avgResponseHours: number; openInvestigations: number; target: string }

export interface ScoreHistoryPoint { month: string; overall: number; responsive: number }

// ---- Alerts ----
export type AlertType = "training" | "document" | "dbs" | "mar" | "note" | "supervision";
export type AlertSeverity = "urgent" | "warning" | "info";

export interface ComplianceAlert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  assignedTo?: string;
  dueLabel?: string;
  severity: AlertSeverity;
  href: string;
  resolved: boolean;
}

// ---- Regulations ----
export type RegStatus = "Compliant" | "Attention" | "Risk" | "N/A";
export type RegCategory = "Safe" | "Effective" | "Caring" | "Responsive" | "Well-Led";

export interface RegAction { id: string; label: string; owner: string; due: string }
export interface RegEvidenceItem { label: string; done: boolean }
export interface RegLinkedItem { label: string; type: string; href: string }

export interface Regulation {
  id: number;
  reg: string;
  title: string;
  description: string;
  category: RegCategory;
  status: RegStatus;
  progress: number;
  lastInspected: string;
  evidenceItems: RegEvidenceItem[];
  actions: RegAction[];
  linkedItems: RegLinkedItem[];
}

export interface RegulationFilters {
  search: string;
  category: RegCategory | "All";
  status: RegStatus | "All";
}

// ---- Audit trail  ----
export type AuditEntity = "Plan" | "Visit" | "MAR" | "Incident" | "Risk" | "Signature";

export interface AuditLog {
  id: number;
  timestamp: Date;
  action: string;
  details: string;
  user: string;
  entity: AuditEntity;
  patient?: string;
  location?: string;
  device?: string;
  ipAddress?: string;
  notes?: string;
}

export interface AuditFilters {
  search: string;
  entity: AuditEntity | "All";
  from: string; // yyyy-MM-dd or ""
  to: string;
}

// ---- Digital signatures  ----
export type SignatureStatus = "signed" | "pending" | "overdue";
export type SignatureDocType = "Care Plan" | "Consent Form" | "Medication Auth";

export interface SignatureItem {
  id: string;
  document: string;
  patient: string;
  type: SignatureDocType;
  assignedTo: string;
  dueDate: Date;
  status: SignatureStatus;
  signedAt?: Date;
  signedBy?: string;
}

// ---- Inspection pack  ----
export type PackSectionId =
  | "staff-files" | "patient-files" | "compliance-dashboard" | "policies" | "complaints" | "quality-assurance";

export interface PackSection { id: PackSectionId; label: string; description: string; pages: number }
export interface PackRecord { generatedAt: Date; pageCount: number; sections: PackSectionId[] }
export type PackStage = "idle" | "running" | "done";

// ---- Forms (zod in lib/validations/compliance) ----
export interface SignDocumentFormData { fullName: string; agreed: boolean }
export interface AssignActionFormData { label: string; owner: string; dueDate: string }
export interface InspectionPackFormData { sections: PackSectionId[]; patientScope: "all" | "selected" }

// ---- Display ----
export type Tone = "success" | "warning" | "error" | "info" | "muted";

// ---- Mock data seeds ----
/** [dayOffset, "HH:mm", action, details, user, entity, patient?, location?, device?, ipAddress?, notes?] */
export type AuditLogSeed = [number, string, string, string, string, AuditEntity, string?, string?, string?, string?, string?];
