"use client";

import { Avatar, AvatarFallback, Badge, Button, Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui";
import { Clock, Download, FileText, Monitor, Tag, User } from "lucide-react";
import type { ElementType } from "react";
import type { AuditLog } from "types";
import { AUDIT_ENTITY_BADGE, formatStamp, getInitials } from "utils";

interface AuditLogDrawerProps {
  log: AuditLog | null;
  asOf: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewRecord: (log: AuditLog) => void;
  onDownload: (log: AuditLog) => void;
}

function DetailRow({ icon: Icon, label, value }: { icon: ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 border-b border-cf-border-light py-3 last:border-0">
      <div className="mt-0.5 flex-shrink-0 rounded-md bg-cf-surface-muted p-1.5"><Icon className="h-3.5 w-3.5 text-cf-ink-60" /></div>
      <div>
        <p className="mb-0.5 text-xs font-medium tracking-wide text-cf-ink-40 uppercase">{label}</p>
        <p className="text-sm font-medium text-cf-ink">{value}</p>
      </div>
    </div>
  );
}

export function AuditLogDrawer({ log, asOf, open, onOpenChange, onViewRecord, onDownload }: AuditLogDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 p-0 sm:max-w-md">
        {log && (
          <>
            <SheetHeader className="border-b border-cf-border-light px-6 py-5">
              <div className="flex items-start gap-3 pr-8">
                <Avatar className="h-11 w-11 flex-shrink-0 border border-cf-border-light">
                  <AvatarFallback className="bg-cf-surface-muted text-sm font-bold text-cf-ink-60">{getInitials(log.user)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <SheetTitle className="text-base leading-tight font-bold text-cf-ink">{log.action}</SheetTitle>
                    <Badge variant={AUDIT_ENTITY_BADGE[log.entity]} badgeSize="sm" shape="pill">{log.entity}</Badge>
                  </div>
                  <p className="mt-0.5 text-sm text-cf-ink-60">{log.user} · {formatStamp(log.timestamp, asOf)}</p>
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="mb-2 rounded-xl border border-cf-border bg-cf-surface-muted p-4">
                <p className="mb-1 text-[10px] font-bold tracking-widest text-cf-ink-40 uppercase">Details</p>
                <p className="text-sm leading-relaxed text-cf-ink">{log.details}</p>
              </div>
              <DetailRow icon={User} label="Performed by" value={log.user} />
              <DetailRow icon={Clock} label="Timestamp" value={formatStamp(log.timestamp, asOf)} />
              {log.patient && <DetailRow icon={FileText} label="Patient" value={log.patient} />}
              {log.location && <DetailRow icon={Tag} label="Location" value={log.location} />}
              {log.device && <DetailRow icon={Monitor} label="Device" value={log.device} />}
              {log.ipAddress && <DetailRow icon={Monitor} label="IP address" value={log.ipAddress} />}
              {log.notes && (
                <div className="pt-3">
                  <p className="mb-2 text-[10px] font-bold tracking-widest text-cf-ink-40 uppercase">Notes</p>
                  <p className="rounded-xl border border-cf-border bg-cf-surface-muted p-4 text-sm leading-relaxed text-cf-ink-60">{log.notes}</p>
                </div>
              )}
              <p className="mt-4 text-xs text-cf-ink-40">Audit records are immutable. Changes appear as versioned updates.</p>
            </div>

            <div className="flex gap-2 border-t border-cf-border-light px-6 py-4">
              <Button variant="outline" className="flex-1" onClick={() => onViewRecord(log)}>View full record</Button>
              <Button className="flex-1" onClick={() => onDownload(log)}><Download />Download</Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
