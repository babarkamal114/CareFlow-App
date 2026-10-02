import * as React from "react"

import { cn } from "lib"

export type StatCardProps = React.ComponentProps<"div">

function StatCard({
  className,
  role,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...props
}: StatCardProps) {
  const resolvedRole =
    role ?? (ariaLabel ?? ariaLabelledby ? "region" : undefined)

  return (
    <div
      data-slot="stat-card"
      role={resolvedRole}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card p-5 outline-none transition-[border-color,box-shadow] duration-200 focus-visible:ring-[3px] focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
      {...props}
    />
  )
}

function StatCardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-card-header"
      className={cn(
        "mb-3.5 flex items-start justify-between gap-3",
        className
      )}
      {...props}
    />
  )
}

const statIconTone = {
  brand: "bg-brand-50 text-brand-600 [&>svg]:stroke-brand-600",
  blue: "bg-cf-blue-50 text-[#3574D4] [&>svg]:stroke-[#3574D4]",
  amber: "bg-cf-amber-50 text-[#916408] [&>svg]:stroke-[#916408]",
  red: "bg-cf-red-50 text-[#A82B2B] [&>svg]:stroke-[#A82B2B]",
  muted: "bg-muted text-muted-foreground [&>svg]:stroke-current",
} as const

type StatTone = keyof typeof statIconTone

function StatCardIcon({
  className,
  tone = "brand",
  "aria-hidden": ariaHidden = true,
  ...props
}: React.ComponentProps<"div"> & { tone?: StatTone }) {
  return (
    <div
      data-slot="stat-card-icon"
      aria-hidden={ariaHidden}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-[9px] [&_svg]:pointer-events-none",
        statIconTone[tone],
        className
      )}
      {...props}
    />
  )
}

function StatCardLabel({
  className,
  id,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-card-label"
      id={id}
      className={cn(
        "text-[11px] font-bold tracking-[0.06em] text-muted-foreground uppercase",
        className
      )}
      {...props}
    />
  )
}

function StatCardValue({
  className,
  "aria-labelledby": ariaLabelledby,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-card-value"
      aria-labelledby={ariaLabelledby}
      className={cn(
        "mt-1 font-heading text-[32px] leading-none font-black tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function StatCardTrend({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-card-trend"
      className={cn(
        "mt-2.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  StatCard,
  StatCardHeader,
  StatCardIcon,
  StatCardLabel,
  StatCardTrend,
  StatCardValue,
}
