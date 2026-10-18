'use client';

import { Badge, Button } from '@/components/ui';
import { AlertTriangle, CheckCircle2, ChevronRight, Clock, Shield } from 'lucide-react';
import { SafeguardingNotificationChain } from './safeguarding-notification-chain';

export type ConcernStatus = 'open' | 'investigating' | 'resolved';
export type AbuseCategory =
  | 'Physical' | 'Emotional' | 'Financial' | 'Neglect'
  | 'Sexual' | 'Discriminatory' | 'Self-neglect' | 'Modern Slavery';

export interface SafeguardingConcern {
  id: string;
  patient: string;
  category: AbuseCategory;
  reportedBy: string;
  reportedAt: string;
  status: ConcernStatus;
  chain: { role: string; name: string; notified: boolean; notifiedAt?: string }[];
  outcome?: string;
}

const STATUS_CONFIG: Record<
  ConcernStatus,
  { label: string; badge: string; icon: React.ElementType; iconClass: string }
> = {
  open:          { label: 'Open',          badge: 'pastel-danger',  icon: AlertTriangle, iconClass: 'text-[var(--cf-error)]'   },
  investigating: { label: 'Investigating', badge: 'pastel-warning', icon: Clock,         iconClass: 'text-[var(--cf-warning)]' },
  resolved:      { label: 'Resolved',      badge: 'pastel-success', icon: CheckCircle2,  iconClass: 'text-[var(--cf-success)]' },
};

interface SafeguardingConcernRowProps {
  concern: SafeguardingConcern;
  expanded: boolean;
  onToggle: () => void;
  onMarkResolved: (id: string) => void;
}

export function SafeguardingConcernRow({
  concern,
  expanded,
  onToggle,
  onMarkResolved,
}: SafeguardingConcernRowProps) {
  const cfg = STATUS_CONFIG[concern.status];
  const Icon = cfg.icon;

  return (
    <div className="border border-cf-border rounded-xl overflow-hidden">
      <Button
        variant="ghost"
        onClick={onToggle}
        className="w-full h-auto flex items-center justify-start gap-3 p-3 hover:bg-cf-surface-muted transition-colors text-left rounded-none"
      >
        <Icon className={`h-4 w-4 flex-shrink-0 ${cfg.iconClass}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-cf-ink">{concern.patient}</p>
            <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--cf-error-muted)] text-[var(--cf-error)] font-medium flex-shrink-0">
              {concern.category}
            </span>
          </div>
          <p className="text-xs text-cf-ink-60 mt-0.5">
            Reported by {concern.reportedBy} · {concern.reportedAt}
          </p>
        </div>
        <Badge variant={cfg.badge as any} badgeSize="sm" shape="pill">
          {cfg.label}
        </Badge>
        <ChevronRight
          className={`h-4 w-4 text-cf-ink-40 transition-transform ${expanded ? 'rotate-90' : ''}`}
        />
      </Button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-cf-border bg-cf-surface-muted">
          <SafeguardingNotificationChain chain={concern.chain} />
          {concern.outcome && (
            <div className="mt-3 p-2.5 rounded-lg bg-[var(--cf-success-muted)] border border-[var(--cf-success)]/20">
              <p className="text-xs font-semibold text-[var(--cf-success)] mb-1">Outcome</p>
              <p className="text-xs text-cf-ink-60">{concern.outcome}</p>
            </div>
          )}
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline" className="text-xs gap-1">
              <Shield className="h-3 w-3" />
              Package Evidence
            </Button>
            {concern.status !== 'resolved' && (
              <Button
                size="sm"
                variant="brandOutline"
                className="text-xs"
                onClick={() => onMarkResolved(concern.id)}
              >
                Mark Resolved
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
