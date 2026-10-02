"use client";

import { Button, Badge, Checkbox, Label } from "ui-components";
import { Pencil, AlertTriangle, CheckCircle2 } from "lucide-react";
import { SectionLabel, ReviewItem } from "./AddStaffFormPrimitives";
import { ROLE_LABELS, EMPLOYMENT_LABELS, REF_LABELS } from "./types";
import type { AddStaffFormData, RefRelationship } from "./types";

interface Props {
  data: AddStaffFormData;
  onEdit: (step: number) => void;
  onConfirmChange: (v: boolean) => void;
}

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <SectionLabel>{title}</SectionLabel>
      <div className="divide-y divide-border rounded-lg border border-border px-4">
        {children}
      </div>
      {onEdit && (
        <div className="flex justify-end pt-1">
          <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={onEdit}>
            <Pencil className="mr-1 h-3 w-3" /> Edit
          </Button>
        </div>
      )}
    </div>
  );
}

export function ReviewConfirmStep({ data, onEdit, onConfirmChange }: Props) {
  const { personal: p, employment: e } = data;

  const refsObtained =
    e.ref1Name && e.ref1Contact && e.ref1Relationship &&
    e.ref2Name && e.ref2Contact && e.ref2Relationship;

  const formatDate = (iso: string) =>
    iso
      ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
      : "—";

  return (
    <div className="space-y-6">
      <ReviewSection title="Personal Information" onEdit={() => onEdit(1)}>
        <ReviewItem label="Name" value={p.fullName} />
        <ReviewItem label="Email" value={p.email} />
        <ReviewItem label="Phone" value={p.phone} />
        <ReviewItem label="Date of Birth" value={formatDate(p.dateOfBirth)} />
        <ReviewItem label="Address" value={p.address} />
        <ReviewItem label="NI Number" value={p.niNumber || "—"} />
        <ReviewItem
          label="Emergency Contact"
          value={p.emergencyContactName ? `${p.emergencyContactName} (${p.emergencyContactPhone})` : "—"}
        />
      </ReviewSection>

      <ReviewSection title="Employment Details" onEdit={() => onEdit(2)}>
        <ReviewItem label="Role" value={e.role ? ROLE_LABELS[e.role] : "—"} />
        <ReviewItem label="Start Date" value={formatDate(e.startDate)} />
        <ReviewItem label="Employment Type" value={e.employmentType ? EMPLOYMENT_LABELS[e.employmentType] : "—"} />
        <ReviewItem label="Hours / Week" value={e.hoursPerWeek || "—"} />
      </ReviewSection>

      <ReviewSection title="Pre-Employment Checks">
        <ReviewItem
          label="Right to Work"
          value={
            e.rightToWorkVerified ? (
              <Badge variant="softSuccess">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Verified{e.rightToWorkFileName ? ` · ${e.rightToWorkFileName}` : ""}
              </Badge>
            ) : (
              <Badge variant="softWarning">Pending verification</Badge>
            )
          }
        />
        <ReviewItem
          label="Overseas Worker"
          value={
            e.isOverseasWorker === true ? (
              <Badge variant="softInfo">Yes{e.goodConductFileName ? ` · ${e.goodConductFileName}` : ""}</Badge>
            ) : e.isOverseasWorker === false ? (
              <Badge variant="softMuted">No</Badge>
            ) : "—"
          }
        />
        <ReviewItem
          label="References"
          value={
            refsObtained ? (
              <div className="space-y-0.5 text-right">
                <Badge variant="softSuccess" className="mb-1">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> 2 obtained
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {e.ref1Name} ({e.ref1Relationship ? REF_LABELS[e.ref1Relationship as RefRelationship] : ""})
                </p>
                <p className="text-xs text-muted-foreground">
                  {e.ref2Name} ({e.ref2Relationship ? REF_LABELS[e.ref2Relationship as RefRelationship] : ""})
                </p>
              </div>
            ) : (
              <Badge variant="softWarning">Incomplete</Badge>
            )
          }
        />
      </ReviewSection>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">Next Steps</p>
            <p className="text-sm text-amber-700 dark:text-amber-500">
              After confirming, this staff member will be created with status{" "}
              <span className="font-semibold">Onboarding Required</span>. The manager must
              complete the onboarding checklist within 5 days before staff can be scheduled.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
        <Checkbox
          checked={data.confirmed}
          onCheckedChange={(checked) => onConfirmChange(!!checked)}
        />
        <Label className="cursor-pointer text-sm font-medium text-cf-ink">
          I confirm all information is correct
        </Label>
      </div>
    </div>
  );
}
