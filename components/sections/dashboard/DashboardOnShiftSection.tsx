'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui';
import { Users } from 'lucide-react';

import { useOnShiftCarers } from 'hooks';
import { canSeeStaff, getCarerBadgeVariant } from 'utils';

function OnShiftCard() {
  const { data, isLoading, error, refetch } = useOnShiftCarers();

  const carers = data?.carers ?? [];
  const remainingCount = Math.max(0, (data?.total ?? 0) - carers.length);

  return (
    <Card className="border-cf-border w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3 pt-3 px-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-cf-ink-60" />
          <CardTitle className="text-sm font-semibold text-cf-ink">
            On Shift Now
          </CardTitle>
        </div>
        {data && (
          <Badge variant="pastel-zinc" shape={'pill'}>
            {data.total} active
          </Badge>
        )}
      </CardHeader>

      <CardContent className="px-4 pb-4">
        {isLoading && (
          <div className="flex flex-wrap gap-2 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-7 w-24 rounded-full bg-cf-ink-40/20" />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <p className="text-xs text-cf-ink-60">
            Couldn&apos;t load staff.{' '}
            <Button onClick={refetch} className="font-semibold text-cf-ink underline">
              Retry
            </Button>
          </p>
        )}

        {!isLoading && !error && carers.length === 0 && (
          <p className="text-xs text-cf-ink-40">Nobody is on shift right now.</p>
        )}

        {!isLoading && !error && carers.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {carers.map((carer) => (
              <Badge
                key={carer.id}
                variant={getCarerBadgeVariant(carer.id)}
                className="text-xs font-medium py-1.5 px-2.5 rounded-full"
              >
                {carer.name}
              </Badge>
            ))}

            {remainingCount > 0 && (
              <Badge
                variant="pastel-neutral"
                className="text-xs font-medium py-1.5 px-2.5 rounded-full"
              >
                +{remainingCount} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface DashboardOnShiftSectionProps {
  role: string;
}

function DashboardOnShiftSection({ role }: DashboardOnShiftSectionProps) {
  if (!canSeeStaff(role)) return null;
  return <OnShiftCard />;
}

export default DashboardOnShiftSection;