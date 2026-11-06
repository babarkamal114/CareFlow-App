"use client";

import {
  mockDashboardVisitSummary,
  useGetDashboardActivityApi,
  useGetDashboardAlertsApi,
  useGetDashboardComplianceApi,
  useGetDashboardCqcApi,
  useGetDashboardMapPinsApi,
  useGetDashboardRevenueApi,
  useGetDashboardStaffSnapshotApi,
  useGetDashboardVisitSummaryApi,
  useGetDashboardVisitsApi,
} from "lib";
import { useMemo, useState } from "react";
import type {
  DashboardActivityPoint,
  DashboardAlert,
  DashboardComplianceItem,
  DashboardCqcOverview,
  DashboardMapPin,
  DashboardRevenueSnapshot,
  DashboardVisit,
  DashboardVisitFilter,
  DashboardVisitSummary,
} from "types";
import {
  buildDashboardMapMarkers,
  buildDashboardRevenueBars,
  buildDashboardStaffSegments,
  countHighPriorityAlerts,
  countUrgentComplianceItems,
  filterDashboardVisits,
  getDashboardActivityTotals,
  getDashboardAlertCountLabel,
  getDashboardCqcOverall,
  getDashboardCqcTrend,
  getDashboardRevenueChange,
  getDashboardStaffTotal,
  getUpcomingVisitCount,
  getVisitCompletionRate,
  sortDashboardAlerts,
  sortDashboardComplianceItems,
} from "utils";

// Stable empty values, so `?? []` doesn't create a new array on every render while loading.
const NO_VISITS: DashboardVisit[] = [];
const NO_PINS: DashboardMapPin[] = [];
const NO_ALERTS: DashboardAlert[] = [];
const NO_ACTIVITY: DashboardActivityPoint[] = [];
const NO_COMPLIANCE: DashboardComplianceItem[] = [];

export interface UseDashboardWorkspaceReturn {
  isLoading: boolean;
  visits: {
    rows: DashboardVisit[];
    filter: DashboardVisitFilter;
    setFilter: (filter: DashboardVisitFilter) => void;
    summary: DashboardVisitSummary;
    completionRate: number;
    upcoming: number;
    mapMarkers: ReturnType<typeof buildDashboardMapMarkers>;
  };
  alerts: {
    items: DashboardAlert[];
    highPriorityCount: number;
    countLabel: ReturnType<typeof getDashboardAlertCountLabel>;
  };
  staff: {
    segments: ReturnType<typeof buildDashboardStaffSegments>;
    total: number;
  };
  cqc: {
    score: number;
    trend: ReturnType<typeof getDashboardCqcTrend>;
    domains: DashboardCqcOverview["domains"];
  } | null;
  revenue: {
    snapshot: DashboardRevenueSnapshot;
    change: ReturnType<typeof getDashboardRevenueChange>;
    bars: ReturnType<typeof buildDashboardRevenueBars>;
  } | null;
  activity: {
    points: DashboardActivityPoint[];
    totals: ReturnType<typeof getDashboardActivityTotals>;
  };
  compliance: {
    items: DashboardComplianceItem[];
    urgentCount: number;
  };
}

export function useDashboardWorkspace(): UseDashboardWorkspaceReturn {
  const [visitFilter, setVisitFilter] = useState<DashboardVisitFilter>("all");

  const visitsQ = useGetDashboardVisitsApi();
  const summaryQ = useGetDashboardVisitSummaryApi();
  const pinsQ = useGetDashboardMapPinsApi();
  const alertsQ = useGetDashboardAlertsApi();
  const staffQ = useGetDashboardStaffSnapshotApi();
  const cqcQ = useGetDashboardCqcApi();
  const revenueQ = useGetDashboardRevenueApi();
  const activityQ = useGetDashboardActivityApi();
  const complianceQ = useGetDashboardComplianceApi();

  const allVisits = visitsQ.data ?? NO_VISITS;
  const pins = pinsQ.data ?? NO_PINS;
  const summary = summaryQ.data;
  const staffSnapshot = staffQ.data;
  const cqcData = cqcQ.data;
  const revenueData = revenueQ.data;
  const activityPoints = activityQ.data ?? NO_ACTIVITY;
  const visitRows = useMemo(() => filterDashboardVisits(allVisits, visitFilter), [allVisits, visitFilter]);
  const mapMarkers = useMemo(() => buildDashboardMapMarkers(allVisits, pins), [allVisits, pins]);
  const alertItems = useMemo(() => sortDashboardAlerts(alertsQ.data ?? NO_ALERTS), [alertsQ.data]);
  const staffSegments = useMemo(
    () => (staffSnapshot ? buildDashboardStaffSegments(staffSnapshot) : []),
    [staffSnapshot],
  );
  const cqc = useMemo(() => {
    if (!cqcData) return null;
    const score = getDashboardCqcOverall(cqcData.domains);
    return {
      score,
      trend: getDashboardCqcTrend(score, cqcData.previousOverallScore),
      domains: cqcData.domains,
    };
  }, [cqcData]);
  const revenue = useMemo(
    () =>
      revenueData
        ? {
            snapshot: revenueData,
            change: getDashboardRevenueChange(revenueData.thisMonth, revenueData.lastMonth),
            bars: buildDashboardRevenueBars(revenueData),
          }
        : null,
    [revenueData],
  );
  const activityTotals = useMemo(() => getDashboardActivityTotals(activityPoints), [activityPoints]);
  const complianceItems = useMemo(
    () => sortDashboardComplianceItems(complianceQ.data ?? NO_COMPLIANCE),
    [complianceQ.data],
  );

  return {
    isLoading:
      visitsQ.isLoading || summaryQ.isLoading || pinsQ.isLoading || alertsQ.isLoading || staffQ.isLoading ||
      cqcQ.isLoading || revenueQ.isLoading || activityQ.isLoading || complianceQ.isLoading,
    visits: {
      rows: visitRows,
      filter: visitFilter,
      setFilter: setVisitFilter,
      summary: mockDashboardVisitSummary,
      completionRate: summary ? getVisitCompletionRate(summary) : 0,
      upcoming: summary ? getUpcomingVisitCount(summary) : 0,
      mapMarkers,
    },
    alerts: {
      items: alertItems,
      highPriorityCount: countHighPriorityAlerts(alertItems),
      countLabel: getDashboardAlertCountLabel(alertItems.length),
    },
    staff: {
      segments: staffSegments,
      total: staffSnapshot ? getDashboardStaffTotal(staffSnapshot) : 0,
    },
    cqc,
    revenue,
    activity: {
      points: activityPoints,
      totals: activityTotals,
    },
    compliance: {
      items: complianceItems,
      urgentCount: countUrgentComplianceItems(complianceItems),
    },
  };
}