import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui";
import type { DashboardCqcDomain } from "types";
import { DASHBOARD_SCORE_TONE_CLASSES, getDashboardScoreTone } from "utils";

interface CqcBreakdownBarsProps {
  domains: DashboardCqcDomain[];
}

/** One bar per CQC key question (Safe, Effective, Caring, Responsive, Well-led). */
export function CqcBreakdownBars({ domains }: CqcBreakdownBarsProps) {
  return (
    <ul className="space-y-3">
      {domains.map((domain) => {
        const tone = DASHBOARD_SCORE_TONE_CLASSES[getDashboardScoreTone(domain.score)];
        return (
          <li key={domain.key}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-cf-ink">{domain.label}</span>
              <span className="tabular-nums text-cf-ink-80">{domain.score}</span>
            </div>
            <Progress value={domain.score} aria-label={`${domain.label} score`} className="gap-0">
              <ProgressTrack>
                <ProgressIndicator className={tone.bar} />
              </ProgressTrack>
            </Progress>
          </li>
        );
      })}
    </ul>
  );
}