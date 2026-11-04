"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  mockDashboardActivity, mockDashboardAlerts, mockDashboardComplianceDue, mockDashboardCqc, mockDashboardMapPins, mockDashboardRevenue,
  mockDashboardStaffSnapshot, mockDashboardVisitSummary, mockDashboardVisits, mockRequest,
} from "lib";
import type {
  DashboardActivityPoint, DashboardAlert, DashboardComplianceItem, DashboardCqcOverview, DashboardMapPin, DashboardRevenueSnapshot,
  DashboardStaffSnapshot, DashboardVisit, DashboardVisitSummary,
} from "types";
import { useApiMutation, useApiQuery } from "./use-api";

const allDashboardKeys = ["dashboard"] as const;
const dashboardKeys = {
  visits: [...allDashboardKeys, "visits"],
  visitSummary: [...allDashboardKeys, "visit-summary"],
  mapPins: [...allDashboardKeys, "map-pins"],
  alerts: [...allDashboardKeys, "alerts"],
  staff: [...allDashboardKeys, "staff"],
  cqc: [...allDashboardKeys, "cqc"],
  revenue: [...allDashboardKeys, "revenue"],
  activity: [...allDashboardKeys, "activity"],
  compliance: [...allDashboardKeys, "compliance"],
} as const;

export interface AcknowledgeDashboardAlertVariables { alertId: string }
export interface CompleteDashboardComplianceVariables { itemId: string }

// ---------------- Reads ----------------

export const useGetDashboardVisitsApi = () =>
  useApiQuery<DashboardVisit[]>(dashboardKeys.visits, () => mockRequest(mockDashboardVisits));

export const useGetDashboardVisitSummaryApi = () =>
  useApiQuery<DashboardVisitSummary>(dashboardKeys.visitSummary, () => mockRequest(mockDashboardVisitSummary));

export const useGetDashboardMapPinsApi = () =>
  useApiQuery<DashboardMapPin[]>(dashboardKeys.mapPins, () => mockRequest(mockDashboardMapPins));

export const useGetDashboardAlertsApi = () =>
  useApiQuery<DashboardAlert[]>(dashboardKeys.alerts, () => mockRequest(mockDashboardAlerts));

export const useGetDashboardStaffSnapshotApi = () =>
  useApiQuery<DashboardStaffSnapshot>(dashboardKeys.staff, () => mockRequest(mockDashboardStaffSnapshot));

export const useGetDashboardCqcApi = () =>
  useApiQuery<DashboardCqcOverview>(dashboardKeys.cqc, () => mockRequest(mockDashboardCqc));

export const useGetDashboardRevenueApi = () =>
  useApiQuery<DashboardRevenueSnapshot>(dashboardKeys.revenue, () => mockRequest(mockDashboardRevenue));

export const useGetDashboardActivityApi = () =>
  useApiQuery<DashboardActivityPoint[]>(dashboardKeys.activity, () => mockRequest(mockDashboardActivity));

export const useGetDashboardComplianceApi = () =>
  useApiQuery<DashboardComplianceItem[]>(dashboardKeys.compliance, () => mockRequest(mockDashboardComplianceDue));

// ---------------- Writes (they only wait, then return a fixed response; the screens don't change) ----------------

export function useAcknowledgeDashboardAlertApi() {
  const queryClient = useQueryClient();
  return useApiMutation<void, AcknowledgeDashboardAlertVariables>({
    mutationKey: [...allDashboardKeys, "acknowledge-alert"],
    mutationFn: () => mockRequest(undefined, 250),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allDashboardKeys });
    },
    showErrorToast: true,
  });
}

export function useCompleteDashboardComplianceApi() {
  const queryClient = useQueryClient();
  return useApiMutation<void, CompleteDashboardComplianceVariables>({
    mutationKey: [...allDashboardKeys, "complete-compliance"],
    mutationFn: () => mockRequest(undefined, 250),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allDashboardKeys });
    },
    showErrorToast: true,
  });
}