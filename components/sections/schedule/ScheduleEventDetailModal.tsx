'use client';

import { format } from 'date-fns';
import { Calendar, Clock, User, MapPin, FileText, Edit, X, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Card, CardContent } from '@/components/ui';

interface EventDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: any;
  onEdit: () => void;
}

const statusColorMap: Record<string, string> = {
  'scheduled': 'bg-blue-100 text-blue-700 border-blue-200',
  'in-progress': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'completed': 'bg-green-100 text-green-700 border-green-200',
  'missed': 'bg-red-100 text-red-700 border-red-200',
  'cancelled': 'bg-gray-100 text-gray-700 border-gray-200',
};

const typeColorMap: Record<string, string> = {
  'care-visit': 'bg-blue-500',
  'appointment': 'bg-purple-500',
  'medication': 'bg-green-500',
  'assessment': 'bg-orange-500',
  'meeting': 'bg-yellow-500',
  'task': 'bg-gray-500',
};

const typeLabelMap: Record<string, string> = {
  'care-visit': 'Care Visit',
  'appointment': 'Appointment',
  'medication': 'Medication',
  'assessment': 'Assessment',
  'meeting': 'Meeting',
  'task': 'Task',
};

export function EventDetailsModal({ open, onOpenChange, event, onEdit }: EventDetailsModalProps) {
  if (!event) return null;

  const visit = event.resource || event;
  const typeColor = typeColorMap[visit.type] || 'bg-gray-500';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${typeColor}`} />
            <DialogTitle className="text-xl font-semibold">Visit Details</DialogTitle>
          </div>
          
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{visit.patientName}</h2>
              <p className="text-sm text-cf-ink-60">{visit.title || typeLabelMap[visit.type]}</p>
            </div>
            <Badge variant="outline" className={statusColorMap[visit.status] || 'bg-gray-100 text-gray-700'}>
              {visit.status?.charAt(0).toUpperCase() + visit.status?.slice(1) || 'Scheduled'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Card className="border-cf-border">
              <CardContent className="pt-3">
                <div className="flex items-center gap-2 text-sm text-cf-ink-60">
                  <Calendar className="h-4 w-4" />
                  Date
                </div>
                <p className="font-medium">
                  {visit.date ? format(new Date(visit.date), 'dd MMM yyyy') : 'N/A'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-cf-border">
              <CardContent className="pt-3">
                <div className="flex items-center gap-2 text-sm text-cf-ink-60">
                  <Clock className="h-4 w-4" />
                  Time
                </div>
                <p className="font-medium">
                  {visit.startTime && visit.endTime 
                    ? `${visit.startTime} - ${visit.endTime}`
                    : visit.start && visit.end
                    ? `${format(new Date(visit.start), 'HH:mm')} - ${format(new Date(visit.end), 'HH:mm')}`
                    : 'N/A'}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Card className="border-cf-border">
              <CardContent className="pt-3">
                <div className="flex items-center gap-2 text-sm text-cf-ink-60">
                  <User className="h-4 w-4" />
                  Carer
                </div>
                <p className="font-medium">{visit.carerName || 'Unassigned'}</p>
              </CardContent>
            </Card>

            <Card className="border-cf-border">
              <CardContent className="pt-3">
                <div className="flex items-center gap-2 text-sm text-cf-ink-60">
                  <span className="text-xs font-semibold uppercase">Type</span>
                </div>
                <p className="font-medium">{typeLabelMap[visit.type] || visit.type || 'N/A'}</p>
              </CardContent>
            </Card>
          </div>

          {visit.location && (
            <Card className="border-cf-border">
              <CardContent className="pt-3">
                <div className="flex items-center gap-2 text-sm text-cf-ink-60">
                  <MapPin className="h-4 w-4" />
                  Location
                </div>
                <p className="font-medium">{visit.location}</p>
              </CardContent>
            </Card>
          )}

          {visit.notes && (
            <Card className="border-cf-border">
              <CardContent className="pt-3">
                <div className="flex items-center gap-2 text-sm text-cf-ink-60">
                  <FileText className="h-4 w-4" />
                  Notes
                </div>
                <p className="text-sm text-cf-ink-60">{visit.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 border-cf-border">
            Close
          </Button>
          <Button onClick={onEdit} className="flex-1 gap-1.5">
            <Edit className="h-4 w-4" />
            Edit Visit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}