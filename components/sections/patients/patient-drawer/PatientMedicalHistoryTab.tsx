'use client';

import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { AlertTriangle, Heart, Activity } from 'lucide-react';

interface PatientMedicalHistoryTabProps {
  conditions: Array<{ name: string; diagnosedDate: string; status: 'active' | 'managed' | 'resolved' | 'discharged' }>;
  allergies: Array<{ name: string; severity: 'mild' | 'moderate' | 'severe'; reaction: string }>;
  hospitalisations: Array<{ date: string; reason: string; duration: string; outcome: string }>;
}

export function PatientMedicalHistoryTab({ conditions, allergies, hospitalisations }: PatientMedicalHistoryTabProps) {
  return (
    <div className="space-y-4">
      {conditions && conditions.length > 0 && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Heart className="h-4 w-4 text-cf-ink-60" />
              Current Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {conditions.map((condition, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-cf-surface-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium text-cf-ink">{condition.name}</p>
                  <p className="text-xs text-cf-ink-60">
                    Diagnosed: {new Date(condition.diagnosedDate).toLocaleDateString('en-GB')}
                  </p>
                </div>
                <Badge
                  variant={
                    condition.status === 'active'
                      ? 'pastel-danger'
                      : condition.status === 'managed'
                      ? 'pastel-warning'
                      : 'pastel-success'
                  }
                  className="text-[10px]"
                >
                  {condition.status.charAt(0).toUpperCase() + condition.status.slice(1)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {allergies && allergies.length > 0 && (
        <Card className="border-cf-border border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              Allergies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {allergies.map((allergy, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-red-50/30 rounded-lg border border-red-200/50">
                <div>
                  <p className="text-sm font-medium text-cf-ink">{allergy.name}</p>
                  <p className="text-xs text-cf-ink-60">Reaction: {allergy.reaction}</p>
                </div>
                <Badge
                  variant={
                    allergy.severity === 'severe'
                      ? 'pastel-danger'
                      : allergy.severity === 'moderate'
                      ? 'pastel-warning'
                      : 'pastel-info'
                  }
                  className="text-[10px]"
                >
                  {allergy.severity.charAt(0).toUpperCase() + allergy.severity.slice(1)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {hospitalisations && hospitalisations.length > 0 && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-cf-ink-60" />
              Hospitalisations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {hospitalisations.map((hospitalisation, index) => (
              <div key={index} className="p-2 bg-cf-surface-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-cf-ink">{hospitalisation.reason}</p>
                  <span className="text-xs text-cf-ink-60">{hospitalisation.duration}</span>
                </div>
                <p className="text-xs text-cf-ink-60">
                  {new Date(hospitalisation.date).toLocaleDateString('en-GB')}
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