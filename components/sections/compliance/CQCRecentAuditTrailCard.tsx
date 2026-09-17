'use client';

import { useState, useMemo } from 'react';
import {
  Card, CardHeader, CardTitle, CardContent, Badge, Button,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  Avatar, AvatarFallback,
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui';
import { ChevronRight, Search, Download, X, Clock, User, FileText, Tag, Monitor } from 'lucide-react';
import { toast } from 'sonner';

interface AuditLog {
  id: number;
  time: string;
  action: string;
  details: string;
  user: string;
  entity: string;
  entityColor: string;
  type: string;
  patient?: string;
  location?: string;
  device?: string;
  ipAddress?: string;
  notes?: string;
}

const ALL_LOGS: AuditLog[] = [
  { id: 1, time: '09:42', action: 'Care plan reviewed',       details: 'Margaret Johnson · Personal care v4',       user: 'Sarah W.',  entity: 'Plan',      entityColor: 'pastel-success', type: 'plan',     patient: 'Margaret Johnson', location: 'Office',    device: 'Chrome / Windows',  ipAddress: '192.168.1.42', notes: 'Reviewed and approved personal care plan v4. No changes required.' },
  { id: 2, time: '09:28', action: 'Visit completed',          details: 'Lucy C. checked out · Arthur Wilson',       user: 'Lucy C.',   entity: 'Visit',     entityColor: 'pastel-info',    type: 'visit',    patient: 'Arthur Wilson',    location: '14 Elm St', device: 'Mobile / iOS',      ipAddress: '10.0.0.15',    notes: 'Visit completed on time. Patient in good spirits. Medication given.' },
  { id: 3, time: '09:15', action: 'Medication administered',  details: 'Paracetamol 500mg · Robert Ahmed',          user: 'Priya P.',  entity: 'MAR',       entityColor: 'pastel-info',    type: 'mar',      patient: 'Robert Ahmed',     location: '42 Elm St', device: 'Mobile / Android',  ipAddress: '10.0.0.22',    notes: 'Paracetamol 500mg administered as prescribed. Patient tolerated well.' },
  { id: 4, time: '09:01', action: 'Incident reported',        details: 'Safeguarding concern · Edna Morris',        user: 'Sarah W.',  entity: 'Incident',  entityColor: 'pastel-danger',  type: 'incident', patient: 'Edna Morris',      location: '7 Oak Ave', device: 'Chrome / Windows',  ipAddress: '192.168.1.42', notes: 'Safeguarding concern raised. Manager notified immediately. Incident ref #INC-2024-041.' },
  { id: 5, time: '08:47', action: 'Risk assessment updated',  details: 'Falls risk → High · Dorothy Chen',          user: 'Emma C.',   entity: 'Risk',      entityColor: 'pastel-warning', type: 'risk',     patient: 'Dorothy Chen',     location: 'Office',    device: 'Chrome / Mac',      ipAddress: '192.168.1.10', notes: 'Falls risk escalated to High following recent near-miss. Care plan updated accordingly.' },
  { id: 6, time: '08:30', action: 'Digital signature added',  details: 'Consent form · Barbara Williams',           user: 'Emma C.',   entity: 'Signature', entityColor: 'pastel-success', type: 'plan',     patient: 'Barbara Williams', location: 'Office',    device: 'Chrome / Mac',      ipAddress: '192.168.1.10', notes: 'Consent form for data sharing signed electronically. Timestamp verified.' },
  { id: 7, time: '08:12', action: 'Care plan approved',       details: 'Henry Smith · Mobility v2',                 user: 'Emma C.',   entity: 'Plan',      entityColor: 'pastel-success', type: 'plan',     patient: 'Henry Smith',      location: 'Office',    device: 'Chrome / Mac',      ipAddress: '192.168.1.10', notes: 'Mobility care plan v2 approved after multidisciplinary review.' },
  { id: 8, time: '07:58', action: 'Medication omitted',       details: 'Metformin 500mg · Robert Ahmed (refused)',  user: 'Priya P.',  entity: 'MAR',       entityColor: 'pastel-warning', type: 'mar',      patient: 'Robert Ahmed',     location: '42 Elm St', device: 'Mobile / Android',  ipAddress: '10.0.0.22',    notes: 'Patient refused Metformin 500mg. GP notified. Next dose scheduled as normal.' },
];

const ENTITY_TYPES = ['All', 'Plan', 'Visit', 'MAR', 'Incident', 'Risk', 'Signature'];

const ENTITY_COLORS: Record<string, string> = {
  Plan: '#16a34a', Visit: '#2563eb', MAR: '#2563eb',
  Incident: '#dc2626', Risk: '#d97706', Signature: '#16a34a',
};

const getInitials = (name: string) =>
  name.split(' ').filter(Boolean).map(p => p[0]).join('').slice(0, 2).toUpperCase();

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-cf-border-light last:border-0">
      <div className="p-1.5 rounded-md bg-cf-surface-muted mt-0.5 flex-shrink-0">
        <Icon className="h-3.5 w-3.5 text-cf-ink-60" />
      </div>
      <div>
        <p className="text-xs text-cf-ink-40 font-medium uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-sm text-cf-ink font-medium">{value}</p>
      </div>
    </div>
  );
}

