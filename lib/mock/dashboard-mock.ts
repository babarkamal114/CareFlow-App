import type {
  DashboardActivityPoint,
  DashboardAlert,
  DashboardComplianceItem,
  DashboardCqcOverview,
  DashboardMapPin,
  DashboardRevenueSnapshot,
  DashboardStaffSnapshot,
  DashboardVisit,
  DashboardVisitSummary,
} from "types";

/** Fixed "now" so mock statuses and "time ago" labels never drift. Thursday 8 Oct 2026, 11:20. */
export const DASHBOARD_MOCK_NOW = new Date(2026, 9, 8, 11, 20);

// ---- Visits ----
export const mockDashboardVisitSummary: DashboardVisitSummary = {
  total: 48,
  completed: 24,
  inProgress: 6,
  late: 3,
  missed: 2,
};

export const mockDashboardVisits: DashboardVisit[] = [
  { id: "dv-1", patientName: "Margaret Johnson", careType: "Personal Care + Medication", carerName: "Sarah Williams", startTime: "07:00", durationMins: 60, status: "completed" },
  { id: "dv-2", patientName: "Robert Chen", careType: "Meal Preparation", carerName: "James O'Connor", startTime: "07:30", durationMins: 45, status: "completed" },
  { id: "dv-3", patientName: "Patricia Smith", careType: "Medication", carerName: "Emma Davies", startTime: "08:00", durationMins: 30, status: "completed" },
  { id: "dv-4", patientName: "Dorothy Chen", careType: "Personal Care", carerName: "Michael Turner", startTime: "08:30", durationMins: 30, status: "missed" },
  { id: "dv-5", patientName: "Susan Taylor", careType: "Medication + Meal Preparation", carerName: "Laura Mitchell", startTime: "09:00", durationMins: 45, status: "completed" },
  { id: "dv-6", patientName: "David Wilson", careType: "Personal Care", carerName: "Priya Patel", startTime: "09:30", durationMins: 60, status: "completed" },
  { id: "dv-7", patientName: "Edna Morris", careType: "Personal Care + Medication", carerName: "Sarah Williams", startTime: "10:00", durationMins: 60, status: "in-progress" },
  { id: "dv-8", patientName: "James Okafor", careType: "Medication", carerName: "James O'Connor", startTime: "10:45", durationMins: 30, status: "late", minutesLate: 35 },
  { id: "dv-9", patientName: "Margaret Johnson", careType: "Companionship", carerName: "Emma Davies", startTime: "11:00", durationMins: 60, status: "in-progress" },
  { id: "dv-10", patientName: "Robert Chen", careType: "Medication", carerName: "Laura Mitchell", startTime: "11:30", durationMins: 15, status: "scheduled" },
  { id: "dv-11", patientName: "Patricia Smith", careType: "Meal Preparation", carerName: "Priya Patel", startTime: "12:00", durationMins: 45, status: "scheduled" },
  { id: "dv-12", patientName: "David Wilson", careType: "Personal Care", carerName: "Michael Turner", startTime: "13:00", durationMins: 60, status: "scheduled" },
];

export const mockDashboardMapPins: DashboardMapPin[] = [
  { visitId: "dv-1", x: 22, y: 30 },
  { visitId: "dv-2", x: 38, y: 18 },
  { visitId: "dv-3", x: 56, y: 26 },
  { visitId: "dv-4", x: 72, y: 38 },
  { visitId: "dv-5", x: 30, y: 58 },
  { visitId: "dv-6", x: 48, y: 70 },
  { visitId: "dv-7", x: 64, y: 62 },
  { visitId: "dv-8", x: 80, y: 74 },
  { visitId: "dv-9", x: 18, y: 78 },
  { visitId: "dv-10", x: 42, y: 44 },
  { visitId: "dv-11", x: 84, y: 20 },
  { visitId: "dv-12", x: 60, y: 48 },
];

