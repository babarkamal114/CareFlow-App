'use client';

import React from "react";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { AlertCircle } from "lucide-react";

import {
  countHighPriority,
  getAttentionBadgeLabel,
  getAttentionRows,
} from "utils";

interface DashboardAttentionBoardProps {
  role: string;
}

function DashboardAttentionBoard({ role }: DashboardAttentionBoardProps) {
  const rows = getAttentionRows(role);
  const highCount = countHighPriority(rows);

  return (
    <Card className="border-cf-border w-full ">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-3 px-4">
        <div className="flex items-center gap-1.5">
          <AlertCircle className="h-4 w-4 text-cf-ink-60" />
          <CardTitle className="text-sm font-semibold text-cf-ink">
            Needs Attention
          </CardTitle>
        </div>
        {highCount > 0 && (
          <Badge variant="pastel-danger" shape={"pill"}>
            {getAttentionBadgeLabel(highCount)}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-cf-border">
          {rows.length === 0 && (
            <p className="px-4 py-6 text-center text-xs text-cf-ink-40">
              All clear - nothing needs attention.
            </p>
          )}

          {rows.map((row) => (
            <div
              key={row.id}
              className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-cf-surface-muted/50 transition-colors"
            >
              <div className="flex-shrink-0 text-cf-ink-60 mt-0.5">
                <row.Icon className="h-3.5 w-3.5 text-cf-ink-60" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-cf-ink">{row.title}</p>
                <p className="text-xs text-cf-ink-60">{row.subject}</p>
                <p className="text-[10px] text-cf-ink-40 mt-0.5">{row.detail}</p>
              </div>

              <div className="flex-shrink-0 text-right">
                <p className="text-xs text-cf-ink-40">{row.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default DashboardAttentionBoard;
