"use client";

import { Badge } from "@/components/ui";
import type { StaffFormStatusBadgeProps } from "types";
import { STAFF_STATUS_BADGE_VARIANT } from "utils";

export function StaffFormStatusBadge({
  status,
  children,
}: StaffFormStatusBadgeProps) {
  const variant = STAFF_STATUS_BADGE_VARIANT[status];

  return <Badge variant={variant}>{children}</Badge>;
}
