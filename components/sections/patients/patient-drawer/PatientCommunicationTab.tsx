'use client';

import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { Languages, Brain, Users } from 'lucide-react';
import {
  getCapacityBadge,
  getCommunicationAids,
  hasCommunicationInfo,
  hasImpairment,
  type PatientCommunicationInfo,
} from 'utils';

export function PatientCommunicationTab(props: PatientCommunicationInfo) {
  const {
    preferredLanguage,
    hearingImpairment,
    visionImpairment,
    mentalCapacity,
    communicationNotes,
    poaName,
    poaRelationship,
    poaPhone,
  } = props;

  const aids = getCommunicationAids(props);

  if (!hasCommunicationInfo(props)) {
    return (
      <div className="text-center py-8">
        <Languages className="h-12 w-12 text-cf-ink-40 mx-auto mb-3" />
        <p className="text-sm text-cf-ink-60">No communication needs recorded</p>
        <p className="text-xs text-cf-ink-40 mt-1">
          Language, sensory needs, capacity and POA details will appear here
        </p>
      </div>
    );
  }

  const showCommunicationCard =
    preferredLanguage ||
    hasImpairment(hearingImpairment) ||
    hasImpairment(visionImpairment) ||
    aids.length > 0 ||
    communicationNotes;

  const capacity = mentalCapacity ? getCapacityBadge(mentalCapacity) : null;

  return (
    <div className="space-y-4">
      {showCommunicationCard && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Languages className="h-4 w-4 text-cf-ink-60" />
              Communication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {preferredLanguage && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-cf-ink-60">Preferred Language</span>
                <span className="text-cf-ink font-medium">{preferredLanguage}</span>
              </div>
            )}
            {hasImpairment(hearingImpairment) && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-cf-ink-60">Hearing</span>
                <Badge variant="pastel-warning" className="text-[10px]">{hearingImpairment}</Badge>
              </div>
            )}
            {hasImpairment(visionImpairment) && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-cf-ink-60">Vision</span>
                <Badge variant="pastel-warning" className="text-[10px]">{visionImpairment}</Badge>
              </div>
            )}
            {aids.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {aids.map((label) => (
                  <Badge key={label} variant="pastel-info" className="text-[10px]">{label}</Badge>
                ))}
              </div>
            )}
            {communicationNotes && (
              <div className="p-2 bg-cf-surface-muted rounded-lg">
                <p className="text-sm text-cf-ink-60">{communicationNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {capacity && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Brain className="h-4 w-4 text-cf-ink-60" />
              Mental Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center text-sm">
              <span className="text-cf-ink-60">Capacity Status</span>
              <Badge variant={capacity.variant} className="text-[10px]">{capacity.label}</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {(poaName || poaRelationship || poaPhone) && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-cf-ink-60" />
              Power of Attorney
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {poaName && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-cf-ink-60">Name</span>
                <span className="text-cf-ink font-medium">{poaName}</span>
              </div>
            )}
            {poaRelationship && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-cf-ink-60">Relationship</span>
                <span className="text-cf-ink font-medium">{poaRelationship}</span>
              </div>
            )}
            {poaPhone && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-cf-ink-60">Phone</span>
                <span className="text-cf-ink font-medium">{poaPhone}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}