"use client";

import { Avatar, AvatarFallback, Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { ChevronRight } from "lucide-react";
import type { AuditLog } from "types";
import { AUDIT_ENTITY_BADGE, formatAuditTime, getInitials } from "utils";

interface AuditLogTableProps {
  logs: AuditLog[];
  asOf: Date;
  onSelect: (log: AuditLog) => void;
}

export function AuditLogTable({ logs, asOf, onSelect }: AuditLogTableProps) {
  if (logs.length === 0) {
    return <p className="py-6 text-center text-sm text-cf-ink-40">No entries match your search.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Action</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="w-8"><span className="sr-only">Open</span></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id} onClick={() => onSelect(log)} className="group cursor-pointer">
            <TableCell>
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0 border border-cf-border-light">
                  <AvatarFallback className="bg-cf-surface-muted text-xs font-medium text-cf-ink-60">{getInitials(log.user)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-cf-ink">{log.action}</p>
                  <p className="truncate text-sm text-cf-ink-60">{log.details}</p>
                </div>
              </div>
            </TableCell>
            <TableCell className="whitespace-nowrap text-sm text-cf-ink-60">{log.user}</TableCell>
            <TableCell className="whitespace-nowrap text-sm text-cf-ink-60">{formatAuditTime(log.timestamp, asOf)}</TableCell>
            <TableCell><Badge variant={AUDIT_ENTITY_BADGE[log.entity]} badgeSize="sm" shape="pill">{log.entity}</Badge></TableCell>
            <TableCell className="text-right"><ChevronRight className="h-5 w-5 text-cf-ink-40 transition-colors group-hover:text-cf-ink" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
