"use client";

import { useMemo, useState } from "react";

import {
  mockDashboardActivity,
  mockDashboardAlerts,
  mockDashboardComplianceDue,
  mockDashboardCqc,
  mockDashboardMapPins,
  mockDashboardRevenue,
  mockDashboardStaffSnapshot,
  mockDashboardVisitSummary,
  mockDashboardVisits,
} from "lib";
import type { DashboardVisitFilter } from "types";
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

/**
 * Everything the Dashboard page needs, grouped by section.
 * Data comes from mock files for now; swap the mock imports for API data later.
 * The only state is the visit status filter.
 */
export function useDashboardWorkspace() {
  const [visitFilter, setVisitFilter] = useState<DashboardVisitFilter>("all");

  const visitRows = useMemo(
    () => filterDashboardVisits(mockDashboardVisits, visitFilter),
    [visitFilter],
  );

  const mapMarkers = useMemo(
    () => buildDashboardMapMarkers(mockDashboardVisits, mockDashboardMapPins),
    [],
  );

  const alertItems = useMemo(() => sortDashboardAlerts(mockDashboardAlerts), []);

  const staffSegments = useMemo(() => buildDashboardStaffSegments(mockDashboardStaffSnapshot), []);

  const cqc = useMemo(() => {
    const score = getDashboardCqcOverall(mockDashboardCqc.domains);
    return {
      score,
      trend: getDashboardCqcTrend(score, mockDashboardCqc.previousOverallScore),
      domains: mockDashboardCqc.domains,
    };
  }, []);

  const revenue = useMemo(
    () => ({
      snapshot: mockDashboardRevenue,
      change: getDashboardRevenueChange(mockDashboardRevenue.thisMonth, mockDashboardRevenue.lastMonth),
      bars: buildDashboardRevenueBars(mockDashboardRevenue),
    }),
    [],
  );

  const activityTotals = useMemo(() => getDashboardActivityTotals(mockDashboardActivity), []);

  const complianceItems = useMemo(() => sortDashboardComplianceItems(mockDashboardComplianceDue), []);

  return {
    visits: {
      rows: visitRows,
      filter: visitFilter,
      setFilter: setVisitFilter,
      summary: mockDashboardVisitSummary,
      completionRate: getVisitCompletionRate(mockDashboardVisitSummary),
      upcoming: getUpcomingVisitCount(mockDashboardVisitSummary),
      mapMarkers,
    },
    alerts: {
      items: alertItems,
      highPriorityCount: countHighPriorityAlerts(alertItems),
      countLabel: getDashboardAlertCountLabel(alertItems.length),
    },
    staff: {
      segments: staffSegments,
      total: getDashboardStaffTotal(mockDashboardStaffSnapshot),
    },
    cqc,
    revenue,
    activity: {
      points: mockDashboardActivity,
      totals: activityTotals,
    },
    compliance: {
      items: complianceItems,
      urgentCount: countUrgentComplianceItems(complianceItems),
    },
  };
}