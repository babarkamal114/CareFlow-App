"use client";

import { Button } from "@/components/ui";
import { RefreshCw } from "lucide-react";
import type { LiveMonitoringHeaderProps } from "types";
import { LiveBadge } from "./live-badge";

export function LiveMonitoringHeader({ updatedLabel, onRefresh }: LiveMonitoringHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 pb-4 border-b border-cf-border-light">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="font-heading text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-cf-ink">
            Live Monitoring
          </h1>
          <LiveBadge />
        </div>
        <p className="mt-1 text-sm text-cf-ink-60">
          Real-time view of today&apos;s visits, carers, and alerts
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs text-cf-ink-40">{updatedLabel}</span>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>
    </div>
  );
}
