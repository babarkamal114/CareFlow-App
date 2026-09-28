"use client";

import { useEffect, useMemo, useState } from "react";
import {
  EMPTY_MEDICATION_DRAFT,
  getIncompleteMedicationIds,
  haveMedicationsChanged,
  validateMedicationDraft,
  type MedicationDraft,
  type PatientMedication,
} from "utils";

interface UseMedicationFormArgs {
  open: boolean;
  medications: PatientMedication[];
  onSave: (medications: PatientMedication[]) => Promise<void>;
  onClose: () => void;
}

export function useMedicationForm({ open, medications, onSave, onClose }: UseMedicationFormArgs) {
  const [initialMeds, setInitialMeds] = useState<PatientMedication[]>([]);
  const [meds, setMeds] = useState<PatientMedication[]>([]);
  const [draft, setDraft] = useState<MedicationDraft>(EMPTY_MEDICATION_DRAFT);
  const [draftErrors, setDraftErrors] = useState<Record<string, string>>({});
  const [incompleteIds, setIncompleteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const list = Array.isArray(medications) ? medications : [];
      setInitialMeds(list);
      setMeds(list);
      setDraft(EMPTY_MEDICATION_DRAFT);
      setDraftErrors({});
      setIncompleteIds([]);
    }
  }, [open, medications]);

  const isDirty = useMemo(() => haveMedicationsChanged(initialMeds, meds), [initialMeds, meds]);
  const hasPendingDraft = draft.name.trim() !== '' || draft.dosage.trim() !== '';

  const updateDraft = <K extends keyof MedicationDraft>(field: K, value: MedicationDraft[K]) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setDraftErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      if (field === 'dosage') delete next.name; 
      return next;
    });
  };

  const addMedication = () => {
    const errors = validateMedicationDraft(draft, meds);
    setDraftErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setMeds((prev) => [
      ...prev,
      { id: Date.now().toString(), ...draft, name: draft.name.trim(), dosage: draft.dosage.trim() },
    ]);
    setDraft(EMPTY_MEDICATION_DRAFT);
  };

  const removeMedication = (id: string) => {
    setMeds((prev) => prev.filter((m) => m.id !== id));
    setIncompleteIds((prev) => prev.filter((x) => x !== id));
  };

  const updateMedication = (id: string, field: keyof PatientMedication, value: string) => {
    setMeds((prev) => prev.map((m) => (m.id === id ? ({ ...m, [field]: value } as PatientMedication) : m)));
    setIncompleteIds((prev) => prev.filter((x) => x !== id));
  };

  const submit = async () => {
    const incomplete = getIncompleteMedicationIds(meds);
    setIncompleteIds(incomplete);
    if (incomplete.length > 0) return;

    setIsLoading(true);
    try {
      await onSave(meds);
      onClose();
    } catch (error) {
      console.error('Failed to update medications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    meds,
    draft,
    draftErrors,
    incompleteIds,
    isLoading,
    isDirty,
    hasPendingDraft,
    updateDraft,
    addMedication,
    removeMedication,
    updateMedication,
    submit,
  };
}