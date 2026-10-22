"use client";

import { motion } from "framer-motion";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui";
import type { BadgeProps } from "@/components/ui";
import {
  DASHBOARD_GAUGE_CIRCUMFERENCE,
  DASHBOARD_GAUGE_RADIUS,
  DASHBOARD_SCORE_TONE_CLASSES,
  getDashboardGaugeOffset,
  getDashboardScoreTone,
  type DashboardCqcTrend,
  type DashboardTrendDirection,
} from "utils";

const TREND_BADGE: Record<DashboardTrendDirection, NonNullable<BadgeProps["variant"]>> = {
  up: "softSuccess",
  down: "softDanger",
  neutral: "softMuted",
};

const TREND_ICON = { up: TrendingUp, down: TrendingDown, neutral: Minus } as const;

interface CqcReadinessGaugeProps {
  score: number;
  trend: DashboardCqcTrend;
}

/** Circular 0-100 gauge with a trend badge underneath. */
export function CqcReadinessGauge({ score, trend }: CqcReadinessGaugeProps) {
  const tone = DASHBOARD_SCORE_TONE_CLASSES[getDashboardScoreTone(score)];
  const TrendIcon = TREND_ICON[trend.direction];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative size-36">
        <svg
          viewBox="0 0 120 120"
          className="size-full -rotate-90"
          role="img"
          aria-label={`CQC readiness score ${score} out of 100`}
        >
          <circle
            cx="60"
            cy="60"
            r={DASHBOARD_GAUGE_RADIUS}
            fill="none"
            strokeWidth={10}
            className="stroke-cf-surface-inset"
          />
          <motion.circle
            cx="60"
            cy="60"
            r={DASHBOARD_GAUGE_RADIUS}
            fill="none"
            strokeWidth={10}
            strokeLinecap="round"
            className={tone.stroke}
            strokeDasharray={DASHBOARD_GAUGE_CIRCUMFERENCE}
            initial={{ strokeDashoffset: DASHBOARD_GAUGE_CIRCUMFERENCE }}
            animate={{ strokeDashoffset: getDashboardGaugeOffset(score) }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-4xl font-bold leading-none text-cf-ink">{score}</span>
          <span className="mt-1 text-xs text-cf-ink-60">out of 100</span>
        </div>
      </div>

      <Badge variant={TREND_BADGE[trend.direction]} shape="pill" badgeSize="md">
        <TrendIcon className="size-3.5" aria-hidden />
        {trend.label}
      </Badge>
    </div>
  );
}