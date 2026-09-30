"use client";

import { Button, Badge, Checkbox, Label } from "@/components/ui";
import { Pencil, AlertTriangle, CheckCircle2 } from "lucide-react";
import { SectionLabel, ReviewItem } from "./AddStaffFormPrimitives";
import {
  REVIEW_COPY,
  buildAddStaffReviewSections,
  type AddStaffFormData,
  type AddStaffReviewRow,
} from "utils";

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
            <Pencil className="mr-1 h-3 w-3" /> {REVIEW_COPY.editLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

function ReviewValue({ row }: { row: AddStaffReviewRow }) {
  if (!row.badge) return <>{row.value}</>;

  const badge = (
    <Badge variant={row.badge.variant} className={row.details ? "mb-1" : undefined}>
      {row.badge.withCheckIcon && <CheckCircle2 className="mr-1 h-3 w-3" />}
      {row.badge.text}
    </Badge>
  );

  if (!row.details) return badge;

  return (
    <div className="space-y-0.5 text-right">
      {badge}
      {row.details.map((line) => (
        <p key={line} className="text-xs text-muted-foreground">
          {line}
        </p>
      ))}
    </div>
  );
}

export function ReviewConfirmStep({ data, onEdit, onConfirmChange }: Props) {
  const sections = buildAddStaffReviewSections(data);
  const { nextSteps } = REVIEW_COPY;

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <ReviewSection
          key={section.id}
          title={section.title}
          onEdit={section.editStep ? () => onEdit(section.editStep!) : undefined}
        >
          {section.rows.map((row) => (
            <ReviewItem key={row.label} label={row.label} value={<ReviewValue row={row} />} />
          ))}
        </ReviewSection>
      ))}

      <div className="rounded-lg border border-warning/30 bg-warning-muted p-4">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">{nextSteps.title}</p>
            <p className="text-sm text-muted-foreground">
              {nextSteps.beforeStatus}
              <span className="font-semibold text-foreground">{nextSteps.status}</span>
              {nextSteps.afterStatus}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
        <Checkbox
          checked={data.confirmed}
          onCheckedChange={(checked) => onConfirmChange(!!checked)}
        />
        <Label className="cursor-pointer text-sm font-medium text-foreground">
          {REVIEW_COPY.confirmLabel}
        </Label>
      </div>
    </div>
  );
}