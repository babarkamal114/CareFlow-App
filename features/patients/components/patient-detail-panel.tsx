"use client";
// features/patients/components/patient-detail-panel.tsx
// Keeps ALL existing action + react-query logic unchanged.
// Only the visual layer has been upgraded to match the Figma design.

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useActionState, useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Phone, Calendar, AlertTriangle } from "lucide-react";
import Link from "next/link";

import { Button } from "ui-components";

import {
  type UpdatePatientActionState,
  updatePatientDisplayNameAction,
} from "../actions/update-patient.action";
import { patientKeys } from "../queries/patient-query-keys";
import { fetchPatientById } from "../services/fetch-patient-by-id";
import { RiskBadge } from "./ui/risk-badge";
import { StatusBadge } from "./ui/status-badge";
import { CarePlanBar } from "./ui/care-plan-bar";
import { PatientAvatar } from "./ui/patient-avatar";

const initialActionState: UpdatePatientActionState = { status: "idle" };

export function PatientDetailPanel({ patientId }: { patientId: string }): ReactNode {
  // ── Existing query logic (unchanged) ──────────────────────────────────────
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

  // ── Loading / error states ─────────────────────────────────────────────────
  if (isPending) {
    return (
      <div className="flex items-center justify-center h-48 text-[#8B8FA8] text-sm">
        Loading patient…
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        {error instanceof Error ? error.message : "Something went wrong"}
      </p>
    );
  }

  if (!data) return null;

  // ── Figma-styled UI ────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-xl border border-[#E4E5EA] overflow-hidden"
    >
      {/* Header row */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F0F1F5]">
        <Link href="/patients"
          className="p-1.5 rounded-lg hover:bg-[#F4F5F7] transition-colors">
          <ArrowLeft className="w-4 h-4 text-[#8B8FA8]" />
        </Link>
        <PatientAvatar initials={data.initials ?? "?"} displayName={data.displayName} size="md" />
        <div className="flex-1">
          <h2 className="text-[15px] font-semibold text-[#1A1D2E]">{data.displayName}</h2>
          {data.nhsNumber && (
            <p className="text-[12px] text-[#8B8FA8]">NHS {data.nhsNumber}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {data.risk   && <RiskBadge   risk={data.risk}     />}
          {data.status && <StatusBadge status={data.status} />}
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#F0F1F5]">
        {[
          { icon: Calendar,      label: "Age",        value: data.age ? `${data.age} yrs` : "—" },
          { icon: MapPin,        label: "Address",    value: data.address   ?? "—" },
          { icon: Phone,         label: "Carer",      value: data.carer     ?? "—" },
          { icon: AlertTriangle, label: "Next Visit", value: data.nextVisit ?? "—" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white px-5 py-4">
            <div className="flex items-center gap-1.5 mb-1">
              <Icon className="w-3.5 h-3.5 text-[#B0B3C3]" />
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#B0B3C3]">
                {label}
              </span>
            </div>
            <p className="text-[14px] font-semibold text-[#1A1D2E]">{value}</p>
          </div>
        ))}
      </div>

      {/* Care plan bar */}
      {data.carePlanStatus && (
        <div className="px-5 py-4 border-t border-[#F0F1F5]">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-[#B0B3C3] mb-2">
            Care Plan
          </p>
          <CarePlanBar status={data.carePlanStatus} />
        </div>
      )}

      {/* Edit display name form — existing logic, restyled */}
      <div className="px-5 py-4 border-t border-[#F0F1F5]">
        <p className="text-[11px] uppercase tracking-wider font-semibold text-[#B0B3C3] mb-3">
          Edit Details
        </p>
        <form action={formAction} className="flex max-w-md flex-col gap-3">
          <input type="hidden" name="id" value={data.id} />
          <label className="text-[12px] font-medium text-[#4A4D63]">
            Display name
            <input
              name="displayName"
              defaultValue={data.displayName}
              className="mt-1 w-full rounded-lg border border-[#E4E5EA] bg-white
                         px-3 py-2 text-[13px] text-[#1A1D2E]
                         focus:outline-none focus:ring-2 focus:ring-[#0EA472]/30
                         focus:border-[#0EA472] transition-all"
            />
          </label>
          <Button type="submit" disabled={isPendingAction}>Save</Button>
          {state.status === "error" && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}
          {state.status === "success" && (
            <p className="text-sm text-[#0EA472]">{state.message}</p>
          )}
        </form>
      </div>
    </motion.div>
  );
}
