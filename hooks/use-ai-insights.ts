'use client'

import { toast } from "@/components/ui";
import { useReviewAiInsightApi } from "lib";
import { useState } from "react";
import type { AiInsightKind, UseAiInsightsReturn } from "types";
import { useAiInsightsQuery } from "./use-reports-queries";

export function useAiInsights(): UseAiInsightsReturn {
    const [kind, setKind] = useState<AiInsightKind | "all">("all")
    const [showReviewed, setShowReviewed] = useState(false)

    const { data, isLoading } = useAiInsightsQuery()

    const { mutate: reviewInsight, isPending: isReviewing } = useReviewAiInsightApi({
        onSuccess: (_response, variables) => {
            if (variables.status === "accepted") {
                toast.success("Insight accepted")
            } else {
                toast.success("Insight dismissed")
            }
        },
        onError: () => toast.error("Could not update the insight.")
    })

    const all = data ?? []
    const open = all.filter((insight) => insight.status === "suggested")
    const reviewed = all.filter((insight) => insight.status !== "suggested")

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
