"use client";

import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { FileText, Trash2 } from "lucide-react";
import { STAFF_DOCUMENT_TYPE_LABELS } from "types";
import type {
  StaffDocument,
  StaffDocumentType,
} from "types";
import { formatDate } from "utils";

export function StaffDocumentRow({
  document,
  onTypeChange,
  onRemove,
}: {
  document: StaffDocument;
  onTypeChange: (type: StaffDocumentType) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-cf-border bg-cf-surface-inset/40 p-4 sm:flex-row sm:items-end">
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 shrink-0 text-cf-ink-40" />
          <span className="truncate text-sm font-medium text-cf-ink">
            {document.fileName || "Uploaded document"}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Uploaded {formatDate(document.uploadedAt)}
        </p>
      </div>

      <div className="sm:w-52">
        <Select
          value={document.type}
          onValueChange={(next) =>
            onTypeChange((next ?? "other") as StaffDocumentType)
          }
        >
          <SelectTrigger
            aria-label="Document type"
            className="w-full border-cf-border bg-cf-surface text-cf-ink"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-cf-border bg-cf-surface">
            {(Object.entries(STAFF_DOCUMENT_TYPE_LABELS) as [
              StaffDocumentType,
              string,
            ][]).map(([option, label]) => (
              <SelectItem key={option} value={option}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-8 text-xs text-destructive"
      >
        <Trash2 className="mr-1 h-3.5 w-3.5" />
        Remove
      </Button>
    </div>
  );
}
