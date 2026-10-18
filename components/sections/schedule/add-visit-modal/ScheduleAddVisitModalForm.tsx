// components/sections/schedule/AddVisitModal/VisitForm.tsx
'use client';

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
import { Button } from '@/components/ui';
import { cn } from 'lib';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

interface VisitFormProps {
  formData: any;
  errors: Record<string, string>;
  patients: Array<{ id: string; name: string }>;
  carers: Array<{ id: string; name: string }>;
  visitTypes: Array<{ value: string; label: string }>;
  visitDurations: Array<{ value: string; label: string }>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onDateSelect: (date: Date | undefined) => void;
}

export function VisitForm({
  formData,
  errors,
  patients,
  carers,
  visitTypes,
  visitDurations,
  onInputChange,
  onSelectChange,
  onDateSelect,
}: VisitFormProps) {
  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="patientId" className="text-sm font-medium">
            Patient *
          </Label>
          <Select
            value={formData.patientId}
            onValueChange={(val) => onSelectChange('patientId', val!)}
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
            onValueChange={(val) => onSelectChange('carerId', val!)}
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
          onChange={onInputChange}
          className={`border-cf-border ${errors.title ? 'border-red-500' : ''}`}
        />
        {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Visit Type</Label>
          <Select
            value={formData.type}
            onValueChange={(val) => onSelectChange('type', val!)}
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
          <Label className="text-sm font-medium">Duration</Label>
          <Select
            value={formData.duration}
            onValueChange={(val) => onSelectChange('duration', val!)}
          >
            <SelectTrigger className="border-cf-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {visitDurations.map((duration) => (
                <SelectItem key={duration.value} value={duration.value}>
                  {duration.label}
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
                onSelect={onDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="startTime" className="text-sm font-medium">
            Start Time *
          </Label>
          <Input
            id="startTime"
            name="startTime"
            type="time"
            value={formData.startTime}
            onChange={onInputChange}
            className={`border-cf-border ${errors.startTime ? 'border-red-500' : ''}`}
          />
          {errors.startTime && (
            <p className="text-xs text-red-500">{errors.startTime}</p>
          )}
        </div>
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
          onChange={onInputChange}
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
          onChange={onInputChange}
          className="border-cf-border min-h-[80px]"
        />
      </div>
    </div>
  );
}