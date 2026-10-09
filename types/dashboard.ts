// ---- Visits ----
export type DashboardVisitStatus = "scheduled" | "in-progress" | "completed" | "late" | "missed";
export type DashboardVisitFilter = DashboardVisitStatus | "all";

export interface DashboardVisit {
  id: string;
  patientName: string;
  careType: string;
  carerName: string;
  startTime: string;
  durationMins: number;
  status: DashboardVisitStatus;
  minutesLate?: number;
}

/** Whole-day totals for the agency (the table below only lists a sample of visits). */
export interface DashboardVisitSummary {
  total: number;
  completed: number;
  inProgress: number;
  late: number;
  missed: number;
}

/** Position of a visit pin on the mock map, as a percentage of the map box. */
export interface DashboardMapPin {
  visitId: string;
  x: number;
  y: number;
}

// ---- Alerts ----
export type DashboardAlertType =
  | "missed-visit"
  | "late-carer"
  | "safeguarding"
  | "care-plan-overdue"
  | "unsigned-document"
  | "dbs-expiring";

export type DashboardAlertPriority = "high" | "medium" | "low";

export interface DashboardAlert {
  id: string;
  type: DashboardAlertType;
  priority: DashboardAlertPriority;
  title: string;
  subject: string;
  detail: string;
  minutesAgo: number;
}

// ---- Staff ----
export interface DashboardStaffSnapshot {
  onShift: number;
  available: number;
  onLeave: number;
}

// ---- CQC ----
export type DashboardCqcKey = "safe" | "effective" | "caring" | "responsive" | "well-led";

export interface DashboardCqcDomain {
  key: DashboardCqcKey;
  label: string;
  score: number;
}

export interface DashboardCqcOverview {
  previousOverallScore: number;
  domains: DashboardCqcDomain[];
}

// ---- Revenue (GBP pounds) ----
export interface DashboardRevenueSnapshot {
  thisMonth: number;
  lastMonth: number;
  outstanding: number;
  outstandingInvoiceCount: number;
  overdue: number;
  overdueInvoiceCount: number;
}

// ---- Weekly activity ----
export interface DashboardActivityPoint {
  day: string;
  scheduled: number;
  completed: number;
  missed: number;
}

// ---- Compliance due ----
export type DashboardComplianceKind = "dbs" | "training" | "care-plan-review" | "supervision" | "policy";

export interface DashboardComplianceItem {
  id: string;
  kind: DashboardComplianceKind;
  title: string;
  subject: string;
  dueInDays: number;
}