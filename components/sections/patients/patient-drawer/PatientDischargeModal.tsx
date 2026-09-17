'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Label,
  Textarea,
  Checkbox,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { AlertTriangle } from 'lucide-react';

export type DischargeReason =
  | 'recovered'
  | 'deceased'
  | 'moved-out-of-area'
  | 'moved-to-care-home'
  | 'hospital-admission-permanent'
  | 'self-funding-withdrawn'
  | 'family-request'
  | 'other';

export interface DischargePayload {
  reason: DischargeReason;
  notes: string;
  dischargeDate: string;
  scheduleFinalVisit: boolean;
  finalVisitDate?: string;
  finalVisitTime?: string;
  notifyGp: boolean;
  notifyNextOfKin: boolean;
  notifyEmergencyContact: boolean;
  otherNotifications: string;
}

interface PatientDischargeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientName: string;
  gpName?: string;
  nextOfKinName?: string;
  emergencyContact?: string;
  onConfirm: (payload: DischargePayload) => Promise<void> | void;
}

const REASON_LABELS: Record<DischargeReason, string> = {
  recovered: 'Recovered / no longer needs care',
  deceased: 'Deceased',
  'moved-out-of-area': 'Moved out of area',
  'moved-to-care-home': 'Moved to residential care home',
  'hospital-admission-permanent': 'Permanent hospital admission',
  'self-funding-withdrawn': 'Self-funding withdrawn',
  'family-request': 'Family request',
  other: 'Other',
};

const todayISO = () => new Date().toISOString().split('T')[0];

