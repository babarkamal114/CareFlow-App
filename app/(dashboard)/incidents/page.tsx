'use client';

import { useMemo, useState } from 'react';
import {
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Avatar,
  AvatarFallback,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  EmptyState,
} from '@/components/ui';
import {
  Search,
  Download,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Incident, IncidentSeverity, IncidentStatus } from '@/types';
import { mockIncidents } from 'utils';
import { ReportIncidentModal, IncidentDetailDrawer, IncidentStatsSection, IncidentHeaderSection } from 'sections';

const severityDot: Record<IncidentSeverity, string> = {
  critical: 'bg-cf-red-500',
  high: 'bg-cf-red-500',
  medium: 'bg-cf-amber-500',
  low: 'bg-cf-blue-500',
};

const severityText: Record<IncidentSeverity, string> = {
  critical: 'text-cf-red-500',
  high: 'text-cf-red-500',
  medium: 'text-cf-amber-500',
  low: 'text-cf-blue-500',
};

const statusText: Record<IncidentStatus, string> = {
  reported: 'text-cf-blue-500',
  investigating: 'text-cf-amber-500',
  resolved: 'text-brand-600',
  closed: 'text-cf-ink-60',
};

const statusLabel: Record<IncidentStatus, string> = {
  reported: 'Reported',
  investigating: 'Investigating',
  resolved: 'Resolved',
  closed: 'Closed',
};

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  const handleReportIncident = (newIncident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>) => {
    const incident: Incident = {
      ...newIncident,
      id: `incident-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setIncidents([incident, ...incidents]);
  };

  const counts = useMemo(
    () => ({
      all: incidents.length,
      reported: incidents.filter((i) => i.status === 'reported').length,
      investigating: incidents.filter((i) => i.status === 'investigating').length,
      resolved: incidents.filter((i) => i.status === 'resolved').length,
    }),
    [incidents]
  );

  const filteredIncidents = useMemo(() => {
    const byStatus =
      filterStatus === 'all' ? incidents : incidents.filter((i) => i.status === filterStatus);

    const query = search.trim().toLowerCase();
    if (!query) return byStatus;

    return byStatus.filter((i) =>
      [i.title, i.patientName, i.description, i.assignedTo]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(query))
    );
  }, [incidents, filterStatus, search]);

  const handleExport = () => {
    const header = ['Title', 'Patient', 'Severity', 'Status', 'Assigned To', 'Reported'];
    const rows = filteredIncidents.map((i) => [
      i.title,
      i.patientName,
      i.severity,
      i.status,
      i.assignedTo,
      new Date(i.createdAt).toLocaleDateString(),
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'incidents-export.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="h-full w-full overflow-y-scroll no-scrollbar">
        <div className="rounded-2xl bg-cf-surface shadow-cf-md p-6 space-y-6">
          <div className="pb-4 border-b border-cf-border-light">
            <IncidentHeaderSection onReportIncident={setReportOpen as any} />
          </div>

          <IncidentStatsSection incidents={incidents} />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Tabs value={filterStatus} onValueChange={(v) => setFilterStatus(v as string)}>
              <TabsList>
                <TabsTrigger value="all">
                  All <span className="ml-1 text-cf-ink-40">({counts.all})</span>
                </TabsTrigger>
                <TabsTrigger value="reported">
                  Reported <span className="ml-1 text-cf-ink-40">({counts.reported})</span>
                </TabsTrigger>
                <TabsTrigger value="investigating">
                  Investigating <span className="ml-1 text-cf-ink-40">({counts.investigating})</span>
                </TabsTrigger>
                <TabsTrigger value="resolved">
                  Resolved <span className="ml-1 text-cf-ink-40">({counts.resolved})</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <InputGroup className="w-64">
                <InputGroupAddon>
                  <Search className="h-4 w-4" />
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="Search incidents..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
              <Button variant="outline" className="gap-2" onClick={handleExport}>
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="mt-6">
            {filteredIncidents.length === 0 ? (
              <EmptyState
                icon={<ShieldAlert />}
                title="No incidents found"
                description="Try adjusting your search or filters, or report a new incident."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Incident</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Reported</TableHead>
                    <TableHead className="w-8" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIncidents.map((incident) => (
                    <TableRow
                      key={incident.id}
                      onClick={() => {
                        setSelectedIncident(incident);
                        setDrawerOpen(true);
                      }}
                      className="cursor-pointer"
                    >
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="font-semibold text-cf-ink">{incident.title}</p>
                          <p className="mt-0.5 truncate text-xs text-cf-ink-60">
                            {incident.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar size="sm" shape="square">
                            <AvatarFallback>{getInitials(incident.patientName)}</AvatarFallback>
                          </Avatar>
                          <span className="text-cf-ink">{incident.patientName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5">
                          <span className={`size-1.5 rounded-full ${severityDot[incident.severity]}`} />
                          <span className={`font-medium capitalize ${severityText[incident.severity]}`}>
                            {incident.severity}
                          </span>
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${statusText[incident.status]}`}>
                          {statusLabel[incident.status]}
                        </span>
                      </TableCell>
                      <TableCell className="text-cf-ink-60">{incident.assignedTo}</TableCell>
                      <TableCell className="text-cf-ink-60">
                        {new Date(incident.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <ChevronRight className="h-4 w-4 text-cf-ink-40" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>

      <ReportIncidentModal
        open={reportOpen}
        onOpenChange={setReportOpen}
        onSubmit={handleReportIncident}
      />
      <IncidentDetailDrawer
        incident={selectedIncident}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </>
  );
}