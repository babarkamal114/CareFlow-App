'use client';

import { Card, Badge, BadgeProps, ScrollArea } from '@/components/ui';
import {
  User,
  Calendar,
  MapPin,
  Users,
  Tag,
  AlertCircle,
  UserRound,
} from 'lucide-react';
import { Incident, IncidentSeverity } from '@/types';

interface IncidentInfoTabProps {
  incident: Incident;
}

const getSeverityColor = (severity: IncidentSeverity): BadgeProps['variant'] => {
  switch (severity) {
    case 'critical':
      return 'pastel-danger';
    case 'high':
      return 'pastel-orange';
    case 'medium':
      return 'pastel-warning';
    case 'low':
      return 'pastel-info';
    default:
      return 'pastel-neutral';
  }
};

export function IncidentInfoTab({ incident }: IncidentInfoTabProps) {
  return (
    <ScrollArea className="h-[calc(100vh-280px)] pr-4">
      <div className="space-y-4 pb-4">
        <Card className="border-cf-border p-4">
          <p className="text-sm font-semibold text-cf-ink mb-2">Description</p>
          <p className="text-sm text-cf-ink whitespace-pre-wrap">
            {incident.description}
          </p>
        </Card>

        <Card className="border-cf-border p-4">
          <p className="text-sm font-semibold text-cf-ink mb-4">Incident Details</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-cf-ink-60 mb-1">Patient</p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-cf-ink-40" />
                <p className="font-medium text-cf-ink">{incident.patientName}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-cf-ink-60 mb-1">Type</p>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-cf-ink-40" />
                <p className="font-medium text-cf-ink capitalize">{incident.type}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-cf-ink-60 mb-1">Date & Time</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-cf-ink-40" />
                <p className="font-medium text-cf-ink">
                  {incident.dateTime.toLocaleDateString()} at{' '}
                  {incident.dateTime.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-cf-ink-60 mb-1">Reported By</p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-cf-ink-40" />
                <p className="font-medium text-cf-ink">{incident.reportedBy}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-cf-ink-60 mb-1">Assigned To</p>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-cf-ink-40" />
                <p className="font-medium text-cf-ink">{incident.assignedTo}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-cf-ink-60 mb-1">Severity</p>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-cf-ink-40" />
                <Badge variant={getSeverityColor(incident.severity)} badgeSize={'md'} shape={'pill'}>
                  {incident.severity.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {incident.location && (
          <Card className="border-cf-border p-4">
            <p className="text-sm font-semibold text-cf-ink mb-2">Location</p>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-cf-ink-40" />
              <p className="text-sm text-cf-ink">{incident.location}</p>
            </div>
          </Card>
        )}

        <Card className="border-cf-border p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-cf-ink">Witnesses</p>
            <Badge variant="pastel-neutral" badgeSize={'sm'} shape={'pill'}>
              {incident.witnesses?.length || 0}
            </Badge>
          </div>
          {incident.witnesses && incident.witnesses.length > 0 ? (
            <div className="space-y-2">
              {incident.witnesses.map((witness, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-cf-surface-muted rounded-lg">
                  <UserRound className="h-3.5 w-3.5 text-cf-ink-40" />
                  <span className="text-sm text-cf-ink">{witness}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-cf-ink-60">No witnesses recorded</p>
          )}
        </Card>

        <Card className="border-cf-border p-4">
          <p className="text-sm font-semibold text-cf-ink mb-4">Status History</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full animate-pulse bg-green-500 mt-1.5" />
              <div>
                <p className="text-sm text-cf-ink">Reported</p>
                <p className="text-xs text-cf-ink-60">
                  {incident.dateTime.toLocaleDateString()} at{' '}
                  {incident.dateTime.toLocaleTimeString()}
                </p>
              </div>
            </div>
            {incident.status !== 'reported' && (
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full animate-pulse bg-yellow-500 mt-1.5" />
                <div>
                  <p className="text-sm text-cf-ink">Investigating</p>
                  <p className="text-xs text-cf-ink-60">
                    Investigation in progress
                  </p>
                </div>
              </div>
            )}
            {(incident.status === 'resolved' || incident.status === 'closed') && (
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
                <div>
                  <p className="text-sm text-cf-ink">Resolved</p>
                  <p className="text-xs text-cf-ink-60">
                    Incident resolved
                  </p>
                </div>
              </div>
            )}
            {incident.status === 'closed' && (
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-gray-500 mt-1.5" />
                <div>
                  <p className="text-sm text-cf-ink">Closed</p>
                  <p className="text-xs text-cf-ink-60">
                    Case closed
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </ScrollArea>
  );
}