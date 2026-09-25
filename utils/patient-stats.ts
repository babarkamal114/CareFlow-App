import { Users, UserPlus, FileText, Calendar } from "lucide-react";
import { StatCardProps } from "types";

export interface PatientStats {
  totalPatients: number;
  totalPatientsTrendPct: number;
  newPatients: number;
  newPatientsCount: number;
  activeCarePlans: number;
  carePlansScore: number;
  visitsToday: number;
  visitsTodayTrendPct: number;
}

const MOCK_PATIENT_STATS: PatientStats = {
  totalPatients: 142,
  totalPatientsTrendPct: 12,
  newPatients: 18,
  newPatientsCount: 8,
  activeCarePlans: 98,
  carePlansScore: 85,
  visitsToday: 48,
  visitsTodayTrendPct: 5,
};

export function fetchPatientStats(): Promise<PatientStats> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(MOCK_PATIENT_STATS);
    }, 600);
  });
}

export function getVisiblePatientStatDefinitions(): string[] {
  return ["total-patients", "new-patients", "active-care-plans", "visits-today"];
}

export function buildPatientStatCards(
  stats: PatientStats
): { id: string; props: StatCardProps }[] {
  return [
    {
      id: "total-patients",
      props: {
        label: "Total Patients",
        Icon: Users,
        value: String(stats.totalPatients),
        description: "Active patients under care",
        showScore: false,
        showTrend: true,
        trend: stats.totalPatientsTrendPct < 0 ? "down" : "up",
        hasCqcScore: false,
        hasValueBadge: true,
        valueBadgeValue: `${Math.abs(stats.totalPatientsTrendPct)}%`,
      },
    },
    {
      id: "new-patients",
      props: {
        label: "New Patients",
        Icon: UserPlus,
        value: String(stats.newPatients),
        description: "Added this month",
        showScore: false,
        showTrend: true,
        trend: stats.newPatientsCount < 0 ? "down" : "up",
        hasCqcScore: false,
        hasValueBadge: true,
        valueBadgeValue: `${Math.abs(stats.newPatientsCount)}`,
      },
    },
    {
      id: "active-care-plans",
      props: {
        label: "Active Care Plans",
        Icon: FileText,
        value: String(stats.activeCarePlans),
        description: "Care plans currently active",
        showScore: true,
        score: stats.carePlansScore,
        showTrend: false,
        hasCqcScore: false,
        hasValueBadge: false,
      },
    },
    {
      id: "visits-today",
      props: {
        label: "Visits Today",
        Icon: Calendar,
        value: String(stats.visitsToday),
        description: "Scheduled patient visits",
        showScore: false,
        showTrend: true,
        trend: stats.visitsTodayTrendPct < 0 ? "down" : "up",
        hasCqcScore: false,
        hasValueBadge: true,
        valueBadgeValue: `${Math.abs(stats.visitsTodayTrendPct)}%`,
      },
    },
  ];
}