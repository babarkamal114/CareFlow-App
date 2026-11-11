import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui";
import type { DashboardCqcDomain } from "types";
import { DASHBOARD_SCORE_TONE_CLASSES, getDashboardScoreStatus, getDashboardScoreTone } from "utils"; 

interface CqcBreakdownBarsProps {
  domains: DashboardCqcDomain[];
}

export function CqcBreakdownBars({ domains }: CqcBreakdownBarsProps) {
  return (
    <ul aria-label="Score for each CQC key question" className="space-y-3">
      {domains.map((domain) => {
        const tone = DASHBOARD_SCORE_TONE_CLASSES[getDashboardScoreTone(domain.score)];
        return (
          <li key={domain.key}>
            <div className="mb-1 flex items-center justify-between gap-2 text-sm">
              <span className="font-medium text-cf-ink">{domain.label}</span>
              <span className="flex items-center gap-2">
                <span className="tabular-nums text-cf-ink-80">
                  {domain.score}
                  <span className="sr-only"> out of 100</span>
                </span>
                <span className="text-xs text-cf-ink-60">{getDashboardScoreStatus(domain.score)}</span>
              </span>
            </div>
            <div aria-hidden="true">
              <Progress value={domain.score} className="gap-0">
                <ProgressTrack>
                  <ProgressIndicator className={tone.bar} />
                </ProgressTrack>
              </Progress>
            </div>
          </li>
        );
      })}
    </ul>
  );
}