import type {
  AuditLog,
  AuditEntity,
  ComplianceAlert,
  CqcQuestionId,
  DocumentationGaps,
  IncidentResponseStats,
  PackRecord,
  PackSection,
  ReadinessFactor,
  ScoreHistoryPoint,
  SignatureItem,
  TrainingIssues,
} from "types";

export const COMPLIANCE_MOCK_TODAY = new Date(2026, 9, 14);

export const daysFromToday = (days: number): Date => {
  const d = new Date(COMPLIANCE_MOCK_TODAY);
  d.setDate(d.getDate() + days);
  return d;
};

const at = (dayOffset: number, hhmm: string): Date => {
  const d = daysFromToday(dayOffset);
  const [h, m] = hhmm.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  return d;
};

const shortDay = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });

// ---- CQC readiness: the 8 inputs from Blueprint 3.4.1 ----
export const mockReadinessFactors: ReadinessFactor[] = [
  { id: "care-plans", label: "Care plan completeness", description: "Patients with current, reviewed and approved care plans", score: 88, weight: 15, questions: ["effective", "caring", "responsive"], detail: "125 of 142 patients have an approved, in-date plan", href: "/care-plans" },
  { id: "risk-assessments", label: "Risk assessment coverage", description: "Assessments that are up to date", score: 95, weight: 12, questions: ["safe", "effective"], detail: "135 of 142 assessments reviewed in the last 12 months", href: "/patients" },
  { id: "documentation", label: "Documentation timeliness", description: "Daily notes recorded during or straight after visits", score: 76, weight: 12, questions: ["effective", "well-led", "responsive"], detail: "5 notes recorded more than 2 hours after the visit", href: "/scheduling" },
  { id: "incident-response", label: "Incident response times", description: "How quickly incidents are investigated and closed", score: 82, weight: 12, questions: ["responsive", "safe"], detail: "Average first response 4.2h (target under 6h)", href: "/incidents" },
  { id: "training", label: "Training compliance", description: "Staff who have completed all mandatory training", score: 72, weight: 15, questions: ["safe", "effective", "well-led"], detail: "3 expired and 5 expiring certificates", href: "/staff" },
  { id: "dbs", label: "DBS status", description: "DBS checks that are current", score: 94, weight: 10, questions: ["safe", "well-led"], detail: "1 DBS check expiring within 30 days", href: "/staff" },
  { id: "supervision", label: "Supervision records", description: "Supervisions happening on schedule", score: 74, weight: 12, questions: ["well-led", "caring"], detail: "4 staff are overdue a supervision", href: "/staff" },
  { id: "medication", label: "Medication audit", description: "Medication administration accuracy rate", score: 97, weight: 12, questions: ["safe", "caring"], detail: "4 missing MAR entries in the last 7 days", href: "/medications" },
];

export const mockQuestionImprovements: Record<CqcQuestionId, string[]> = {
  safe: ["Renew expired training certificates", "Keep DBS renewals ahead of expiry"],
  effective: ["Record daily notes during or straight after visits", "Clear overdue care plan reviews"],
  caring: ["Complete overdue supervisions", "Evidence annual consent reviews"],
  responsive: ["Improve response times to urgent care requests", "Reduce wait times for care plan reviews", "Enhance communication with families"],
  "well-led": ["Strengthen governance framework", "Improve staff retention rates", "Enhance incident reporting culture", "Regular management meetings required"],
};

export const mockDocumentationGaps: DocumentationGaps = { unsignedPlans: 3, missingMAR: 4, lateNotes: 5 };
export const mockTrainingIssues: TrainingIssues = { expired: 3, expiringSoon: 5 };
export const mockIncidentResponse: IncidentResponseStats = { avgResponseHours: 4.2, openInvestigations: 2, target: "<6h" };

// 12 months ending Oct 2026. The last point is replaced by the calculated score in utils (buildScoreTrend).
export const mockScoreHistory: ScoreHistoryPoint[] = [
  { month: "Nov", overall: 66, responsive: 62 }, { month: "Dec", overall: 68, responsive: 63 },
  { month: "Jan", overall: 70, responsive: 66 }, { month: "Feb", overall: 72, responsive: 68 },
  { month: "Mar", overall: 74, responsive: 70 }, { month: "Apr", overall: 76, responsive: 72 },
  { month: "May", overall: 77, responsive: 74 }, { month: "Jun", overall: 79, responsive: 75 },
  { month: "Jul", overall: 80, responsive: 77 }, { month: "Aug", overall: 81, responsive: 78 },
  { month: "Sep", overall: 83, responsive: 80 }, { month: "Oct", overall: 84, responsive: 82 },
];

