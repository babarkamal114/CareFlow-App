"use client";

import {
  Badge, Button, Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui";
import { AlertTriangle, ArrowUpRight, CheckCircle2, FileText, Users, XCircle } from "lucide-react";
import type { Regulation } from "types";
import { CATEGORY_STYLE, getEvidenceCount, REG_STATUS_CONFIG, TONE_TEXT } from "utils";
import { StatusProgressBar } from "./status-progress-bar";

interface RegulationDrawerProps {
  reg: Regulation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: () => void;
  onExport: (reg: Regulation) => void;
  onCompleteAction: (regId: number, actionId: string) => void;
  onOpenLinked: (href: string) => void;
}

export function RegulationDrawer({ reg, open, onOpenChange, onAssign, onExport, onCompleteAction, onOpenLinked }: RegulationDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 p-0 sm:max-w-lg">
        {reg && <DrawerBody reg={reg} onAssign={onAssign} onExport={onExport} onCompleteAction={onCompleteAction} onOpenLinked={onOpenLinked} />}
      </SheetContent>
    </Sheet>
  );
}

function DrawerBody({ reg, onAssign, onExport, onCompleteAction, onOpenLinked }: Omit<RegulationDrawerProps, "open" | "onOpenChange" | "reg"> & { reg: Regulation }) {
  const cfg = REG_STATUS_CONFIG[reg.status];
  const { done, total } = getEvidenceCount(reg);

  return (
    <>
      <SheetHeader className="border-b border-cf-border-light px-6 py-5">
        <div className="flex flex-wrap items-center gap-2 pr-8">
          <span className="text-xs font-bold text-cf-ink-40">{reg.reg}</span>
          <SheetTitle className="text-base font-bold text-cf-ink">{reg.title}</SheetTitle>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={cfg.badge} shape="pill" badgeSize="sm">{reg.status}</Badge>
          <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${CATEGORY_STYLE[reg.category]}`}>{reg.category}</span>
        </div>
        <p className="text-sm text-cf-ink-60">{reg.description}</p>
        <div className="mt-2">
          <div className="mb-1.5 flex justify-between">
            <span className="text-xs text-cf-ink-60">Compliance score</span>
            <span className={`text-sm font-bold ${TONE_TEXT[cfg.tone]}`}>{reg.progress}%</span>
          </div>
          <StatusProgressBar value={reg.progress} tone={cfg.tone} className="h-2" />
          <p className="mt-1.5 text-xs text-cf-ink-40">Last inspected: {reg.lastInspected}</p>
        </div>
      </SheetHeader>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
        <section>
          <div className="mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-cf-ink-60" />
            <h3 className="text-sm font-bold text-cf-ink">Evidence checklist</h3>
            <span className="ml-auto text-xs text-cf-ink-40">{done}/{total} complete</span>
          </div>
          <div className="space-y-2">
            {reg.evidenceItems.map((item) => (
              <div key={item.label} className={`flex items-center gap-3 rounded-lg border p-3 ${item.done ? "border-success/20 bg-success-muted" : "border-error/20 bg-error-muted"}`}>
                {item.done ? <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-success" /> : <XCircle className="h-4 w-4 flex-shrink-0 text-error" />}
                <span className={`text-sm ${item.done ? "text-cf-ink" : "font-medium text-error"}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {reg.actions.length > 0 && (
          <section>
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <h3 className="text-sm font-bold text-cf-ink">Actions required</h3>
            </div>
            <div className="space-y-2">
              {reg.actions.map((a) => (
                <div key={a.id} className="flex items-start justify-between gap-3 rounded-lg border border-warning/20 bg-warning-muted p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-cf-ink">{a.label}</p>
                    <p className="mt-0.5 text-xs text-cf-ink-60">{a.owner} · <span className="font-medium text-warning">{a.due}</span></p>
                  </div>
                  <Button variant="outline" size="xs" onClick={() => onCompleteAction(reg.id, a.id)}>Done</Button>
                </div>
              ))}
            </div>
          </section>
        )}

        {reg.linkedItems.length > 0 && (
          <section>
            <div className="mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-cf-ink-60" />
              <h3 className="text-sm font-bold text-cf-ink">Linked items</h3>
            </div>
            <div className="space-y-2">
              {reg.linkedItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => onOpenLinked(item.href)}
                  className="flex w-full items-center justify-between rounded-lg border border-cf-border bg-cf-surface p-3 text-left transition-colors hover:bg-cf-surface-muted"
                >
                  <span className="flex items-center gap-2">
                    <span className="rounded-md bg-cf-surface-muted px-2 py-0.5 text-xs font-medium text-cf-ink-60">{item.type}</span>
                    <span className="text-sm text-cf-ink">{item.label}</span>
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-cf-ink-40" />
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="flex gap-2 border-t border-cf-border-light p-4">
        <Button variant="outline" className="flex-1" onClick={onAssign}><Users />Assign action</Button>
        <Button className="flex-1" onClick={() => onExport(reg)}><FileText />Export evidence</Button>
      </div>
    </>
  );
}
