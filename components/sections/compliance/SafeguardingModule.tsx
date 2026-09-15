'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui';
import { Shield, ChevronRight, AlertTriangle, CheckCircle2, Clock, Plus, X } from 'lucide-react';

type ConcernStatus = 'open' | 'investigating' | 'resolved';
type AbuseCategory =
  | 'Physical' | 'Emotional' | 'Financial' | 'Neglect'
  | 'Sexual' | 'Discriminatory' | 'Self-neglect' | 'Modern Slavery';

interface SafeguardingConcern {
  id: string;
  patient: string;
  category: AbuseCategory;
  reportedBy: string;
  reportedAt: string;
  status: ConcernStatus;
  chain: { role: string; name: string; notified: boolean; notifiedAt?: string }[];
  outcome?: string;
}

const MOCK_CONCERNS: SafeguardingConcern[] = [
  {
    id: 'sg1',
    patient: 'Edna Morris',
    category: 'Neglect',
    reportedBy: 'Sarah W.',
    reportedAt: 'Today 09:01',
    status: 'investigating',
    chain: [
      { role: 'Safeguarding Lead', name: 'Emma C.',        notified: true,  notifiedAt: '09:03' },
      { role: 'Registered Manager', name: 'Dr R. Patel',  notified: true,  notifiedAt: '09:05' },
      { role: 'Local Authority MASH', name: 'MASH Team',  notified: false },
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
      { role: 'Safeguarding Lead',   name: 'Emma C.',     notified: true, notifiedAt: '14:25' },
      { role: 'Registered Manager',  name: 'Dr R. Patel', notified: true, notifiedAt: '14:28' },
      { role: 'Local Authority MASH',name: 'MASH Team',   notified: true, notifiedAt: '15:10' },
    ],
    outcome: 'Concern investigated. No further action required. Care plan updated.',
  },
];

const STATUS_CONFIG: Record<ConcernStatus, { label: string; badge: string; icon: React.ElementType; iconClass: string }> = {
  open:          { label: 'Open',          badge: 'pastel-danger',  icon: AlertTriangle, iconClass: 'text-[var(--cf-error)]'   },
  investigating: { label: 'Investigating', badge: 'pastel-warning', icon: Clock,         iconClass: 'text-[var(--cf-warning)]' },
  resolved:      { label: 'Resolved',      badge: 'pastel-success', icon: CheckCircle2,  iconClass: 'text-[var(--cf-success)]' },
};

const ABUSE_CATEGORIES: AbuseCategory[] = [
  'Physical', 'Emotional', 'Financial', 'Neglect',
  'Sexual', 'Discriminatory', 'Self-neglect', 'Modern Slavery',
];

function NotificationChain({ chain }: { chain: SafeguardingConcern['chain'] }) {
  return (
    <div className="mt-3 space-y-1.5">
      <p className="text-xs font-semibold text-cf-ink-60 uppercase tracking-wide mb-2">Notification Chain</p>
      {chain.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${step.notified ? 'bg-[var(--cf-success)]' : 'bg-cf-border'}`}>
            {step.notified && <CheckCircle2 className="w-3 h-3 text-white" />}
          </div>
          <span className="text-xs text-cf-ink flex-1">{step.role} — <span className="font-medium">{step.name}</span></span>
          {step.notified
            ? <span className="text-xs text-cf-ink-40">{step.notifiedAt}</span>
            : <span className="text-xs text-[var(--cf-warning)] font-medium">Pending</span>
          }
        </div>
      ))}
    </div>
  );
}

function NewConcernForm({ onClose }: { onClose: () => void }) {
  const [category, setCategory] = useState<AbuseCategory | ''>('');
  return (
    <div className="border border-cf-border rounded-xl p-4 bg-cf-surface-muted space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-cf-ink">New Safeguarding Concern</p>
        <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close"><X className="h-4 w-4 text-cf-ink-40" /></Button>
      </div>
      <div className="space-y-2">
        <input placeholder="Patient name" className="w-full px-3 py-2 text-sm border border-cf-border rounded-lg bg-white text-cf-ink placeholder:text-cf-ink-40 focus:outline-none focus:ring-2 focus:ring-cf-brand-300" />
        <select
          value={category}
          onChange={e => setCategory(e.target.value as AbuseCategory)}
          className="w-full px-3 py-2 text-sm border border-cf-border rounded-lg bg-white text-cf-ink focus:outline-none focus:ring-2 focus:ring-cf-brand-300"
        >
          <option value="">Select abuse category…</option>
          {ABUSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <textarea
          placeholder="Describe the concern…"
          rows={3}
          className="w-full px-3 py-2 text-sm border border-cf-border rounded-lg bg-white text-cf-ink placeholder:text-cf-ink-40 focus:outline-none focus:ring-2 focus:ring-cf-brand-300 resize-none"
        />
      </div>
      <div className="flex gap-2">
        <Button size="sm" className="flex-1">Submit &amp; Notify Chain</Button>
        <Button size="sm" variant="outline" onClick={onClose}>Cancel</Button>
      </div>
      <p className="text-xs text-cf-ink-40">Submitting will automatically notify the Safeguarding Lead, Registered Manager, and (where applicable) the Local Authority MASH team.</p>
    </div>
  );
}

export function SafeguardingModule() {
  const [expanded, setExpanded]   = useState<string | null>(null);
  const [showForm, setShowForm]   = useState(false);
  const concerns = MOCK_CONCERNS;
  const open = concerns.filter(c => c.status !== 'resolved').length;

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
            {open > 0 && (
              <Badge variant="pastel-danger" shape="pill" badgeSize="sm">{open} open</Badge>
            )}
            <Button size="sm" variant="brandOutline" className="gap-1" onClick={() => setShowForm(v => !v)}>
              <Plus className="h-3.5 w-3.5" />
              Report
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {showForm && <NewConcernForm onClose={() => setShowForm(false)} />}

        {concerns.map(concern => {
          const cfg  = STATUS_CONFIG[concern.status];
          const Icon = cfg.icon;
          const isOpen = expanded === concern.id;

          return (
            <div key={concern.id} className="border border-cf-border rounded-xl overflow-hidden">
              {/* Row */}
              <Button
                variant="ghost"
                onClick={() => setExpanded(isOpen ? null : concern.id)}
                className="w-full h-auto flex items-center justify-start gap-3 p-3 hover:bg-cf-surface-muted transition-colors text-left rounded-none"
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${cfg.iconClass}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-cf-ink">{concern.patient}</p>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--cf-error-muted)] text-[var(--cf-error)] font-medium flex-shrink-0">{concern.category}</span>
                  </div>
                  <p className="text-xs text-cf-ink-60 mt-0.5">Reported by {concern.reportedBy} · {concern.reportedAt}</p>
                </div>
                <Badge variant={cfg.badge as any} badgeSize="sm" shape="pill">{cfg.label}</Badge>
                <ChevronRight className={`h-4 w-4 text-cf-ink-40 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
              </Button>

              {/* Expanded detail */}
              {isOpen && (
                <div className="px-4 pb-4 border-t border-cf-border bg-cf-surface-muted">
                  <NotificationChain chain={concern.chain} />
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
                      <Button size="sm" variant="brandOutline" className="text-xs">
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}