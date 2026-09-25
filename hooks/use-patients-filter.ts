"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Patient } from "types";
import {
  fetchPatients,
  filterPatientsByTab,
  getPatientTabCounts,
  PatientTab,
} from "utils";

export function usePatientsFilter() {
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [activeTab, setActiveTab] = useState<PatientTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const load = useCallback(() => {
    setIsLoading(true);
    setError(null);

    fetchPatients()
      .then(setAllPatients)
      .catch((err: Error) => setError(err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const patients = useMemo(
    () => filterPatientsByTab(allPatients, activeTab, searchQuery),
    [allPatients, activeTab, searchQuery]
  );

  const tabCounts = useMemo(() => getPatientTabCounts(allPatients), [allPatients]);

  return {
    patients, 
    tabCounts, 
    isLoading,
    error,
    refetch: load,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
  };
}