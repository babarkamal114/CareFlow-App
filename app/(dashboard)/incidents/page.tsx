'use client';

import { useState } from 'react';
import { Card, Badge, Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { Incident } from '@/types';
import { mockIncidents } from 'utils';
import { ReportIncidentModal, IncidentDetailDrawer, IncidentStatsSection, IncidentHeaderSection } from 'sections';


export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const handleReportIncident = (newIncident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>) => {
    const incident: Incident = {
      ...newIncident,
      id: `incident-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setIncidents([incident, ...incidents]);
  };

  const filteredIncidents =
    filterStatus === 'all'
      ? incidents
      : incidents.filter((i) => i.status === filterStatus);



  return (
    <>
      <div className="h-full w-full  space-y-8 overflow-y-scroll no-scrollbar">
        <IncidentHeaderSection onReportIncident={setReportOpen as any}/>

        <IncidentStatsSection incidents={incidents}/>

        <Card className="border-cf-border p-6">
          <Tabs defaultValue="all" onValueChange={setFilterStatus}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="reported">Reported</TabsTrigger>
              <TabsTrigger value="investigating">Investigating</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mt-6 space-y-3">
            {filteredIncidents.map((incident) => (
              <div
                key={incident.id}
                onClick={() => {
                  setSelectedIncident(incident);
                  setDrawerOpen(true);
                }}
                className="p-4 border border-cf-border rounded-lg hover:bg-cf-surface-muted transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-cf-ink">{incident.title}</h3>
                      <Badge
                        variant={
                          incident.severity === 'critical'
                            ? 'pastel-danger'
                            : incident.severity === 'high'
                            ? 'pastel-danger'
                            : incident.severity === 'medium'
                            ? 'pastel-warning'
                            : 'pastel-info'
                        }
                        shape={'pill'}
                        badgeSize={'md'}
                      >
                        {incident.severity}
                      </Badge>
                      <Badge
                        variant={
                          incident.status === 'reported'
                            ? 'pastel-info'
                            : incident.status === 'investigating'
                            ? 'pastel-warning'
                            : 'pastel-success'
                        }
                        shape={'pill'}
                        badgeSize={'md'}
                      >
                        {incident.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-cf-ink-60 mb-2">{incident.description}</p>
                    <div className="flex items-center gap-4 text-xs text-cf-ink-60">
                      <span>Patient: {incident.patientName}</span>
                      <span>Reported: {incident.createdAt.toLocaleDateString()}</span>
                      <span>Assigned to: {incident.assignedTo}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {incident.nextReviewDate && (
                      <p className="text-xs text-cf-ink-60">
                        Review: {incident.nextReviewDate.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
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