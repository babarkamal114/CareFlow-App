import { AlertTriangle, CalendarCheck, Pill, PoundSterling, ShieldCheck } from "lucide-react";
import type { ReportKpi, StatCardProps } from "types";
import { formatKpiValue, getKpiChange } from "utils";

const ICONS: Record<string, StatCardProps["Icon"]> = { readiness: ShieldCheck, "on-time": CalendarCheck, incidents: AlertTriangle, mar: Pill, revenue: PoundSterling };

export function getReportKpiCards(kpis: ReportKpi[]): StatCardProps[] {
  return kpis.map((k) => {
    const c = getKpiChange(k);
    const arrow = c.direction === "up" ? "▲" : c.direction === "down" ? "▼" : "–";
    return {
      label: k.label,
      value: formatKpiValue(k),
      Icon: ICONS[k.id] ?? ShieldCheck,
      description: k.targetLabel ?? "vs last month",
      badgeVariant: c.good ? "softSuccess" : "softDanger",
      showTrend: true,
      trend: c.direction === "flat" ? "neutral" : c.direction,
      children: (
        <p className="text-xs text-cf-ink-60">
          <span className={c.good ? "font-semibold text-success" : "font-semibold text-error"}>{arrow} {c.delta > 0 ? "+" : ""}{c.delta}{k.unit === "percent" ? " pts" : ""}</span>
          {" "}vs last month{k.targetLabel ? ` · ${k.targetLabel}` : ""}
        </p>
      ),
    } satisfies StatCardProps;
  });
}
