'use client';

import { CircleHelp, Plus, Trash2 } from 'lucide-react';
import {
  Button,
  Card,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui';
import {
  addBodyMarking,
  addInjuryDetail,
  getBodyMarkings,
  INJURY_SEVERITY_OPTIONS,
  INCIDENT_BODY_PARTS,
  INCIDENT_MARK_TYPES,
  removeBodyMarking,
  removeInjuryDetail,
  updateBodyMarking,
  updateInjuryDetail,
} from 'utils';
import type {
  IncidentFormStepProps,
  IncidentMarkType,
  InjurySeverity,
} from 'types';

export function IncidentInjuriesStep({ form, replace }: IncidentFormStepProps) {
  const markings = getBodyMarkings(form);

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label className="text-sm font-medium text-cf-ink">
            Were any injuries observed?
          </Label>
          <Tooltip>
            <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
              <CircleHelp className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent>
              Turn this on if any physical injury or mark was seen or reported
              at the time, including marks that are not painful. Leave it off
              for near misses where nothing was harmed.
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-3">
          <Switch
            checked={form.injuriesObserved}
            onCheckedChange={(checked) =>
              replace(
                checked
                  ? addInjuryDetail(form)
                  : { ...form, injuriesObserved: false, injuryDetails: [], bodyMapData: { markings: [] } }
              )
            }
            aria-label="Injuries observed"
          />
          <span className="text-sm text-cf-ink-60">
            {form.injuriesObserved ? 'Yes - record details below' : 'No injuries'}
          </span>
        </div>
      </div>

      {form.injuriesObserved && (
        <>
          <Card className="space-y-4 border-cf-border p-4">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-cf-ink">Injury details</p>
              <Tooltip>
                <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
                  <CircleHelp className="size-3.5" />
                </TooltipTrigger>
                <TooltipContent>
                  One row per injury: where it is, what it looks like and how
                  serious it is. Record what you observed, not a diagnosis -
                  leave any medical judgement to the GP or nurse.
                </TooltipContent>
              </Tooltip>
            </div>

            {form.injuryDetails.map((injury, index) => (
              <div
                key={injury.id}
                className="grid gap-3 rounded-lg bg-cf-surface-muted p-3 sm:grid-cols-2"
              >
                <div className="space-y-1.5">
                  <Label className="text-xs text-cf-ink-60">Body part</Label>
                  <Select
                    value={injury.bodyPart}
                    onValueChange={(value) =>
                      replace(updateInjuryDetail(form, index, { bodyPart: value ?? '' }))
                    }
                  >
                    <SelectTrigger className="w-full" aria-label="Body part">
                      <SelectValue placeholder="Select body part" />
                    </SelectTrigger>
                    <SelectContent>
                      {INCIDENT_BODY_PARTS.map((part) => (
                        <SelectItem key={part} value={part}>
                          {part}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-cf-ink-60">Severity</Label>
                  <Select
                    value={injury.severity}
                    onValueChange={(value) =>
                      replace(
                        updateInjuryDetail(form, index, {
                          severity: (value as InjurySeverity | null) ?? 'minor',
                        })
                      )
                    }
                  >
                    <SelectTrigger className="w-full" aria-label="Injury severity">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      {INJURY_SEVERITY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs text-cf-ink-60">Description</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g. Purple bruising on the outer left forearm, approx. 3cm"
                      value={injury.description}
                      onChange={(event) =>
                        replace(
                          updateInjuryDetail(form, index, { description: event.target.value })
                        )
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Remove injury"
                      onClick={() => replace(removeInjuryDetail(form, index))}
                    >
                      <Trash2 className="size-4 text-cf-ink-40" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => replace(addInjuryDetail(form))}
            >
              <Plus className="size-4" />
              Add injury
            </Button>
          </Card>

          <Card className="space-y-4 border-cf-border p-4">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-cf-ink">Body map markings</p>
              <Tooltip>
                <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
                  <CircleHelp className="size-3.5" />
                </TooltipTrigger>
                <TooltipContent>
                  Plot every mark on the body so patterns are visible later.
                  Record the size, colour and shape in the notes, and take a
                  photo only with the person&apos;s consent.
                </TooltipContent>
              </Tooltip>
            </div>

            {markings.map((marking, index) => (
              <div
                key={marking.id}
                className="grid gap-3 rounded-lg bg-cf-surface-muted p-3 sm:grid-cols-3"
              >
                <div className="space-y-1.5">
                  <Label className="text-xs text-cf-ink-60">Body part</Label>
                  <Select
                    value={marking.bodyPart}
                    onValueChange={(value) =>
                      replace(updateBodyMarking(form, index, { bodyPart: value ?? '' }))
                    }
                  >
                    <SelectTrigger className="w-full" aria-label="Marking body part">
                      <SelectValue placeholder="Select body part" />
                    </SelectTrigger>
                    <SelectContent>
                      {INCIDENT_BODY_PARTS.map((part) => (
                        <SelectItem key={part} value={part}>
                          {part}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-cf-ink-60">Mark type</Label>
                  <Select
                    value={marking.markType}
                    onValueChange={(value) =>
                      replace(
                        updateBodyMarking(form, index, {
                          markType: (value as IncidentMarkType | null) ?? 'other',
                        })
                      )
                    }
                  >
                    <SelectTrigger className="w-full" aria-label="Mark type">
                      <SelectValue placeholder="Select mark type" />
                    </SelectTrigger>
                    <SelectContent>
                      {INCIDENT_MARK_TYPES.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-cf-ink-60">Notes</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g. Handprint shape, 4cm, purple"
                      value={marking.notes ?? ''}
                      onChange={(event) =>
                        replace(
                          updateBodyMarking(form, index, { notes: event.target.value })
                        )
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Remove marking"
                      onClick={() => replace(removeBodyMarking(form, index))}
                    >
                      <Trash2 className="size-4 text-cf-ink-40" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => replace(addBodyMarking(form))}
            >
              <Plus className="size-4" />
              Add body map marking
            </Button>
          </Card>
        </>
      )}
    </div>
  );
}