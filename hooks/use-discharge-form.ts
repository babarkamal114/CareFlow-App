"use client";

import { useCallback, useEffect, useState } from "react";
import {
  buildDischargePayload,
  getInitialDischargeForm,
  validateDischargeForm,
  type DischargeContacts,
  type DischargeFormState,
  type DischargePayload,
} from "utils";

interface UseDischargeFormArgs extends DischargeContacts {
  open: boolean;
  onConfirm: (payload: DischargePayload) => Promise<void> | void;
  onClose: () => void;
}

export function useDischargeForm({
  open,
  gpName,
  nextOfKinName,
  emergencyContact,
  onConfirm,
  onClose,
}: UseDischargeFormArgs) {
  const [form, setForm] = useState<DischargeFormState>(() =>
    getInitialDischargeForm({ gpName, nextOfKinName, emergencyContact })
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(getInitialDischargeForm({ gpName, nextOfKinName, emergencyContact }));
      setErrors({});
    }
  }, [open, gpName, nextOfKinName, emergencyContact]);

  const updateField = useCallback(
    <K extends keyof DischargeFormState>(key: K, value: DischargeFormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        if (key === 'scheduleFinalVisit') delete next.finalVisitDate;
        if (key === 'reason') delete next.notes;
        return next;
      });
    },
    []
  );

  const submit = async () => {
    const validation = validateDischargeForm(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    try {
      await onConfirm(buildDischargePayload(form));
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return { form, errors, submitting, updateField, submit };
}