export type PageParams<T extends Record<string, string>> = {
  params: Promise<T>;
};

export * from "./components";
export * from './compliance'
export * from './dashboard';
export type {
  AttentionPriority,
  AttentionType,
  AttentionTypeConfig,
  CarerStatusTone,
  LiveActivityFilter,
  LiveActivityFilterKey,
  LiveActivityFilterTabsProps,
  LiveActivityRowData,
  LiveActivityRowProps,
  LiveActivitySectionProps,
  LiveActivityTableProps,
  LiveAttentionPanelProps,
  LiveAttentionRowProps,
  LiveAttentionSectionProps,
  LiveBadgeVariant,
  LiveCarerRowProps,
  LiveCarersPanelProps,
  LiveCarersSectionProps,
  LiveMonitoringCounts,
  LiveMonitoringHeaderProps,
  LiveMonitoringResponse,
  LiveMonitoringStatsProps,
} from './live-monitoring';
export * from "./staff-form";
export * from './finance'
export * from './reports';
export * from './report-components'
export * from './medication';
