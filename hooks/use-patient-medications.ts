"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchPatientMedications,
  sortControlledFirst,
  type PatientMedication,
} from "utils";

export function usePatientMedications(patientId: string | undefined) {
  const [medications, setMedications] = useState<PatientMedication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(() => {
    if (!patientId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    fetchPatientMedications(patientId)
      .then((meds) => setMedications(sortControlledFirst(meds)))
      .catch((err: Error) => setError(err))
      .finally(() => setIsLoading(false));
  }, [patientId]);

  useEffect(() => {
    load();
  }, [load]);

  return { medications, isLoading, error, refetch: load };
}