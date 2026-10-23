"use client";

import { Button } from "@/components/ui";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import type { ReportColumn } from "types";

interface BuilderFieldPickerProps { columns: ReportColumn[]; fields: string[]; error?: string; onToggle: (key: string) => void; onMove: (key: string, dir: -1 | 1) => void }

export function BuilderFieldPicker({ columns, fields, error, onToggle, onMove }: BuilderFieldPickerProps) {
  const label = (key: string) => columns.find((c) => c.key === key)?.label ?? key;
  const available = columns.filter((c) => !fields.includes(c.key));
  return (
    <div className="space-y-1.5">
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <p className="mb-1.5 text-xs font-semibold text-cf-ink-60 uppercase">Available fields</p>
          <ul className="min-h-24 space-y-1 rounded-lg border border-cf-border-light p-2">
            {available.length === 0 && <li className="p-1 text-xs text-cf-ink-40">All fields added.</li>}
            {available.map((c) => (
              <li key={c.key}>
                <Button variant="ghost" size="sm" className="w-full justify-between" onClick={() => onToggle(c.key)}>{c.label}<Plus /></Button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-1.5 text-xs font-semibold text-cf-ink-60 uppercase">Report columns (in order)</p>
          <ul className="min-h-24 space-y-1 rounded-lg border border-cf-border-light bg-cf-surface-muted/40 p-2">
            {fields.length === 0 && <li className="p-1 text-xs text-cf-ink-40">Add at least one field.</li>}
            {fields.map((k, i) => (
              <li key={k} className="flex items-center justify-between rounded-md bg-cf-surface px-2 py-1 text-sm text-cf-ink">
                <span>{label(k)}</span>
                <span className="flex gap-0.5">
                  <Button variant="ghost" size="icon-sm" aria-label={`Move ${label(k)} up`} disabled={i === 0} onClick={() => onMove(k, -1)}><ArrowUp /></Button>
                  <Button variant="ghost" size="icon-sm" aria-label={`Move ${label(k)} down`} disabled={i === fields.length - 1} onClick={() => onMove(k, 1)}><ArrowDown /></Button>
                  <Button variant="ghost" size="icon-sm" aria-label={`Remove ${label(k)}`} onClick={() => onToggle(k)}><X /></Button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {error && <p role="alert" className="text-xs text-error">{error}</p>}
    </div>
  );
}