// ---- Alerts ----
export const mockAlerts: ComplianceAlert[] = [
  { id: "al-1", type: "training", title: "Safeguarding training expired", description: "Mark Davis · Expired 3 days ago", assignedTo: "Mark Davis", dueLabel: "3 days ago", severity: "urgent", href: "/staff", resolved: false },
  { id: "al-2", type: "document", title: "3 care plans unsigned", description: "Awaiting RM sign-off", severity: "urgent", href: "/care-plans", resolved: false },
  { id: "al-3", type: "dbs", title: "DBS expiring — Lucy C.", description: `Expires ${shortDay(daysFromToday(14))} · 14 days`, assignedTo: "Lucy C.", dueLabel: "14 days", severity: "warning", href: "/staff", resolved: false },
  { id: "al-4", type: "mar", title: "4 MAR entries missing", description: "Yesterday's evening round", severity: "warning", href: "/medications", resolved: false },
  { id: "al-5", type: "note", title: "5 notes recorded late", description: "Submitted >2hrs after visit", severity: "warning", href: "/scheduling", resolved: false },
  { id: "al-6", type: "supervision", title: "Supervisions due — 4 staff", description: `Due by ${shortDay(daysFromToday(16))}`, dueLabel: shortDay(daysFromToday(16)), severity: "info", href: "/staff", resolved: false },
];

// ---- Audit trail ----
type LogSeed = [number, string, string, string, string, AuditEntity, string?, string?, string?, string?, string?];
const LOG_SEEDS: LogSeed[] = [
  [0, "09:42", "Care plan reviewed", "Margaret Johnson · Personal care v4", "Sarah W.", "Plan", "Margaret Johnson", "Office", "Chrome / Windows", "192.168.1.42", "Reviewed and approved personal care plan v4. No changes required."],
  [0, "09:28", "Visit completed", "Lucy C. checked out · Arthur Wilson", "Lucy C.", "Visit", "Arthur Wilson", "14 Elm St", "Mobile / iOS", "10.0.0.15", "Visit completed on time. Patient in good spirits. Medication given."],
  [0, "09:15", "Medication administered", "Paracetamol 500mg · Robert Ahmed", "Priya P.", "MAR", "Robert Ahmed", "42 Elm St", "Mobile / Android", "10.0.0.22", "Paracetamol 500mg administered as prescribed. Patient tolerated well."],
  [0, "09:01", "Incident reported", "Safeguarding concern · Edna Morris", "Sarah W.", "Incident", "Edna Morris", "7 Oak Ave", "Chrome / Windows", "192.168.1.42", "Concern raised. Manager notified immediately. Incident ref #INC-2026-041."],
  [0, "08:47", "Risk assessment updated", "Falls risk → High · Dorothy Chen", "Emma C.", "Risk", "Dorothy Chen", "Office", "Chrome / Mac", "192.168.1.10", "Falls risk escalated to High following a recent near-miss. Care plan updated."],
  [0, "08:30", "Digital signature added", "Consent form · Barbara Williams", "Emma C.", "Signature", "Barbara Williams", "Office", "Chrome / Mac", "192.168.1.10", "Consent form for data sharing signed electronically. Timestamp verified."],
  [0, "08:12", "Care plan approved", "Henry Smith · Mobility v2", "Emma C.", "Plan", "Henry Smith", "Office", "Chrome / Mac", "192.168.1.10", "Mobility care plan v2 approved after multidisciplinary review."],
  [0, "07:58", "Medication omitted", "Metformin 500mg · Robert Ahmed (refused)", "Priya P.", "MAR", "Robert Ahmed", "42 Elm St", "Mobile / Android", "10.0.0.22", "Patient refused Metformin 500mg. GP notified. Next dose scheduled as normal."],
  [-1, "17:40", "Visit completed", "Sarah W. checked out · Dorothy Chen", "Sarah W.", "Visit", "Dorothy Chen", "3 Mill Rd", "Mobile / iOS", "10.0.0.31", "Evening visit completed. Fluids encouraged."],
  [-1, "16:05", "Care plan updated", "Edna Morris · Nutrition v2", "Emma C.", "Plan", "Edna Morris", "Office", "Chrome / Mac", "192.168.1.10", "Nutrition plan updated after dietitian review."],
  [-1, "12:20", "Medication administered", "Ramipril 5mg · Henry Smith", "Lucy C.", "MAR", "Henry Smith", "9 Park Ln", "Mobile / iOS", "10.0.0.15", "Administered as prescribed."],
  [-2, "14:10", "Digital signature added", "Care plan · Arthur Wilson", "Sarah W.", "Signature", "Arthur Wilson", "Office", "Chrome / Windows", "192.168.1.42", "Care plan signed by registered manager."],
  [-3, "10:30", "Incident reported", "Missed visit · James Okafor", "Emma C.", "Incident", "James Okafor", "Office", "Chrome / Mac", "192.168.1.10", "Carer delayed by traffic. Family informed; visit rescheduled."],
  [-3, "09:05", "Risk assessment updated", "Moving & handling · Susan Taylor", "Priya P.", "Risk", "Susan Taylor", "21 High St", "Mobile / Android", "10.0.0.22", "Hoist added to moving and handling assessment."],
  [-5, "15:45", "Care plan reviewed", "Patricia Smith · Medication v3", "Emma C.", "Plan", "Patricia Smith", "Office", "Chrome / Mac", "192.168.1.10", "Quarterly review complete."],
  [-6, "11:15", "Visit completed", "Lucy C. checked out · Margaret Johnson", "Lucy C.", "Visit", "Margaret Johnson", "5 Cedar Cl", "Mobile / iOS", "10.0.0.15", "Personal care completed."],
];

