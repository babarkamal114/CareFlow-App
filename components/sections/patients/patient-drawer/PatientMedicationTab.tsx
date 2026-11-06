'use client';

import { Card, CardContent, Badge } from "@/components/ui";
import { Pill } from 'lucide-react';
import type { PatientMedication } from 'types';
import { getMedicationDetailParts, getMedicationPrescribedParts, getMedicationTypeBadgeVariant, getMedicationTypeLabel } from 'utils';
import { DotSeparated } from '../DotSeparated';

interface PatientMedicationsTabProps {
  /** Current medication list for this patient (already sorted). */
  medications: PatientMedication[];
}

export function PatientMedicationsTab({ medications }: PatientMedicationsTabProps) {
  if (medications.length === 0) {
    return (
      <div className="text-center py-8">
        <Pill className="h-12 w-12 text-cf-ink-40 mx-auto mb-3" />
        <p className="text-sm text-cf-ink-60">No medications recorded</p>
        <p className="text-xs text-cf-ink-40 mt-1">
          Use Update Medication to add this patient&apos;s prescriptions
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {medications.map((med) => {
        const prescribedParts = getMedicationPrescribedParts(med);

        return (
          <Card key={med.id} className="border-cf-border">
            <CardContent className="pt-4">
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm text-cf-ink">{med.name}</p>
                      <Badge
                        variant={getMedicationTypeBadgeVariant(med.medicationType)}
                        className="text-[10px]"
                        shape="pill"
                      >
                        {getMedicationTypeLabel(med.medicationType, 'short')}
                      </Badge>
                    </div>
                    <p className="text-xs text-cf-ink-60 mt-0.5">{med.indication}</p>
                  </div>
                  <Badge variant="pastel-info" className="text-xs shrink-0" shape="pill">
                    {med.dosage}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-xs text-cf-ink-60 flex-wrap">
                  <DotSeparated parts={getMedicationDetailParts(med)} />
                </div>

                {med.instructions && (
                  <div className="text-xs text-cf-ink-60 bg-cf-surface-muted rounded p-2">
                    {med.instructions}
                  </div>
                )}

                {prescribedParts.length > 0 && (
                  <div className="flex items-center gap-2 text-[10px] text-cf-ink-40">
                    <DotSeparated parts={prescribedParts} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}