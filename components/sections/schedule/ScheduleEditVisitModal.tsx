'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  ConflictWarningList,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  PreferenceWarningList,
} from '@/components/ui';
import { hasErrors, validateEditVisitForm } from 'lib';
import type {
  EditVisitFormData,
  ScheduleContext,
  ScheduleFormErrors,
  ScheduleVisit,
  VisitIssues,
  VisitTemplate,
} from 'types';
import {
  canPreviewIssues,
  formDataToVisit,
  getVisitIssues,
  hasBlockingConflict,
  visitToFormData,
} from 'utils';
import { ScheduleVisitForm, type VisitFormValues } from './ScheduleVisitForm';

const NO_ISSUES: VisitIssues = { conflicts: [], violations: [] };

interface ScheduleEditVisitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visit: ScheduleVisit | null;
  onSave: (visitId: string, data: EditVisitFormData) => Promise<void> | void;
  context: ScheduleContext;
  templates: VisitTemplate[];
}

export function ScheduleEditVisitModal({
  open,
  onOpenChange,
  visit,
  onSave,
  context,
  templates,
}: ScheduleEditVisitModalProps) {
  const [values, setValues] = useState<EditVisitFormData | null>(null);
  const [errors, setErrors] = useState<ScheduleFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open && visit) {
      setValues(visitToFormData(visit));
      setErrors({});
    }
  }, [open, visit]);

  // The visit's own id is reused so it is never reported as clashing with itself.
  const issues = useMemo(
    () =>
      visit && values && canPreviewIssues(values)
        ? getVisitIssues(
            formDataToVisit(values, visit.id, context, { base: visit, templates }),
            context
          )
        : NO_ISSUES,
    [visit, values, context, templates]
  );
  const isBlocked = hasBlockingConflict(issues.conflicts);

  if (!visit || !values) return null;

  const handleChange = (patch: Partial<VisitFormValues>) => {
    setValues((prev) => (prev ? { ...prev, ...patch } : prev));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(patch).forEach((key) => delete next[key]);
      return next;
    });
  };

  const handleSubmit = async () => {
    const nextErrors = validateEditVisitForm(values);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setIsSaving(true);
    try {
      await onSave(visit.id, values);
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Visit</DialogTitle>
          <DialogDescription>
            Update the details for {visit.patientName}&apos;s visit.
          </DialogDescription>
        </DialogHeader>

        <ScheduleVisitForm
          values={values}
          errors={errors}
          onChange={handleChange}
          patients={context.patients}
          carers={context.carers}
          templates={templates}
          showStatus
          showTemplates={false}
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
            {isBlocked ? 'Save anyway' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}