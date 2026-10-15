import { Badge } from "@/components/ui";
import type { CqcQuestionScore } from "types";
import { BAND_CONFIG, getScoreBand, QUESTION_META, TONE_TEXT } from "utils";
import { StatusProgressBar } from "./status-progress-bar";

export function CqcQuestionRow({ question }: { question: CqcQuestionScore }) {
  const { Icon, label } = QUESTION_META[question.id];
  const band = BAND_CONFIG[getScoreBand(question.score)];

  return (
    <div className="flex items-center gap-x-4">
      <div className="flex w-28 flex-shrink-0 items-center gap-x-2">
        <Icon className={`size-4 ${TONE_TEXT[band.tone]}`} />
        <span className="text-sm font-semibold text-cf-ink">{label}</span>
      </div>
      <div className="flex-1">
        <StatusProgressBar value={question.score} tone={band.tone} className="h-2" />
      </div>
      <div className="flex min-w-[140px] flex-shrink-0 items-center justify-end gap-x-2">
        <span className="w-12 text-right text-lg font-bold text-cf-ink">{question.score}</span>
        <Badge variant={band.badge} badgeSize="md" shape="pill" className="whitespace-nowrap">{band.label}</Badge>
      </div>
    </div>
  );
}
