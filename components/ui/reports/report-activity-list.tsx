import { Badge } from "@/components/ui";
import type { ReportActivity } from "types";
import { REPORT_ACTIVITY_LABEL } from "utils";

export function ReportActivityList({ activity }: { activity: ReportActivity[] }) {
  if (activity.length === 0) return <p className="py-4 text-center text-sm text-cf-ink-40">No report activity yet.</p>;
  return (
    <ul className="divide-y divide-cf-border-light rounded-lg border border-cf-border-light">
      {activity.map((a) => (
        <li key={a.id} className="flex flex-wrap items-center gap-3 p-3">
          <Badge variant="pastel-neutral" shape="pill" badgeSize="sm">{REPORT_ACTIVITY_LABEL[a.action]}</Badge>
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-cf-ink">{a.target}{a.detail ? <span className="font-normal text-cf-ink-60"> · {a.detail}</span> : null}</span>
          <span className="text-xs text-cf-ink-60">{a.user} · {a.at.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} {a.at.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
        </li>
      ))}
    </ul>
  );
}
