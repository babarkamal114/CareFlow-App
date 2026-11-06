'use client';

import {
  Badge,
  Card,
  ScrollArea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui';
import { CircleHelp, HeartPulse } from 'lucide-react';
import { Incident } from 'types';
import {
  getBodyMarkTypeLabel,
  getIncidentInjuryCount,
  getInjurySeverityLabel,
  getInjurySeverityVariant,
} from 'utils';

interface IncidentInjuriesTabProps {
  incident: Incident;
}

export function IncidentInjuriesTab({ incident }: IncidentInjuriesTabProps) {
  const injuries = incident.injuryDetails ?? [];
  const markings = incident.bodyMapMarkings ?? [];

  return (
    <ScrollArea className="h-[calc(100vh-260px)] pr-4">
      <div className="space-y-4 pb-4">
        <Card className="border-cf-border p-4">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-cf-ink">Injuries observed</p>
            <Tooltip>
              <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
                <CircleHelp className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                Whether any physical injury or mark was seen or reported at the
                time of the incident. Marks that are not painful still count.
              </TooltipContent>
            </Tooltip>
          </div>
          {incident.injuriesObserved ? (
            <p className="mt-2 text-sm text-cf-ink">
              {getIncidentInjuryCount(incident) > 0
                ? `${getIncidentInjuryCount(incident)} injury record(s) and ${markings.length} body map marking(s) logged.`
                : 'Injuries were observed but no detail was recorded.'}
            </p>
          ) : (
            <p className="mt-2 text-sm text-cf-ink-60">
              No injuries were observed or reported.
            </p>
          )}
        </Card>

        <Card className="border-cf-border p-4">
          <p className="mb-4 text-sm font-semibold text-cf-ink">Injury details</p>
          {injuries.length > 0 ? (
            <div className="space-y-3">
              {injuries.map((injury) => (
                <div
                  key={injury.id}
                  className="rounded-lg bg-cf-surface-muted p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-cf-ink">
                      {injury.bodyPart || 'Unspecified body part'}
                    </p>
                    <Badge
                      variant={getInjurySeverityVariant(injury.severity)}
                      shape="pill"
                      badgeSize="sm"
                    >
                      {getInjurySeverityLabel(injury.severity)}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-cf-ink">
                    {injury.description || 'No description recorded'}
                  </p>
                  {injury.photoUrls && injury.photoUrls.length > 0 && (
                    <p className="mt-1 text-xs text-cf-ink-60">
                      {injury.photoUrls.length} photo(s) attached
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center">
              <HeartPulse className="mx-auto mb-2 size-8 text-cf-ink-40" />
              <p className="text-sm text-cf-ink-60">No injuries recorded</p>
            </div>
          )}
        </Card>

        <Card className="border-cf-border p-4">
          <div className="mb-4 flex items-center gap-1.5">
            <p className="text-sm font-semibold text-cf-ink">Body map markings</p>
            <Tooltip>
              <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
                <CircleHelp className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                Every mark plotted at the time of the incident. Patterns across
                dates can indicate a safeguarding concern, so these are shown
                as they were recorded.
              </TooltipContent>
            </Tooltip>
          </div>
          {markings.length > 0 ? (
            <div className="space-y-2">
              {markings.map((marking) => (
                <div
                  key={marking.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-cf-surface-muted p-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-cf-ink">
                      {marking.bodyPart || 'Unspecified body part'}
                    </p>
                    {marking.notes && (
                      <p className="text-xs text-cf-ink-60">{marking.notes}</p>
                    )}
                  </div>
                  <Badge variant="softInfo" shape="pill" badgeSize="sm">
                    {getBodyMarkTypeLabel(marking.markType)}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-cf-ink-60">No body map markings recorded</p>
          )}
        </Card>
      </div>
    </ScrollArea>
  );
}