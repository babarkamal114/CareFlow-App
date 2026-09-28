"use client";

import { useCallback, useEffect, useState } from "react";
import {
  buildDocumentsFromFiles,
  fetchPatientDocuments,
  sortDocumentsNewestFirst,
  type PatientDocument,
} from "utils";

export function usePatientDocuments(patientId: string | undefined) {
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(() => {
    if (!patientId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    fetchPatientDocuments(patientId)
      .then((docs) => setDocuments(sortDocumentsNewestFirst(docs)))
      .catch((err: Error) => setError(err))
      .finally(() => setIsLoading(false));
  }, [patientId]);

  useEffect(() => {
    load();
  }, [load]);

  const addFiles = useCallback((files: File[], docType: string) => {
    setDocuments((prev) =>
      sortDocumentsNewestFirst([...buildDocumentsFromFiles(files, docType), ...prev])
    );
  }, []);

  const removeDocument = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return { documents, isLoading, error, refetch: load, addFiles, removeDocument };
}