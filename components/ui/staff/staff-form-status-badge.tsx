"use client";

import { Badge } from "@/components/ui";

export function StaffFormStatusBadge({
  status,
  children,
}: {
  status: "green" | "amber" | "red" | "neutral";
  children: React.ReactNode;
}) {
  const variant = {
    green: "softSuccess",
    amber: "softWarning",
    red: "softDanger",
    neutral: "softMuted",
  }[status] as "softSuccess" | "softWarning" | "softDanger" | "softMuted";

  return <Badge variant={variant}>{children}</Badge>;
}
