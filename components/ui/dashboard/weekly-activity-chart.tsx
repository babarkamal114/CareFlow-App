"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui";
import type { DashboardActivityPoint } from "types";
import { DASHBOARD_ACTIVITY_CHART_CONFIG, DASHBOARD_ACTIVITY_SERIES } from "utils";

const AXIS_TICK = { fontSize: 12, fill: "var(--cf-ink-60)" };

/** Legend dots use the same chart tokens as the lines. */
export function WeeklyActivityLegend() {
  return (
    <ul className="flex items-center gap-3">
      {DASHBOARD_ACTIVITY_SERIES.map((series) => (
        <li key={series.key} className="flex items-center gap-1.5">
          <span className="size-2 rounded-full" style={{ backgroundColor: series.color }} aria-hidden />
          <span className="text-xs text-cf-ink-60">{series.label}</span>
        </li>
      ))}
    </ul>
  );
}

interface WeeklyActivityChartProps {
  points: DashboardActivityPoint[];
}

/** Line chart of scheduled, completed and missed visits over the last 7 days. */
export function WeeklyActivityChart({ points }: WeeklyActivityChartProps) {
  return (
    <ChartContainer config={DASHBOARD_ACTIVITY_CHART_CONFIG} className="aspect-auto min-h-[200px] w-full flex-1">
      <LineChart accessibilityLayer data={points} margin={{ left: 0, right: 12, top: 10, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--cf-border-light)" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} tick={AXIS_TICK} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={28} tick={AXIS_TICK} />
        <ChartTooltip
          cursor={{ stroke: "var(--cf-ink-20)", strokeDasharray: "4 4" }}
          content={<ChartTooltipContent indicator="dot" />}
        />
        {DASHBOARD_ACTIVITY_SERIES.map((series) => (
          <Line
            key={series.key}
            type="monotone"
            dataKey={series.key}
            stroke={`var(--color-${series.key})`}
            strokeWidth={series.primary ? 3 : 1.75}
            strokeDasharray={series.primary ? undefined : "5 4"}
            dot={series.primary ? { r: 3.5, fill: `var(--color-${series.key})`, strokeWidth: 0 } : false}
            activeDot={{ r: series.primary ? 6 : 4, strokeWidth: 0 }}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}