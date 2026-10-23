"use client";

import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts";
import type { ReportChartSpec, ReportColumn, ReportRow } from "types";
import { REPORT_CHART_COLORS } from "utils";

interface ReportChartProps { columns: ReportColumn[]; rows: ReportRow[]; chart: ReportChartSpec }

const short = (v: unknown) => (String(v).length > 12 ? `${String(v).slice(0, 11)}…` : String(v));

export function ReportChart({ columns, rows, chart }: ReportChartProps) {
  if (rows.length === 0) return <p className="py-10 text-center text-sm text-cf-ink-40">No data for this selection.</p>;
  const label = (key: string) => columns.find((c) => c.key === key)?.label ?? key;

  if (chart.kind === "donut") {
    const yKey = chart.yKeys[0];
    const data = rows.map((r, i) => ({ name: String(r[chart.xKey]), value: Number(r[yKey]), fill: REPORT_CHART_COLORS[i % REPORT_CHART_COLORS.length] }));
    const config = Object.fromEntries(data.map((d) => [d.name, { label: d.name, color: d.fill }])) as ChartConfig;
    return (
      <ChartContainer config={config} className="aspect-auto h-60 w-full">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={84} paddingAngle={2} isAnimationActive={false}>
            {data.map((d) => <Cell key={d.name} fill={d.fill} />)}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="name" />} />
        </PieChart>
      </ChartContainer>
    );
  }

  const config = Object.fromEntries(chart.yKeys.map((k, i) => [k, { label: label(k), color: REPORT_CHART_COLORS[i % REPORT_CHART_COLORS.length] }])) as ChartConfig;
  const axes = (
    <>
      <CartesianGrid vertical={false} strokeDasharray="3 3" />
      <XAxis dataKey={chart.xKey} tickLine={false} axisLine={false} tickMargin={8} tickFormatter={short} interval={0} />
      <YAxis tickLine={false} axisLine={false} width={44} />
      <ChartTooltip content={<ChartTooltipContent />} />
      {chart.yKeys.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
    </>
  );

  return (
    <ChartContainer config={config} className="aspect-auto h-60 w-full">
      {chart.kind === "line" ? (
        <LineChart data={rows} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          {axes}
          {chart.yKeys.map((k) => <Line key={k} type="monotone" dataKey={k} stroke={`var(--color-${k})`} strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />)}
        </LineChart>
      ) : (
        <BarChart data={rows} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          {axes}
          {chart.yKeys.map((k) => <Bar key={k} dataKey={k} fill={`var(--color-${k})`} radius={4} isAnimationActive={false} />)}
        </BarChart>
      )}
    </ChartContainer>
  );
}
