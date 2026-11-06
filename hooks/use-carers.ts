"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchCarers,
} from "utils";
import type { Carer } from "types";

/** Pass `enabled = false` to skip fetching (e.g. while a modal is closed). */
export function useCarers(enabled = true) {
  const [carers, setCarers] = useState<Carer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    fetchCarers()
      .then(setCarers)
      .catch((err: Error) => setError(err))
      .finally(() => setIsLoading(false));
  }, [enabled]);

  useEffect(() => {
    load();
  }, [load]);

  return { carers, isLoading, error, refetch: load };
}