export function PatientDischargeModal({
  open,
  onOpenChange,
  patientName,
  gpName,
  nextOfKinName,
  emergencyContact,
  onConfirm,
}: PatientDischargeModalProps) {
  const [reason, setReason] = useState<DischargeReason>('recovered');
  const [notes, setNotes] = useState('');
  const [dischargeDate, setDischargeDate] = useState(todayISO());
  const [scheduleFinalVisit, setScheduleFinalVisit] = useState(true);
  const [finalVisitDate, setFinalVisitDate] = useState('');
  const [finalVisitTime, setFinalVisitTime] = useState('');
  const [notifyGp, setNotifyGp] = useState(!!gpName);
  const [notifyNextOfKin, setNotifyNextOfKin] = useState(!!nextOfKinName);
  const [notifyEmergencyContact, setNotifyEmergencyContact] = useState(!!emergencyContact);
  const [otherNotifications, setOtherNotifications] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setReason('recovered');
    setNotes('');
    setDischargeDate(todayISO());
    setScheduleFinalVisit(true);
    setFinalVisitDate('');
    setFinalVisitTime('');
    setNotifyGp(!!gpName);
    setNotifyNextOfKin(!!nextOfKinName);
    setNotifyEmergencyContact(!!emergencyContact);
    setOtherNotifications('');
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!dischargeDate) newErrors.dischargeDate = 'Discharge date is required';
    if (scheduleFinalVisit && !finalVisitDate) {
      newErrors.finalVisitDate = 'Pick a date for the final visit, or turn scheduling off';
    }
    if (reason === 'other' && !notes.trim()) {
      newErrors.notes = 'Add a reason since "Other" was selected';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onConfirm({
        reason,
        notes,
        dischargeDate,
        scheduleFinalVisit,
        finalVisitDate: scheduleFinalVisit ? finalVisitDate : undefined,
        finalVisitTime: scheduleFinalVisit ? finalVisitTime : undefined,
        notifyGp,
        notifyNextOfKin,
        notifyEmergencyContact,
        otherNotifications,
      });
      resetForm();
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-[var(--cf-error-muted)]">
              <AlertTriangle className="size-4 text-[var(--cf-error)]" />
            </span>
            <DialogTitle className="text-xl font-semibold text-cf-ink">
              Discharge {patientName}
            </DialogTitle>
          </div>
          <DialogDescription>
            This closes the patient's active care and stops future visit scheduling.
            Their record and history remain accessible.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Reason */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Reason for discharge *</Label>
            <Select value={reason} onValueChange={(val) => setReason(val as DischargeReason)}>
              <SelectTrigger className="border-cf-border h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(REASON_LABELS) as DischargeReason[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {REASON_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              Notes {reason === 'other' && '*'}
            </Label>
            <Textarea
              placeholder="Any additional context for the record..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-cf-border text-sm min-h-20"
            />
            {errors.notes && (
              <p className="text-xs text-[var(--cf-error)]">{errors.notes}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Discharge date *</Label>
            <Input
              type="date"
              value={dischargeDate}
              onChange={(e) => setDischargeDate(e.target.value)}
              className="border-cf-border h-9 text-sm"
            />
            {errors.dischargeDate && (
              <p className="text-xs text-[var(--cf-error)]">{errors.dischargeDate}</p>
            )}
          </div>

          {/* Final visit */}
          <div className="space-y-2 rounded-lg border border-cf-border-light p-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="scheduleFinalVisit"
                checked={scheduleFinalVisit}
                onCheckedChange={(checked) => setScheduleFinalVisit(checked as boolean)}
              />
              <Label htmlFor="scheduleFinalVisit" className="text-sm font-medium cursor-pointer">
                Schedule a final visit
              </Label>
            </div>
            {scheduleFinalVisit && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Input
                  type="date"
                  value={finalVisitDate}
                  onChange={(e) => setFinalVisitDate(e.target.value)}
                  className="border-cf-border h-8 text-sm"
                />
                <Input
                  type="time"
                  value={finalVisitTime}
                  onChange={(e) => setFinalVisitTime(e.target.value)}
                  className="border-cf-border h-8 text-sm"
                />
              </div>
            )}
            {errors.finalVisitDate && (
              <p className="text-xs text-[var(--cf-error)]">{errors.finalVisitDate}</p>
            )}
          </div>

          {/* Notifications */}
          <div className="space-y-2 rounded-lg border border-cf-border-light p-3">
            <p className="text-xs font-medium text-cf-ink-60">Notify on discharge</p>

            <div className="flex items-center gap-2">
              <Checkbox
                id="notifyGp"
                checked={notifyGp}
                disabled={!gpName}
                onCheckedChange={(checked) => setNotifyGp(checked as boolean)}
              />
              <Label htmlFor="notifyGp" className="text-sm font-normal cursor-pointer">
                GP {gpName ? `(${gpName})` : '(no GP on file)'}
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="notifyNextOfKin"
                checked={notifyNextOfKin}
                disabled={!nextOfKinName}
                onCheckedChange={(checked) => setNotifyNextOfKin(checked as boolean)}
              />
              <Label htmlFor="notifyNextOfKin" className="text-sm font-normal cursor-pointer">
                Next of kin {nextOfKinName ? `(${nextOfKinName})` : '(none on file)'}
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="notifyEmergencyContact"
                checked={notifyEmergencyContact}
                disabled={!emergencyContact}
                onCheckedChange={(checked) => setNotifyEmergencyContact(checked as boolean)}
              />
              <Label htmlFor="notifyEmergencyContact" className="text-sm font-normal cursor-pointer">
                Emergency contact {emergencyContact ? `(${emergencyContact})` : '(none on file)'}
              </Label>
            </div>

            <div className="space-y-1 pt-1">
              <Label className="text-xs font-medium">Other professionals to notify</Label>
              <Input
                placeholder="e.g. Social worker, pharmacist..."
                value={otherNotifications}
                onChange={(e) => setOtherNotifications(e.target.value)}
                className="border-cf-border h-8 text-sm"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            className="bg-[var(--cf-error)] text-white hover:bg-[var(--cf-error)]/90"
            onClick={handleConfirm}
            disabled={submitting}
          >
            {submitting ? 'Discharging...' : 'Confirm Discharge'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}