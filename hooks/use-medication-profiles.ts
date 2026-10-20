"use client";
import { toast } from "@/components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MEDICATION_MOCK_NOW, discontinueMedication, mockAllergyAliases, mockInteractionRules, saveMedication } from "lib";
import { useMemo, useState } from "react";
import type { Medication, MedicationFormData } from "types";
import { groupMedicationsByPatient } from "utils";
import { medicationKeys, useMedicationPatientsQuery, useMedicationsQuery } from "./use-medication-queries";

interface FormState { open: boolean; patientId: string | null; medication: Medication | null }
const CLOSED: FormState = { open: false, patientId: null, medication: null };

export function useMedicationProfiles() {
  const qc = useQueryClient();
  const patientsQ = useMedicationPatientsQuery();
  const medsQ = useMedicationsQuery();
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<FormState>(CLOSED);
  const [discontinueTarget, setDiscontinueTarget] = useState<Medication | null>(null);

  const patients = patientsQ.data ?? [];
  const medications = medsQ.data ?? [];
  const groups = useMemo(() => groupMedicationsByPatient(medications, patients, search), [medications, patients, search]);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: medicationKeys.medications });
    qc.invalidateQueries({ queryKey: medicationKeys.round });
    qc.invalidateQueries({ queryKey: medicationKeys.controlled });
  };

  const saveMutation = useMutation({
    mutationFn: saveMedication,
    onSuccess: (med, vars) => {
      refresh();
      setForm(CLOSED);
      toast.success(vars.id ? `${med.drugName} updated — carers will see the change highlighted` : `${med.drugName} added`);
    },
    onError: () => toast.error("Could not save the medication. Please try again."),
  });

  const discontinueMutation = useMutation({
    mutationFn: discontinueMedication,
    onSuccess: () => {
      refresh();
      toast.success(`${discontinueTarget?.drugName ?? "Medication"} discontinued`);
      setDiscontinueTarget(null);
    },
    onError: () => toast.error("Could not discontinue the medication."),
  });

  return {
    groups, patients, medications, search, setSearch, now: MEDICATION_MOCK_NOW,
    isLoading: patientsQ.isLoading || medsQ.isLoading,
    rules: mockInteractionRules, allergyAliases: mockAllergyAliases,
    form, openAdd: (patientId?: string) => setForm({ open: true, patientId: patientId ?? null, medication: null }),
    openEdit: (medication: Medication) => setForm({ open: true, patientId: medication.patientId, medication }),
    closeForm: () => setForm(CLOSED),
    save: (data: MedicationFormData) => saveMutation.mutate({ id: form.medication?.id, data }),
    isSaving: saveMutation.isPending,
    discontinueTarget, askDiscontinue: setDiscontinueTarget,
    confirmDiscontinue: () => discontinueTarget && discontinueMutation.mutate(discontinueTarget.id),
    isDiscontinuing: discontinueMutation.isPending,
  };
}
