'use client';

import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { Languages, Brain, Users, type LucideIcon } from 'lucide-react';
import {
  getCapacityBadge,
  getCommunicationAids,
  getCommunicationDetailRows,
  getPoaDetailRows,
  hasCommunicationCardInfo,
  hasCommunicationInfo,
  hasPoaInfo,
  type PatientCommunicationInfo,
  type PatientDetailRow,
} from 'utils';

function CommunicationRow({ row }: { row: PatientDetailRow }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-cf-ink-60">{row.label}</span>
      {row.badgeVariant ? (
        <Badge variant={row.badgeVariant} className="text-[10px]">{row.value}</Badge>
      ) : (
        <span className="text-cf-ink font-medium">{row.value}</span>
      )}
    </div>
  );
}

function CommunicationCard({
  Icon,
  title,
  contentClassName = '',
  children,
}: {
  Icon: LucideIcon;
  title: string;
  contentClassName?: string;
  children: ReactNode;
}) {
  return (
    <Card className="border-cf-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Icon className="h-4 w-4 text-cf-ink-60" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}

export function PatientCommunicationTab(props: PatientCommunicationInfo) {
  const { mentalCapacity, communicationNotes } = props;

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

  const capacity = mentalCapacity ? getCapacityBadge(mentalCapacity) : null;

  return (
    <div className="space-y-4">
      {hasCommunicationCardInfo(props) && (
        <CommunicationCard Icon={Languages} title="Communication" contentClassName="space-y-3">
          {getCommunicationDetailRows(props).map((row) => (
            <CommunicationRow key={row.label} row={row} />
          ))}
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
        </CommunicationCard>
      )}

      {capacity && (
        <CommunicationCard Icon={Brain} title="Mental Capacity">
          <CommunicationRow
            row={{ label: 'Capacity Status', value: capacity.label, badgeVariant: capacity.variant }}
          />
        </CommunicationCard>
      )}

      {hasPoaInfo(props) && (
        <CommunicationCard Icon={Users} title="Power of Attorney" contentClassName="space-y-3">
          {getPoaDetailRows(props).map((row) => (
            <CommunicationRow key={row.label} row={row} />
          ))}
        </CommunicationCard>
      )}
    </div>
  );
}