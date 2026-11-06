'use client';

import { useMemo } from 'react';
import { Button, DatePicker, Input, Label, ScheduleSelect, Textarea } from '@/components/ui';
import { cn } from 'lib';
import type {
  ScheduleCarer,
  ScheduleFormErrors,
  SchedulePatient,
  VisitFormData,
  VisitStatus,
  VisitTemplate,
} from 'types';
import {
  VISIT_DURATION_MINUTES,
  VISIT_STATUS_OPTIONS,
  VISIT_TYPE_OPTIONS,
  applyTemplateToForm,
  formatDurationLabel,
  parseIsoDate,
  toIsoDate,
  toSelectOptions,
} from 'utils';

const NO_CARER = 'none';

/** Add and edit share these fields. `status` only exists when editing. */
export type VisitFormValues = VisitFormData & { status?: VisitStatus | '' };

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

export function FormField({ label, htmlFor, error, className, children }: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface ScheduleVisitFormProps {
  values: VisitFormValues;
  errors: ScheduleFormErrors;
  onChange: (patch: Partial<VisitFormValues>) => void;
  patients: SchedulePatient[];
  carers: ScheduleCarer[];
  templates: VisitTemplate[];
  showStatus?: boolean;
  showTemplates?: boolean;
}

export function ScheduleVisitForm({
  values,
  errors,
  onChange,
  patients,
  carers,
  templates,
  showStatus = false,
  showTemplates = true,
}: ScheduleVisitFormProps) {
  const patientOptions = useMemo(() => toSelectOptions(patients), [patients]);
  const carerOptions = useMemo(
    () => [{ value: NO_CARER, label: 'Unassigned (assign later)' }, ...toSelectOptions(carers)],
    [carers]
  );
  const durationOptions = useMemo(() => {
    const minutes: number[] = [...VISIT_DURATION_MINUTES];
    if (typeof values.durationMinutes === 'number' && !minutes.includes(values.durationMinutes)) {
      minutes.push(values.durationMinutes);
    }
    return minutes.sort((a, b) => a - b).map((m) => ({ value: String(m), label: formatDurationLabel(m) }));
  }, [values.durationMinutes]);

  const applyTemplate = (template: VisitTemplate) => {
    const { templateId, title, type, durationMinutes } = applyTemplateToForm(values, template);
    onChange({ templateId, title, type, durationMinutes });
  };

  return (
    <div className="space-y-4">
      {showTemplates && templates.length > 0 && (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Start from a template</Label>
          <div className="flex flex-wrap gap-1.5">
            {templates.map((template) => (
              <Button
                key={template.id}
                type="button"
                size="xs"
                variant={values.templateId === template.id ? 'brandOutline' : 'outline'}
                aria-pressed={values.templateId === template.id}
                onClick={() => applyTemplate(template)}
              >
                {template.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Patient *" htmlFor="patientId" error={errors.patientId}>
          <ScheduleSelect
            id="patientId"
            value={values.patientId}
            options={patientOptions}
            placeholder="Select patient"
            invalid={Boolean(errors.patientId)}
            onValueChange={(patientId) => onChange({ patientId })}
          />
        </FormField>

        <FormField label="Assigned carer" htmlFor="carerId" error={errors.carerId}>
          <ScheduleSelect
            id="carerId"
            value={values.carerId === '' ? NO_CARER : values.carerId}
            options={carerOptions}
            onValueChange={(carerId) => onChange({ carerId: carerId === NO_CARER ? '' : carerId })}
          />
        </FormField>
      </div>

      <FormField label="Title *" htmlFor="title" error={errors.title}>
        <Input
          id="title"
          placeholder="e.g. Morning personal care"
          value={values.title}
          aria-invalid={Boolean(errors.title) || undefined}
          onChange={(event) => onChange({ title: event.target.value })}
        />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Visit type *" htmlFor="type" error={errors.type}>
          <ScheduleSelect
            id="type"
            value={values.type}
            options={VISIT_TYPE_OPTIONS}
            placeholder="Select type"
            invalid={Boolean(errors.type)}
            onValueChange={(type) => onChange({ type: type as VisitFormData['type'] })}
          />
        </FormField>

        <FormField label="Duration *" htmlFor="durationMinutes" error={errors.durationMinutes}>
          <ScheduleSelect
            id="durationMinutes"
            value={values.durationMinutes === '' ? '' : String(values.durationMinutes)}
            options={durationOptions}
            placeholder="Select duration"
            invalid={Boolean(errors.durationMinutes)}
            onValueChange={(value) => onChange({ durationMinutes: value === '' ? '' : Number(value) })}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Date *" htmlFor="date" error={errors.date}>
          <DatePicker
            id="date"
            className="w-full"
            value={values.date ? parseIsoDate(values.date) : undefined}
            onChange={(date) => date && onChange({ date: toIsoDate(date) })}
          />
        </FormField>

        <FormField label="Start time *" htmlFor="startTime" error={errors.startTime}>
          <Input
            id="startTime"
            type="time"
            value={values.startTime}
            aria-invalid={Boolean(errors.startTime) || undefined}
            onChange={(event) => onChange({ startTime: event.target.value })}
          />
        </FormField>
      </div>

      {showStatus && (
        <FormField label="Status *" htmlFor="status" error={errors.status}>
          <ScheduleSelect
            id="status"
            value={values.status ?? ''}
            options={VISIT_STATUS_OPTIONS}
            placeholder="Select status"
            invalid={Boolean(errors.status)}
            onValueChange={(status) => onChange({ status: status as VisitStatus })}
          />
        </FormField>
      )}

      <FormField label="Location" htmlFor="location" error={errors.location}>
        <Input
          id="location"
          placeholder="Defaults to the patient's address"
          value={values.location}
          onChange={(event) => onChange({ location: event.target.value })}
        />
      </FormField>

      <FormField label="Notes" htmlFor="notes" error={errors.notes}>
        <Textarea
          id="notes"
          placeholder="Special instructions for this visit"
          className="min-h-20"
          value={values.notes}
          onChange={(event) => onChange({ notes: event.target.value })}
        />
      </FormField>
    </div>
  );
}