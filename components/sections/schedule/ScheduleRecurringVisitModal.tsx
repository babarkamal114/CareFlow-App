'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Repeat } from 'lucide-react';
import {
  Badge,
  Button,
  DatePicker,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  ScheduleSelect,
} from '@/components/ui';
import { hasErrors, validateRecurringVisitForm } from 'lib';
import { SCHEDULE_DAYS } from 'types';
import type {
  RecurringFrequency,
  RecurringVisitFormData,
  ScheduleContext,
  ScheduleFormErrors,
  VisitTemplate,
  VisitType,
} from 'types';
import {
  DAY_SHORT_LABELS,
  RECURRING_FREQUENCY_OPTIONS,
  VISIT_DURATION_MINUTES,
  VISIT_TYPE_OPTIONS,
  createRecurringFormData,
  detectVisitConflicts,
  expandRecurringRule,
  formatDurationLabel,
  hasBlockingConflict,
  parseIsoDate,
  recurringFormToRule,
  toIsoDate,
  toSelectOptions,
} from 'utils';
import { FormField } from './ScheduleVisitForm';

const NO_VALUE = 'none';
const DURATION_OPTIONS = VISIT_DURATION_MINUTES.map((m) => ({
  value: String(m),
  label: formatDurationLabel(m),
}));

interface ScheduleRecurringVisitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: RecurringVisitFormData) => Promise<void> | void;
  context: ScheduleContext;
  templates: VisitTemplate[];
  /** ISO date used as the starting point for the date pickers. */
  defaultDate: string;
}

