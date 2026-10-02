"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useActionState, useEffect, type ReactNode } from "react";

import { Button } from "@/components/ui";

import {
  type UpdatePatientActionState,
  updatePatientDisplayNameAction,
} from "../actions/update-patient.action";
import { patientKeys } from "../queries/patient-query-keys";
import { fetchPatientById } from "../services/fetch-patient-by-id";

const initialActionState: UpdatePatientActionState = { status: "idle" };

export function PatientDetailPanel({
  patientId,
}: {
  patientId: string;
}): ReactNode {
  const queryClient = useQueryClient();
  const { data, isPending, isError, error } = useQuery({
    queryKey: patientKeys.detail(patientId),
    queryFn: () => fetchPatientById(patientId),
  });

  const [state, formAction, isPendingAction] = useActionState(
    updatePatientDisplayNameAction,
    initialActionState,
  );

  useEffect(() => {
    if (state.status === "success") {
      void queryClient.invalidateQueries({ queryKey: patientKeys.detail(patientId) });
    }
  }, [patientId, queryClient, state.status]);

  if (isPending) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        {error instanceof Error ? error.message : "Something went wrong"}
      </p>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6 rounded-lg border border-border bg-card p-6">
      <div>
        <h2 className="text-lg font-semibold text-card-foreground">
          {data.displayName}
        </h2>
        {data.nhsNumber ? (
          <p className="text-sm text-muted-foreground">NHS {data.nhsNumber}</p>
        ) : null}
      </div>

      <form action={formAction} className="flex max-w-md flex-col gap-3">
        <input type="hidden" name="id" value={data.id} />
        <label className="text-sm font-medium text-card-foreground">
          Display name
          <input
            name="displayName"
            defaultValue={data.displayName}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </label>
        <Button type="submit" disabled={isPendingAction}>
          Save
        </Button>
        {state.status === "error" ? (
          <p className="text-sm text-destructive">{state.message}</p>
        ) : null}
        {state.status === "success" ? (
          <p className="text-sm text-muted-foreground">{state.message}</p>
        ) : null}
      </form>
    </div>
  );
}