function AuditDrawer({ log, open, onClose }: { log: AuditLog | null; open: boolean; onClose: () => void }) {
  if (!log) return null;
  const color = ENTITY_COLORS[log.entity] ?? '#6b7280';

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[420px] sm:w-[480px] p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-cf-border-light">
          <div className="flex items-start gap-3">
            <Avatar className="h-11 w-11 border border-cf-border-light flex-shrink-0">
              <AvatarFallback className="bg-cf-surface-muted text-cf-ink-60 text-sm font-bold">
                {getInitials(log.user)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <SheetTitle className="text-base font-bold text-cf-ink leading-tight">
                  {log.action}
                </SheetTitle>
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: `${color}18`, color }}
                >
                  {log.entity}
                </span>
              </div>
              <p className="text-sm text-cf-ink-60 mt-0.5">{log.user} · Today {log.time}</p>
            </div>
          </div>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-1">
          {/* Details pill */}
          <div className="rounded-xl border border-cf-border bg-cf-surface-muted p-4 mb-2">
            <p className="text-[10px] font-bold text-cf-ink-40 uppercase tracking-widest mb-1">Details</p>
            <p className="text-sm text-cf-ink leading-relaxed">{log.details}</p>
          </div>

          <DetailRow icon={User}     label="Performed By" value={log.user} />
          <DetailRow icon={Clock}    label="Timestamp"    value={`Today · ${log.time}`} />
          {log.patient   && <DetailRow icon={FileText} label="Patient"    value={log.patient} />}
          {log.location  && <DetailRow icon={Tag}      label="Location"   value={log.location} />}
          {log.device    && <DetailRow icon={Monitor}  label="Device"     value={log.device} />}
          {log.ipAddress && <DetailRow icon={Monitor}  label="IP Address" value={log.ipAddress} />}

          {log.notes && (
            <div className="pt-3">
              <p className="text-[10px] font-bold text-cf-ink-40 uppercase tracking-widest mb-2">Notes</p>
              <p className="text-sm text-cf-ink-60 leading-relaxed bg-cf-surface-muted rounded-xl p-4 border border-cf-border">
                {log.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-cf-border-light flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">View Full Record</Button>
          <Button size="sm" className="flex-1 gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function RecentAuditTrailCard() {
  const [search, setSearch]           = useState('');
  const [activeType, setActiveType]   = useState('All');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [drawerOpen, setDrawerOpen]   = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ALL_LOGS.filter(log => {
      const matchesSearch = !q || log.action.toLowerCase().includes(q) || log.details.toLowerCase().includes(q) || log.user.toLowerCase().includes(q);
      const matchesType   = activeType === 'All' || log.entity === activeType;
      return matchesSearch && matchesType;
    });
  }, [search, activeType]);

  const openDrawer = (log: AuditLog) => { setSelectedLog(log); setDrawerOpen(true); };

  const handleExport = () => {
    const csv = [
      ['Time', 'Action', 'Details', 'User', 'Type'].join(','),
      ...filtered.map(l => [l.time, `"${l.action}"`, `"${l.details}"`, l.user, l.entity].join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'audit-trail.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Card className="border-cf-border-light shadow-cf-sm rounded-2xl w-full h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-bold">Recent Audit Trail</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleExport}>
                <Download className="h-3.5 w-3.5" />
                Export
              </Button>
              <Button variant="ghost" size="sm" className="text-xs text-cf-ink-60"
                onClick={() => toast.info('Full Audit Log coming soon')}>
                Full Audit Log
              </Button>
            </div>
          </div>

          {/* Search */}
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

          {/* Filter pills */}
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {ENTITY_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                style={activeType === type ? { backgroundColor: '#16a34a', color: '#fff', borderColor: '#16a34a' } : {}}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150 ${
                  activeType === type ? 'shadow-sm' : 'bg-white text-gray-500 border-gray-200 hover:border-green-400 hover:text-gray-700'
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
            <Table>
              <TableHeader>
                <TableRow className="border-b border-cf-border-light hover:bg-transparent">
                  <TableHead className="text-cf-ink-60 font-medium text-xs">Action</TableHead>
                  <TableHead className="text-cf-ink-60 font-medium text-xs">User</TableHead>
                  <TableHead className="text-cf-ink-60 font-medium text-xs">Time</TableHead>
                  <TableHead className="text-cf-ink-60 font-medium text-xs">Type</TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(log => (
                  <TableRow
                    key={log.id}
                    onClick={() => openDrawer(log)}
                    className="border-b border-cf-border-light hover:bg-cf-surface-muted/50 transition-colors cursor-pointer group"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-8 w-8 border border-cf-border-light flex-shrink-0">
                          <AvatarFallback className="bg-cf-surface-muted text-cf-ink-60 text-xs font-medium">
                            {getInitials(log.user)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-semibold text-cf-ink truncate">{log.action}</p>
                          <p className="text-sm text-cf-ink-60 truncate">{log.details}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-cf-ink-60 whitespace-nowrap">{log.user}</TableCell>
                    <TableCell className="text-sm text-cf-ink-60 whitespace-nowrap">{log.time}</TableCell>
                    <TableCell>
                      <Badge variant={log.entityColor as any} className="text-xs">{log.entity}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <ChevronRight className="h-5 w-5 text-cf-ink-40 group-hover:text-cf-ink transition-colors" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AuditDrawer log={selectedLog} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}