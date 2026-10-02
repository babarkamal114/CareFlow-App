// components/sections/schedule/CapacityPlanningSection.tsx
"use client";

import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Badge } from "@/components/ui";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui";

const chartData = [
  { day: "Monday", needed: 28, available: 40 },
  { day: "Tuesday", needed: 32, available: 40 },
  { day: "Wednesday", needed: 35, available: 36 },
  { day: "Thursday", needed: 38, available: 36 },
  { day: "Friday", needed: 42, available: 36 },
  { day: "Saturday", needed: 20, available: 28 },
  { day: "Sunday", needed: 15, available: 16 },
];

const chartConfig = {
  needed: {
    label: "Hours Needed",
    color: "#1a7f56",
  },
  available: {
    label: "Hours Available",
    color: "#d1d5db",
  },
} satisfies ChartConfig;

export function CapacityPlanningSection() {
  const totalNeeded = chartData.reduce((sum, d) => sum + d.needed, 0);
  const totalAvailable = chartData.reduce((sum, d) => sum + d.available, 0);
  const difference = totalAvailable - totalNeeded;
  const isOverstaffed = difference >= 0;

  return (
    <Card className="border-cf-border">
      <CardHeader className="border-b border-cf-border pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">Capacity Planning</CardTitle>
            <CardDescription className="text-xs mt-1">
              Weekly care hours overview
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {isOverstaffed ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <Badge variant="pastel-success" className="text-xs">
                  Overstaffed
                </Badge>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                <Badge variant="pastel-danger" className="text-xs">
                  Understaffed
                </Badge>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <ChartContainer config={chartConfig} className="h-70 w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--cf-border-light)"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--cf-ink-60)" }}
            />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--cf-ink-60)" }}
              tickFormatter={(value: any) => `${value}h`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value: any, name: any) => {
                    const label = name === "needed" ? "Needed" : "Available";
                    return [`${value}h`, label];
                  }}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="needed"
              fill="#1a7f56"
              radius={[4, 4, 0, 0]}
              name="needed"
            />
            <Bar
              dataKey="available"
              fill="#d1d5db"
              radius={[4, 4, 0, 0]}
              name="available"
            />
          </BarChart>
        </ChartContainer>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-cf-surface-muted rounded-lg">
            <p className="text-xs font-medium text-cf-ink-60 mb-1">
              Total Available
            </p>
            <p className="text-2xl font-bold text-cf-ink">{totalAvailable}h</p>
          </div>
          <div className="p-3 bg-cf-surface-muted rounded-lg">
            <p className="text-xs font-medium text-cf-ink-60 mb-1">
              Total Needed
            </p>
            <p className="text-2xl font-bold text-cf-ink">{totalNeeded}h</p>
          </div>
          <div className="p-3 bg-cf-surface-muted rounded-lg">
            <p className="text-xs font-medium text-cf-ink-60 mb-1">
              {isOverstaffed ? "Surplus" : "Gap"}
            </p>
            <p
              className={`text-2xl font-bold ${
                isOverstaffed ? "text-green-600" : "text-red-600"
              }`}
            >
              {Math.abs(difference)}h
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-cf-border pt-4">
        <div className="flex items-center gap-2">
          {isOverstaffed ? (
            <>
              <TrendingUp className="h-4 w-4 text-green-600 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-cf-ink">Overstaffed</p>
                <p className="text-xs text-cf-ink-60">
                  {difference}h additional capacity available
                </p>
              </div>
            </>
          ) : (
            <>
              <TrendingDown className="h-4 w-4 text-red-600 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-cf-ink">Understaffed</p>
                <p className="text-xs text-cf-ink-60">
                  {Math.abs(difference)}h additional staff needed
                </p>
              </div>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}