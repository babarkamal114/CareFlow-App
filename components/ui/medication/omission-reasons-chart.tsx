"use client";

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const config = { count: { label: "Doses", color: "var(--chart-3)" } } satisfies ChartConfig;

export function OmissionReasonsChart({ data }: { data: { label: string; count: number }[] }) {
  if (data.length === 0) return <p className="py-8 text-center text-sm text-cf-ink-40">No omissions or refusals recorded.</p>;
  return (
    <ChartContainer config={config} className="aspect-auto h-56 w-full">
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
        <YAxis type="category" dataKey="label" tickLine={false} axisLine={false} width={130} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
