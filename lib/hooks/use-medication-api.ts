"use client";

import { useQueryClient } from "@tanstack/react-query";
import type {
  AuditReport, ControlledEntry, ControlledEntryFormData, ControlledStock, HistoryDose, Medication, MedicationFormData,
  MedicationPatient, PrnFollowUpFormData, PrnFormData, PrnRecord, RecordDoseFormData, ScheduledDose,
} from "types";
import {
  mockAuditReports, mockControlledEntries, mockControlledStock, mockDoses, mockHistory, mockMedicationPatients, mockMedications,
  mockPrnRecords,
} from "lib";
import { useApiMutation, useApiQuery } from "./use-api";

const mockRequest = <T,>(data: T, delay = 500): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

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
  useApiQuery<Medication[]>(keys.medications, () => mockRequest(mockMedications));

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

// ---------------- Writes (they only wait, then return a fixed response; the screens don't change) ----------------

export const useRecordDoseApi = () =>
  useMedicationMutation<ScheduledDose, RecordDoseVariables>("record-dose", () => mockRequest(mockDoses[0], 300));

export const useSaveMedicationApi = () =>
  useMedicationMutation<Medication, SaveMedicationVariables>("save-medication", ({ data }) =>
    mockRequest({ ...mockMedications[0], drugName: data.drugName }, 300)); // drugName so the success toast reads correctly

export const useDiscontinueMedicationApi = () =>
  useMedicationMutation<void, string>("discontinue-medication", () => mockRequest(undefined, 250));

export const useRecordPrnApi = () =>
  useMedicationMutation<PrnRecord, RecordPrnVariables>("record-prn", () => mockRequest(mockPrnRecords[0], 300));

export const useRecordPrnFollowUpApi = () =>
  useMedicationMutation<PrnRecord, RecordPrnFollowUpVariables>("record-prn-follow-up", () => mockRequest(mockPrnRecords[0], 250));

export const useRecordControlledEntryApi = () =>
  useMedicationMutation<void, RecordControlledEntryVariables>("record-controlled-entry", () => mockRequest(undefined, 300));

export const useGenerateAuditReportApi = () =>
  useMedicationMutation<AuditReport, void>("generate-audit-report", () => mockRequest(mockAuditReports[0], 500));
