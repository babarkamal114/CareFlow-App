import { canAccess } from "./dashboard-helpers";

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