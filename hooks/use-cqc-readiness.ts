"use client";

import { toast } from "@/components/ui";
import {
  mockDocumentationGaps, mockIncidentResponse, mockQuestionImprovements, mockReadinessFactors, mockScoreHistory,
  mockTrainingIssues,
} from "lib";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { CqcQuestionScore } from "types";
import {
  buildReadinessCsv, buildScoreTrend, calcOverallScore, calcQuestionScores, downloadTextFile, QUESTION_LABELS,
} from "utils";

export function useCqcReadiness() {
  const router = useRouter();
  const factors = mockReadinessFactors;
  const [drilldownOpen, setDrilldownOpen] = useState(false);

  const overall = useMemo(() => calcOverallScore(factors), [factors]);
  const questions = useMemo(() => calcQuestionScores(factors, mockQuestionImprovements, QUESTION_LABELS), [factors]);
  const previous = mockScoreHistory[mockScoreHistory.length - 2].overall;

  const exportEvidence = () => {
    downloadTextFile("cqc-readiness-evidence.csv", buildReadinessCsv(factors, questions, overall), "text/csv;charset=utf-8");
    toast.success("Readiness evidence exported");
  };

  return {
    factors,
    overall,
    questions,
    change: overall - previous,
    documentationGaps: mockDocumentationGaps,
    trainingIssues: mockTrainingIssues,
    incidentResponse: mockIncidentResponse,
    drilldownOpen,
    setDrilldownOpen,
    exportEvidence,
    navigate: (href: string) => router.push(href),
  };
}

/** Score trend chart: 3 / 6 / 12 month toggle, last point = the live calculated score. */
export function useScoreTrend(overall: number, questions: CqcQuestionScore[]) {
  const [months, setMonths] = useState(6);
  const responsive = questions.find((q) => q.id === "responsive")?.score ?? overall;

  const points = useMemo(() => buildScoreTrend(mockScoreHistory, overall, responsive, months), [overall, responsive, months]);
  const best = questions.reduce((a, b) => (b.score > a.score ? b : a), questions[0]);
  const focus = questions.reduce((a, b) => (b.score < a.score ? b : a), questions[0]);

  return { months, setMonths, points, change: points[points.length - 1].overall - points[0].overall, best, focus };
}
