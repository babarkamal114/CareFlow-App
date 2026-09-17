// components/sections/dashboard/DashboardStatSection.tsx
'use client'

import React, { use } from "react";
import { motion } from "framer-motion";
import { StatCard } from "shared";
import { Users, Calendar, ClipboardList, DollarSign } from "lucide-react";

const cards = [
  {
    label: "Total Patients",
    value: "142",
    Icon: Users,
    description: "Active patients under care",
    showScore: false,
    showTrend: true,
    trend: "up" as const,
    hasCqcScore: false,
    hasValueBadge: true,
    valueBadgeValue: "12%",
    badgeVariant: "softSuccess" as const,
  },
  {
    label: "Active Staff",
    value: "31",
    Icon: Users,
    description: "Staff currently active",
    showScore: false,
    showTrend: true,
    trend: "up" as const,
    hasCqcScore: false,
    hasValueBadge: true,
    valueBadgeValue: "8%",
    badgeVariant: "softInfo" as const,
  },
  {
    label: "Today's Visits",
    value: "48",
    Icon: Calendar,
    description: "Visits scheduled today",
    showScore: true,
    score: 92,
    showTrend: false,
    hasCqcScore: false,
    hasValueBadge: false,
    badgeVariant: "softWarning" as const,
  },
  {
    label: "Revenue",
    value: "$42,500",
    Icon: DollarSign,
    description: "This month's revenue",
    showScore: true,
    score: 78,
    showTrend: false,
    hasCqcScore: false,
    hasValueBadge: false,
    badgeVariant: "softDanger" as const,
  },
];

function DashboardStatSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

export default DashboardStatSection;