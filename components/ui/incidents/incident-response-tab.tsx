'use client';

import {
  Badge,
  Card,
  Chip,
  ScrollArea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui';
import { CircleHelp, PhoneCall, Siren } from 'lucide-react';
import { Incident } from 'types';
import { getCarePlanFollowedLabel, getCarePlanFollowedVariant } from 'utils';

interface IncidentResponseTabProps {
  incident: Incident;
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs text-cf-ink-60">{label}</p>
      <p className="text-sm text-cf-ink whitespace-pre-wrap">
        {value?.trim() ? value : 'Not recorded'}
      </p>
    </div>
  );
}

export function IncidentResponseTab({ incident }: IncidentResponseTabProps) {
  return (
    <ScrollArea className="h-[calc(100vh-260px)] pr-4">
      <div className="space-y-4 pb-4">
        <Card className="space-y-3 border-cf-border p-4">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-cf-ink">Immediate actions</p>
            <Tooltip>
              <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
                <CircleHelp className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                What the reporter did straight after the incident. This is
                checked against procedure during investigation, so it is kept
                as a factual record.
              </TooltipContent>
            </Tooltip>
          </div>
          <DetailRow label="Actions taken" value={incident.immediateActions} />
        </Card>

        <Card className="space-y-3 border-cf-border p-4">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-cf-ink">Care plan compliance</p>
            <Tooltip>
              <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
                <CircleHelp className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                Whether the person&apos;s agreed care plan and risk assessment
                were followed as written. Deviations feed directly into the
                root cause analysis.
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={getCarePlanFollowedVariant(incident.carePlanFollowed)}
              shape="pill"
              badgeSize="sm"
            >
              {getCarePlanFollowedLabel(incident.carePlanFollowed)}
            </Badge>
          </div>
          {incident.carePlanFollowed === false && (
            <DetailRow label="Deviation reason" value={incident.carePlanDeviationReason} />
          )}
        </Card>

        <Card className="space-y-3 border-cf-border p-4">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-cf-ink">Emergency services</p>
            <Tooltip>
              <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
                <CircleHelp className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                Any 999 or 111 call, ambulance, GP or out-of-hours contact,
                including the case or reference number given.
              </TooltipContent>
            </Tooltip>
          </div>
          {incident.emergencyServicesCalled ? (
            <div className="flex items-start gap-2">
              <Siren className="mt-0.5 size-4 shrink-0 text-cf-red-500" />
              <DetailRow label="Contact details" value={incident.emergencyServicesDetails} />
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-cf-ink-60">
              <PhoneCall className="size-4 text-cf-ink-40" />
              No emergency contact was made
            </div>
          )}
        </Card>

        <Card className="space-y-3 border-cf-border p-4">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-cf-ink">Contributing factors</p>
            <Tooltip>
              <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
                <CircleHelp className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                The conditions that made the incident more likely - environment,
                staffing, equipment, communication or the person&apos;s health.
              </TooltipContent>
            </Tooltip>
          </div>
          {incident.contributingFactors && incident.contributingFactors.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {incident.contributingFactors.map((factor) => (
                <Chip key={factor} tone="neutral">
                  {factor}
                </Chip>
              ))}
            </div>
          ) : (
            <p className="text-sm text-cf-ink-60">No contributing factors recorded</p>
          )}
        </Card>

        <Card className="space-y-3 border-cf-border p-4">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-cf-ink">Follow up plan</p>
            <Tooltip>
              <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
                <CircleHelp className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                The agreed actions to stop a repeat happening, with an owner
                and a date. CQC expects a named owner for every incident.
              </TooltipContent>
            </Tooltip>
          </div>
          <DetailRow label="Actions agreed" value={incident.followUpPlan} />
        </Card>
      </div>
    </ScrollArea>
  );
}