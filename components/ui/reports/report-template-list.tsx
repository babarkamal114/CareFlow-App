"use client";

import { Button } from "@/components/ui";
import { FolderOpen, Trash2 } from "lucide-react";
import type { ReportTemplate } from "types";

interface ReportTemplateListProps { templates: ReportTemplate[]; onLoad: (t: ReportTemplate) => void; onDelete: (id: string) => void }

export function ReportTemplateList({ templates, onLoad, onDelete }: ReportTemplateListProps) {
  if (templates.length === 0) return <p className="py-4 text-center text-sm text-cf-ink-40">No saved templates yet. Build a report and save it to reuse later.</p>;
  return (
    <ul className="divide-y divide-cf-border-light rounded-lg border border-cf-border-light">
      {templates.map((t) => (
        <li key={t.id} className="flex items-center gap-3 p-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-cf-ink">{t.name}</p>
            <p className="text-xs text-cf-ink-60">{t.config.fields.length} fields · saved {t.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} by {t.createdBy}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => onLoad(t)}><FolderOpen />Load</Button>
          <Button variant="ghost" size="icon-sm" aria-label={`Delete ${t.name}`} onClick={() => onDelete(t.id)}><Trash2 /></Button>
        </li>
      ))}
    </ul>
  );
}
