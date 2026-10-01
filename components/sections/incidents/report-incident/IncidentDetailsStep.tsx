'use client';

import { CircleHelp } from 'lucide-react';
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui';
import {
  INCIDENT_TYPE_OPTIONS,
  INCIDENT_SEVERITY_OPTIONS,
  mockPatients,
} from 'utils';
import type { IncidentFormStepProps, IncidentSeverity, IncidentType } from 'types';

export function IncidentDetailsStep({ form, update }: IncidentFormStepProps) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Label className="text-sm font-medium text-cf-ink">
              Incident Type *
            </Label>
            <Tooltip>
              <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
                <CircleHelp className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                What kind of event this is. This drives the CQC report filters
                and dashboards, so pick the closest match.
              </TooltipContent>
            </Tooltip>
          </div>
          <Select
            value={form.type}
            onValueChange={(value) =>
              update('type', (value as IncidentType | null) ?? '')
            }
          >
            <SelectTrigger className="w-full" aria-label="Incident type">
              <SelectValue placeholder="Select incident type" />
            </SelectTrigger>
            <SelectContent>
              {INCIDENT_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Label className="text-sm font-medium text-cf-ink">Severity *</Label>
            <Tooltip>
              <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
                <CircleHelp className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                Rate the impact that actually happened, not what could have
                happened. Low: no treatment needed. Medium: first aid or GP
                visit. High: hospital or ambulance. Critical: life-changing
                injury or death.
              </TooltipContent>
            </Tooltip>
          </div>
          <Select
            value={form.severity}
            onValueChange={(value) =>
              update('severity', (value as IncidentSeverity | null) ?? '')
            }
          >
            <SelectTrigger className="w-full" aria-label="Severity">
              <SelectValue placeholder="Select severity level" />
            </SelectTrigger>
            <SelectContent>
              {INCIDENT_SEVERITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Label className="text-sm font-medium text-cf-ink">Patient *</Label>
            <Tooltip>
              <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
                <CircleHelp className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                The person the incident relates to. Selecting one fills their
                name and links this report to their timeline and care plan.
              </TooltipContent>
            </Tooltip>
          </div>
          <Select
            value={form.patientId}
            onValueChange={(value) => {
              const patient = mockPatients.find((item) => item.id === value);
              if (!patient) return;
              update('patientId', patient.id);
              update('patientName', patient.name);
            }}
          >
            <SelectTrigger className="w-full" aria-label="Patient">
              <SelectValue placeholder="Select patient" />
            </SelectTrigger>
            <SelectContent>
              {mockPatients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Label className="text-sm font-medium text-cf-ink" htmlFor="incident-patient-name">
              Patient name *
            </Label>
            <Tooltip>
              <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
                <CircleHelp className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                Filled in from the patient you selected. Edit it only if the
                person is not on the list (for example a visitor or staff
                member) so the record can still be identified.
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="incident-patient-name"
            placeholder="e.g. Dorothy Chen"
            value={form.patientName}
            onChange={(event) => update('patientName', event.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Label className="text-sm font-medium text-cf-ink" htmlFor="incident-datetime">
              Date &amp; time *
            </Label>
            <Tooltip>
              <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
                <CircleHelp className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                When the incident happened, not when you are writing it up. Use
                an approximate time (for example 09:00) if the exact time is
                unknown - do not leave it blank.
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="incident-datetime"
            type="datetime-local"
            value={form.dateTime}
            onChange={(event) => update('dateTime', event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Label className="text-sm font-medium text-cf-ink" htmlFor="incident-location">
              Location *
            </Label>
            <Tooltip>
              <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
                <CircleHelp className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                Be specific enough to assess the environment: &quot;Bathroom,
                123 Oak Street&quot;, not just &quot;Bathroom&quot;. Include the
                room or area so hazards can be identified later.
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="incident-location"
            placeholder="e.g. Bathroom, 123 Oak Street"
            value={form.location}
            onChange={(event) => update('location', event.target.value)}
          />
        </div>
      </div>
    </div>
  );
}