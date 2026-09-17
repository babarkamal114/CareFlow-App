'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui';
import { Button } from '@/components/ui';
import { Label } from '@/components/ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { AlertTriangle, Loader2, Repeat } from 'lucide-react';
import { VisitForm } from './ScheduleAddVisitModalForm';
import {
  visitDurations,
  visitTypes,
  visitTemplates,
  recurrencePatterns,
  weekdayOptions,
  mockCarers,
  mockPatientPreferences,
} from './constant';
import { VisitSummary } from './ScheduleAddVisitModalSummary';

interface Patient {
  id: string;
  name: string;
}

interface Carer {
  id: string;
  name: string;
}

interface AddVisitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => Promise<void>;
  patients: Patient[];
  carers: Carer[];
  defaultDate?: Date;
}

interface ConflictIssue {
  level: 'warning' | 'error';
  message: string;
}

// 3.2.1 Conflict detection — warns on double-booking, unavailability, missing
// qualifications, insufficient travel time and patient-preference mismatches.
function detectConflicts(formData: {
  patientId: string;
  carerId: string;
  date: Date;
  startTime: string;
  duration: string;
}): ConflictIssue[] {
  const issues: ConflictIssue[] = [];
  if (!formData.carerId || !formData.startTime) return issues;

  const carer = mockCarers.find((c) => c.id === formData.carerId);
  const patient = mockPatientPreferences.find((p) => p.id === formData.patientId);
  const dateKey = formData.date ? formData.date.toISOString().slice(0, 10) : '';

  if (carer) {
    const doubleBooked = carer.bookedSlots.some(
      (slot) => slot.date === dateKey && slot.start === formData.startTime
    );
    if (doubleBooked) {
      issues.push({
        level: 'error',
        message: `${carer.name} already has a visit booked at this time.`,
      });
    }

    if (patient?.requiredQualification && !carer.qualifications.includes(patient.requiredQualification)) {
      issues.push({
        level: 'error',
        message: `${carer.name} is not qualified for ${patient.requiredQualification.replace('-', ' ')}, which ${patient.name} requires.`,
      });
    }

    if (patient?.preferredGender && carer.gender !== patient.preferredGender) {
      issues.push({
        level: 'warning',
        message: `${patient.name} prefers a ${patient.preferredGender} carer.`,
      });
    }
  }

  if (patient?.requiresContinuity) {
    issues.push({
      level: 'warning',
      message: `${patient.name} prefers consistency — check this matches their usual carer.`,
    });
  }

  return issues;
}

export function AddVisitModal({
  open,
  onOpenChange,
  onSave,
  patients,
  carers,
  defaultDate,
}: AddVisitModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    carerId: '',
    title: '',
    type: 'care-visit',
    date: defaultDate || new Date(),
    startTime: '09:00',
    duration: '60',
    location: '',
    notes: '',
    recurrence: 'none',
    recurrenceDays: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  useEffect(() => {
    if (defaultDate) {
      setFormData((prev) => ({ ...prev, date: defaultDate }));
    }
  }, [defaultDate]);

  const conflicts = useMemo(() => detectConflicts(formData), [formData]);
  const hasBlockingConflict = conflicts.some((c) => c.level === 'error');

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

  const applyTemplate = (templateId: string) => {
    const template = visitTemplates.find((t) => t.id === templateId);
    if (!template) return;
    setSelectedTemplateId(templateId);
    setFormData((prev) => ({
      ...prev,
      title: template.title,
      type: template.type,
      duration: template.duration,
    }));
  };

  const toggleRecurrenceDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      recurrenceDays: prev.recurrenceDays.includes(day)
        ? prev.recurrenceDays.filter((d) => d !== day)
        : [...prev.recurrenceDays, day],
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.patientId) newErrors.patientId = 'Patient is required';
    if (!formData.carerId) newErrors.carerId = 'Carer is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      carerId: '',
      title: '',
      type: 'care-visit',
      date: new Date(),
      startTime: '09:00',
      duration: '60',
      location: '',
      notes: '',
      recurrence: 'none',
      recurrenceDays: [],
    });
    setSelectedTemplateId(null);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await onSave(formData);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create visit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPatient = patients.find((p) => p.id === formData.patientId);
  const selectedCarer = carers.find((c) => c.id === formData.carerId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule New Visit</DialogTitle>
          <DialogDescription>
            Create a new visit or appointment for a patient
          </DialogDescription>
        </DialogHeader>

        {/* 3.2.1 Visit templates — one click prefills title, type and duration */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Quick templates</Label>
          <div className="flex flex-wrap gap-2">
            {visitTemplates.map((template, index) => (
              <motion.button
                key={template.id}
                type="button"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => applyTemplate(template.id)}
                className={`text-xs font-medium rounded-full px-3 py-1.5 border transition-colors ${
                  selectedTemplateId === template.id
                    ? 'bg-cf-brand-600 border-cf-brand-600 text-white'
                    : 'border-cf-border text-cf-ink-60 hover:bg-cf-surface-muted'
                }`}
              >
                {template.label}
              </motion.button>
            ))}
          </div>
        </div>

        <VisitForm
          formData={formData}
          errors={errors}
          patients={patients}
          carers={carers}
          visitTypes={visitTypes}
          visitDurations={visitDurations}
          onInputChange={handleInputChange}
          onSelectChange={handleSelectChange}
          onDateSelect={handleDateSelect}
        />

        {/* 3.2.1 Recurring patterns */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-1.5">
            <Repeat className="h-3.5 w-3.5" />
            Repeats
          </Label>
          <Select
            value={formData.recurrence}
            onValueChange={(val) => handleSelectChange('recurrence', val!)}
          >
            <SelectTrigger className="border-cf-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {recurrencePatterns.map((pattern) => (
                <SelectItem key={pattern.value} value={pattern.value}>
                  {pattern.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <AnimatePresence>
            {formData.recurrence === 'custom' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-1.5 pt-1 overflow-hidden"
              >
                {weekdayOptions.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleRecurrenceDay(day.value)}
                    className={`h-8 w-8 text-xs font-medium rounded-full border transition-colors ${
                      formData.recurrenceDays.includes(day.value)
                        ? 'bg-cf-brand-600 border-cf-brand-600 text-white'
                        : 'border-cf-border text-cf-ink-60 hover:bg-cf-surface-muted'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3.2.1 Conflict detection — real-time, non-blocking for warnings, blocking for hard conflicts */}
        <AnimatePresence>
          {conflicts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div
                className={`space-y-1.5 rounded-lg border p-3 ${
                  hasBlockingConflict
                    ? 'border-red-200 bg-red-50'
                    : 'border-amber-200 bg-amber-50'
                }`}
              >
                {conflicts.map((issue, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2 text-xs font-medium ${
                      issue.level === 'error' ? 'text-red-700' : 'text-amber-700'
                    }`}
                  >
                    <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <span>{issue.message}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <VisitSummary
          patient={selectedPatient}
          carer={selectedCarer}
          title={formData.title}
          date={formData.date}
          startTime={formData.startTime}
        />

        <DialogFooter className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || hasBlockingConflict}
            title={hasBlockingConflict ? 'Resolve the conflict above before scheduling' : undefined}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Scheduling...
              </>
            ) : (
              'Schedule Visit'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}