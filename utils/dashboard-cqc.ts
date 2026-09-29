import { canAccess, formatLongDate, isoMinutesAgo } from "./dashboard-helpers";

export type CqcKey = "safe" | "effective" | "caring" | "responsive" | "well-led";

export interface CqcOverviewResponse {
  overallScore: number;
  previousScore?: number | null;
  updatedAt: string;
  attributes: { key: CqcKey; score: number }[];
}

const CQC_ATTRIBUTES: { key: CqcKey; label: string }[] = [
  { key: "safe", label: "Safe" },
  { key: "effective", label: "Effective" },
  { key: "caring", label: "Caring" },
  { key: "responsive", label: "Responsive" },
  { key: "well-led", label: "Well-led" },
];

export type ScoreTone = "success" | "warning" | "error";

export const clampScore = (score: number) => Math.min(100, Math.max(0, score));

export function getScoreTone(score: number): ScoreTone {
  if (score >= 80) return "success";
  if (score >= 70) return "warning";
  return "error";
}

export interface CqcAttributeRow {
  key: CqcKey;
  label: string;
  score: number;
  tone: ScoreTone;
}

export function buildCqcAttributes(
  attributes: CqcOverviewResponse["attributes"]
): CqcAttributeRow[] {
  return CQC_ATTRIBUTES.flatMap(({ key, label }) => {
    const found = attributes.find((a) => a.key === key);
    if (!found) return [];
    const score = clampScore(found.score);
    return [{ key, label, score, tone: getScoreTone(score) }];
  });
}

export function getCqcTrend(
  overallScore: number,
  previousScore?: number | null
): { points: number; isImproving: boolean } | null {
  if (previousScore === undefined || previousScore === null) return null;
  const diff = Math.round(overallScore - previousScore);
  return { points: Math.abs(diff), isImproving: diff >= 0 };
}

export const canSeeCqc = (role: string) => canAccess(role, "reports");

export function getMockCqcOverview(): CqcOverviewResponse {
  return {
    overallScore: 87,
    previousScore: 83,
    updatedAt: isoMinutesAgo(60 * 24 * 9),
    attributes: [
      { key: "safe", score: 92 },
      { key: "effective", score: 85 },
      { key: "caring", score: 88 },
      { key: "responsive", score: 79 },
      { key: "well-led", score: 91 },
    ],
  };
}

/* ------------------------- Breakdown card (bars) --------------------------- */

export function getCqcBreakdown(): { attributes: CqcAttributeRow[]; lastUpdated: string } {
  const data = getMockCqcOverview();
  return {
    attributes: buildCqcAttributes(data.attributes),
    lastUpdated: data.updatedAt ? formatLongDate(data.updatedAt) : "",
  };
}

export const CQC_GAUGE_RADIUS = 54;
export const CQC_GAUGE_CIRCUMFERENCE = 2 * Math.PI * CQC_GAUGE_RADIUS;
export const CQC_RING_COLORS: Record<ScoreTone, string> = {
  success: "var(--cf-success)",
  warning: "var(--cf-warning)",
  error: "var(--cf-error)",
};

export const CQC_GAUGE_DESCRIPTION =
  "Overall compliance score based on Safe, Effective, Caring, Responsive, and Well-led ratings.";

export const getCqcTrendLabel = (points: number) => `${points} pts vs last month`;

export interface CqcGauge {
  score: number;
  displayScore: number;
  ringColor: string;
  offset: number; 
  circumference: number;
  radius: number;
  trend: { points: number; isImproving: boolean; label: string } | null;
}

export function getCqcGauge(): CqcGauge {
  const data = getMockCqcOverview();
  const score = clampScore(data.overallScore);
  const trend = getCqcTrend(score, data.previousScore);

  return {
    score,
    displayScore: Math.round(score),
    ringColor: CQC_RING_COLORS[getScoreTone(score)],
    offset: CQC_GAUGE_CIRCUMFERENCE * (1 - score / 100),
    circumference: CQC_GAUGE_CIRCUMFERENCE,
    radius: CQC_GAUGE_RADIUS,
    trend: trend ? { ...trend, label: getCqcTrendLabel(trend.points) } : null,
  };
}
