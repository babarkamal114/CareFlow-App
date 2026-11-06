"use client";

import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui";
import { Download, FileText } from "lucide-react";
import type { PackRecord, PackSection } from "types";
import { formatLongDate } from "utils";

interface PackPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: PackRecord;
  sections: PackSection[];
  onDownload: () => void;
}

/** What the last generated pack contains. */
export function PackPreviewDialog({ open, onOpenChange, record, sections, onDownload }: PackPreviewDialogProps) {
  const included = sections.filter((s) => record.sections.includes(s.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg text-cf-ink">Inspection pack preview</DialogTitle>
          <DialogDescription>Generated {formatLongDate(record.generatedAt)} · {record.pageCount} pages</DialogDescription>
        </DialogHeader>
        <ol className="divide-y divide-cf-border-light rounded-lg border border-cf-border-light">
          {included.map((s, i) => (
            <li key={s.id} className="flex items-center gap-3 px-3 py-2.5">
              <FileText className="size-4 flex-shrink-0 text-cf-ink-40" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-cf-ink">{i + 1}. {s.label}</p>
                <p className="truncate text-xs text-cf-ink-60">{s.description}</p>
              </div>
              <span className="text-xs tabular-nums text-cf-ink-60">{s.pages} pp</span>
            </li>
          ))}
        </ol>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={onDownload}><Download />Download summary</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