// ---- Alert feed (minutesAgo is relative to DASHBOARD_MOCK_NOW) ----
export const mockDashboardAlerts: DashboardAlert[] = [
  { id: "al-1", type: "missed-visit", priority: "high", title: "Missed visit", subject: "Dorothy Chen", detail: "Scheduled 08:30 · No check-in recorded", minutesAgo: 170 },
  { id: "al-2", type: "late-carer", priority: "high", title: "Carer running late", subject: "James Okafor", detail: "Visit at 10:45 · Carer has not checked in", minutesAgo: 35 },
  { id: "al-3", type: "safeguarding", priority: "high", title: "Safeguarding concern", subject: "Edna Morris", detail: "Financial abuse reported · Family member involved", minutesAgo: 60 },
  { id: "al-4", type: "care-plan-overdue", priority: "medium", title: "Care plans overdue", subject: "3 patients", detail: "R. Ahmed, B. Williams, H. Smith · Due yesterday", minutesAgo: 540 },
  { id: "al-5", type: "dbs-expiring", priority: "medium", title: "DBS expiring", subject: "Lucy Chen", detail: "Expires 22 Oct · 14 days remaining", minutesAgo: 600 },
  { id: "al-6", type: "unsigned-document", priority: "low", title: "Unsigned document", subject: "Michael Turner", detail: "Care agreement awaiting signature · 2 days", minutesAgo: 1440 },
];

// ---- Staff snapshot ----
export const mockDashboardStaffSnapshot: DashboardStaffSnapshot = {
  onShift: 24,
  available: 5,
  onLeave: 2,
};

// ---- CQC readiness (overall score is calculated from the domains) ----
export const mockDashboardCqc: DashboardCqcOverview = {
  previousOverallScore: 82,
  domains: [
    { key: "safe", label: "Safe", score: 82 },
    { key: "effective", label: "Effective", score: 88 },
    { key: "caring", label: "Caring", score: 94 },
    { key: "responsive", label: "Responsive", score: 79 },
    { key: "well-led", label: "Well-led", score: 85 },
  ],
};

// ---- Revenue snapshot (GBP pounds). Static values, no dependency on the finance mock. ----
export const mockDashboardRevenue: DashboardRevenueSnapshot = {
  thisMonth: 42500,
  lastMonth: 40400,
  outstanding: 21100,
  outstandingInvoiceCount: 7,
  overdue: 8640,
  overdueInvoiceCount: 3,
};

// ---- Weekly activity (last 7 days; today is partly done so "completed" is lower) ----
export const mockDashboardActivity: DashboardActivityPoint[] = [
  { day: "Fri", scheduled: 45, completed: 43, missed: 1 },
  { day: "Sat", scheduled: 38, completed: 37, missed: 1 },
  { day: "Sun", scheduled: 36, completed: 36, missed: 0 },
  { day: "Mon", scheduled: 44, completed: 41, missed: 2 },
  { day: "Tue", scheduled: 46, completed: 44, missed: 1 },
  { day: "Wed", scheduled: 45, completed: 43, missed: 2 },
  { day: "Thu", scheduled: 48, completed: 24, missed: 2 },
];

// ---- Compliance due ----
export const mockDashboardComplianceDue: DashboardComplianceItem[] = [
  { id: "cd-1", kind: "care-plan-review", title: "Care plan review", subject: "Margaret Johnson", dueInDays: -1 },
  { id: "cd-2", kind: "supervision", title: "Supervision due", subject: "Michael Turner", dueInDays: 3 },
  { id: "cd-3", kind: "training", title: "Moving & handling refresher", subject: "6 carers", dueInDays: 5 },
  { id: "cd-4", kind: "dbs", title: "DBS renewal", subject: "Lucy Chen", dueInDays: 14 },
  { id: "cd-5", kind: "policy", title: "Safeguarding policy sign-off", subject: "All staff", dueInDays: 21 },
];