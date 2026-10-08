"use client";

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { MonthlyRevenuePoint } from "types";

// Colours are the chart tokens from globals.css, so they follow light/dark themes.
const chartConfig = {
  invoiced: { label: "Invoiced", color: "var(--chart-1)" },
  collected: { label: "Collected", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function RevenueChart({ data }: { data: MonthlyRevenuePoint[] }) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={44}
          tickFormatter={(v: number) => `£${Math.round(v / 1000)}k`}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="invoiced" fill="var(--color-invoiced)" radius={4} />
        <Bar dataKey="collected" fill="var(--color-collected)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}