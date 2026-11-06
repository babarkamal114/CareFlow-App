import { Badge } from "@/components/ui";
import { AlertTriangle } from "lucide-react";
import type { CqcQuestionScore } from "types";
import { BAND_CONFIG, getScoreBand, TONE_TEXT } from "utils";

/** "Areas needing improvement": every CQC question that is not rated Good, with its suggested actions. */
export function ImprovementList({ questions }: { questions: CqcQuestionScore[] }) {
  const needs = questions.filter((q) => getScoreBand(q.score) !== "good");
  if (needs.length === 0) return null;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <span className="text-sm font-semibold text-cf-ink">Areas Needing Improvement</span>
      </div>
      {needs.map((q) => {
        const band = BAND_CONFIG[getScoreBand(q.score)];
        return (
          <div key={q.id} className="pl-2">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${TONE_TEXT[band.tone]}`}>{q.label}</span>
              <span className="text-xs text-cf-ink-40">•</span>
              <span className="text-xs text-cf-ink-60">Score: {q.score}%</span>
              <Badge variant={band.badge} badgeSize="sm" shape="rounded">{band.label}</Badge>
            </div>
            <ul className="mt-1.5 space-y-1 pl-4">
              {q.improvements.map((tip) => (
                <li key={tip} className="list-disc text-xs text-cf-ink-60">{tip}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