export function ScheduleRecurringVisitModal({
  open,
  onOpenChange,
  onSave,
  context,
  templates,
  defaultDate,
}: ScheduleRecurringVisitModalProps) {
  const [values, setValues] = useState<RecurringVisitFormData>(() => createRecurringFormData());
  const [errors, setErrors] = useState<ScheduleFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  const defaultDateRef = useRef(defaultDate);
  defaultDateRef.current = defaultDate;
  useEffect(() => {
    if (open) {
      setValues(createRecurringFormData({ startDate: defaultDateRef.current, endDate: '' }));
      setErrors({});
    }
  }, [open]);

  const patientOptions = useMemo(() => toSelectOptions(context.patients), [context.patients]);
  const carerOptions = useMemo(
    () => [{ value: NO_VALUE, label: 'Unassigned (assign later)' }, ...toSelectOptions(context.carers)],
    [context.carers]
  );
  const templateOptions = useMemo(
    () => [{ value: NO_VALUE, label: 'No template' }, ...toSelectOptions(templates.map((t) => ({ id: t.id, name: t.name })))],
    [templates]
  );

  // Preview what the rule would create, once the form is valid.
  const preview = useMemo(() => {
    if (hasErrors(validateRecurringVisitForm(values))) return null;
    const generated = expandRecurringRule(recurringFormToRule(values, 'preview'), context, templates);
    const combined = { ...context, visits: [...context.visits, ...generated] };
    const clashing = generated.filter((v) => hasBlockingConflict(detectVisitConflicts(v, combined))).length;
    return { count: generated.length, clashing };
  }, [values, context, templates]);

  const patch = (next: Partial<RecurringVisitFormData>) => {
    setValues((prev) => ({ ...prev, ...next }));
    setErrors((prev) => {
      const copy = { ...prev };
      Object.keys(next).forEach((key) => delete copy[key]);
      return copy;
    });
  };

  const handleTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    patch(
      template
        ? { templateId, type: template.type, durationMinutes: template.durationMinutes }
        : { templateId: '' }
    );
  };

  const toggleDay = (day: (typeof SCHEDULE_DAYS)[number]) =>
    patch({ days: values.days.includes(day) ? values.days.filter((d) => d !== day) : [...values.days, day] });

  const handleSubmit = async () => {
    const nextErrors = validateRecurringVisitForm(values);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setIsSaving(true);
    try {
      await onSave(values);
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Repeat className="size-4" />
            Create recurring visits
          </DialogTitle>
          <DialogDescription>
            Set a pattern once instead of scheduling the same visit every week.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Patient *" htmlFor="r-patient" error={errors.patientId}>
              <ScheduleSelect id="r-patient" value={values.patientId} options={patientOptions}
                placeholder="Select patient" invalid={Boolean(errors.patientId)}
                onValueChange={(patientId) => patch({ patientId })} />
            </FormField>
            <FormField label="Assigned carer" htmlFor="r-carer">
              <ScheduleSelect id="r-carer" value={values.carerId === '' ? NO_VALUE : values.carerId}
                options={carerOptions}
                onValueChange={(carerId) => patch({ carerId: carerId === NO_VALUE ? '' : carerId })} />
            </FormField>
            <FormField label="Template" htmlFor="r-template">
              <ScheduleSelect id="r-template" value={values.templateId === '' ? NO_VALUE : values.templateId}
                options={templateOptions}
                onValueChange={(id) => handleTemplate(id === NO_VALUE ? '' : id)} />
            </FormField>
            <FormField label="Visit type *" htmlFor="r-type" error={errors.type}>
              <ScheduleSelect id="r-type" value={values.type} options={VISIT_TYPE_OPTIONS}
                invalid={Boolean(errors.type)}
                onValueChange={(type) => patch({ type: type as VisitType })} />
            </FormField>
            <FormField label="Start time *" htmlFor="r-time" error={errors.startTime}>
              <Input id="r-time" type="time" value={values.startTime}
                aria-invalid={Boolean(errors.startTime) || undefined}
                onChange={(event) => patch({ startTime: event.target.value })} />
            </FormField>
            <FormField label="Duration *" htmlFor="r-duration" error={errors.durationMinutes}>
              <ScheduleSelect id="r-duration"
                value={values.durationMinutes === '' ? '' : String(values.durationMinutes)}
                options={DURATION_OPTIONS} invalid={Boolean(errors.durationMinutes)}
                onValueChange={(v) => patch({ durationMinutes: v === '' ? '' : Number(v) })} />
            </FormField>
            <FormField label="Starts *" htmlFor="r-start" error={errors.startDate}>
              <DatePicker id="r-start" className="w-full"
                value={values.startDate ? parseIsoDate(values.startDate) : undefined}
                onChange={(d) => d && patch({ startDate: toIsoDate(d) })} />
            </FormField>
            <FormField label="Ends *" htmlFor="r-end" error={errors.endDate}>
              <DatePicker id="r-end" className="w-full" placeholder="Pick an end date"
                value={values.endDate ? parseIsoDate(values.endDate) : undefined}
                onChange={(d) => d && patch({ endDate: toIsoDate(d) })} />
            </FormField>
          </div>

          <FormField label="Repeats *" htmlFor="r-frequency" error={errors.frequency}>
            <ScheduleSelect id="r-frequency" value={values.frequency} options={RECURRING_FREQUENCY_OPTIONS}
              invalid={Boolean(errors.frequency)}
              onValueChange={(frequency) => patch({ frequency: frequency as RecurringFrequency })} />
          </FormField>

          {values.frequency !== 'daily' && (
            <FormField label="On these days *" error={errors.days}>
              <div className="flex flex-wrap gap-1.5">
                {SCHEDULE_DAYS.map((day) => (
                  <Button key={day} type="button" size="xs" aria-pressed={values.days.includes(day)}
                    variant={values.days.includes(day) ? 'brandOutline' : 'outline'}
                    onClick={() => toggleDay(day)}>
                    {DAY_SHORT_LABELS[day]}
                  </Button>
                ))}
              </div>
            </FormField>
          )}

          {preview && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg bg-cf-surface-muted p-3 text-sm text-cf-ink">
              <span>
                This will create <strong>{preview.count}</strong> visit{preview.count === 1 ? '' : 's'}.
              </span>
              {preview.clashing > 0 && (
                <Badge variant="softDanger">{preview.clashing} with a clash</Badge>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="button" loading={isSaving} onClick={handleSubmit}>
            Create visits
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}