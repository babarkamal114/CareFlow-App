"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { MOCK_PATIENTS, MOCK_PATIENT_MEDICATIONS } from "utils";
import type {
  DischargePayload,
  Patient,
  PatientEditData,
  PatientTab,
} from "types";
import type { PatientMedication } from "types";
import { applyDischarge } from "app-utils/patient-discharge";
import { applyPatientEdit } from "app-utils/patient-edit";
import { filterPatientsByTab, getPatientStats, getPatientTabCounts } from "app-utils/patients";
import { sortControlledFirst } from "app-utils/patient-records";

type WorkspaceModal = "create" | "edit" | "medications" | null;

const SIMULATED_LATENCY_MS = 500;
const wait = () => new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

function groupMedicationsByPatient(): Record<string, PatientMedication[]> {
  const grouped: Record<string, PatientMedication[]> = {};
  for (const { patientId, ...medication } of MOCK_PATIENT_MEDICATIONS) {
    (grouped[patientId] ??= []).push(medication);
  }
  return grouped;
}

/** All state and handlers for the Patients page. Sections stay presentational. */
export function usePatientsWorkspace(initialPatientId?: string) {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [medicationsByPatient, setMedicationsByPatient] = useState(groupMedicationsByPatient);
  const [activeTab, setActiveTab] = useState<PatientTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(initialPatientId ?? null);
  const [drawerOpen, setDrawerOpen] = useState(Boolean(initialPatientId));
  const [modal, setModal] = useState<WorkspaceModal>(null);

  const selectedPatient = useMemo(
    () => patients.find((patient) => patient.id === selectedId) ?? null,
    [patients, selectedId]
  );

  const selectedMedications = useMemo(
    () => sortControlledFirst(selectedId ? (medicationsByPatient[selectedId] ?? []) : []),
    [medicationsByPatient, selectedId]
  );

  const filteredPatients = useMemo(
    () => filterPatientsByTab(patients, activeTab, searchQuery),
    [patients, activeTab, searchQuery]
  );
  const tabCounts = useMemo(() => getPatientTabCounts(patients), [patients]);
  const stats = useMemo(() => getPatientStats(patients), [patients]);

  const viewPatient = useCallback((patient: Patient) => {
    setSelectedId(patient.id);
    setDrawerOpen(true);
  }, []);

  const createPatient = useCallback((patient: Patient, medications: PatientMedication[]) => {
    setPatients((prev) => [patient, ...prev]);
    setMedicationsByPatient((prev) => ({ ...prev, [patient.id]: medications }));
    toast.success(`${patient.name} was added`);
  }, []);

  const updatePatient = useCallback(
    async (data: Partial<PatientEditData>) => {
      if (!selectedId) return;
      await wait();
      setPatients((prev) =>
        prev.map((patient) =>
          patient.id === selectedId ? applyPatientEdit(patient, data) : patient
        )
      );
      toast.success("Patient details updated");
    },
    [selectedId]
  );

  const saveMedications = useCallback(
    async (medications: PatientMedication[]) => {
      if (!selectedId) return;
      await wait();
      setMedicationsByPatient((prev) => ({ ...prev, [selectedId]: medications }));
      toast.success("Medications updated");
    },
    [selectedId]
  );

  const dischargePatient = useCallback(async (patientId: string, payload: DischargePayload) => {
    await wait();
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === patientId ? applyDischarge(patient, payload) : patient
      )
    );
    toast.success("Patient discharged. Their record is kept for audit.");
  }, []);

  const exportPatients = useCallback(() => {
    toast.info("Patient export will be available once the backend is connected.");
  }, []);

  return {
    filteredPatients,
    tabCounts,
    stats,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    hasFilters: activeTab !== "all" || searchQuery.trim() !== "",
    selectedPatient,
    selectedMedications,
    drawerOpen,
    setDrawerOpen,
    viewPatient,
    createOpen: modal === "create",
    editOpen: modal === "edit",
    medicationsOpen: modal === "medications",
    setCreateOpen: (open: boolean) => setModal(open ? "create" : null),
    setEditOpen: (open: boolean) => setModal(open ? "edit" : null),
    setMedicationsOpen: (open: boolean) => setModal(open ? "medications" : null),
    createPatient,
    updatePatient,
    saveMedications,
    dischargePatient,
    exportPatients,
  };
}