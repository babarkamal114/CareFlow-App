"use client";

import { useQueryClient } from "@tanstack/react-query";
import { parseISO } from "date-fns";
import type {
  AuditReport,
  ControlledEntry,
  ControlledEntryFormData,
  ControlledStock,
  HistoryDose,
  Medication,
  MedicationFormData,
  MedicationPatient,
  PrnFollowUpFormData,
  PrnFormData,
  PrnRecord,
  RecordDoseFormData,
  ScheduledDose,
} from "types";
import {
  MEDICATION_MOCK_NOW, mockAuditReports, mockControlledEntries, mockControlledStock, mockDoses, mockHistory, mockMedicationPatients,
  mockMedications, mockPrnRecords,
} from "lib";
import { useApiMutation, useApiQuery } from "./use-api";
import { mockRequest } from "lib";

const KEY = ["medication"] as const;
const keys = {
  patients: [...KEY, "patients"],
  medications: [...KEY, "medications"],
  round: [...KEY, "round"],
  history: [...KEY, "history"],
  prn: [...KEY, "prn"],
  controlled: [...KEY, "controlled"],
  reports: [...KEY, "reports"],
} as const;

export interface ControlledDataResponse { stock: ControlledStock[]; entries: ControlledEntry[] }
export interface RecordDoseVariables { doseId: string; data: RecordDoseFormData; recordedBy: string }
export interface SaveMedicationVariables { id?: string; data: MedicationFormData }
export interface RecordPrnVariables { data: PrnFormData; recordedBy: string }
export interface RecordPrnFollowUpVariables { id: string; data: PrnFollowUpFormData; recordedBy: string }
export interface RecordControlledEntryVariables { medicationId: string; data: ControlledEntryFormData; recordedBy: string }

let medicationStore: Medication[] | null = null;
const getMedicationStore = (): Medication[] => (medicationStore ??= [...mockMedications]);

function saveMedicationInStore(id: string | undefined, data: MedicationFormData): Medication {
  if (!data.route || !data.type || !data.frequency) throw new Error("Route, type and frequency are required");

  const current = getMedicationStore();
  const existing = id ? current.find((m) => m.id === id) : undefined;
  const instructions = data.instructions.trim();

  const medication: Medication = {
    id: existing?.id ?? `med-${Date.now()}`,
    patientId: data.patientId,
    drugName: data.drugName.trim(),
    strength: data.strength.trim(),
    route: data.route,
    type: data.type,
    frequency: data.frequency,
    times: data.times,
    prescriber: data.prescriber.trim(),
    startDate: parseISO(data.startDate),
    indication: data.indication.trim(),
    barcode: existing?.barcode ?? `5012349${String(Date.now()).slice(-6)}`,
    active: true,
    changedAt: MEDICATION_MOCK_NOW, 
    changeNote: existing ? "Medication details updated" : "New medication added",
    ...(data.endDate ? { endDate: parseISO(data.endDate) } : {}),
    ...(instructions ? { instructions } : {}),
    ...(data.schedule ? { schedule: data.schedule } : {}),
    ...(data.prnMinIntervalHours !== "" ? { prnMinIntervalHours: data.prnMinIntervalHours } : {}),
    ...(data.prnMaxPer24h !== "" ? { prnMaxPer24h: data.prnMaxPer24h } : {}),
  };

  medicationStore = existing
    ? current.map((m) => (m.id === existing.id ? medication : m))
    : [...current, medication];
  return medication;
}

function discontinueMedicationInStore(id: string): void {
  medicationStore = getMedicationStore().map((m) => (m.id === id ? { ...m, active: false } : m));
}

function useMedicationMutation<TData, TVariables>(name: string, mutationFn: (variables: TVariables) => Promise<TData>) {
  const queryClient = useQueryClient();
  return useApiMutation<TData, TVariables>({
    mutationKey: [...KEY, name],
    mutationFn,
    showErrorToast: true,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
    },
  });
}

// ---------------- Reads ----------------

export const useGetMedicationPatientsApi = () =>
  useApiQuery<MedicationPatient[]>(keys.patients, () => mockRequest(mockMedicationPatients));

export const useGetMedicationsApi = () =>
  useApiQuery<Medication[]>(keys.medications, () => mockRequest(getMedicationStore()));

export const useGetRoundDosesApi = () =>
  useApiQuery<ScheduledDose[]>(keys.round, () => mockRequest(mockDoses));

export const useGetMedicationHistoryApi = () =>
  useApiQuery<HistoryDose[]>(keys.history, () => mockRequest(mockHistory));

export const useGetPrnRecordsApi = () =>
  useApiQuery<PrnRecord[]>(keys.prn, () => mockRequest(mockPrnRecords));

export const useGetControlledDataApi = () =>
  useApiQuery<ControlledDataResponse>(keys.controlled, () =>
    mockRequest({ stock: mockControlledStock, entries: mockControlledEntries }));

export const useGetAuditReportsApi = () =>
  useApiQuery<AuditReport[]>(keys.reports, () => mockRequest(mockAuditReports));


export const useRecordDoseApi = () =>
  useMedicationMutation<ScheduledDose, RecordDoseVariables>("record-dose", () => mockRequest(mockDoses[0], 300));

export const useSaveMedicationApi = () =>
  useMedicationMutation<Medication, SaveMedicationVariables>("save-medication", ({ id, data }) =>
    mockRequest(undefined, 300).then(() => saveMedicationInStore(id, data)));

export const useDiscontinueMedicationApi = () =>
  useMedicationMutation<void, string>("discontinue-medication", (id) =>
    mockRequest(undefined, 250).then(() => discontinueMedicationInStore(id)));

export const useRecordPrnApi = () =>
  useMedicationMutation<PrnRecord, RecordPrnVariables>("record-prn", () => mockRequest(mockPrnRecords[0], 300));

export const useRecordPrnFollowUpApi = () =>
  useMedicationMutation<PrnRecord, RecordPrnFollowUpVariables>("record-prn-follow-up", () => mockRequest(mockPrnRecords[0], 250));

export const useRecordControlledEntryApi = () =>
  useMedicationMutation<void, RecordControlledEntryVariables>("record-controlled-entry", () => mockRequest(undefined, 300));

export const useGenerateAuditReportApi = () =>
  useMedicationMutation<AuditReport, void>("generate-audit-report", () => mockRequest(mockAuditReports[0], 500));