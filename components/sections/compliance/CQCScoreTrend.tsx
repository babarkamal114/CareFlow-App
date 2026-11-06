'use client';

import {
  type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent,
  Card, CardContent, CardHeader, CardTitle, FilterPill,
} from '@/components/ui';
import { useCqcReadiness, useScoreTrend } from 'hooks';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

// Colours come from the chart tokens in globals.css, so they follow light / dark mode.
const chartConfig = {
  overall: { label: 'Overall', color: 'var(--chart-1)' },
  responsive: { label: 'Responsive', color: 'var(--chart-3)' },
} satisfies ChartConfig;

const RANGES = [3, 6, 12];

export function CQCScoreTrendCard() {
  const r = useCqcReadiness();
  const t = useScoreTrend(r.overall, r.questions);

  return (
    <Card className="h-full w-full rounded-2xl border-cf-border-light shadow-cf-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-bold text-cf-ink">CQC Score Trend</CardTitle>
          <div className="flex gap-1.5" role="group" aria-label="Trend range">
            {RANGES.map((m) => (
              <FilterPill key={m} label={`${m}M`} active={t.months === m} onClick={() => t.setMonths(m)} />
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
          <LineChart data={t.points} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis domain={[50, 100]} tickLine={false} axisLine={false} width={32} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line type="monotone" dataKey="overall" stroke="var(--color-overall)" strokeWidth={2} dot={{ r: 4 }} isAnimationActive={false} />
            <Line type="monotone" dataKey="responsive" stroke="var(--color-responsive)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} isAnimationActive={false} />
          </LineChart>
        </ChartContainer>

        <div className="grid grid-cols-3 gap-6 border-t border-cf-border pt-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-cf-ink-60 uppercase">{t.months}-Month Change</p>
            <p className={`text-2xl font-bold ${t.change >= 0 ? 'text-success' : 'text-error'}`}>{t.change >= 0 ? '+' : ''}{t.change} pts</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-cf-ink-60 uppercase">Best Area</p>
            <p className="text-2xl font-bold text-cf-ink">{t.best.label}</p>
            <p className="text-sm text-cf-ink-60">{t.best.score}/100</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-warning uppercase">Focus Area</p>
            <p className="text-2xl font-bold text-warning">{t.focus.label}</p>
            <p className="text-sm text-cf-ink-60">{t.focus.score}/100</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
