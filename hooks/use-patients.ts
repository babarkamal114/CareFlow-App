"use client";

import { useCallback, useEffect, useState } from "react";
import type { Patient } from "types";
import { fetchPatients } from "utils";

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(() => {
    setIsLoading(true);
    setError(null);

    fetchPatients()
      .then(setPatients)
      .catch((err: Error) => setError(err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { patients, isLoading, error, refetch: load };
}