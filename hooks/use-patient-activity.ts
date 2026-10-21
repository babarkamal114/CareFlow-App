"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchPatientActivity,
} from "utils";
import type { PatientActivity } from "types";

export function usePatientActivity(patientId: string | undefined) {
  const [activities, setActivities] = useState<PatientActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(() => {
    if (!patientId) return;

    setIsLoading(true);
    setError(null);

    fetchPatientActivity(patientId)
      .then(setActivities)
      .catch((err: Error) => setError(err))
      .finally(() => setIsLoading(false));
  }, [patientId]);

  useEffect(() => {
    load();
  }, [load]);

  return { activities, isLoading, error, refetch: load };
}