'use client';

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
import { useDischargeForm } from 'hooks';
import {
  DISCHARGE_REASONS,
  DISCHARGE_REASON_LABELS,
  type DischargePayload,
  type DischargeReason,
} from 'utils';

export type { DischargePayload, DischargeReason } from 'utils';

interface PatientDischargeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientName: string;
  gpName?: string;
  nextOfKinName?: string;
  emergencyContact?: string;
  onConfirm: (payload: DischargePayload) => Promise<void> | void;
}

export function PatientDischargeModal({
  open,
  onOpenChange,
  patientName,
  gpName,
  nextOfKinName,
  emergencyContact,
  onConfirm,
}: PatientDischargeModalProps) {
  const { form, errors, submitting, updateField, submit } = useDischargeForm({
    open,
    gpName,
    nextOfKinName,
    emergencyContact,
    onConfirm,
    onClose: () => onOpenChange(false),
  });

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
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Reason for discharge *</Label>
            <Select
              value={form.reason}
              onValueChange={(val) => updateField('reason', val as DischargeReason)}
            >
              <SelectTrigger className="border-cf-border h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DISCHARGE_REASONS.map((key) => (
                  <SelectItem key={key} value={key}>
                    {DISCHARGE_REASON_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              Notes {form.reason === 'other' && '*'}
            </Label>
            <Textarea
              placeholder="Any additional context for the record..."
              value={form.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              className="border-cf-border text-sm min-h-20"
            />
            {errors.notes && <p className="text-xs text-[var(--cf-error)]">{errors.notes}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Discharge date *</Label>
            <Input
              type="date"
              value={form.dischargeDate}
              onChange={(e) => updateField('dischargeDate', e.target.value)}
              className="border-cf-border h-9 text-sm"
            />
            {errors.dischargeDate && (
              <p className="text-xs text-[var(--cf-error)]">{errors.dischargeDate}</p>
            )}
          </div>

          <div className="space-y-2 rounded-lg border border-cf-border-light p-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="scheduleFinalVisit"
                checked={form.scheduleFinalVisit}
                onCheckedChange={(checked) => updateField('scheduleFinalVisit', checked as boolean)}
              />
              <Label htmlFor="scheduleFinalVisit" className="text-sm font-medium cursor-pointer">
                Schedule a final visit
              </Label>
            </div>
            {form.scheduleFinalVisit && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Input
                  type="date"
                  value={form.finalVisitDate}
                  onChange={(e) => updateField('finalVisitDate', e.target.value)}
                  className="border-cf-border h-8 text-sm"
                />
                <Input
                  type="time"
                  value={form.finalVisitTime}
                  onChange={(e) => updateField('finalVisitTime', e.target.value)}
                  className="border-cf-border h-8 text-sm"
                />
              </div>
            )}
            {errors.finalVisitDate && (
              <p className="text-xs text-[var(--cf-error)]">{errors.finalVisitDate}</p>
            )}
          </div>

          <div className="space-y-2 rounded-lg border border-cf-border-light p-3">
            <p className="text-xs font-medium text-cf-ink-60">Notify on discharge</p>

            <div className="flex items-center gap-2">
              <Checkbox
                id="notifyGp"
                checked={form.notifyGp}
                disabled={!gpName}
                onCheckedChange={(checked) => updateField('notifyGp', checked as boolean)}
              />
              <Label htmlFor="notifyGp" className="text-sm font-normal cursor-pointer">
                GP {gpName ? `(${gpName})` : '(no GP on file)'}
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="notifyNextOfKin"
                checked={form.notifyNextOfKin}
                disabled={!nextOfKinName}
                onCheckedChange={(checked) => updateField('notifyNextOfKin', checked as boolean)}
              />
              <Label htmlFor="notifyNextOfKin" className="text-sm font-normal cursor-pointer">
                Next of kin {nextOfKinName ? `(${nextOfKinName})` : '(none on file)'}
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="notifyEmergencyContact"
                checked={form.notifyEmergencyContact}
                disabled={!emergencyContact}
                onCheckedChange={(checked) => updateField('notifyEmergencyContact', checked as boolean)}
              />
              <Label htmlFor="notifyEmergencyContact" className="text-sm font-normal cursor-pointer">
                Emergency contact {emergencyContact ? `(${emergencyContact})` : '(none on file)'}
              </Label>
            </div>

            <div className="space-y-1 pt-1">
              <Label className="text-xs font-medium">Other professionals to notify</Label>
              <Input
                placeholder="e.g. Social worker, pharmacist..."
                value={form.otherNotifications}
                onChange={(e) => updateField('otherNotifications', e.target.value)}
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
            onClick={submit}
            disabled={submitting}
          >
            {submitting ? 'Discharging...' : 'Confirm Discharge'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}