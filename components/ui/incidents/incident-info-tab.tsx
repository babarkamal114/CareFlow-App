'use client';

import { Card, Badge, ScrollArea } from '@/components/ui';
import { MapPin, UserRound, AlertCircle } from 'lucide-react';
import { Incident } from 'types';
import {
  getIncidentDetailFields,
  getSeverityBadgeVariant,
  getSeverityLabel,
  getIncidentStatusHistory,
} from 'utils';

interface IncidentInfoTabProps {
  incident: Incident;
}

export function IncidentInfoTab({ incident }: IncidentInfoTabProps) {
  const detailFields = getIncidentDetailFields(incident);
  const statusHistory = getIncidentStatusHistory(incident);

  return (
    <ScrollArea className="h-[calc(100vh-280px)] pr-4">
      <div className="space-y-4 pb-4">
        <Card className="border-cf-border p-4">
          <p className="text-sm font-semibold text-cf-ink mb-2">Description</p>
          <p className="text-sm text-cf-ink whitespace-pre-wrap">
            {incident.description}
          </p>
        </Card>

        <Card className="border-cf-border p-4">
          <p className="text-sm font-semibold text-cf-ink mb-4">Incident Details</p>
          <div className="grid grid-cols-2 gap-4">
            {detailFields.map((field) => (
              <div key={field.label}>
                <p className="text-xs text-cf-ink-60 mb-1">{field.label}</p>
                <div className="flex items-center gap-2">
                  <field.icon className="h-4 w-4 text-cf-ink-40" />
                  <p className="font-medium text-cf-ink">{field.value}</p>
                </div>
              </div>
            ))}
            <div>
              <p className="text-xs text-cf-ink-60 mb-1">Severity</p>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-cf-ink-40" />
                <Badge
                  variant={getSeverityBadgeVariant(incident.severity)}
                  badgeSize={'md'}
                  shape={'pill'}
                >
                  {getSeverityLabel(incident.severity)}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {incident.location && (
          <Card className="border-cf-border p-4">
            <p className="text-sm font-semibold text-cf-ink mb-2">Location</p>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-cf-ink-40" />
              <p className="text-sm text-cf-ink">{incident.location}</p>
            </div>
          </Card>
        )}

        <Card className="border-cf-border p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-cf-ink">Witnesses</p>
            <Badge variant="pastel-neutral" badgeSize={'sm'} shape={'pill'}>
              {incident.witnesses?.length || 0}
            </Badge>
          </div>
          {incident.witnesses && incident.witnesses.length > 0 ? (
            <div className="space-y-2">
              {incident.witnesses.map((witness, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-cf-surface-muted rounded-lg">
                  <UserRound className="h-3.5 w-3.5 text-cf-ink-40" />
                  <span className="text-sm text-cf-ink">{witness}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-cf-ink-60">No witnesses recorded</p>
          )}
        </Card>

        <Card className="border-cf-border p-4">
          <p className="text-sm font-semibold text-cf-ink mb-4">Status History</p>
          <div className="space-y-3">
            {statusHistory.map((entry) => (
              <div key={entry.label} className="flex items-start gap-3">
                <div
                  className={`h-2 w-2 rounded-full mt-1.5 ${entry.dotClass} ${
                    entry.animate ? 'animate-pulse' : ''
                  }`}
                />
                <div>
                  <p className="text-sm text-cf-ink">{entry.label}</p>
                  <p className="text-xs text-cf-ink-60">{entry.note}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ScrollArea>
  );
}