'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';
import { Users } from 'lucide-react';

import { canSeeStaff, getCarerBadgeVariant, getOnShiftCarers } from 'utils';

function OnShiftCard() {
  const { total, carers, remainingCount } = getOnShiftCarers();

  return (
    <Card className="border-cf-border w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3 pt-3 px-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-cf-ink-60" />
          <CardTitle className="text-sm font-semibold text-cf-ink">
            On Shift Now
          </CardTitle>
        </div>
        <Badge variant="pastel-zinc" shape={'pill'}>
          {total} active
        </Badge>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        {carers.length === 0 && (
          <p className="text-xs text-cf-ink-40">Nobody is on shift right now.</p>
        )}

        {carers.length > 0 && (
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
