"use client";

import { useMemo } from "react";
import type { PatientRiskAssessment } from "types";
import { MOCK_PATIENT_RISK_ASSESSMENTS } from "lib";

export function usePatientRiskAssessments(patientId: string | undefined) {
  const assessments = useMemo<PatientRiskAssessment[]>(
    () =>
      patientId
        ? MOCK_PATIENT_RISK_ASSESSMENTS.filter((a) => a.patientId === patientId)
        : [],
    [patientId]
  );

  return { assessments };
}