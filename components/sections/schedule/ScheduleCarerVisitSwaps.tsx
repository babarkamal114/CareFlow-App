'use client';

import { AlertTriangle, ArrowRight, Check, Clock, X } from 'lucide-react';
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { cn } from 'lib';
import type { ShiftSwapRequest } from 'types';
import {
  SHIFT_PERIOD_BADGE_VARIANT,
  formatShortDate,
  formatTimeAgo,
  getInitials,
  getShiftPeriod,
} from 'utils';

interface ScheduleCarerVisitSwapsProps {
  swaps: ShiftSwapRequest[];
  /** Local ISO datetime treated as "now", used for the "2 hours ago" labels. */
  nowIso: string;
  onApprove: (swapId: string) => void;
  onReject: (swapId: string) => void;
  className?: string;
}

function SwapAvatar({ name }: { name: string }) {
  return (
    <Avatar className="size-9 shrink-0 border border-cf-border">
      <AvatarFallback className="bg-brand-50 text-xs font-medium text-brand-700">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

export function ScheduleCarerVisitSwaps({
  swaps,
  nowIso,
  onApprove,
  onReject,
  className,
}: ScheduleCarerVisitSwapsProps) {
  const pending = swaps.filter((swap) => swap.status === 'pending');

  return (
    <Card className={cn('w-full shrink-0', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="size-4" aria-hidden />
          Pending Swaps
          {pending.length > 0 && (
            <Badge variant="softDanger" shape="pill">
              {pending.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {pending.length === 0 && (
          <div className="py-8 text-center text-cf-ink-60">
            <p className="text-sm">No pending swap requests</p>
            <p className="mt-1 text-xs">Carers can request swaps from the mobile app</p>
          </div>
        )}

        {pending.map((swap) => {
          const period = getShiftPeriod(swap.startTime);
          return (
            <article
              key={swap.id}
              className="space-y-3 rounded-xl border border-cf-border bg-cf-surface p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <SwapAvatar name={swap.requesterName} />
                  <ArrowRight className="size-3.5 text-cf-ink-40" aria-hidden />
                  <SwapAvatar name={swap.targetName} />
                </div>
                <Badge variant={SHIFT_PERIOD_BADGE_VARIANT[period]}>{period}</Badge>
              </div>

              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-cf-ink">
                  {swap.requesterName} <span className="font-normal text-cf-ink-60">to</span>{' '}
                  {swap.targetName}
                </p>
                <p className="text-sm text-cf-ink-80">
                  {formatShortDate(swap.date)} · {swap.startTime} - {swap.endTime}
                </p>
                <p className="text-xs text-cf-ink-60">
                  Requested {formatTimeAgo(swap.requestedAt, nowIso)}
                </p>
              </div>

              {swap.conflictMessage && (
                <Alert variant="warning" className="px-3 py-2">
                  <AlertIcon>
                    <AlertTriangle />
                  </AlertIcon>
                  <AlertContent>
                    <AlertDescription>{swap.conflictMessage}</AlertDescription>
                  </AlertContent>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onReject(swap.id)}
                >
                  <X />
                  Decline
                </Button>
                <Button size="sm" className="flex-1" onClick={() => onApprove(swap.id)}>
                  <Check />
                  Approve
                </Button>
              </div>
            </article>
          );
        })}
      </CardContent>
    </Card>
  );
}