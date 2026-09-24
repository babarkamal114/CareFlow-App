'use client';

import React, { useMemo } from "react";
import { Badge, Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";
import { AlertCircle } from "lucide-react";

import { useAttentionItems } from "hooks";
import { buildAttentionRows } from "utils";

interface DashboardAttentionBoardProps {
  /** The logged-in user's role. Decides which alerts are shown. */
  role: string;
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="px-4 py-3 space-y-2 animate-pulse">
          <div className="h-3 w-1/3 rounded bg-cf-ink-40/20" />
          <div className="h-3 w-1/2 rounded bg-cf-ink-40/20" />
        </div>
      ))}
    </>
  );
}

function DashboardAttentionBoard({ role }: DashboardAttentionBoardProps) {
  const { data, isLoading, error, refetch } = useAttentionItems();

  const rows = useMemo(
    () => (data ? buildAttentionRows(data.items, role) : []),
    [data, role]
  );
  const highCount = rows.filter((r) => r.priority === "high").length;

  return (
    <Card className="border-cf-border w-full ">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-3 px-4">
        <div className="flex items-center gap-1.5">
          <AlertCircle className="h-4 w-4 text-cf-ink-60" />
          <CardTitle className="text-sm font-semibold text-cf-ink">
            Needs Attention
          </CardTitle>
        </div>
        {!isLoading && !error && highCount > 0 && (
          <Badge variant="pastel-danger" shape={"pill"}>
            {highCount} {highCount === 1 ? "Item" : "Items"}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-cf-border">
          {isLoading && <SkeletonRows />}

          {!isLoading && error && (
            <p className="px-4 py-6 text-center text-xs text-cf-ink-60">
              Couldn&apos;t load alerts.{" "}
              <Button onClick={refetch} className="font-semibold text-cf-ink underline">
                Retry
              </Button>
            </p>
          )}

          {!isLoading && !error && rows.length === 0 && (
            <p className="px-4 py-6 text-center text-xs text-cf-ink-40">
              All clear - nothing needs attention.
            </p>
          )}

          {!isLoading &&
            !error &&
            rows.map((row) => (
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