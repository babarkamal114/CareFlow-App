"use client";

import React from "react";
import { motion } from "framer-motion";
import { StatCard } from "shared";
import { Users, Activity, UserCheck, AlertTriangle } from "lucide-react";
import {
  mockLiveVisits,
  mockLiveCarersOnShift,
  mockLiveAttentionItems,
  getPriority,
} from "utils";

function LiveMonitoringStats() {
  const activeVisitsCount = mockLiveVisits.filter(
    (v) => v.status === "in-progress" || v.status === "delayed"
  ).length;
  const activePatientsCount = mockLiveVisits.filter(
    (v) => v.status !== "completed" && v.status !== "missed"
  ).length;
  const carersOnDuty = mockLiveCarersOnShift.length;
  const highPriorityAlerts = mockLiveAttentionItems.filter(
    (i) => getPriority(i.type) === "high"
  ).length;

  const cards = [
    {
      label: "Active Patients",
      value: String(activePatientsCount),
      description: "Currently receiving or awaiting care",
      Icon: Users,
      showScore: false,
      showTrend: false,
      hasCqcScore: false,
      hasValueBadge: false,
      badgeVariant: "softSuccess" as const,
    },
    {
      label: "Active Visits",
      value: String(activeVisitsCount),
      description: "In progress or running late",
      Icon: Activity,
      showScore: false,
      showTrend: false,
      hasCqcScore: false,
      hasValueBadge: false,
      badgeVariant: "softInfo" as const,
    },
    {
      label: "Carers On Duty",
      value: String(carersOnDuty),
      description: "On shift right now",
      Icon: UserCheck,
      showScore: false,
      showTrend: false,
      hasCqcScore: false,
      hasValueBadge: false,
      badgeVariant: "softWarning" as const,
    },
    {
      label: "Alerts",
      value: String(mockLiveAttentionItems.length),
      description: "Items needing attention",
      Icon: AlertTriangle,
      showScore: false,
      showTrend: false,
      hasCqcScore: false,
      hasValueBadge: highPriorityAlerts > 0,
      valueBadgeValue: `${highPriorityAlerts} high`,
      badgeVariant: "softDanger" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -3 }}
        >
          <StatCard {...card} />
        </motion.div>
      ))}
    </div>
  );
}

export default LiveMonitoringStats;