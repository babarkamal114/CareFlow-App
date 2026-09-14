'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui';
import { ChevronRight, Search, Download, X } from 'lucide-react';

const ALL_LOGS = [
  { id: 1,  time: '09:42', action: 'Care plan reviewed',        details: 'Margaret Johnson · Personal care v4',       user: 'Sarah W.',  entity: 'Plan',     entityColor: 'pastel-success', type: 'plan'     },
  { id: 2,  time: '09:28', action: 'Visit completed',           details: 'Lucy C. checked out · Arthur Wilson',       user: 'Lucy C.',   entity: 'Visit',    entityColor: 'pastel-info',    type: 'visit'    },
  { id: 3,  time: '09:15', action: 'Medication administered',   details: 'Paracetamol 500mg · Robert Ahmed',          user: 'Priya P.',  entity: 'MAR',      entityColor: 'pastel-info',    type: 'mar'      },
  { id: 4,  time: '09:01', action: 'Incident reported',         details: 'Safeguarding concern · Edna Morris',        user: 'Sarah W.',  entity: 'Incident', entityColor: 'pastel-danger',  type: 'incident' },
  { id: 5,  time: '08:47', action: 'Risk assessment updated',   details: 'Falls risk → High · Dorothy Chen',          user: 'Emma C.',   entity: 'Risk',     entityColor: 'pastel-warning', type: 'risk'     },
  { id: 6,  time: '08:30', action: 'Digital signature added',   details: 'Consent form · Barbara Williams',           user: 'Emma C.',   entity: 'Signature',entityColor: 'pastel-success', type: 'plan'     },
  { id: 7,  time: '08:12', action: 'Care plan approved',        details: 'Henry Smith · Mobility v2',                 user: 'Emma C.',   entity: 'Plan',     entityColor: 'pastel-success', type: 'plan'     },
  { id: 8,  time: '07:58', action: 'Medication omitted',        details: 'Metformin 500mg · Robert Ahmed (refused)',  user: 'Priya P.',  entity: 'MAR',      entityColor: 'pastel-warning', type: 'mar'      },
];

const ENTITY_TYPES = ['All', 'Plan', 'Visit', 'MAR', 'Incident', 'Risk', 'Signature'];

export function RecentAuditTrailCard() {
  const [search, setSearch]       = useState('');
  const [activeType, setActiveType] = useState('All');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ALL_LOGS.filter(log => {
      const matchesSearch =
        !q ||
        log.action.toLowerCase().includes(q)  ||
        log.details.toLowerCase().includes(q) ||
        log.user.toLowerCase().includes(q);
      const matchesType = activeType === 'All' || log.entity === activeType;
      return matchesSearch && matchesType;
    });
  }, [search, activeType]);

  const handleExport = () => {
    const csv = [
      ['Time', 'Action', 'Details', 'User', 'Type'].join(','),
      ...filtered.map(l =>
        [l.time, `"${l.action}"`, `"${l.details}"`, l.user, l.entity].join(',')
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'audit-trail.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="border-cf-border-light shadow-cf-sm rounded-2xl w-full h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-bold">Recent Audit Trail</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleExport}>
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
            <a href="#" className="text-sm text-cf-ink-60 hover:text-cf-ink">Full Audit Log</a>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-cf-ink-40" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by user, patient or action…"
            className="w-full pl-8 pr-8 py-2 text-sm bg-cf-surface-muted border border-cf-border rounded-lg text-cf-ink placeholder:text-cf-ink-40 focus:outline-none focus:ring-2 focus:ring-cf-brand-300"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="h-3.5 w-3.5 text-cf-ink-40" />
            </button>
          )}
        </div>

        {/* Type filter pills */}
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {ENTITY_TYPES.map(type => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                activeType === type
                  ? 'bg-cf-brand-600 text-white'
                  : 'bg-cf-surface-muted text-cf-ink-60 hover:bg-cf-border'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {filtered.length === 0 ? (
          <p className="text-sm text-cf-ink-40 text-center py-6">No entries match your search.</p>
        ) : (
          <div className="space-y-4">
            {filtered.map(log => (
              <div key={log.id} className="flex gap-4 pb-4 border-b border-cf-border last:border-b-0 last:pb-0">
                <div className="w-12 flex-shrink-0">
                  <p className="text-sm font-semibold text-cf-ink-60">{log.time}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-cf-ink">{log.action}</p>
                  <p className="text-sm text-cf-ink-60 mt-0.5">{log.details}</p>
                </div>
                <div className="text-right flex-shrink-0 space-y-1.5">
                  <p className="text-sm text-cf-ink-60">{log.user}</p>
                  <Badge variant={log.entityColor as any} className="text-xs">{log.entity}</Badge>
                </div>
                <ChevronRight className="h-5 w-5 text-cf-ink-40 flex-shrink-0 self-center" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}