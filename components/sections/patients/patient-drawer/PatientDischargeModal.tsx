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
import { AlertTriangle } from "lucide-react";
import { useDischargeForm } from "hooks";
import {
  DISCHARGE_FINAL_VISIT_FIELDS,
  DISCHARGE_NOTIFY_OPTIONS,
  DISCHARGE_REASON_VALUES,
  DISCHARGE_REASON_LABELS,
  getDischargeNotifyLabel,
  type DischargeReason,
} from "utils";
import type { DischargeContacts, DischargePayload } from "types";

interface PatientDischargeModalProps extends DischargeContacts {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientName: string;
  onConfirm: (payload: DischargePayload) => Promise<void> | void;
}

function DischargeFieldError({ message }: { message?: string | undefined }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-xs text-destructive">
      {message}
    </p>
  );
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
  const { form, errors, submitError, submitting, updateField, submit } = useDischargeForm({
    open,
    gpName,
    nextOfKinName,
    emergencyContact,
    onConfirm,
    onClose: () => onOpenChange(false),
  });

  const contacts: DischargeContacts = { gpName, nextOfKinName, emergencyContact };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-cf-red-50">
              <AlertTriangle className="size-4 text-destructive" />
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

        <div className="space-y-1.5">
            <Label htmlFor="dischargeReason" className="text-xs font-medium">
              Reason for discharge *
            </Label>
            <Select
              value={form.reason}
              items={DISCHARGE_REASON_LABELS}
              onValueChange={(val) => {
                if (val) updateField("reason", val as DischargeReason);
              }}
            >
              <SelectTrigger
                id="dischargeReason"
                aria-invalid={!!errors.reason}
                className="border-cf-border h-9 w-full text-sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                alignItemWithTrigger={false}
                sideOffset={4}
                className="min-w-[var(--anchor-width)] w-auto max-h-72"
              >
                {DISCHARGE_REASON_VALUES.map((key) => (
                  <SelectItem key={key} value={key} className="py-2 text-sm">
                    {DISCHARGE_REASON_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DischargeFieldError message={errors.reason} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dischargeNotes" className="text-xs font-medium">
              Notes {form.reason === "other" && "*"}
            </Label>
            <Textarea
              id="dischargeNotes"
              aria-invalid={!!errors.notes}
              placeholder="Any additional context for the record..."
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              className="border-cf-border text-sm min-h-20"
            />
            <DischargeFieldError message={errors.notes} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dischargeDate" className="text-xs font-medium">
              Discharge date *
            </Label>
            <Input
              id="dischargeDate"
              type="date"
              aria-invalid={!!errors.dischargeDate}
              value={form.dischargeDate}
              onChange={(e) => updateField("dischargeDate", e.target.value)}
              className="border-cf-border h-9 text-sm"
            />
            <DischargeFieldError message={errors.dischargeDate} />
          </div>

          <div className="space-y-2 rounded-lg border border-cf-border-light p-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="scheduleFinalVisit"
                checked={form.scheduleFinalVisit}
                onCheckedChange={(checked) => updateField("scheduleFinalVisit", checked === true)}
              />
              <Label htmlFor="scheduleFinalVisit" className="text-sm font-medium cursor-pointer">
                Schedule a final visit
              </Label>
            </div>
            {form.scheduleFinalVisit && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {DISCHARGE_FINAL_VISIT_FIELDS.map(({ field, type, label }) => (
                  <div key={field} className="space-y-1">
                    <Label htmlFor={field} className="text-xs font-medium text-cf-ink-60">
                      {label}
                    </Label>
                    <Input
                      id={field}
                      type={type}
                      aria-invalid={!!errors[field]}
                      value={form[field]}
                      onChange={(e) => updateField(field, e.target.value)}
                      className="border-cf-border h-8 text-sm"
                    />
                  </div>
                ))}
              </div>
            )}
            <DischargeFieldError message={errors.finalVisitDate} />
            <DischargeFieldError message={errors.finalVisitTime} />
          </div>

          <div className="space-y-2 rounded-lg border border-cf-border-light p-3">
            <p className="text-xs font-medium text-cf-ink-60">Notify on discharge</p>

          {DISCHARGE_NOTIFY_OPTIONS.map((option) => (
            <div key={option.field} className="space-y-1">
              <div className="flex items-center gap-2">
                <Checkbox
                  id={option.field}
                  checked={form[option.field]}
                  disabled={!contacts[option.contact]}
                  aria-invalid={!!errors[option.field]}
                  onCheckedChange={(checked) => updateField(option.field, checked === true)}
                />
                <Label htmlFor={option.field} className="text-sm font-normal cursor-pointer">
                  {getDischargeNotifyLabel(option, contacts)}
                </Label>
              </div>
              <DischargeFieldError message={errors[option.field]} />
            </div>
          ))}

            <div className="space-y-1 pt-1">
              <Label htmlFor="otherNotifications" className="text-xs font-medium">
                Other professionals to notify
              </Label>
              <Input
                id="otherNotifications"
                placeholder="e.g. Social worker, pharmacist..."
                value={form.otherNotifications}
                onChange={(e) => updateField("otherNotifications", e.target.value)}
                className="border-cf-border h-8 text-sm"
              />
            </div>
          </div>

        {submitError && (
          <p role="alert" className="rounded-md bg-cf-red-50 p-2 text-xs text-destructive">
            {submitError}
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            className="bg-[var(--cf-error)] text-white hover:bg-[var(--cf-error)]/90"
            onClick={submit}
            disabled={submitting}
          >
            {submitting ? "Discharging..." : "Confirm Discharge"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}