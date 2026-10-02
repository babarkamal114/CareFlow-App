'use client';

import { CircleHelp } from 'lucide-react';
import {
  Label,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui';
import type { IncidentFormStepProps } from 'types';

export function IncidentNarrativeStep({ form, update }: IncidentFormStepProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-cf-border-light bg-cf-surface-muted px-3 py-2">
        <p className="text-xs text-cf-ink-60">
          Describe the incident using the <span className="font-medium text-cf-ink">A-B-C</span>{' '}
          approach so the cause, the event and the outcome are all clear.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label className="text-sm font-medium text-cf-ink" htmlFor="incident-antecedent">
            Antecedent *
          </Label>
          <Tooltip>
            <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
              <CircleHelp className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent>
              What was happening straight before the incident. Note the
              activity, who was present, and anything unusual such as an
              unsettled mood, a refusal of care or a change in routine.
            </TooltipContent>
          </Tooltip>
        </div>
        <Textarea
          id="incident-antecedent"
          rows={3}
          placeholder="e.g. Patient was being assisted to the bathroom and appeared unsteady; grab rail was not fitted."
          value={form.antecedent}
          onChange={(event) => update('antecedent', event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label className="text-sm font-medium text-cf-ink" htmlFor="incident-description">
            Description *
          </Label>
          <Tooltip>
            <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
              <CircleHelp className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent>
              A factual account of what you saw happen, in order. Stick to
              observations - avoid opinions, assumptions or naming people as
              at fault.
            </TooltipContent>
          </Tooltip>
        </div>
        <Textarea
          id="incident-description"
          rows={4}
          placeholder="e.g. Patient slipped on a wet floor while standing at the sink. I was two steps away and supported them immediately."
          value={form.description}
          onChange={(event) => update('description', event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label className="text-sm font-medium text-cf-ink" htmlFor="incident-consequence">
            Consequence *
          </Label>
          <Tooltip>
            <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
              <CircleHelp className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent>
              What happened as a result: how the person responded, who helped,
              whether care was disrupted or continued, and any distress,
              agitation or refusal of care afterwards.
            </TooltipContent>
          </Tooltip>
        </div>
        <Textarea
          id="incident-consequence"
          rows={3}
          placeholder="e.g. Patient was assessed, no injury seen at the time. Personal care was completed later with a second carer present."
          value={form.consequence}
          onChange={(event) => update('consequence', event.target.value)}
        />
      </div>
    </div>
  );
}