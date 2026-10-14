'use client';

import { useEffect, useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  ScheduleSelect,
  Textarea,
  VisitTypeBadge,
} from '@/components/ui';
import { hasErrors, validateVisitTemplateForm } from 'lib';
import type { ScheduleFormErrors, VisitTemplate, VisitTemplateFormData, VisitType } from 'types';
import {
  VISIT_DURATION_MINUTES,
  VISIT_TYPE_OPTIONS,
  createTemplateFormData,
  formatDurationLabel,
} from 'utils';
import { FormField } from './ScheduleVisitForm';

const DURATION_OPTIONS = VISIT_DURATION_MINUTES.map((m) => ({
  value: String(m),
  label: formatDurationLabel(m),
}));

interface ScheduleVisitTemplatesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: VisitTemplate[];
  /** Skills carers can hold, offered as "required skills" for a template. */
  skillOptions: string[];
  onSave: (data: VisitTemplateFormData) => void;
  onDelete: (templateId: string) => void;
}

export function ScheduleVisitTemplatesModal({
  open,
  onOpenChange,
  templates,
  skillOptions,
  onSave,
  onDelete,
}: ScheduleVisitTemplatesModalProps) {
  const [values, setValues] = useState<VisitTemplateFormData>(() => createTemplateFormData());
  const [errors, setErrors] = useState<ScheduleFormErrors>({});

  useEffect(() => {
    if (open) {
      setValues(createTemplateFormData());
      setErrors({});
    }
  }, [open]);

  const sortedSkills = useMemo(() => [...skillOptions].sort(), [skillOptions]);

  const patch = (next: Partial<VisitTemplateFormData>) => {
    setValues((prev) => ({ ...prev, ...next }));
    setErrors((prev) => {
      const copy = { ...prev };
      Object.keys(next).forEach((key) => delete copy[key]);
      return copy;
    });
  };

  const toggleSkill = (skill: string) =>
    patch({
      requiredSkills: values.requiredSkills.includes(skill)
        ? values.requiredSkills.filter((s) => s !== skill)
        : [...values.requiredSkills, skill],
    });

  const handleSubmit = () => {
    const nextErrors = validateVisitTemplateForm(values);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    onSave(values);
    setValues(createTemplateFormData());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Visit templates</DialogTitle>
          <DialogDescription>
            Standard visit types with set tasks and duration. Pick one when adding a visit.
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-2">
          {templates.length === 0 && (
            <li className="py-4 text-center text-sm text-cf-ink-60">No templates yet</li>
          )}
          {templates.map((template) => (
            <li
              key={template.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-cf-border p-3"
            >
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-medium text-cf-ink">{template.name}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-cf-ink-60">
                  <VisitTypeBadge type={template.type} />
                  <span>{formatDurationLabel(template.durationMinutes)}</span>
                  <span>·</span>
                  <span>
                    {template.tasks.length} task{template.tasks.length === 1 ? '' : 's'}
                  </span>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Delete ${template.name}`}
                className="text-error hover:bg-error-muted hover:text-error"
                onClick={() => onDelete(template.id)}
              >
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>

        <div className="space-y-4 border-t border-cf-border pt-4">
          <h3 className="text-sm font-semibold text-cf-ink">New template</h3>

          <FormField label="Name *" htmlFor="t-name" error={errors.name}>
            <Input id="t-name" placeholder="e.g. 45-min lunchtime visit" value={values.name}
              aria-invalid={Boolean(errors.name) || undefined}
              onChange={(event) => patch({ name: event.target.value })} />
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Visit type *" htmlFor="t-type" error={errors.type}>
              <ScheduleSelect id="t-type" value={values.type} options={VISIT_TYPE_OPTIONS}
                invalid={Boolean(errors.type)}
                onValueChange={(type) => patch({ type: type as VisitType })} />
            </FormField>
            <FormField label="Duration *" htmlFor="t-duration" error={errors.durationMinutes}>
              <ScheduleSelect id="t-duration"
                value={values.durationMinutes === '' ? '' : String(values.durationMinutes)}
                options={DURATION_OPTIONS} invalid={Boolean(errors.durationMinutes)}
                onValueChange={(v) => patch({ durationMinutes: v === '' ? '' : Number(v) })} />
            </FormField>
          </div>

          <FormField label="Tasks (one per line) *" htmlFor="t-tasks" error={errors.tasks}>
            <Textarea id="t-tasks" className="min-h-24" placeholder={'Wash and dress\nPrepare breakfast'}
              value={values.tasks} onChange={(event) => patch({ tasks: event.target.value })} />
          </FormField>

          {sortedSkills.length > 0 && (
            <FormField label="Required skills">
              <div className="flex flex-wrap gap-1.5">
                {sortedSkills.map((skill) => (
                  <Button key={skill} type="button" size="xs"
                    aria-pressed={values.requiredSkills.includes(skill)}
                    variant={values.requiredSkills.includes(skill) ? 'brandOutline' : 'outline'}
                    onClick={() => toggleSkill(skill)}>
                    {skill}
                  </Button>
                ))}
              </div>
            </FormField>
          )}

          <Button type="button" onClick={handleSubmit} className="w-full">
            Add template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}