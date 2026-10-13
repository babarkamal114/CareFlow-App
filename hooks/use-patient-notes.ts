"use client";

import { useMemo } from "react";
import type { PatientDailyNote } from "types";
import { MOCK_PATIENT_NOTES } from "@/lib/mock/patient-clinical-mock-data";

export function usePatientNotes(patientId: string | undefined) {
  const notes = useMemo<PatientDailyNote[]>(
    () =>
      patientId
        ? MOCK_PATIENT_NOTES.filter((n) => n.patientId === patientId).sort((a, b) =>
            `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`)
          )
        : [],
    [patientId]
  );

  return { notes };
}