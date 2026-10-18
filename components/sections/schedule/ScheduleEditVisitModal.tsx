'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Calendar } from '@/components/ui';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { cn } from 'lib';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';

interface EditVisitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visit: any;
  onSave: (data: any) => Promise<void>;
  patients: Array<{ id: string; name: string }>;
  carers: Array<{ id: string; name: string }>;
}

const visitTypes = [
  { value: 'care-visit', label: 'Care Visit' },
  { value: 'appointment', label: 'Appointment' },
  { value: 'medication', label: 'Medication' },
  { value: 'assessment', label: 'Assessment' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'task', label: 'Task' },
];

const visitStatuses = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'missed', label: 'Missed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export function EditVisitModal({
  open,
  onOpenChange,
  visit,
  onSave,
  patients,
  carers,
}: EditVisitModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    carerId: '',
    title: '',
    type: 'care-visit',
    status: 'scheduled',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (visit && open) {
      const visitData = visit.resource || visit;
      const patient = patients.find(p => p.name === visitData.patientName);
      const carer = carers.find(c => c.name === visitData.carerName);

      setFormData({
        patientId: patient?.id || visitData.patientId || '',
        carerId: carer?.id || visitData.carerId || '',
        title: visitData.title || '',
        type: visitData.type || 'care-visit',
        status: visitData.status || 'scheduled',
        date: visitData.date ? new Date(visitData.date) : new Date(),
        startTime: visitData.startTime || '09:00',
        endTime: visitData.endTime || '10:00',
        location: visitData.location || '',
        notes: visitData.notes || '',
      });
    }
  }, [visit, open, patients, carers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, date }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.patientId) newErrors.patientId = 'Patient is required';
    if (!formData.carerId) newErrors.carerId = 'Carer is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      const patient = patients.find(p => p.id === formData.patientId);
      const carer = carers.find(c => c.id === formData.carerId);

      await onSave({
        ...formData,
        patientName: patient?.name || '',
        carerName: carer?.name || '',
        date: formData.date.toISOString().split('T')[0],
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update visit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!visit) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Visit</DialogTitle>
          <DialogDescription>
            Update visit details for {visit.resource?.patientName || visit.patientName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientId" className="text-sm font-medium">
                Patient *
              </Label>
              <Select
                value={formData.patientId}
                onValueChange={(val) => handleSelectChange('patientId', val!)}
              >
                <SelectTrigger
                  className={`border-cf-border ${errors.patientId ? 'border-red-500' : ''}`}
                >
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.patientId && (
                <p className="text-xs text-red-500">{errors.patientId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="carerId" className="text-sm font-medium">
                Assigned Carer *
              </Label>
              <Select
                value={formData.carerId}
                onValueChange={(val) => handleSelectChange('carerId', val!)}
              >
                <SelectTrigger
                  className={`border-cf-border ${errors.carerId ? 'border-red-500' : ''}`}
                >
                  <SelectValue placeholder="Select carer" />
                </SelectTrigger>
                <SelectContent>
                  {carers.map((carer) => (
                    <SelectItem key={carer.id} value={carer.id}>
                      {carer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.carerId && (
                <p className="text-xs text-red-500">{errors.carerId}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title *
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Morning Care Visit"
              value={formData.title}
              onChange={handleInputChange}
              className={`border-cf-border ${errors.title ? 'border-red-500' : ''}`}
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Visit Type</Label>
              <Select
                value={formData.type}
                onValueChange={(val) => handleSelectChange('type', val!)}
              >
                <SelectTrigger className="border-cf-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {visitTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val) => handleSelectChange('status', val!)}
              >
                <SelectTrigger className="border-cf-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {visitStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Date *</Label>
              <Popover>
                <PopoverTrigger >
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal border-cf-border',
                      !formData.date && 'text-muted-foreground',
                      errors.date && 'border-red-500'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, 'dd MMM yyyy') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Start Time *</Label>
              <Input
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleInputChange}
                className={`border-cf-border ${errors.startTime ? 'border-red-500' : ''}`}
              />
              {errors.startTime && <p className="text-xs text-red-500">{errors.startTime}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">End Time *</Label>
            <Input
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={handleInputChange}
              className={`border-cf-border ${errors.endTime ? 'border-red-500' : ''}`}
            />
            {errors.endTime && <p className="text-xs text-red-500">{errors.endTime}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">
              Location
            </Label>
            <Input
              id="location"
              name="location"
              placeholder="e.g., 123 Oak Street, Manchester"
              value={formData.location}
              onChange={handleInputChange}
              className="border-cf-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes
            </Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Special instructions or notes about this visit..."
              value={formData.notes}
              onChange={handleInputChange}
              className="border-cf-border min-h-[80px]"
            />
          </div>

          <div className="p-3 bg-cf-surface-muted rounded-lg space-y-1">
            <p className="text-xs font-medium text-cf-ink-60">Summary</p>
            <p className="text-sm text-cf-ink">
              Patient: <span className="font-medium">
                {patients.find(p => p.id === formData.patientId)?.name || 'Not selected'}
              </span>
            </p>
            <p className="text-sm text-cf-ink">
              Carer: <span className="font-medium">
                {carers.find(c => c.id === formData.carerId)?.name || 'Not selected'}
              </span>
            </p>
            {formData.date && formData.startTime && formData.endTime && (
              <p className="text-sm text-cf-ink">
                Time:{' '}
                <span className="font-medium">
                  {format(formData.date, 'dd MMM yyyy')} at {formData.startTime} - {formData.endTime}
                </span>
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 border-cf-border hover:bg-cf-surface-muted"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 bg-cf-primary hover:bg-cf-primary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}