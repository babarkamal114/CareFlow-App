'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui';

const weeklyActivityData = [
  { day: 'Mon', done: 45, active: 23, missed: 5 },
  { day: 'Tue', done: 52, active: 18, missed: 3 },
  { day: 'Wed', done: 48, active: 25, missed: 6 },
  { day: 'Thu', done: 61, active: 20, missed: 4 },
  { day: 'Fri', done: 55, active: 22, missed: 7 },
  { day: 'Sat', done: 42, active: 28, missed: 8 },
  { day: 'Sun', done: 38, active: 30, missed: 9 },
];

const chartConfig = {
  done: {
    label: 'Done',
    color: 'var(--chart-1)',
  },
  active: {
    label: 'Active',
    color: 'var(--chart-2)',
  },
  missed: {
    label: 'Missed',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

export function DashboardWeeklyActivity() {
  return (
    <motion.div
      className="h-full flex-1 min-w-0"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="border-cf-border-light shadow-cf-sm rounded-2xl w-full h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4 px-4">
          <div>
            <CardTitle className="text-sm font-semibold text-cf-ink">
              Weekly Activity
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Visits overview
            </CardDescription>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--chart-1)]" />
              <span className="text-xs text-cf-ink-60">Done</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--chart-2)]" />
              <span className="text-xs text-cf-ink-60">Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--chart-3)]" />
              <span className="text-xs text-cf-ink-60">Missed</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-4 flex-1 flex flex-col">
          <ChartContainer config={chartConfig} className="flex-1 w-full">
            <LineChart
              accessibilityLayer
              data={weeklyActivityData}
              margin={{ left: 0, right: 12, top: 10, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="var(--cf-border-light)"
              />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tick={{ fontSize: 12, fill: 'var(--cf-ink-40)' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 12, fill: 'var(--cf-ink-40)' }}
                width={28}
              />
              <ChartTooltip
                cursor={{ stroke: 'var(--cf-ink-20)', strokeDasharray: '4 4' }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              {/* Primary series — bold solid line with visible dots, the visual anchor */}
              <Line
                type="monotone"
                dataKey="done"
                stroke="var(--color-done)"
                strokeWidth={3}
                dot={{ r: 3.5, fill: 'var(--color-done)', strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                isAnimationActive={true}
              />
              {/* Secondary series — thinner, dashed, no dots: recedes behind the primary line */}
              <Line
                type="monotone"
                dataKey="active"
                stroke="var(--color-active)"
                strokeWidth={1.75}
                strokeDasharray="5 4"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                isAnimationActive={true}
              />
              <Line
                type="monotone"
                dataKey="missed"
                stroke="var(--color-missed)"
                strokeWidth={1.75}
                strokeDasharray="5 4"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                isAnimationActive={true}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}