"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui";
import { ChevronDown, Download } from "lucide-react";

export interface ExportOption {
  id: string;
  label: string;
  description?: string;
}

/** Local-authority formats from Blueprint 3.6.2. */
export const INVOICE_EXPORT_OPTIONS: ExportOption[] = [
  { id: "csv", label: "CSV", description: "All visible invoices" },
  { id: "controcc", label: "ContrOCC", description: "Council purchasing format" },
  { id: "liquidlogic", label: "Liquidlogic", description: "Council purchasing format" },
];

export const REPORT_EXPORT_OPTIONS: ExportOption[] = [
  { id: "csv", label: "CSV", description: "Current report" },
  { id: "accountant", label: "Accountant pack", description: "Monthly P&L summary" },
];

interface ExportMenuProps {
  options: ExportOption[];
  onSelect: (id: string) => void;
  label?: string;
}

export function ExportMenu({ options, onSelect, label = "Export" }: ExportMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
        <Download />
        {label}
        <ChevronDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 border-cf-border bg-cf-surface">
        <DropdownMenuLabel>Export as</DropdownMenuLabel>
        {options.map((option) => (
          <DropdownMenuItem key={option.id} onClick={() => onSelect(option.id)} className="flex-col items-start gap-0">
            <span className="font-medium text-cf-ink">{option.label}</span>
            {option.description && <span className="text-xs text-cf-ink-60">{option.description}</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}