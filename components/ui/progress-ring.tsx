// components/ui/progress-ring.tsx
// Small circular progress indicator — used by Finance "Collection rate" stat
// and reusable anywhere else a ring-style % is needed (e.g. CQC Readiness).

import { cn } from "@/lib/utils"

export interface ProgressRingProps {
  /** 0–100 */
  value: number
  size?: number
  strokeWidth?: number
  color?: string // stroke color, defaults to brand green
  trackColor?: string
  className?: string
  label?: string // text shown in the center, defaults to `${value}%`
}

function ProgressRing({
  value,
  size = 40,
  strokeWidth = 4,
  color = "#00C48C",
  trackColor = "#F0F1F5",
  className,
  label,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(100, Math.max(0, value))
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${clamped}%`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <span
        className="absolute text-[9px] font-bold text-[#111318]"
        style={{ fontSize: size * 0.22 }}
      >
        {label ?? `${clamped}%`}
      </span>
    </div>
  )
}

export { ProgressRing }
