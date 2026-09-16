'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Badge } from "@/components/ui";
import { CarePlanModule, MedicationContent } from "types";

interface MedicationModuleViewProps {
  module: CarePlanModule;
}

export function MedicationModuleView({ module }: MedicationModuleViewProps) {
  const content = module.content as MedicationContent;

  return (
    <div className="space-y-4">
      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Medication Adherence</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className="capitalize">{content.medicationAdherenceLevel}</Badge>
        </CardContent>
      </Card>

      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Administration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs font-medium text-cf-ink-60 mb-1">Method</p>
            <p className="text-sm text-cf-ink">{content.administrationMethod}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-cf-ink-60 mb-1">
              Storage Requirements
            </p>
            <p className="text-sm text-cf-ink">{content.storageRequirements}</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h4 className="font-semibold text-cf-ink">Current Medications</h4>
        {content.medications.map((med) => (
          <Card key={med.id} className="border-cf-border">
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm text-cf-ink">{med.name}</p>
                  <p className="text-xs text-cf-ink-60 mt-1">{med.indication}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs font-medium text-cf-ink-60">Dosage</p>
                    <p className="text-cf-ink">{med.dosage}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-cf-ink-60">Frequency</p>
                    <p className="text-cf-ink">{med.frequency}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-cf-ink-60">Timing</p>
                    <p className="text-cf-ink">{med.timing}</p>
                  </div>
                </div>

                {med.sideEffects.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-cf-ink-60 mb-2">
                      Side Effects
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {med.sideEffects.map((effect, i) => (
                        <Badge key={`side-effect-${effect}-${i}`} variant="pastel-warning" className="text-xs">
                          {effect}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Review Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <p className="text-cf-ink-60 font-medium">Last Review</p>
            <p className="text-cf-ink">{content.lastReviewDate}</p>
          </div>
          <div>
            <p className="text-cf-ink-60 font-medium">Next Review</p>
            <p className="text-cf-ink">{content.nextReviewDate}</p>
          </div>
        </CardContent>
      </Card>

      {content.goals.length > 0 && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {content.goals.map((goal, i) => (
                <li key={`goal-${goal}-${i}`} className="text-sm text-cf-ink flex gap-2">
                  <span className="text-cf-primary">→</span>
                  {goal}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {content.notes && (
        <Card className="border-cf-border bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-cf-ink whitespace-pre-wrap">
              {content.notes}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}