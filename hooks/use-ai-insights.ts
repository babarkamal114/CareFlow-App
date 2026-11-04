'use client'

import { toast } from "@/components/ui";
import { useReviewAiInsightApi } from "lib";
import { useState } from "react";
import type { AiInsight, AiInsightKind } from "types";
import { useAiInsightsQuery } from "./use-reports-queries";

export interface UseAiInsightsReturn {
    visible: AiInsight[];
    isLoading: boolean;
    kind: AiInsightKind | "all";
    setKind: (kind: AiInsightKind | "all") => void;
    showReviewed: boolean;
    setShowReviewed: (show: boolean) => void;
    openCount: number;
    reviewedCount: number;
    countByKind: (kind: AiInsightKind | "all") => number;
    accept: (id: string) => void;
    dismiss: (id: string) => void;
    isReviewing: boolean;
}

export function useAiInsights(): UseAiInsightsReturn {
    const [kind, setKind] = useState<AiInsightKind | "all">("all")
    const [showReviewed, setShowReviewed] = useState(false)

    const { data, isLoading } = useAiInsightsQuery()

    // the list refetches by itself after a review succeeds
    const { mutate: reviewInsight, isPending: isReviewing } = useReviewAiInsightApi({
        onSuccess: (_response, variables) => {
            if (variables.status === "accepted") {
                toast.success("Accepted — a follow-up task has been created")
            } else {
                toast.success("Insight dismissed")
            }
        },
        onError: () => toast.error("Could not update the insight.")
    })

    const all = data ?? []
    const open = all.filter((insight) => insight.status === "suggested")
    const reviewed = all.filter((insight) => insight.status !== "suggested")

    // what the screen shows: the chosen kind, open ones only unless "show reviewed" is on
    const visible = all.filter((insight) => {
        const kindMatches = kind === "all" || insight.kind === kind
        const statusMatches = showReviewed || insight.status === "suggested"
        return kindMatches && statusMatches
    })

    const countByKind = (k: AiInsightKind | "all") => {
        return open.filter((insight) => k === "all" || insight.kind === k).length
    }

    const accept = (id: string) => {
        reviewInsight({ id, status: "accepted" })
    }

    const dismiss = (id: string) => {
        reviewInsight({ id, status: "dismissed" })
    }

    return {
        visible,
        isLoading,
        kind,
        setKind,
        showReviewed,
        setShowReviewed,
        openCount: open.length,
        reviewedCount: reviewed.length,
        countByKind,
        accept,
        dismiss,
        isReviewing
    }
}
