'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ConflictWarningList,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  PreferenceWarningList,
} from '@/components/ui';
import { hasErrors, validateVisitForm } from 'lib';
import type {
  ScheduleContext,
  ScheduleFormErrors,
  VisitFormData,
  VisitIssues,
  VisitTemplate,
} from 'types';
import {
  canPreviewIssues,
  createVisitFormData,
  formDataToVisit,
  getVisitIssues,
  hasBlockingConflict,
} from 'utils';
import { ScheduleVisitForm, type VisitFormValues } from './ScheduleVisitForm';

const NO_ISSUES: VisitIssues = { conflicts: [], violations: [] };

interface ScheduleAddVisitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: VisitFormData) => Promise<void> | void;
  context: ScheduleContext;
  templates: VisitTemplate[];
  /** Pre-fills the form, e.g. the date and time of a clicked calendar slot. */
  defaultValues?: Partial<VisitFormData>;
}

export function ScheduleAddVisitModal({
  open,
  onOpenChange,
  onSave,
  context,
  templates,
  defaultValues,
}: ScheduleAddVisitModalProps) {
  const [values, setValues] = useState<VisitFormData>(() => createVisitFormData(defaultValues));
  const [errors, setErrors] = useState<ScheduleFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  // Reset each time the modal opens. A ref keeps parent re-renders from wiping the form.
  const defaultsRef = useRef(defaultValues);
  defaultsRef.current = defaultValues;
  useEffect(() => {
    if (open) {
      setValues(createVisitFormData(defaultsRef.current));
      setErrors({});
    }
  }, [open]);

  const issues = useMemo(
    () =>
      canPreviewIssues(values)
        ? getVisitIssues(formDataToVisit(values, 'draft', context, { templates }), context)
        : NO_ISSUES,
    [values, context, templates]
  );
  const isBlocked = hasBlockingConflict(issues.conflicts);

  const handleChange = (patch: Partial<VisitFormValues>) => {
    setValues((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(patch).forEach((key) => delete next[key]);
      return next;
    });
  };

  const handleSubmit = async () => {
    const nextErrors = validateVisitForm(values);
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
          <DialogTitle>Add Visit</DialogTitle>
          <DialogDescription>
            Choose a patient and carer. We check for clashes and patient preferences as you go.
          </DialogDescription>
        </DialogHeader>

        <ScheduleVisitForm
          values={values}
          errors={errors}
          onChange={handleChange}
          patients={context.patients}
          carers={context.carers}
          templates={templates}
        />

        <ConflictWarningList conflicts={issues.conflicts} />
        <PreferenceWarningList violations={issues.violations} />

        <DialogFooter className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            type="button"
            variant={isBlocked ? 'destructive' : 'default'}
            loading={isSaving}
            onClick={handleSubmit}
          >
            {isBlocked ? 'Schedule anyway' : 'Schedule Visit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}