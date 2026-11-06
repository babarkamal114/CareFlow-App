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
  Switch,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui';
import { INCIDENT_STATUS_OPTIONS } from 'utils';
import type { IncidentFormStepProps, IncidentStatus } from 'types';
import { IncidentReviewSummaryCard } from './IncidentReviewSummaryCard';

export function IncidentReviewStep({ form, update }: IncidentFormStepProps) {
  return (
    <div className="space-y-5">
      <IncidentReviewSummaryCard form={form} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Label className="text-sm font-medium text-cf-ink" htmlFor="incident-reporter">
              Reported by *
            </Label>
            <Tooltip>
              <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
                <CircleHelp className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                The person who witnessed or found out about the incident, in the
                form &quot;Name (Role)&quot;. This is who the manager will follow
                up with, and it appears on the audit trail.
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="incident-reporter"
            placeholder="e.g. Sarah Johnson (Carer)"
            value={form.reportedBy}
            onChange={(event) => update('reportedBy', event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Label className="text-sm font-medium text-cf-ink" htmlFor="incident-reporter-name">
              Reporter name
            </Label>
            <Tooltip>
              <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
                <CircleHelp className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                The display name shown on the incident list, for example
                &quot;Sarah Johnson&quot; without the role in brackets.
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="incident-reporter-name"
            placeholder="e.g. Sarah Johnson"
            value={form.reportedByName}
            onChange={(event) => update('reportedByName', event.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Label className="text-sm font-medium text-cf-ink">Status</Label>
            <Tooltip>
              <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
                <CircleHelp className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                New reports start as &quot;Reported&quot;. Move to
                &quot;Investigating&quot; while the root cause is being confirmed,
                then &quot;Resolved&quot; once actions are in place and
                &quot;Closed&quot; after sign off.
              </TooltipContent>
            </Tooltip>
          </div>
          <Select
            value={form.status}
            onValueChange={(value) =>
              update('status', (value as IncidentStatus | null) ?? 'reported')
            }
          >
            <SelectTrigger className="w-full" aria-label="Incident status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {INCIDENT_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Label className="text-sm font-medium text-cf-ink" htmlFor="incident-assigned-to">
              Assigned to
            </Label>
            <Tooltip>
              <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
                <CircleHelp className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                Who owns the investigation - usually the registered manager or
                safeguarding lead. They are responsible for the follow up plan
                and for closing the case.
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="incident-assigned-to"
            placeholder="e.g. John Manager"
            value={form.assignedTo ?? ''}
            onChange={(event) => update('assignedTo', event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-cf-border-light p-4">
        <p className="text-sm font-semibold text-cf-ink">Notifiable &amp; safeguarding flags</p>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <Label className="text-sm font-medium text-cf-ink">CQC notifiable incident</Label>
            <Tooltip>
              <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
                <CircleHelp className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                Certain events must be reported to the Care Quality Commission,
                for example serious injuries, significant medication errors or
                safeguarding referrals.
              </TooltipContent>
            </Tooltip>
          </div>
          <Switch
            checked={form.isCqcNotifiable}
            onCheckedChange={(checked) => update('isCqcNotifiable', checked)}
            aria-label="CQC notifiable incident"
          />
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <Label className="text-sm font-medium text-cf-ink">RIDDOR reportable</Label>
            <Tooltip>
              <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
                <CircleHelp className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                Reportable to the Health and Safety Executive under RIDDOR:
                injuries needing medical treatment beyond first aid, or a
                dangerous occurrence such as a fall or a medication error.
              </TooltipContent>
            </Tooltip>
          </div>
          <Switch
            checked={form.isRiddorReportable}
            onCheckedChange={(checked) => update('isRiddorReportable', checked)}
            aria-label="RIDDOR reportable"
          />
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <Label className="text-sm font-medium text-cf-ink">Safeguarding concern</Label>
            <Tooltip>
              <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
                <CircleHelp className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                Turn on for anything suggesting abuse, neglect, financial
                exploitation or a person at risk of harm. This alerts the
                safeguarding lead so a referral can be made.
              </TooltipContent>
            </Tooltip>
          </div>
          <Switch
            checked={form.isSafeguardingConcern}
            onCheckedChange={(checked) => update('isSafeguardingConcern', checked)}
            aria-label="Safeguarding concern"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Label className="text-sm font-medium text-cf-ink" htmlFor="incident-root-cause">
              Root cause
            </Label>
            <Tooltip>
              <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
                <CircleHelp className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                The underlying reason the incident happened, not the trigger.
                Ask &quot;why did this happen&quot; until you reach a process,
                training or equipment gap that can be fixed.
              </TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            id="incident-root-cause"
            rows={3}
            placeholder="e.g. Falls risk assessment not updated after the home assessment in June."
            value={form.rootCause ?? ''}
            onChange={(event) => update('rootCause', event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Label className="text-sm font-medium text-cf-ink" htmlFor="incident-preventive">
              Preventive actions
            </Label>
            <Tooltip>
              <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
                <CircleHelp className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                The changes you are making to stop a repeat - with an owner and
                a date for each one. Keep this specific and checkable.
              </TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            id="incident-preventive"
            rows={3}
            placeholder="e.g. Grab rail fitted 3 July; mobility assessment reviewed weekly by manager."
            value={form.preventiveActions ?? ''}
            onChange={(event) => update('preventiveActions', event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label className="text-sm font-medium text-cf-ink" htmlFor="incident-lessons">
            Lessons learned
          </Label>
          <Tooltip>
            <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
              <CircleHelp className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent>
              What the team and the person should take away, and anything that
              needs sharing with other staff or families. This section is shown
              in the audit pack.
            </TooltipContent>
          </Tooltip>
        </div>
        <Textarea
          id="incident-lessons"
          rows={2}
          placeholder="e.g. Refresh moving-and-handling training for the team on Thursday; share the updated risk assessment with the family."
          value={form.lessonsLearned ?? ''}
          onChange={(event) => update('lessonsLearned', event.target.value)}
        />
      </div>
    </div>
  );
}