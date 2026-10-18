// components/sections/dashboard/DashboardOnShiftSection.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Badge, BadgeProps } from '@/components/ui';
import { Users } from 'lucide-react';

interface Carer {
  id: string;
  name: string;
  avatar?: string;
  status?: 'active' | 'break' | 'en-route';
}


const mockCarersOnShift: Carer[] = [
  { id: '1', name: 'Sarah Johnson', status: 'active' },
  { id: '2', name: 'Michael Chen', status: 'en-route' },
  { id: '3', name: 'Emma Williams', status: 'active' },
  { id: '4', name: 'David Smith', status: 'break' },
  { id: '5', name: 'Lisa Garcia', status: 'active' },
  { id: '6', name: 'James Wilson', status: 'active' },
  { id: '7', name: 'Anna Martinez', status: 'active' },
  { id: '8', name: 'Robert Brown', status: 'en-route' },
  { id: '9', name: 'Sophie Taylor', status: 'active' },
  { id: '10', name: 'John Anderson', status: 'active' },
  { id: '11', name: 'Rachel White', status: 'active' },
  { id: '12', name: 'Tom Harris', status: 'break' },
];

const badgeVariants: BadgeProps['variant'][] = [
  'pastel-success',
  'pastel-warning',
  'pastel-info',
  'pastel-danger',
  'pastel-purple',
  'pastel-pink',
  'pastel-indigo',
  'pastel-teal',
  'pastel-orange',
  'pastel-cyan',
  'pastel-lime',
  'pastel-amber',
  'pastel-emerald',
  'pastel-rose',
];

const getRandomVariant = (index: number): BadgeProps['variant'] => {
  return badgeVariants[index % badgeVariants.length];
};

function DashboardOnShiftSection() {
  const MAX_DISPLAY = 5;
  const displayedCarers = mockCarersOnShift.slice(0, MAX_DISPLAY);
  const remainingCount = mockCarersOnShift.length - MAX_DISPLAY;

  return (
    <Card className="border-cf-border w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3 pt-3 px-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-cf-ink-60" />
          <CardTitle className="text-sm font-semibold text-cf-ink">
            On Shift Now
          </CardTitle>
        </div>
        <Badge 
        variant="pastel-zinc"
        shape={'pill'}
        >
          {mockCarersOnShift.length} active
        </Badge>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        <div className="flex flex-wrap gap-2">
          {displayedCarers.map((carer, index) => (
            <Badge
              key={carer.id}
              variant={getRandomVariant(index)}
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
      </CardContent>
    </Card>
  );
}

export default DashboardOnShiftSection;