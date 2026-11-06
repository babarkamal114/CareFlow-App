'use client';

import { Calendar, Clock, Edit, FileText, MapPin, User, UserPlus } from 'lucide-react';
import {
  Button,
  ConflictWarningList,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  PreferenceWarningList,
  VisitStatusBadge,
  VisitTypeBadge,
} from '@/components/ui';
import type { ScheduleVisit, VisitIssues } from 'types';
import { formatLongDate } from 'utils';

interface DetailTileProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  className?: string;
}

function DetailTile({ icon, label, children, className }: DetailTileProps) {
  return (
    <div className={`rounded-lg border border-cf-border p-3 ${className ?? ''}`}>
      <div className="flex items-center gap-2 text-sm text-cf-ink-60">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-cf-ink">{children}</div>
    </div>
  );
}

interface ScheduleEventDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visit: ScheduleVisit | null;
  issues?: VisitIssues;
  onEdit: () => void;
  onAssign: (visitId: string) => void;
}

export function ScheduleEventDetailsModal({
  open,
  onOpenChange,
  visit,
  issues,
  onEdit,
  onAssign,
}: ScheduleEventDetailsModalProps) {
  if (!visit) return null;
  const isUnassigned = visit.carerId === null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Visit Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-cf-h4 font-bold text-cf-ink">{visit.patientName}</h3>
              <p className="text-sm text-cf-ink-60">{visit.title}</p>
            </div>
            <VisitStatusBadge status={visit.status} unassigned={isUnassigned} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <DetailTile icon={<Calendar className="size-4" />} label="Date">
              {formatLongDate(visit.date)}
            </DetailTile>
            <DetailTile icon={<Clock className="size-4" />} label="Time">
              {visit.startTime} - {visit.endTime}
            </DetailTile>
            <DetailTile icon={<User className="size-4" />} label="Carer">
              <span className={isUnassigned ? 'text-error' : undefined}>
                {visit.carerName || 'Unassigned'}
              </span>
            </DetailTile>
            <DetailTile icon={<FileText className="size-4" />} label="Type">
              <VisitTypeBadge type={visit.type} />
            </DetailTile>
          </div>

          <DetailTile icon={<MapPin className="size-4" />} label="Location">
            {visit.address || 'No address recorded'}
          </DetailTile>

          {visit.notes && (
            <DetailTile icon={<FileText className="size-4" />} label="Notes">
              <span className="font-normal text-cf-ink-60">{visit.notes}</span>
            </DetailTile>
          )}

          <ConflictWarningList conflicts={issues?.conflicts ?? []} />
          <PreferenceWarningList violations={issues?.violations ?? []} />
        </div>

        <DialogFooter className="flex gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Close
          </Button>
          {isUnassigned && (
            <Button variant="brandOutline" onClick={() => onAssign(visit.id)} className="flex-1">
              <UserPlus />
              Assign carer
            </Button>
          )}
          <Button onClick={onEdit} className="flex-1">
            <Edit />
            Edit Visit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}