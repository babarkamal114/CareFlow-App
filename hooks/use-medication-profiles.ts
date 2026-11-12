"use client";

import {
  MEDICATION_MOCK_NOW, mockAllergyAliases, mockInteractionRules, useDiscontinueMedicationApi, useGetMedicationPatientsApi,
  useGetMedicationsApi, useSaveMedicationApi,
} from "lib";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Medication, MedicationFormData } from "types";
import { groupMedicationsByPatient } from "app-utils/medication";

interface FormState { open: boolean; patientId: string | null; medication: Medication | null }
const CLOSED: FormState = { open: false, patientId: null, medication: null };

export function useMedicationProfiles() {
  const router = useRouter();
  const pathname = usePathname();
  const patientsQ = useGetMedicationPatientsApi();
  const medsQ = useGetMedicationsApi();
  const saveMedication = useSaveMedicationApi();
  const discontinueMedication = useDiscontinueMedicationApi();

  const [search, setSearch] = useState("");
  const [form, setForm] = useState<FormState>(CLOSED);
  const [discontinueTarget, setDiscontinueTarget] = useState<Medication | null>(null);
  const [patientFilterId, setPatientFilterId] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const patients = patientsQ.data ?? [];
  const allMedications = medsQ.data;
  const medications = useMemo(() => (allMedications ?? []).filter((m) => m.active), [allMedications]);  const allGroups = useMemo(() => groupMedicationsByPatient(medications, patients, search), [medications, patients, search]);
  const groups = useMemo(
    () => (patientFilterId ? allGroups.filter((g) => g.patient.id === patientFilterId) : allGroups),
    [allGroups, patientFilterId],
  );
  const filteredPatient = patientFilterId ? patients.find((p) => p.id === patientFilterId) ?? null : null;

  const focusPatient = (patientId: string) => {
    setSearch("");
    setPatientFilterId(patientId);
    setHighlightId(patientId);
  };
  const clearHighlight = useCallback(() => setHighlightId(null), []);
  const clearPatientFilter = () => {
    setPatientFilterId(null);
    setHighlightId(null);
    router.replace(pathname, { scroll: false }); // also drop ?patientId from the URL
  };

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
    patientFilterId, filteredPatient, highlightId, focusPatient, clearHighlight, clearPatientFilter,
    form,
    openAdd: (patientId?: string) => setForm({ open: true, patientId: patientId ?? null, medication: null }),
    openEdit: (medication: Medication) => setForm({ open: true, patientId: medication.patientId, medication }),
    closeForm: () => setForm(CLOSED),
    save, isSaving: saveMedication.isPending,
    discontinueTarget, askDiscontinue: setDiscontinueTarget,
    confirmDiscontinue, isDiscontinuing: discontinueMedication.isPending,
  };
}