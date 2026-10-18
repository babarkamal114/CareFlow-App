'use client';

import { CircleHelp } from 'lucide-react';
import {
  Card,
  Label,
  RadioGroup,
  RadioGroupItem,
  Switch,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui';
import type { IncidentFormStepProps } from 'types';

export function IncidentResponseStep({ form, update }: IncidentFormStepProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label className="text-sm font-medium text-cf-ink" htmlFor="incident-immediate-actions">
            Immediate actions taken *
          </Label>
          <Tooltip>
            <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
              <CircleHelp className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent>
              Everything you did straight after the incident: first aid given,
              whether you moved the person, who you called for help, and when
              you informed a manager or family. This is checked against
              procedure during investigation.
            </TooltipContent>
          </Tooltip>
        </div>
        <Textarea
          id="incident-immediate-actions"
          rows={3}
          placeholder="e.g. Checked for injuries, helped the patient into a chair, applied a cold pack and called the duty manager at 14:35."
          value={form.immediateActions}
          onChange={(event) => update('immediateActions', event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label className="text-sm font-medium text-cf-ink">
            Was the care plan followed? *
          </Label>
          <Tooltip>
            <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
              <CircleHelp className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent>
              Compare what happened against the person&apos;s agreed care plan
              and risk assessment. Answering &quot;no&quot; is not a judgement on
              anyone - it simply tells the investigator where the gap was.
            </TooltipContent>
          </Tooltip>
        </div>
        <RadioGroup
          value={form.carePlanFollowed === null ? '' : String(form.carePlanFollowed)}
          onValueChange={(value) => update('carePlanFollowed', value === 'true')}
          className="flex gap-6"
        >
          <label className="flex cursor-pointer items-center gap-2 text-sm text-cf-ink">
            <RadioGroupItem value="true" />
            Yes, as written
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-cf-ink">
            <RadioGroupItem value="false" />
            No, it deviated
          </label>
        </RadioGroup>
      </div>

      {form.carePlanFollowed === false && (
        <Card className="space-y-3 border-cf-border p-4">
          <div className="flex items-center gap-1.5">
            <Label
              className="text-sm font-medium text-cf-ink"
              htmlFor="incident-care-plan-reason"
            >
              Why did it deviate? *
            </Label>
            <Tooltip>
              <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
                <CircleHelp className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                State which part of the plan could not be followed and why, for
                example &quot;refused a shower, so personal care was completed
                at the sink instead&quot;. This feeds the root cause analysis.
              </TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            id="incident-care-plan-reason"
            rows={3}
            placeholder="e.g. Care plan required two staff for transfers; only one was available at the time of the visit."
            value={form.carePlanDeviationReason ?? ''}
            onChange={(event) => update('carePlanDeviationReason', event.target.value)}
          />
        </Card>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label className="text-sm font-medium text-cf-ink">
            Were emergency services called?
          </Label>
          <Tooltip>
            <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
              <CircleHelp className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent>
              Turn this on for 999 or 111 calls, ambulance, GP or out-of-hours
              contacts - and for situations where a call was considered but
              not made. Also include the family being contacted urgently.
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-3">
          <Switch
            checked={form.emergencyServicesCalled}
            onCheckedChange={(checked) => update('emergencyServicesCalled', checked)}
            aria-label="Emergency services called"
          />
          <span className="text-sm text-cf-ink-60">
            {form.emergencyServicesCalled ? 'Yes - record the details below' : 'No contact made'}
          </span>
        </div>
      </div>

      {form.emergencyServicesCalled && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Label
              className="text-sm font-medium text-cf-ink"
              htmlFor="incident-emergency-details"
            >
              Emergency contact details *
            </Label>
            <Tooltip>
              <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
                <CircleHelp className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                Who was contacted, at what time, what they advised and any case
                or reference number given. CQC inspectors ask for this on
                serious incidents.
              </TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            id="incident-emergency-details"
            rows={3}
            placeholder="e.g. 999 called at 14:40, ambulance attended 15:05, advised GP review within 24 hours, incident number 44821."
            value={form.emergencyServicesDetails ?? ''}
            onChange={(event) => update('emergencyServicesDetails', event.target.value)}
          />
        </div>
      )}
    </div>
  );
}