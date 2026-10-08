import type { BadgeProps } from "@/components/ui";
import type { BillingPeriodType, DayType, FundingSource, InvoiceStatus, PaymentMethod, VisitDuration } from "types";

type BadgeVariant = BadgeProps["variant"];

export const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  "partially-paid": "Part paid",
  paid: "Paid",
  overdue: "Overdue",
};

export const INVOICE_STATUS_VARIANT: Record<InvoiceStatus, BadgeVariant> = {
  draft: "softMuted",
  sent: "softInfo",
  "partially-paid": "softWarning",
  paid: "softSuccess",
  overdue: "softDanger",
};

export const FUNDING_SOURCE_LABEL: Record<FundingSource, string> = {
  private: "Private",
  "local-authority": "Local Authority",
  "nhs-chc": "NHS CHC",
};

export const FUNDING_SOURCE_VARIANT: Record<FundingSource, BadgeVariant> = {
  private: "pastel-indigo",
  "local-authority": "pastel-teal",
  "nhs-chc": "pastel-purple",
};

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  card: "Card",
  "direct-debit": "Direct Debit",
  "bank-transfer": "Bank transfer",
};

export const DAY_TYPE_LABEL: Record<DayType, string> = {
  weekday: "Weekday",
  weekend: "Weekend",
  "bank-holiday": "Bank holiday",
  unsocial: "Unsocial hours",
};

export const PERIOD_TYPE_LABEL: Record<BillingPeriodType, string> = {
  weekly: "Weekly",
  fortnightly: "Fortnightly",
  monthly: "Monthly",
};

const toOptions = <T extends string>(labels: Record<T, string>) =>
  (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));

export const INVOICE_STATUS_OPTIONS = toOptions(INVOICE_STATUS_LABEL);
export const FUNDING_SOURCE_OPTIONS = toOptions(FUNDING_SOURCE_LABEL);
export const PAYMENT_METHOD_OPTIONS = toOptions(PAYMENT_METHOD_LABEL);
export const DAY_TYPE_OPTIONS = toOptions(DAY_TYPE_LABEL);
export const PERIOD_TYPE_OPTIONS = toOptions(PERIOD_TYPE_LABEL);

export const VISIT_DURATIONS: VisitDuration[] = [15, 30, 45, 60];
export const DAY_TYPES: DayType[] = ["weekday", "weekend", "bank-holiday", "unsocial"];