"use client";

import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui";
import { ChevronDown, Download } from "lucide-react";
import type { ReportExportFormat } from "types";
import { REPORT_EXPORT_FORMAT_LABEL } from "utils";

interface ReportExportMenuProps { onSelect: (format: ReportExportFormat) => void; label?: string; compact?: boolean; disabled?: boolean }

const FORMATS = Object.keys(REPORT_EXPORT_FORMAT_LABEL) as ReportExportFormat[];

export function ReportExportMenu({ onSelect, label = "Export", compact, disabled }: ReportExportMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size={compact ? "icon-sm" : "sm"} disabled={disabled} aria-label={compact ? "Export report" : undefined} />}>
        <Download />
        {!compact && <>{label}<ChevronDown /></>}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 border-cf-border bg-cf-surface">
        <DropdownMenuLabel>Export as</DropdownMenuLabel>
        {FORMATS.map((f) => <DropdownMenuItem key={f} onClick={() => onSelect(f)}>{REPORT_EXPORT_FORMAT_LABEL[f]}</DropdownMenuItem>)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
