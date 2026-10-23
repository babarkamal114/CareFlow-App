import { toast } from "@/components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewAiInsight } from "lib";
import { useMemo, useState } from "react";
import type { AiInsightKind } from "types";
import { reportKeys, useAiInsightsQuery } from "./use-reports-queries";

export function useAiInsights() {
  const qc = useQueryClient();
  const insightsQ = useAiInsightsQuery();
  const [kind, setKind] = useState<AiInsightKind | "all">("all");
  const [showReviewed, setShowReviewed] = useState(false);

  const all = insightsQ.data ?? [];
  const visible = useMemo(
    () => all.filter((i) => (kind === "all" || i.kind === kind) && (showReviewed || i.status === "suggested")),
    [all, kind, showReviewed],
  );

  const review = useMutation({
    mutationFn: reviewAiInsight,
    onSuccess: (ins) => {
      qc.invalidateQueries({ queryKey: reportKeys.insights });
      qc.invalidateQueries({ queryKey: reportKeys.activity });
      toast.success(ins.status === "accepted" ? "Accepted — a follow-up task has been created" : "Insight dismissed");
    },
    onError: () => toast.error("Could not update the insight."),
  });

  return {
    visible, isLoading: insightsQ.isLoading, kind, setKind, showReviewed, setShowReviewed,
    openCount: all.filter((i) => i.status === "suggested").length, reviewedCount: all.filter((i) => i.status !== "suggested").length,
    countByKind: (k: AiInsightKind | "all") => all.filter((i) => i.status === "suggested" && (k === "all" || i.kind === k)).length,
    accept: (id: string) => review.mutate({ id, status: "accepted" }), dismiss: (id: string) => review.mutate({ id, status: "dismissed" }),
    isReviewing: review.isPending,
  };
}
