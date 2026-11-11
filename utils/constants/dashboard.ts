export const DASHBOARD_MOCK_NOW = new Date(2026, 9, 8, 11, 20);


export const STAT_LINKS = {
  total: "/scheduling",
  completed: "/scheduling?status=completed",
  inProgress: "/live-monitoring",
  late: "/scheduling?status=late",
  missed: "/scheduling?status=missed",
} as const;