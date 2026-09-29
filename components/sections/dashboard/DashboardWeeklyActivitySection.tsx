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
} from '@/components/ui';

import {
  ACTIVITY_CHART_CONFIG,
  ACTIVITY_SERIES,
  canSeeActivity,
  getActivityPoints,
} from 'utils';

function WeeklyActivityCard() {
  const points = getActivityPoints();

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
            {ACTIVITY_SERIES.map((s) => (
              <div key={s.key} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-xs text-cf-ink-60">{s.label}</span>
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-4 flex-1 flex flex-col">
          {points.length === 0 && (
            <p className="flex-1 flex items-center justify-center text-sm text-cf-ink-60">
              No visit activity yet.
            </p>
          )}

          {points.length > 0 && (
            <ChartContainer config={ACTIVITY_CHART_CONFIG} className="flex-1 w-full">
              <LineChart
                accessibilityLayer
                data={points}
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
                {ACTIVITY_SERIES.map((s) =>
                  s.primary ? (
                    <Line
                      key={s.key}
                      type="monotone"
                      dataKey={s.key}
                      stroke={`var(--color-${s.key})`}
                      strokeWidth={3}
                      dot={{ r: 3.5, fill: `var(--color-${s.key})`, strokeWidth: 0 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      isAnimationActive={true}
                    />
                  ) : (
                    <Line
                      key={s.key}
                      type="monotone"
                      dataKey={s.key}
                      stroke={`var(--color-${s.key})`}
                      strokeWidth={1.75}
                      strokeDasharray="5 4"
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 0 }}
                      isAnimationActive={true}
                    />
                  )
                )}
              </LineChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function DashboardWeeklyActivity({ role }: { role: string }) {
  if (!canSeeActivity(role)) return null;
  return <WeeklyActivityCard />;
}