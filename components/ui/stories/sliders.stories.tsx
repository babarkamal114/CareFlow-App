import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Slider,  Progress } from 'ui-components'
import { cn } from 'lib'
import * as React from "react"

const meta = {
  title: "UI/SlidersProgress",
  parameters: {
    controls: { expanded: true },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Circular progress helper (used for the 80% and indeterminate circles)
// ---------------------------------------------------------------------------
function CircularProgress({
  value,
  indeterminate = false,
  size = 56,
  strokeWidth = 5,
  className,
}: {
  value?: number
  indeterminate?: boolean
  size?: number
  strokeWidth?: number
  className?: string
}) {
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const offset =
    indeterminate ? 0 : circumference - ((value ?? 0) / 100) * circumference

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn(indeterminate && "animate-spin", className)}
    >
      {/* track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-muted"
      />
      {/* filled arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={indeterminate ? circumference * 0.75 : offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="text-primary transition-[stroke-dashoffset] duration-500"
      />
      {!indeterminate && value !== undefined && (
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-foreground text-[13px] font-semibold"
        >
          {value}%
        </text>
      )}
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Overview — both panels side by side
// ---------------------------------------------------------------------------
export const Overview: Story = {
  render: () => {
    const [visitDuration, setVisitDuration] = React.useState(45)
    const [priceRange, setPriceRange] = React.useState([25, 85])

    return (
      <div className="grid grid-cols-[1fr_1fr] gap-4">
        {/* ── SLIDER ──────────────────────────────────────────────── */}
        <div className="rounded-xl border bg-background p-6">
          <p className="mb-6 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Slider
          </p>

          {/* Single — Visit duration */}
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Visit duration</span>
              <span className="text-sm font-semibold">{visitDuration} min</span>
            </div>
            <Slider
              min={15}
              max={120}
              value={[visitDuration]}
              onValueChange={(v) => {
                if (Array.isArray(v)) {
                    setVisitDuration(v[0])
                }
                }}
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>15 min</span>
              <span>120 min</span>
            </div>
          </div>

          {/* Range — Price range */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Price range</span>
              <span className="text-sm font-semibold">
                £{priceRange[0]} – £{priceRange[1]}
              </span>
            </div>
            <Slider
              min={0}
              max={200}
              value={priceRange}
              onValueChange={(v) => {
                if (Array.isArray(v)) {
                    setPriceRange(v)
                }
                }}
            />
          </div>
        </div>

        {/* ── PROGRESS BARS ───────────────────────────────────────── */}
        <div className="rounded-xl border bg-background p-6">
          <p className="mb-6 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Progress Bars
          </p>

          <div className="flex flex-col gap-5">
            {/* Uploading files — 72% default (primary) */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-medium">Uploading files</span>
                <span className="text-xs text-muted-foreground">72%</span>
              </div>
              <Progress value={72} />
            </div>

            {/* Profile completion — 100% complete */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-medium">Profile completion</span>
                <span className="text-xs font-semibold text-primary">
                  Complete
                </span>
              </div>
              <Progress value={100} />
            </div>

            {/* Storage used — 82% warning colour */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-medium">Storage used</span>
                <span className="text-xs text-muted-foreground">
                  8.2 / 10 GB
                </span>
              </div>
              <Progress
                value={82}
                className="[&>[data-slot=progress-indicator]]:bg-amber-500"
              />
            </div>

            {/* Circular progress row */}
            <div className="mt-1 flex items-center gap-6">
              {/* 80% determinate */}
              <CircularProgress value={80} size={56} strokeWidth={5} />

              {/* Indeterminate spinner */}
              <CircularProgress indeterminate size={56} strokeWidth={5} />

              <div>
                <p className="text-sm font-medium">Syncing data</p>
                <p className="text-xs text-muted-foreground">
                  Indeterminate progress
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// Individual playgrounds
// ---------------------------------------------------------------------------
export const SliderPlayground: Story = {
  render: () => {
    const [val, setVal] = React.useState(40)
    return (
      <div className="w-64">
        <Slider
            min={0}
            max={100}
            value={[val]}
            onValueChange={(v) => {
                if (Array.isArray(v)) {
                setVal(v[0])
                }
            }}
            />
        <p className="mt-2 text-sm text-muted-foreground">Value: {val}</p>
      </div>
    )
  },
}

export const ProgressPlayground: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-3">
      <Progress value={30} />
      <Progress value={60} />
      <Progress value={90} />
    </div>
  ),
}