export const mockAuditLogs: AuditLog[] = LOG_SEEDS.map(
  ([day, time, action, details, user, entity, patient, location, device, ipAddress, notes], i) => ({
    id: i + 1, timestamp: at(day, time), action, details, user, entity, patient, location, device, ipAddress, notes,
  }),
);

// ---- Digital signatures ----
export const mockSignatures: SignatureItem[] = [
  { id: "sg-1", document: "Personal Care Plan v4", patient: "Margaret Johnson", type: "Care Plan", assignedTo: "Emma C.", dueDate: at(0, "17:00"), status: "signed", signedAt: at(0, "09:42"), signedBy: "Emma C." },
  { id: "sg-2", document: "Medication Authorisation", patient: "Robert Ahmed", type: "Medication Auth", assignedTo: "Priya P.", dueDate: at(0, "17:00"), status: "pending" },
  { id: "sg-3", document: "Consent Form — Data Sharing", patient: "Barbara Williams", type: "Consent Form", assignedTo: "Emma C.", dueDate: at(0, "17:00"), status: "signed", signedAt: at(0, "08:30"), signedBy: "Emma C." },
  { id: "sg-4", document: "Mobility Care Plan v2", patient: "Henry Smith", type: "Care Plan", assignedTo: "Emma C.", dueDate: at(-1, "17:00"), status: "overdue" },
  { id: "sg-5", document: "End-of-Life Care Plan", patient: "Dorothy Chen", type: "Care Plan", assignedTo: "Sarah W.", dueDate: at(1, "17:00"), status: "pending" },
  { id: "sg-6", document: "Consent Form — Family Access", patient: "Arthur Wilson", type: "Consent Form", assignedTo: "Emma C.", dueDate: at(4, "17:00"), status: "pending" },
];

// ---- Inspection pack (3.4.4): the six evidence sections from the blueprint ----
export const mockPackSections: PackSection[] = [
  { id: "staff-files", label: "Staff files", description: "Training records, DBS status and supervision history for every carer", pages: 68 },
  { id: "patient-files", label: "Patient files", description: "Care plans, risk assessments, daily notes and incident reports", pages: 112 },
  { id: "compliance-dashboard", label: "Compliance dashboard", description: "Snapshot of your CQC readiness score with drill-down evidence", pages: 12 },
  { id: "policies", label: "Policies and procedures", description: "Your uploaded policy documents", pages: 24 },
  { id: "complaints", label: "Complaints log", description: "Complaints received, investigated and resolved", pages: 9 },
  { id: "quality-assurance", label: "Quality assurance", description: "Spot checks, medication audits and care plan audits", pages: 22 },
];

export const mockLastPack: PackRecord = {
  generatedAt: daysFromToday(-12),
  pageCount: 247,
  sections: mockPackSections.map((s) => s.id),
};

export const COMPLIANCE_OWNERS = ["Emma C.", "Sarah W.", "Priya P.", "Lucy C.", "Mark Davis"];
