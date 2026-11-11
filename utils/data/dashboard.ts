import type { DashboardActivityPoint, DashboardAlert, DashboardComplianceItem, DashboardCqcOverview, DashboardMapPin, DashboardRevenueSnapshot, DashboardStaffSnapshot, DashboardVisit, DashboardVisitSummary } from "types";
import { mockQuestionImprovements, mockReadinessFactors, mockScoreHistory } from "./compliance";
import { calcOverallScore, calcQuestionScores } from "app-utils/compliance";
import { QUESTION_LABELS } from "app-utils/compliance-display";

export const mockDashboardVisitSummary: DashboardVisitSummary = {
  total: 48,
  completed: 24,
  inProgress: 6,
  late: 3,
  missed: 2,
};
export const mockDashboardVisits: DashboardVisit[] = [
  { id: "dv-1", patientId: "7", patientName: "Arthur Bennett", careType: "Personal Care + Medication", carerName: "Sarah Williams", startTime: "07:00", durationMins: 60, status: "completed" },
  { id: "dv-2", patientId: "4", patientName: "Robert Hayes", careType: "Meal Preparation", carerName: "James O'Connor", startTime: "07:30", durationMins: 45, status: "completed" },
  { id: "dv-3", patientId: "5", patientName: "Sophie Martinez", careType: "Medication", carerName: "Emma Davies", startTime: "08:00", durationMins: 30, status: "completed" },
  { id: "dv-4", patientId: "1", patientName: "Dorothy Chen", careType: "Personal Care", carerName: "Michael Turner", startTime: "08:30", durationMins: 30, status: "missed" },
  { id: "dv-5", patientId: "5", patientName: "Sophie Martinez", careType: "Medication + Meal Preparation", carerName: "Laura Mitchell", startTime: "09:00", durationMins: 45, status: "completed" },
  { id: "dv-6", patientId: "6", patientName: "Tariq Hussain", careType: "Personal Care", carerName: "Priya Patel", startTime: "09:30", durationMins: 60, status: "completed" },
  { id: "dv-7", patientId: "3", patientName: "Edna Morris", careType: "Personal Care + Medication", carerName: "Sarah Williams", startTime: "10:00", durationMins: 60, status: "in-progress" },
  { id: "dv-8", patientId: "2", patientName: "James Okafor", careType: "Medication", carerName: "James O'Connor", startTime: "10:45", durationMins: 30, status: "late", minutesLate: 35 },
  { id: "dv-9", patientId: "7", patientName: "Arthur Bennett", careType: "Companionship", carerName: "Emma Davies", startTime: "11:00", durationMins: 60, status: "in-progress" },
  { id: "dv-10", patientId: "4", patientName: "Robert Hayes", careType: "Medication", carerName: "Laura Mitchell", startTime: "11:30", durationMins: 15, status: "scheduled" },
  { id: "dv-11", patientId: "5", patientName: "Sophie Martinez", careType: "Meal Preparation", carerName: "Priya Patel", startTime: "12:00", durationMins: 45, status: "scheduled" },
  { id: "dv-12", patientId: "6", patientName: "Tariq Hussain", careType: "Personal Care", carerName: "Michael Turner", startTime: "13:00", durationMins: 60, status: "scheduled" },
];
export const mockDashboardMapPins: DashboardMapPin[] = [
  { visitId: "dv-1", lat: 53.4840, lng: -2.2480 },  // Arthur Bennett
  { visitId: "dv-2", lat: 53.4720, lng: -2.2300 },  // Robert Hayes
  { visitId: "dv-3", lat: 53.4950, lng: -2.2200 },  // Sophie Martinez
  { visitId: "dv-4", lat: 53.4610, lng: -2.2650 },  // Dorothy Chen
  { visitId: "dv-5", lat: 53.4950, lng: -2.2200 },  // Sophie Martinez
  { visitId: "dv-6", lat: 53.4780, lng: -2.2100 },  // Tariq Hussain
  { visitId: "dv-7", lat: 53.4900, lng: -2.2700 },  // Edna Morris
  { visitId: "dv-8", lat: 53.4670, lng: -2.2400 },  // James Okafor
  { visitId: "dv-9", lat: 53.4840, lng: -2.2480 },  // Arthur Bennett
  { visitId: "dv-10", lat: 53.4720, lng: -2.2300 }, // Robert Hayes
  { visitId: "dv-11", lat: 53.4950, lng: -2.2200 }, // Sophie Martinez
  { visitId: "dv-12", lat: 53.4780, lng: -2.2100 }, // Tariq Hussain
];
export const mockDashboardAlerts: DashboardAlert[] = [
  { id: "al-1", type: "missed-visit", priority: "high", title: "Missed visit", subject: "Dorothy Chen", detail: "Scheduled 08:30 · No check-in recorded", minutesAgo: 170 },
  { id: "al-2", type: "late-carer", priority: "high", title: "Carer running late", subject: "James Okafor", detail: "Visit at 10:45 · Carer has not checked in", minutesAgo: 35 },
  { id: "al-3", type: "safeguarding", priority: "high", title: "Safeguarding concern", subject: "Edna Morris", detail: "Financial abuse reported · Family member involved", minutesAgo: 60 },
  { id: "al-4", type: "care-plan-overdue", priority: "medium", title: "Care plans overdue", subject: "3 patients", detail: "R. Ahmed, B. Williams, H. Smith · Due yesterday", minutesAgo: 540 },
  { id: "al-5", type: "dbs-expiring", priority: "medium", title: "DBS expiring", subject: "Lucy Chen", detail: "Expires 28 Oct · 14 days remaining", minutesAgo: 600 },
 { id: "al-6", type: "unsigned-document", priority: "low", title: "Unsigned document", subject: "Michael Turner", detail: "Care agreement awaiting signature · 2 days", minutesAgo: 1440 },
];
export const mockDashboardStaffSnapshot: DashboardStaffSnapshot = {
  onShift: 24,
  available: 5,
  onLeave: 2,
};

