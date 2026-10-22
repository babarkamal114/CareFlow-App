"use client";

import React from "react";
import { Button } from "@/components/ui";
import { RefreshCw } from "lucide-react";

interface LiveMonitoringHeaderProps {
  secondsSinceRefresh: number;
  onRefresh: () => void;
}

function LiveMonitoringHeader({ secondsSinceRefresh, onRefresh }: LiveMonitoringHeaderProps) {
  const updatedLabel =
    secondsSinceRefresh < 5 ? "Updated just now" : `Updated ${secondsSinceRefresh}s ago`;

  return (
    <div className="flex items-start justify-between gap-4 pb-4 border-b border-cf-border-light">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="font-heading text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-cf-ink">
            Live Monitoring
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cf-red-50 px-2.5 py-1 text-[11px] font-bold tracking-wide text-cf-red-500">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cf-red-500 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-cf-red-500" />
            </span>
            LIVE
          </span>
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

export default LiveMonitoringHeader;