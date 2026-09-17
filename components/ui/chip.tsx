"use client"

import { XIcon } from "lucide-react"
import * as React from "react"
import { tv, type VariantProps } from "tailwind-variants"

import { cn } from "lib"

const chipVariants = tv({
  base: "inline-flex max-w-full items-center gap-1.5 rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-[13px] font-medium leading-tight motion-safe:transition-[background-color,border-color,color,box-shadow] motion-safe:duration-150",
  variants: {
    tone: {
      neutral: "border-border/60 bg-muted/50 text-foreground",
      success: "border-brand-200/80 bg-brand-50 text-brand-700",
      info: "border-cf-blue-200/80 bg-cf-blue-50 text-[#2258A6]",
      warning: "border-cf-amber-200/80 bg-cf-amber-50 text-[#916408]",
      danger: "border-red-200/80 bg-cf-red-50 text-[#A82B2B]",
    },
  },
  defaultVariants: {
    tone: "neutral",
  },
})

export type ChipProps = React.ComponentProps<"span"> &
  VariantProps<typeof chipVariants> & {
    onDismiss?: () => void
    dismissLabel?: string
    /** Announces the chip in SRs when it has a dismiss control (defaults to text children). */
    accessibleLabel?: string
  }

function Chip({
  className,
  tone,
  onDismiss,
  dismissLabel = "Remove",
  accessibleLabel,
  children,
  ...props
}: ChipProps) {
  const label =
    accessibleLabel ??
    (typeof children === "string" || typeof children === "number"
      ? String(children)
      : undefined)

  const groupLabel: string | undefined = onDismiss
    ? accessibleLabel
      ? `${accessibleLabel}, removable tag`
      : label
        ? `${label}, removable tag`
        : "Removable tag"
    : undefined

  return (
    <span
      data-slot="chip"
      role={onDismiss ? "group" : undefined}
      aria-label={groupLabel || undefined}
      className={cn(
        chipVariants({ tone }),
        onDismiss && "pl-3 pr-1",
        className
      )}
      {...props}
    >
      <span className="min-w-0 truncate">{children}</span>
      {onDismiss ? (
        <button
          type="button"
          className="inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black/10 text-foreground outline-none transition-[background-color,transform] hover:bg-black/15 focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95 motion-reduce:transition-none dark:bg-white/15 dark:hover:bg-white/25"
          onClick={(e) => {
            e.stopPropagation()
            onDismiss()
          }}
          aria-label={dismissLabel}
        >
          <XIcon className="pointer-events-none size-3 opacity-80" aria-hidden />
        </button>
      ) : null}
    </span>
  )
}

export { Chip, chipVariants }
