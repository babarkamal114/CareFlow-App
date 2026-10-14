"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui";
import { cn } from "lib";
import type { CapacityDay } from "types";
import { getCapacityStatus } from "utils";

const chartConfig = {
  neededHours: { label: "Hours needed", color: "var(--chart-1)" },
  availableHours: { label: "Hours available", color: "var(--chart-4)" },
} satisfies ChartConfig;

interface CapacityChartProps {
  data: CapacityDay[];
  className?: string;
}

/** Needed vs available hours per day. Days with a shortfall are drawn in the destructive colour. */
export function CapacityChart({ data, className }: CapacityChartProps) {
  return (
    <ChartContainer config={chartConfig} className={cn("h-72 w-full", className)}>
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 16, right: 16, left: 0, bottom: 8 }}
      >
        <CartesianGrid
          vertical={false}
          stroke="var(--cf-border-light)"
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tick={{ fontSize: 12, fill: "var(--cf-ink-60)" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tick={{ fontSize: 12, fill: "var(--cf-ink-60)" }}
          tickFormatter={(value: number) => `${value}h`}
        />
        <ChartTooltip content={<ChartTooltipContent className="min-w-44" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="neededHours" fill="var(--chart-1)" radius={[4, 4, 0, 0]}>
          {data.map((day) => (
            <Cell
              key={day.date}
              fill={
                getCapacityStatus(day.neededHours, day.availableHours) === "short"
                  ? "var(--destructive)"
                  : "var(--chart-1)"
              }
            />
          ))}
        </Bar>
        <Bar
          dataKey="availableHours"
          fill="var(--chart-4)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}