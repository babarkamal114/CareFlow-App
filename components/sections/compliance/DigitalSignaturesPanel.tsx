'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui';
import { PenLine, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

type SigStatus = 'signed' | 'pending' | 'overdue';

interface SignatureItem {
  id: string;
  document: string;
  patient: string;
  type: 'Care Plan' | 'Consent Form' | 'Medication Auth';
  assignedTo: string;
  dueDate: string;
  status: SigStatus;
  signedAt?: string;
}

const MOCK_SIGNATURES: SignatureItem[] = [
  { id: 's1', document: 'Personal Care Plan v4',        patient: 'Margaret Johnson', type: 'Care Plan',       assignedTo: 'Emma C.',   dueDate: 'Today',      status: 'signed',  signedAt: '09:42 today' },
  { id: 's2', document: 'Medication Authorisation',     patient: 'Robert Ahmed',     type: 'Medication Auth', assignedTo: 'Priya P.',  dueDate: 'Today',      status: 'pending'  },
  { id: 's3', document: 'Consent Form — Data Sharing',  patient: 'Barbara Williams', type: 'Consent Form',    assignedTo: 'Emma C.',   dueDate: 'Today',      status: 'signed',  signedAt: '08:30 today' },
  { id: 's4', document: 'Mobility Care Plan v2',        patient: 'Henry Smith',      type: 'Care Plan',       assignedTo: 'Emma C.',   dueDate: 'Yesterday',  status: 'overdue'  },
  { id: 's5', document: 'End-of-Life Care Plan',        patient: 'Dorothy Chen',     type: 'Care Plan',       assignedTo: 'Sarah W.',  dueDate: 'Tomorrow',   status: 'pending'  },
  { id: 's6', document: 'Consent Form — Family Access', patient: 'Arthur Wilson',    type: 'Consent Form',    assignedTo: 'Emma C.',   dueDate: '18 Apr',     status: 'pending'  },
];

const STATUS_CONFIG: Record<SigStatus, { icon: React.ElementType; label: string; badge: string; iconClass: string }> = {
  signed:  { icon: CheckCircle2,   label: 'Signed',   badge: 'pastel-success', iconClass: 'text-[var(--cf-success)]'  },
  pending: { icon: Clock,          label: 'Pending',  badge: 'pastel-warning', iconClass: 'text-[var(--cf-warning)]'  },
  overdue: { icon: AlertTriangle,  label: 'Overdue',  badge: 'pastel-danger',  iconClass: 'text-[var(--cf-error)]'    },
};

const TYPE_COLORS: Record<SignatureItem['type'], string> = {
  'Care Plan':       'bg-[var(--cf-info-muted)] text-[var(--cf-info)]',
  'Consent Form':    'bg-cf-surface-muted text-cf-ink-60',
  'Medication Auth': 'bg-[var(--cf-warning-muted)] text-[var(--cf-warning)]',
};

export function DigitalSignaturesPanel() {
  const [items, setItems] = useState(MOCK_SIGNATURES);

  const pending  = items.filter(i => i.status === 'pending').length;
  const overdue  = items.filter(i => i.status === 'overdue').length;

  const handleSign = (id: string) => {
    setItems(prev => prev.map(i =>
      i.id === id
        ? { ...i, status: 'signed' as SigStatus, signedAt: 'Just now' }
        : i
    ));
  };

  return (
    <Card className="border-cf-border-light shadow-cf-sm rounded-2xl w-full h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cf-brand-50">
              <PenLine className="h-4 w-4 text-cf-brand-600" />
            </div>
            <div>
              <CardTitle className="font-bold text-cf-ink">Digital Signatures</CardTitle>
              <p className="text-xs text-cf-ink-60">Care plans, consent & medication authorisations</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {overdue > 0 && (
              <Badge variant="pastel-danger" shape="pill" badgeSize="sm">{overdue} overdue</Badge>
            )}
            {pending > 0 && (
              <Badge variant="pastel-warning" shape="pill" badgeSize="sm">{pending} pending</Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2.5">
        {items.map(item => {
          const cfg  = STATUS_CONFIG[item.status];
          const Icon = cfg.icon;
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-cf-border bg-white hover:bg-cf-surface-muted transition-colors"
            >
              <Icon className={`h-4 w-4 flex-shrink-0 ${cfg.iconClass}`} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-cf-ink truncate">{item.document}</p>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0 ${TYPE_COLORS[item.type]}`}>
                    {item.type}
                  </span>
                </div>
                <p className="text-xs text-cf-ink-60">{item.patient}</p>
                <p className="text-xs text-cf-ink-40 mt-0.5">
                  {item.status === 'signed'
                    ? `Signed by ${item.assignedTo} · ${item.signedAt}`
                    : `Assigned to ${item.assignedTo} · Due ${item.dueDate}`
                  }
                </p>
              </div>

              {item.status === 'signed' ? (
                <Badge variant="pastel-success" badgeSize="sm" shape="pill">Signed</Badge>
              ) : (
                <Button
                  size="sm"
                  variant={item.status === 'overdue' ? 'destructive' : 'brandOutline'}
                  className="text-xs flex-shrink-0"
                  onClick={() => handleSign(item.id)}
                >
                  Sign now
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}