'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import {
  Badge,
  CapacityChart,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { cn } from 'lib';
import type { CapacityDay } from 'types';
import { CAPACITY_STATUS_BADGE_VARIANT, CAPACITY_STATUS_LABELS, summariseCapacity } from 'utils';

interface ScheduleCapacitySectionProps {
  days: CapacityDay[];
  className?: string;
}

export function ScheduleCapacitySection({ days, className }: ScheduleCapacitySectionProps) {
  const summary = summariseCapacity(days);
  const hasSurplus = summary.differenceHours >= 0;
  const shortDays = summary.shortfallDays.map((day) => day.label).join(', ');

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle>Capacity Planning</CardTitle>
            <p className="mt-1 text-xs text-cf-ink-60">
              Care hours needed against carer hours available this week
            </p>
          </div>
          <Badge variant={CAPACITY_STATUS_BADGE_VARIANT[summary.status]}>
            {CAPACITY_STATUS_LABELS[summary.status]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        <CapacityChart data={days} />

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-cf-surface-muted p-3">
            <p className="mb-1 text-xs font-medium text-cf-ink-60">Total Available</p>
            <p className="text-2xl font-bold text-cf-ink">{summary.totalAvailableHours}h</p>
          </div>
          <div className="rounded-lg bg-cf-surface-muted p-3">
            <p className="mb-1 text-xs font-medium text-cf-ink-60">Total Needed</p>
            <p className="text-2xl font-bold text-cf-ink">{summary.totalNeededHours}h</p>
          </div>
          <div className="rounded-lg bg-cf-surface-muted p-3">
            <p className="mb-1 text-xs font-medium text-cf-ink-60">
              {hasSurplus ? 'Surplus' : 'Gap'}
            </p>
            <p className={`text-2xl font-bold ${hasSurplus ? 'text-success' : 'text-error'}`}>
              {Math.abs(summary.differenceHours)}h
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-cf-border pt-4">
        <div className="flex items-center gap-2">
          {hasSurplus ? (
            <TrendingUp className="size-4 shrink-0 text-success" aria-hidden />
          ) : (
            <TrendingDown className="size-4 shrink-0 text-error" aria-hidden />
          )}
          <div className="text-sm">
            <p className="font-medium text-cf-ink">
              {summary.utilisationPercent}% of carer hours needed
            </p>
            <p className="text-xs text-cf-ink-60">
              {shortDays
                ? `Short on ${shortDays}. Add cover before these days become a problem.`
                : 'Every day has enough carer hours.'}
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}