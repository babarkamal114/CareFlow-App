"use client";

import { Badge, Button, Card, CardContent } from "@/components/ui";
import { Check, X } from "lucide-react";
import type { AiInsight } from "types";
import { REPORT_INSIGHT_KIND_CONFIG, REPORT_INSIGHT_SEVERITY_BADGE } from "utils";

interface AiInsightCardProps { insight: AiInsight; disabled: boolean; onAccept: (id: string) => void; onDismiss: (id: string) => void }

export function AiInsightCard({ insight, disabled, onAccept, onDismiss }: AiInsightCardProps) {
  const kind = REPORT_INSIGHT_KIND_CONFIG[insight.kind];
  const sev = REPORT_INSIGHT_SEVERITY_BADGE[insight.severity];
  const reviewed = insight.status !== "suggested";
  return (
    <Card className={`h-full rounded-2xl border-cf-border-light shadow-cf-sm ${reviewed ? "opacity-70" : ""}`}>
      <CardContent className="flex h-full flex-col gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant={kind.badge} shape="pill" badgeSize="sm">{kind.label}</Badge>
          <Badge variant={sev.variant} shape="pill" badgeSize="sm">{sev.label}</Badge>
          {reviewed && <Badge variant={insight.status === "accepted" ? "pastel-success" : "pastel-neutral"} shape="pill" badgeSize="sm">{insight.status === "accepted" ? "Accepted" : "Dismissed"}</Badge>}
          <span className="ml-auto text-xs text-cf-ink-40">{insight.subject}</span>
        </div>
        <div className="flex-1 space-y-1.5">
          <h3 className="font-semibold text-cf-ink">{insight.title}</h3>
          <p className="text-sm text-cf-ink-60">{insight.summary}</p>
          <ul className="list-disc space-y-0.5 pl-4 text-xs text-cf-ink-60">{insight.evidence.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
        {!reviewed ? (
          <div className="flex gap-2">
            <Button size="sm" className="flex-1" disabled={disabled} onClick={() => onAccept(insight.id)}><Check />Accept &amp; create task</Button>
            <Button size="sm" variant="outline" disabled={disabled} onClick={() => onDismiss(insight.id)}><X />Dismiss</Button>
          </div>
        ) : null}
        <p className="text-[11px] text-cf-ink-40">AI suggestion — reviewed by a person before any action.</p>
      </CardContent>
    </Card>
  );
}
