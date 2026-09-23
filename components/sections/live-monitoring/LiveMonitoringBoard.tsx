"use client";

import React from "react";
import { useLiveClock } from "./use-live-clock";
import LiveMonitoringHeader from "./LiveMonitoringHeader";
import LiveMonitoringStats from "./LiveMonitoringStats";
import LiveActivityTable from "./LiveActivityTable";
import LiveAttentionPanel from "./LiveAttentionPanel";
import LiveCarersPanel from "./LiveCarersPanel";


function LiveMonitoringBoard() {
  const { now, mountedAt, secondsSinceRefresh, refresh } = useLiveClock();

  return (
    <div className="rounded-2xl bg-cf-surface shadow-cf-md p-6 space-y-4">
      <LiveMonitoringHeader secondsSinceRefresh={secondsSinceRefresh} onRefresh={refresh} />

      <LiveMonitoringStats />

      <div className="flex justify-between gap-x-4">
        <div className="w-full">
          <LiveActivityTable now={now} mountedAt={mountedAt} />
        </div>
        <div className="flex flex-col w-full max-w-sm gap-y-4">
          <LiveAttentionPanel />
          <LiveCarersPanel />
        </div>
      </div>
    </div>
  );
}

export default LiveMonitoringBoard;