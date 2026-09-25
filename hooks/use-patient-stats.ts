"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchPatientStats, PatientStats } from "utils";

export function usePatientStats() {
  const [data, setData] = useState<PatientStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(() => {
    setIsLoading(true);
    setError(null);

    fetchPatientStats()
      .then(setData)
      .catch((err: Error) => setError(err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, isLoading, error, refetch: load };
}