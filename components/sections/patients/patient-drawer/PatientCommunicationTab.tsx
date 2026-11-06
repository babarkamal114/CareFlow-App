'use client';

import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { Languages, Ear, Eye, Brain, Users } from 'lucide-react';

interface PatientCommunicationTabProps {
  preferredLanguage?: string;
  hearingImpairment?: string;
  visionImpairment?: string;
  mentalCapacity?: string;
  hearingAids?: boolean;
  glasses?: boolean;
  pictureBoard?: boolean;
  interpreter?: boolean;
  communicationNotes?: string;
  poaName?: string;
  poaRelationship?: string;
  poaPhone?: string;
}

export function PatientCommunicationTab({
  preferredLanguage,
  hearingImpairment,
  visionImpairment,
  mentalCapacity,
  hearingAids,
  glasses,
  pictureBoard,
  interpreter,
  communicationNotes,
  poaName,
  poaRelationship,
  poaPhone,
}: PatientCommunicationTabProps) {
  return (
    <div className="space-y-4">
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
          {hearingImpairment && hearingImpairment !== 'none' && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-cf-ink-60">Hearing</span>
              <Badge variant="pastel-warning" className="text-[10px]">
                {hearingImpairment}
              </Badge>
            </div>
          )}
          {visionImpairment && visionImpairment !== 'none' && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-cf-ink-60">Vision</span>
              <Badge variant="pastel-warning" className="text-[10px]">
                {visionImpairment}
              </Badge>
            </div>
          )}
          {(hearingAids || glasses || pictureBoard || interpreter) && (
            <div className="flex flex-wrap gap-2 pt-1">
              {hearingAids && <Badge variant="pastel-info" className="text-[10px]">Hearing Aids</Badge>}
              {glasses && <Badge variant="pastel-info" className="text-[10px]">Glasses</Badge>}
              {pictureBoard && <Badge variant="pastel-info" className="text-[10px]">Picture Board</Badge>}
              {interpreter && <Badge variant="pastel-info" className="text-[10px]">Interpreter Needed</Badge>}
            </div>
          )}
          {communicationNotes && (
            <div className="p-2 bg-cf-surface-muted rounded-lg">
              <p className="text-sm text-cf-ink-60">{communicationNotes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Brain className="h-4 w-4 text-cf-ink-60" />
            Mental Capacity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mentalCapacity && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-cf-ink-60">Capacity Status</span>
              <Badge
                variant={
                  mentalCapacity === 'full'
                    ? 'pastel-success'
                    : mentalCapacity === 'partial'
                    ? 'pastel-warning'
                    : 'pastel-danger'
                }
                className="text-[10px]"
              >
                {mentalCapacity === 'full' ? 'Full Capacity' : mentalCapacity === 'partial' ? 'Partial Capacity' : 'Lacks Capacity'}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

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