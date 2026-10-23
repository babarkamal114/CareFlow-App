"use client";

import { AiInsightCard, Button, EmptyState, ReportPill, Skeleton } from "@/components/ui";
import { useAiInsights } from "hooks";
import { Sparkles } from "lucide-react";
import type { AiInsightKind } from "types";
import { REPORT_INSIGHT_KIND_CONFIG } from "utils";

const KINDS = Object.keys(REPORT_INSIGHT_KIND_CONFIG) as AiInsightKind[];

export function ReportsInsightsSection() {
  const a = useAiInsights();
  if (a.isLoading) return <Skeleton className="h-72 w-full rounded-2xl" />;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter insights">
          <ReportPill label="All" count={a.countByKind("all")} active={a.kind === "all"} onClick={() => a.setKind("all")} />
          {KINDS.map((k) => <ReportPill key={k} label={REPORT_INSIGHT_KIND_CONFIG[k].label} count={a.countByKind(k)} active={a.kind === k} onClick={() => a.setKind(k)} />)}
        </div>
        {a.reviewedCount > 0 && <Button variant="ghost" size="sm" onClick={() => a.setShowReviewed(!a.showReviewed)}>{a.showReviewed ? "Hide" : "Show"} {a.reviewedCount} reviewed</Button>}
      </div>
      {a.visible.length === 0 ? (
        <EmptyState icon={<Sparkles />} title="No open insights" description="New AI suggestions appear here. Each one needs a person to accept or dismiss it." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {a.visible.map((i) => <AiInsightCard key={i.id} insight={i} disabled={a.isReviewing} onAccept={a.accept} onDismiss={a.dismiss} />)}
        </div>
      )}
    </div>
  );
}
