'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui';
import { Shield, Plus } from 'lucide-react';
import { SafeguardingConcernRow } from '@/components/ui';
import type { SafeguardingConcern } from '@/components/ui';

const MOCK_CONCERNS: SafeguardingConcern[] = [
  {
    id: 'sg1',
    patient: 'Edna Morris',
    category: 'Neglect',
    reportedBy: 'Sarah W.',
    reportedAt: 'Today 09:01',
    status: 'investigating',
    chain: [
      { role: 'Safeguarding Lead', name: 'Emma C.', notified: true, notifiedAt: '09:03' },
      { role: 'Registered Manager', name: 'Dr R. Patel', notified: true, notifiedAt: '09:05' },
      { role: 'Local Authority MASH', name: 'MASH Team', notified: false },
    ],
  },
  {
    id: 'sg2',
    patient: 'Dorothy Chen',
    category: 'Financial',
    reportedBy: 'Lucy C.',
    reportedAt: '12 Apr 14:22',
    status: 'resolved',
    chain: [
      { role: 'Safeguarding Lead', name: 'Emma C.', notified: true, notifiedAt: '14:25' },
      { role: 'Registered Manager', name: 'Dr R. Patel', notified: true, notifiedAt: '14:28' },
      { role: 'Local Authority MASH', name: 'MASH Team', notified: true, notifiedAt: '15:10' },
    ],
    outcome: 'Concern investigated. No further action required. Care plan updated.',
  },
];

export function SafeguardingModule() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [concerns, setConcerns] = useState<SafeguardingConcern[]>(MOCK_CONCERNS);

  const openCount = concerns.filter((c) => c.status !== 'resolved').length;

  const handleMarkResolved = (id: string) => {
    setConcerns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'resolved' } : c))
    );
  };

  return (
    <Card className="border-cf-border-light shadow-cf-sm rounded-2xl w-full h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[var(--cf-error-muted)]">
              <Shield className="h-4 w-4 text-[var(--cf-error)]" />
            </div>
            <div>
              <CardTitle className="font-bold text-cf-ink">Safeguarding</CardTitle>
              <p className="text-xs text-cf-ink-60">Concerns, notifications &amp; outcomes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {openCount > 0 && (
              <Badge variant="pastel-danger" shape="pill" badgeSize="sm">
                {openCount} open
              </Badge>
            )}
            <Button size="sm" variant="brandOutline" className="gap-1">
              <Plus className="h-3.5 w-3.5" />
              Report
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {concerns.map((concern) => (
          <SafeguardingConcernRow
            key={concern.id}
            concern={concern}
            expanded={expanded === concern.id}
            onToggle={() => setExpanded(expanded === concern.id ? null : concern.id)}
            onMarkResolved={handleMarkResolved}
          />
        ))}
      </CardContent>
    </Card>
  );
}