const complianceQuestions = calcQuestionScores(mockReadinessFactors, mockQuestionImprovements, QUESTION_LABELS);

export const mockDashboardCqc: DashboardCqcOverview = {
  overallScore: calcOverallScore(mockReadinessFactors), // NEW field
  previousOverallScore: mockScoreHistory[mockScoreHistory.length - 2].overall,
  domains: complianceQuestions.map((question) => ({
    key: question.id,
    label: QUESTION_LABELS[question.id],
    score: question.score,
  })),
};

export const mockDashboardRevenue: DashboardRevenueSnapshot = {
  thisMonth: 42500,
  lastMonth: 40400,
  outstanding: 21100,
  outstandingInvoiceCount: 7,
  overdue: 8640,
  overdueInvoiceCount: 3,
};
export const mockDashboardActivity: DashboardActivityPoint[] = [
  { day: "Fri", scheduled: 45, completed: 43, missed: 1 },
  { day: "Sat", scheduled: 38, completed: 37, missed: 1 },
  { day: "Sun", scheduled: 36, completed: 36, missed: 0 },
  { day: "Mon", scheduled: 44, completed: 41, missed: 2 },
  { day: "Tue", scheduled: 46, completed: 44, missed: 1 },
  { day: "Wed", scheduled: 45, completed: 43, missed: 2 },
  { day: "Thu", scheduled: 48, completed: 24, missed: 2 },
];
export const mockDashboardComplianceDue: DashboardComplianceItem[] = [
  { id: "cd-1", kind: "care-plan-review", title: "Care plan review", subject: "Arthur Bennett", dueInDays: -1 },
  { id: "cd-2", kind: "supervision", title: "Supervision due", subject: "Michael Turner", dueInDays: 3 },
  { id: "cd-3", kind: "training", title: "Moving & handling refresher", subject: "6 carers", dueInDays: 5 },
  { id: "cd-4", kind: "dbs", title: "DBS renewal", subject: "Lucy Chen", dueInDays: 14 },
  { id: "cd-5", kind: "policy", title: "Safeguarding policy sign-off", subject: "All staff", dueInDays: 21 },
];