'use client';

import { useState } from 'react';
import { CircleHelp, Paperclip, Trash2 } from 'lucide-react';
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
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui';
import {
  CONTRIBUTING_FACTOR_OPTIONS,
  createIncidentEvidenceItem,
  INCIDENT_EVIDENCE_TYPES,
  removeEvidenceItem,
  toggleContributingFactor,
} from 'utils';
import type { IncidentEvidence, IncidentFormStepProps } from 'types';

export function IncidentFollowUpStep({ form, update }: IncidentFormStepProps) {
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceType, setEvidenceType] = useState<IncidentEvidence['type']>('photo');
  const [evidenceNote, setEvidenceNote] = useState('');
  const [customFactor, setCustomFactor] = useState('');

  const addEvidence = () => {
    const url = evidenceUrl.trim();
    if (!url) return;
    update(
      'evidence',
      [
        ...form.evidence,
        createIncidentEvidenceItem(
          url,
          evidenceType,
          form.reportedByName || form.reportedBy,
          evidenceNote.trim() || undefined
        ),
      ]
    );
    setEvidenceUrl('');
    setEvidenceNote('');
  };

  const addCustomFactor = () => {
    const factor = customFactor.trim();
    if (!factor) return;
    update('contributingFactors', toggleContributingFactor(form.contributingFactors, factor));
    setCustomFactor('');
  };

  const extraFactors = form.contributingFactors.filter(
    (factor) => !CONTRIBUTING_FACTOR_OPTIONS.includes(factor)
  );

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <Label className="text-sm font-medium text-cf-ink">Evidence</Label>
          <Tooltip>
            <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
              <CircleHelp className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent>
              Link anything that supports the account: photos of the scene or
              injuries, body maps, GP letters, medication charts or witness
              statements. Take photos only with consent, and never of a person
              who cannot consent.
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="grid gap-3 rounded-lg bg-cf-surface-muted p-3 sm:grid-cols-[1fr_10rem]">
          <Input
            placeholder="Paste a file link or name, e.g. /uploads/fall-photo-1.jpg"
            value={evidenceUrl}
            onChange={(event) => setEvidenceUrl(event.target.value)}
            aria-label="Evidence link or file name"
          />
          <Select
            value={evidenceType}
            onValueChange={(value) => setEvidenceType((value as IncidentEvidence['type']) ?? 'photo')}
          >
            <SelectTrigger className="w-full" aria-label="Evidence type">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {INCIDENT_EVIDENCE_TYPES.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Short description (optional)"
            value={evidenceNote}
            onChange={(event) => setEvidenceNote(event.target.value)}
            aria-label="Evidence description"
          />
          <Button type="button" variant="brandOutline" size="sm" onClick={addEvidence}>
            <Paperclip className="size-3.5" />
            Attach
          </Button>
        </div>

        {form.evidence.length > 0 && (
          <div className="space-y-2">
            {form.evidence.map((item) => (
              <Card key={item.id} className="flex items-center justify-between border-cf-border p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-cf-ink">{item.url}</p>
                  <p className="text-xs text-cf-ink-60">
                    {item.type.toUpperCase()} · {item.uploadedBy}
                    {item.description ? ` · ${item.description}` : ''}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Remove evidence"
                  onClick={() => update('evidence', removeEvidenceItem(form.evidence, item.id))}
                >
                  <Trash2 className="size-4 text-cf-ink-40" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label className="text-sm font-medium text-cf-ink">
            Contributing factors *
          </Label>
          <Tooltip>
            <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
              <CircleHelp className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent>
              What made this incident more likely - environment, staffing,
              equipment, communication or the person&apos;s health. Select every
              option that applies, at least one is required.
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex flex-wrap gap-2">
          {CONTRIBUTING_FACTOR_OPTIONS.map((factor) => {
            const isSelected = form.contributingFactors.includes(factor);
            return (
              <Button
                key={factor}
                type="button"
                size="sm"
                variant={isSelected ? 'default' : 'outline'}
                onClick={() =>
                  update('contributingFactors', toggleContributingFactor(form.contributingFactors, factor))
                }
              >
                {factor}
              </Button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add another factor"
            value={customFactor}
            onChange={(event) => setCustomFactor(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                addCustomFactor();
              }
            }}
            aria-label="Add another contributing factor"
          />
          <Button type="button" variant="outline" size="sm" onClick={addCustomFactor}>
            Add
          </Button>
        </div>
        {extraFactors.length > 0 && (
          <p className="text-xs text-cf-ink-60">
            Added: {extraFactors.join(', ')}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label className="text-sm font-medium text-cf-ink" htmlFor="incident-follow-up">
            Follow up plan *
          </Label>
          <Tooltip>
            <TooltipTrigger className="cursor-help text-cf-ink-40 hover:text-cf-ink">
              <CircleHelp className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent>
              What must change to stop this happening again: actions, who owns
              them and by when. CQC expects a named owner and a review date for
              every incident.
            </TooltipContent>
          </Tooltip>
        </div>
        <Textarea
          id="incident-follow-up"
          rows={3}
          placeholder="e.g. Install grab rail in bathroom by 5 July (owner: maintenance). Add falls risk assessment to daily notes, reviewed weekly by manager."
          value={form.followUpPlan}
          onChange={(event) => update('followUpPlan', event.target.value)}
        />
      </div>
    </div>
  );
}