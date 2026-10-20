import { AlertTriangle, CheckCircle2, MinusCircle, Pill } from "lucide-react";
import type { StatCardProps } from "types";
import type { summarizeRound } from "utils";

type RoundSummary = ReturnType<typeof summarizeRound>;
const note = (text: string) => <p className="text-xs text-cf-ink-60">{text}</p>;

export function getMedicationStatCards(s: RoundSummary, escalationCount: number): StatCardProps[] {
  const elapsed = s.total - s.upcoming;
  const pct = elapsed > 0 ? Math.round((s.administered / elapsed) * 100) : 100;
  const attention = s.missed + s.due;

  return [
    { label: "Doses today", value: String(s.total), Icon: Pill, description: "Scheduled doses", badgeVariant: "softInfo", children: note(`${s.upcoming} still to come`) },
    {
      label: "Administered", value: String(s.administered), Icon: CheckCircle2, description: "Recorded as given", badgeVariant: "softSuccess",
      hasValueBadge: true, valueBadgeValue: `${pct}%`, children: note("of doses due so far"),
    },
    {
      label: "Needs attention", value: String(attention), Icon: AlertTriangle, description: "Due or missed", badgeVariant: attention > 0 ? "softDanger" : "softSuccess",
      children: note(`${s.missed} missed · ${s.due} due now`),
    },
    {
      label: "Refused / omitted", value: String(s.exceptions), Icon: MinusCircle, description: "Exceptions today", badgeVariant: "softWarning",
      children: note(escalationCount > 0 ? `${escalationCount} patient(s) escalated: 3+ this week` : "No patient escalated this week"),
    },
  ];
}
