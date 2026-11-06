"use client";

import { toast } from "@/components/ui";
import { mockAlerts } from "lib";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { ComplianceAlert } from "types";
import { getOpenAlerts } from "utils";

export function useComplianceAlerts() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<ComplianceAlert[]>(mockAlerts);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const openAlerts = useMemo(() => getOpenAlerts(alerts), [alerts]);
  const selected = alerts.find((a) => a.id === selectedId) ?? null;

  const select = (alert: ComplianceAlert) => {
    setSelectedId(alert.id);
    setOpen(true);
  };

  const resolve = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, resolved: true } : a)));
    setOpen(false);
    toast.success("Alert marked as resolved");
  };

  const goTo = (alert: ComplianceAlert) => {
    setOpen(false);
    router.push(alert.href);
  };

  return {
    openAlerts,
    urgentCount: openAlerts.filter((a) => a.severity === "urgent").length,
    resolvedCount: alerts.length - openAlerts.length,
    selected,
    open,
    setOpen,
    select,
    resolve,
    goTo,
  };
}
