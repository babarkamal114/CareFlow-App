export type PageParams<T extends Record<string, string>> = {
  params: Promise<T>;
};

export * from "./components";
export * from "./compliance";
export * from "./dashboard";
export * from "./finance";
export * from "./live-monitoring";
export * from "./medication";
export * from "./patient-forms";
export * from "./patient-records";
export * from "./patients";
export * from "./report-components";
export * from "./reports";
export * from "./schedule";
export * from "./staff-form";

export type {
  StatCardProps,
  StatCardTrend,
} from "./components";
export type { MedicationType } from "./medication";
export type { VisitStatus } from "./schedule";
export type { VisitStatus as LiveMonitoringVisitStatus } from "./live-monitoring";
