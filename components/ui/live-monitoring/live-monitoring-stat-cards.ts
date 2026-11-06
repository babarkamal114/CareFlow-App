import { Activity, AlertTriangle, UserCheck, Users } from "lucide-react";
import type { StatCardProps } from "types";
import type { getLiveMonitoringCounts } from "utils";

type LiveCounts = ReturnType<typeof getLiveMonitoringCounts>;

export function getLiveMonitoringStatCards(c: LiveCounts): StatCardProps[] {
  return [
    {
      label: "Active Patients", value: String(c.activePatients), Icon: Users,
      description: "Currently receiving or awaiting care", badgeVariant: "softSuccess",
    },
    {
      label: "Active Visits", value: String(c.activeVisits), Icon: Activity,
      description: "In progress or running late", badgeVariant: "softInfo",
    },
    {
      label: "Carers On Duty", value: String(c.carersOnDuty), Icon: UserCheck,
      description: "On shift right now", badgeVariant: "softWarning",
    },
    {
      label: "Alerts", value: String(c.alerts), Icon: AlertTriangle,
      description: "Items needing attention", badgeVariant: "softDanger",
      hasValueBadge: c.highPriorityAlerts > 0, valueBadgeValue: `${c.highPriorityAlerts} high`,
    },
  ];
}