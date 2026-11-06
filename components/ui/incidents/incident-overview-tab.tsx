'use client';

import {
  Badge,
  Card,
  ScrollArea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui';
import { CircleHelp, ShieldAlert } from 'lucide-react';
import { Incident } from 'types';
import {
  getIncidentDetailFields,
  getIncidentFlags,
  getIncidentStatusHistory,
  getSeverityBadgeVariant,
  getSeverityLabel,
  getStatusBadgeVariant,
  getWitnessNames,
  isIncidentFlagged,
} from 'utils';

interface IncidentOverviewTabProps {
  incident: Incident;
}

function NarrativeBlock({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-cf-ink-60">{label}</p>
      <p className="text-sm text-cf-ink whitespace-pre-wrap">
        {value?.trim() ? value : 'Not recorded'}
      </p>
    </div>
  );
}

export function IncidentOverviewTab({ incident }: IncidentOverviewTabProps) {
  const detailFields = getIncidentDetailFields(incident);
  const statusHistory = getIncidentStatusHistory(incident);
  const flags = getIncidentFlags(incident);
  const witnesses = getWitnessNames(incident);

  return (
    <ScrollArea className="h-[calc(100vh-260px)] pr-4">
      <div className="space-y-4 pb-4">
        <Card className="border-cf-border p-4">
          <div className="mb-4 flex items-center gap-1.5">
            <p className="text-sm font-semibold text-cf-ink">Notifiable &amp; safeguarding flags</p>
            <Tooltip>
              <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
                <CircleHelp className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                Statutory reporting triggers set when the incident was raised.
                CQC and RIDDOR notifications have a fixed deadline, so an
                inspector will check these dates first.
              </TooltipContent>
            </Tooltip>
          </div>
          {isIncidentFlagged(incident) ? (
            <div className="space-y-2">
              {flags.map((flag) => (
                <div key={flag.id} className="flex items-start gap-2">
                  <ShieldAlert className="mt-0.5 size-4 shrink-0 text-cf-red-500" />
                  <div>
                    <Badge variant="softDanger" shape="pill" badgeSize="sm">
                      {flag.label}
                    </Badge>
                    <p className="mt-1 text-xs text-cf-ink-60">{flag.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-cf-ink-60">
              No CQC, RIDDOR or safeguarding reporting triggers were set for this incident.
            </p>
          )}
        </Card>

        <Card className="space-y-3 border-cf-border p-4">
          <p className="text-sm font-semibold text-cf-ink">What happened</p>
          <NarrativeBlock label="Antecedent" value={incident.antecedent} />
          <NarrativeBlock label="Description" value={incident.description} />
          <NarrativeBlock label="Consequence" value={incident.consequence} />
        </Card>

        <Card className="border-cf-border p-4">
          <p className="mb-4 text-sm font-semibold text-cf-ink">Incident details</p>
          <div className="grid grid-cols-2 gap-4">
            {detailFields.map((field) => (
              <div key={field.label}>
                <p className="mb-1 text-xs text-cf-ink-60">{field.label}</p>
                <div className="flex items-center gap-2">
                  <field.icon className="size-4 text-cf-ink-40" />
                  <p className="font-medium text-cf-ink">{field.value}</p>
                </div>
              </div>
            ))}
            <div>
              <p className="mb-1 text-xs text-cf-ink-60">Severity</p>
              <Badge
                variant={getSeverityBadgeVariant(incident.severity)}
                badgeSize="md"
                shape="pill"
              >
                {getSeverityLabel(incident.severity)}
              </Badge>
            </div>
            <div>
              <p className="mb-1 text-xs text-cf-ink-60">Status</p>
              <Badge
                variant={getStatusBadgeVariant(incident.status)}
                badgeSize="md"
                shape="pill"
              >
                {incident.status}
              </Badge>
            </div>
            {incident.location && (
              <div className="col-span-2">
                <p className="mb-1 text-xs text-cf-ink-60">Location</p>
                <p className="text-sm font-medium text-cf-ink">{incident.location}</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="border-cf-border p-4">
          <p className="mb-3 text-sm font-semibold text-cf-ink">Witnesses</p>
          {witnesses.length > 0 ? (
            <div className="space-y-2">
              {witnesses.map((witness) => (
                <div
                  key={witness}
                  className="flex items-center gap-2 rounded-lg bg-cf-surface-muted p-2"
                >
                  <span className="text-sm text-cf-ink">{witness}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-cf-ink-60">No witnesses recorded</p>
          )}
        </Card>

        <Card className="border-cf-border p-4">
          <p className="mb-4 text-sm font-semibold text-cf-ink">Status history</p>
          <div className="space-y-3">
            {statusHistory.map((entry) => (
              <div key={entry.label} className="flex items-start gap-3">
                <div
                  className={`mt-1.5 size-2 rounded-full ${entry.dotClass} ${
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