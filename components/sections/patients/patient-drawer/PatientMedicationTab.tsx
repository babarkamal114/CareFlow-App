'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Pill, Plus } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { Skeleton } from "ui/skeleton";
import { MedicationTypeBadge } from "ui/medication/medication-type-badge";
import { usePatientDrawerMedications } from "hooks";
import {
  getMedicationPrescriberParts,
  getMedicationStatus,
  getMedicationSummaryParts,
} from "app-utils/patient-medication-summary";
import { getMedicationsPageUrl } from "app-utils/medication-deep-link";
import { DotSeparated } from '../DotSeparated';

interface PatientMedicationsTabProps {
  patientId: string;
}

export function PatientMedicationsTab({ patientId }: PatientMedicationsTabProps) {
  const router = useRouter();
  const { preview, total, hiddenCount, now, isLoading, isError } = usePatientDrawerMedications(patientId);
  const addMedication = () => router.push(getMedicationsPageUrl(patientId, "add"));

  if (isLoading) {
    return <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-16 rounded-lg" />)}</div>;
  }

  if (isError) {
    return <p className="py-8 text-center text-sm text-cf-ink-60">We could not load this patient&apos;s medications. Please try again.</p>;
  }

  if (total === 0) {
    return (
      <div className="py-8 text-center">
        <Pill className="mx-auto mb-3 h-12 w-12 text-cf-ink-40" />
        <p className="text-sm text-cf-ink-60">No medications recorded</p>
        <Button variant="outline" size="sm" className="mt-3" onClick={addMedication}><Plus />Add medication</Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-cf-ink-60">
          {hiddenCount > 0 ? `Showing ${preview.length} of ${total} medications` : `${total} medication${total === 1 ? "" : "s"}`}
        </p>
        <Button variant="outline" size="sm" onClick={addMedication}><Plus />Add medication</Button>
      </div>

      <ul className="divide-y divide-cf-border-light rounded-lg border border-cf-border-light">
        {preview.map((med) => {
          const status = getMedicationStatus(med, now);
          return (
            <li key={med.id} className="space-y-1 p-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-sm font-medium text-cf-ink">{med.drugName} {med.strength}</span>
                <MedicationTypeBadge medication={med} />
                <Badge variant={status.variant} shape="pill" badgeSize="sm">{status.label}</Badge>
              </div>
              <div className="text-xs text-cf-ink-60">
                <DotSeparated parts={getMedicationSummaryParts(med)} />
              </div>
              {med.instructions && (
                <p className="rounded bg-cf-surface-muted p-2 text-xs text-cf-ink-60">{med.instructions}</p>
              )}
              <div className="text-[11px] text-cf-ink-40">
                <DotSeparated parts={getMedicationPrescriberParts(med)} />
              </div>
              {med.changeNote && status.label === 'Changed' && (
                <p className="text-xs font-medium text-warning">{med.changeNote}</p>
              )}
            </li>
          );
        })}
      </ul>

      {hiddenCount > 0 && (
        <Link
          href={getMedicationsPageUrl(patientId)}
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-500 hover:underline"
        >
          View all medications ({total})
          <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}