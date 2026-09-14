'use client';

import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { ChevronRight } from 'lucide-react';

const regulationsMockData = [
  {
    id: 1,
    title: 'Reg 12 — Safe Care & Treatment',
    description: 'Risk assessments, medication safety, infection control',
    status: 'Compliant' as const,
    progress: 100,
  },
  {
    id: 2,
    title: 'Reg 17 — Good Governance',
    description: 'Audit trails, record keeping, quality monitoring',
    status: 'Compliant' as const,
    progress: 95,
  },
  {
    id: 3,
    title: 'Reg 9 — Person-Centred Care',
    description: 'Care plan reviews overdue, preference matching gaps',
    status: 'Attention' as const,
    progress: 70,
  },
  {
    id: 4,
    title: 'Reg 13 — Safeguarding',
    description: 'Safeguarding workflows, DBS tracking, training',
    status: 'Compliant' as const,
    progress: 92,
  },
  {
    id: 5,
    title: 'Reg 18 — Staffing',
    description: 'Expired training certs, supervision overdue for 4 staff',
    status: 'Risk' as const,
    progress: 65,
  },
];

const getStatusColor = (status: string) => {
  if (status === 'Compliant') return '#16a34a';
  if (status === 'Attention') return '#f59e0b';
  return '#dc2626';
};

const getStatusBadge = (status: string) => {
  if (status === 'Compliant') return 'pastel-success';
  if (status === 'Attention') return 'pastel-warning';
  return 'pastel-danger';
};

const getBorderColor = (status: string) => {
  if (status === 'Compliant') return 'border-l-4 border-l-green-600';
  if (status === 'Attention') return 'border-l-4 border-l-amber-500';
  return 'border-l-4 border-l-red-600';
};

export function KeyRegulationsCard() {
  return (
    <Card className="border-cf-border-light shadow-cf-sm rounded-2xl w-full h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-bold">Key Regulations</CardTitle>
          <a href="#" className="text-sm text-cf-ink-60 hover:text-cf-ink">
            View All 31
          </a>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {regulationsMockData.map((reg) => (
            <div
              key={reg.id}
              className={`p-4 rounded-lg border border-cf-border ${getBorderColor(reg.status)} bg-white hover:bg-cf-surface-muted transition-colors`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-cf-ink">{reg.title}</h3>
                  <p className="text-sm text-cf-ink-60 mt-1">{reg.description}</p>
                </div>
                <Badge variant={getStatusBadge(reg.status) as any} className="ml-4 flex-shrink-0">
                  {reg.status}
                </Badge>
              </div>
              <div className="w-full bg-cf-border rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${reg.progress}%`,
                    backgroundColor: getStatusColor(reg.status),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}