"use client";

import {
  MEDICATION_MOCK_NOW, mockAllergyAliases, mockInteractionRules, useDiscontinueMedicationApi, useGetMedicationPatientsApi,
  useGetMedicationsApi, useSaveMedicationApi,
} from "lib";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Medication, MedicationFormData } from "types";
import { groupMedicationsByPatient } from "utils";

interface FormState { open: boolean; patientId: string | null; medication: Medication | null }
const CLOSED: FormState = { open: false, patientId: null, medication: null };

export function useMedicationProfiles() {
  const patientsQ = useGetMedicationPatientsApi();
  const medsQ = useGetMedicationsApi();
  const saveMedication = useSaveMedicationApi();
  const discontinueMedication = useDiscontinueMedicationApi();

  const [search, setSearch] = useState("");
  const [form, setForm] = useState<FormState>(CLOSED);
  const [discontinueTarget, setDiscontinueTarget] = useState<Medication | null>(null);

  const patients = patientsQ.data ?? [];
  const medications = medsQ.data ?? [];
  const groups = useMemo(() => groupMedicationsByPatient(medications, patients, search), [medications, patients, search]);

  const save = (data: MedicationFormData) => {
    const id = form.medication?.id;
    saveMedication.mutate(
      { id, data },
      {
        onSuccess: (med) => {
          setForm(CLOSED);
          toast.success(id ? `${med.drugName} updated — carers will see the change highlighted` : `${med.drugName} added`);
        },
      },
    );
  };

  const confirmDiscontinue = () => {
    if (!discontinueTarget) return;
    const { id, drugName } = discontinueTarget;
    discontinueMedication.mutate(id, {
      onSuccess: () => {
        setDiscontinueTarget(null);
        toast.success(`${drugName} discontinued`);
      },
    });
  };

  return {
    groups, patients, medications, search, setSearch, now: MEDICATION_MOCK_NOW,
    isLoading: patientsQ.isLoading || medsQ.isLoading,
    rules: mockInteractionRules, allergyAliases: mockAllergyAliases,
    form,
    openAdd: (patientId?: string) => setForm({ open: true, patientId: patientId ?? null, medication: null }),
    openEdit: (medication: Medication) => setForm({ open: true, patientId: medication.patientId, medication }),
    closeForm: () => setForm(CLOSED),
    save, isSaving: saveMedication.isPending,
    discontinueTarget, askDiscontinue: setDiscontinueTarget,
    confirmDiscontinue, isDiscontinuing: discontinueMedication.isPending,
  };
}
