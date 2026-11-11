"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { buildDischargePayload, getInitialDischargeForm } from "app-utils/patient-discharge";
import type {
  DischargeContacts,
  DischargeFormState,
  DischargePayload,
  PatientFormErrors,
} from "types";
import { validateDischargeForm } from "lib";

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
  const contactsRef = useRef<DischargeContacts>({ gpName, nextOfKinName, emergencyContact });
  contactsRef.current = { gpName, nextOfKinName, emergencyContact };

  const [form, setForm] = useState<DischargeFormState>(() =>
    getInitialDischargeForm(contactsRef.current)
  );
  const [errors, setErrors] = useState<PatientFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(getInitialDischargeForm(contactsRef.current));
      setErrors({});
      setSubmitError(null);
    }
  }, [open]);

  const updateField = useCallback(
    <K extends keyof DischargeFormState>(key: K, value: DischargeFormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setSubmitError(null);
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        if (key === "scheduleFinalVisit") {
          delete next.finalVisitDate;
          delete next.finalVisitTime;
        }
        if (key === "reason") delete next.notes;
        return next;
      });
    },
    []
  );

  const submit = useCallback(async () => {
    if (submitting) return;

    const validation = validateDischargeForm(form, contactsRef.current);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await onConfirm(buildDischargePayload(form, contactsRef.current));
      onClose();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Could not discharge the patient. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }, [form, submitting, onConfirm, onClose]);

  return { form, errors, submitError, submitting, updateField, submit };
}