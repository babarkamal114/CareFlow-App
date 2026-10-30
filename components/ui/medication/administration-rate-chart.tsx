"use client";

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const config = { rate: { label: "Administration rate (%)", color: "var(--chart-1)" } } satisfies ChartConfig;

export function AdministrationRateChart({ data }: { data: { day: string; rate: number }[] }) {
  return (
    <ChartContainer config={config} className="aspect-auto h-56 w-full">
      <LineChart data={data} margin={{ top: 5, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} interval={4} />
        <YAxis domain={[60, 100]} tickLine={false} axisLine={false} width={36} tickFormatter={(v: number) => `${v}%`} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey="rate" stroke="var(--color-rate)" strokeWidth={2} dot={false} isAnimationActive={false} />
      </LineChart>
    </ChartContainer>
  );
}
