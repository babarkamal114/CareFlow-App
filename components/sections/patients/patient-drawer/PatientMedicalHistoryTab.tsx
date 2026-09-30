'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { AlertTriangle, Heart, Activity } from 'lucide-react';
import {
  capitalise,
  formatPatientDateGB,
  getAllergyBadgeVariant,
  getConditionBadgeVariant,
  sortAllergies,
  sortConditions,
  sortHospitalisations,
  type PatientAllergy,
  type PatientCondition,
  type PatientHospitalisation,
} from 'utils';

interface PatientMedicalHistoryTabProps {
  conditions: PatientCondition[];
  allergies: PatientAllergy[];
  hospitalisations: PatientHospitalisation[];
}

export function PatientMedicalHistoryTab({ conditions, allergies, hospitalisations }: PatientMedicalHistoryTabProps) {
  const sortedConditions = useMemo(() => sortConditions(conditions), [conditions]);
  const sortedAllergies = useMemo(() => sortAllergies(allergies), [allergies]);
  const sortedHospitalisations = useMemo(() => sortHospitalisations(hospitalisations), [hospitalisations]);

  if (!sortedConditions.length && !sortedAllergies.length && !sortedHospitalisations.length) {
    return (
      <div className="text-center py-8">
        <Heart className="h-12 w-12 text-cf-ink-40 mx-auto mb-3" />
        <p className="text-sm text-cf-ink-60">No medical history recorded</p>
        <p className="text-xs text-cf-ink-40 mt-1">
          Conditions, allergies and hospital stays will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedConditions.length > 0 && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Heart className="h-4 w-4 text-cf-ink-60" />
              Current Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sortedConditions.map((condition, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-cf-surface-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium text-cf-ink">{condition.name}</p>
                  <p className="text-xs text-cf-ink-60">
                    Diagnosed: {formatPatientDateGB(condition.diagnosedDate)}
                  </p>
                </div>
                <Badge variant={getConditionBadgeVariant(condition.status)} className="text-[10px]">
                  {capitalise(condition.status)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {sortedAllergies.length > 0 && (
        <Card className="border-cf-border border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              Allergies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sortedAllergies.map((allergy, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-red-50/30 rounded-lg border border-red-200/50">
                <div>
                  <p className="text-sm font-medium text-cf-ink">{allergy.name}</p>
                  <p className="text-xs text-cf-ink-60">Reaction: {allergy.reaction}</p>
                </div>
                <Badge variant={getAllergyBadgeVariant(allergy.severity)} className="text-[10px]">
                  {capitalise(allergy.severity)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {sortedHospitalisations.length > 0 && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-cf-ink-60" />
              Hospitalisations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sortedHospitalisations.map((hospitalisation, index) => (
              <div key={index} className="p-2 bg-cf-surface-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-cf-ink">{hospitalisation.reason}</p>
                  <span className="text-xs text-cf-ink-60">{hospitalisation.duration}</span>
                </div>
                <p className="text-xs text-cf-ink-60">
                  {formatPatientDateGB(hospitalisation.date)}
                </p>
                <p className="text-xs text-cf-ink-60 mt-1">Outcome: {hospitalisation.outcome}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}