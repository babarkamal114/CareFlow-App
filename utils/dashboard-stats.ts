import type { LucideIcon } from "lucide-react";
import { Calendar, DollarSign, Users } from "lucide-react";
import type { StatCardProps, StatCardTrend } from "types";

import { canAccessModule } from "./dashboard-nav-filter";

export interface TrendMetric {
  value: number;
  changePercent: number;
}

export interface DashboardStatsResponse {
  totalPatients?: TrendMetric;
  activeStaff?: TrendMetric;
  todaysVisits?: {
    value: number;
    completionRate: number; 
  };
  revenue?: {
    value: number;
    targetAttainment: number; 
    currency: string; 
  };
}


const formatNumber = (n: number) => new Intl.NumberFormat("en-GB").format(n);

const formatCurrency = (n: number, currency: string) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);

const clampScore = (n: number) => Math.round(Math.min(100, Math.max(0, n)));

function getTrendProps(changePercent: number): Partial<StatCardProps> {
  const rounded = Math.round(changePercent);
  const trend: StatCardTrend =
    rounded > 0 ? "up" : rounded < 0 ? "down" : "neutral";

  return {
    showTrend: true,
    trend,
    hasValueBadge: trend !== "neutral",
    valueBadgeValue: `${Math.abs(rounded)}%`,
  };
}

const getScoreProps = (score: number): Partial<StatCardProps> => ({
  showScore: true,
  score: clampScore(score),
});


interface StatDefinition {
  id: string;
  label: string;
  Icon: LucideIcon;
  description: string;
  requiredModule: string;
  badgeVariant: StatCardProps["badgeVariant"];
  build: (data: DashboardStatsResponse) => Partial<StatCardProps> | null;
}

export const STAT_DEFINITIONS: StatDefinition[] = [
  {
    id: "total-patients",
    label: "Total Patients",
    Icon: Users,
    description: "Active patients under care",
    requiredModule: "patients",
    badgeVariant: "softSuccess",
    build: ({ totalPatients }) =>
      totalPatients
        ? {
            value: formatNumber(totalPatients.value),
            ...getTrendProps(totalPatients.changePercent),
          }
        : null,
  },
  {
    id: "active-staff",
    label: "Active Staff",
    Icon: Users,
    description: "Staff currently active",
    requiredModule: "staff",
    badgeVariant: "softInfo",
    build: ({ activeStaff }) =>
      activeStaff
        ? {
            value: formatNumber(activeStaff.value),
            ...getTrendProps(activeStaff.changePercent),
          }
        : null,
  },
  {
    id: "todays-visits",
    label: "Today's Visits",
    Icon: Calendar,
    description: "Visits scheduled today",
    requiredModule: "visits",
    badgeVariant: "softWarning",
    build: ({ todaysVisits }) =>
      todaysVisits
        ? {
            value: formatNumber(todaysVisits.value),
            ...getScoreProps(todaysVisits.completionRate),
          }
        : null,
  },
  {
    id: "revenue",
    label: "Revenue",
    Icon: DollarSign,
    description: "This month's revenue",
    requiredModule: "finance",
    badgeVariant: "softDanger",
    build: ({ revenue }) =>
      revenue
        ? {
            value: formatCurrency(revenue.value, revenue.currency),
            ...getScoreProps(revenue.targetAttainment),
          }
        : null,
  },
];

export function getVisibleStatDefinitions(role: string): StatDefinition[] {
  const normalizedRole = (role || "").toLowerCase().trim().replace(/[\s-]+/g, "_");
  return STAT_DEFINITIONS.filter((def) =>
    canAccessModule(normalizedRole, def.requiredModule)
  );
}

export interface DashboardStatCard {
  id: string;
  props: StatCardProps;
}

export function buildStatCards(
  data: DashboardStatsResponse,
  role: string
): DashboardStatCard[] {
  return getVisibleStatDefinitions(role).flatMap((def) => {
    const built = def.build(data);
    if (!built) return []; 

    return [
      {
        id: def.id,
        props: {
          value: "",
          showScore: false,
          showTrend: false,
          hasCqcScore: false,
          hasValueBadge: false,
          label: def.label,
          Icon: def.Icon,
          description: def.description,
          badgeVariant: def.badgeVariant,
          ...built,
        },
      },
    ];
  });
}