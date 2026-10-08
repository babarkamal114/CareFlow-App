import { AlertTriangle, Clock, FileText, PoundSterling } from "lucide-react";
import type { RevenueSummary, StatCardProps } from "types";
import { formatCurrency, formatPercent, getCollectionRate } from "utils";

const note = (text: string) => <p className="text-xs text-cf-ink-60">{text}</p>;

export function getFinanceStatCards(
  summary: RevenueSummary,
  issuedCount: number,
  overdueCount: number,
): StatCardProps[] {
  const collectionRate = getCollectionRate(summary);

  return [
    {
      label: "Invoiced",
      value: formatCurrency(summary.invoiced, true),
      Icon: FileText,
      description: `${issuedCount} invoices issued`,
      badgeVariant: "softInfo",
      children: note(`${issuedCount} invoices issued`),
    },
    {
      label: "Collected",
      value: formatCurrency(summary.collected, true),
      Icon: PoundSterling,
      description: "Payments received",
      badgeVariant: "softSuccess",
      hasValueBadge: true,
      valueBadgeValue: formatPercent(collectionRate),
      children: note("of invoiced revenue"),
    },
    {
      label: "Outstanding",
      value: formatCurrency(summary.outstanding, true),
      Icon: Clock,
      description: "Awaiting payment",
      badgeVariant: "softWarning",
      children: note("Awaiting payment"),
    },
    {
      label: "Overdue",
      value: formatCurrency(summary.overdue, true),
      Icon: AlertTriangle,
      description: `${overdueCount} invoices past due`,
      badgeVariant: summary.overdue > 0 ? "softDanger" : "softSuccess",
      children: note(overdueCount > 0 ? `${overdueCount} invoices past due` : "Nothing overdue"),
    },
  ];
}