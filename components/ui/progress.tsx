"use client"

import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import * as React from "react"

import { cn } from "lib"

type TrackSize = "sm" | "default" | "lg"
type BarColor = string

const ProgressTrackSizeContext = React.createContext<TrackSize>("default")

function Progress({
  className,
  children,
  value,
  trackSize = "default",
  ...props
}: ProgressPrimitive.Root.Props & {
  /** Bar height — HTML `.progress` / `.progress-sm` / `.progress-lg` */
  trackSize?: TrackSize
}) {
  return (
    <ProgressTrackSizeContext.Provider value={trackSize}>
      <ProgressPrimitive.Root
        value={value}
        data-slot="progress"
        data-track-size={trackSize}
        className={cn("flex flex-wrap gap-3", className)}
        {...props}
      >
        {children == null ? (
          <ProgressTrack>
            <ProgressIndicator />
          </ProgressTrack>
        ) : (
          children
        )}
      </ProgressPrimitive.Root>
    </ProgressTrackSizeContext.Provider>
  )
}

function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  const trackSize = React.useContext(ProgressTrackSizeContext)
  return (
    <ProgressPrimitive.Track
      className={cn(
        "relative flex w-full items-center overflow-x-hidden rounded bg-muted",
        trackSize === "sm" && "h-1",
        trackSize === "default" && "h-2",
        trackSize === "lg" && "h-3",
        className
      )}
      data-slot="progress-track"
      {...props}
    />
  )
}

function ProgressIndicator({
  className,
  ...props
}: ProgressPrimitive.Indicator.Props) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn("h-full rounded-sm bg-primary transition-all", className)}
      {...props}
    />
  )
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      className={cn("text-sm font-medium", className)}
      data-slot="progress-label"
      {...props}
    />
  )
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      className={cn(
        "ml-auto text-sm text-muted-foreground tabular-nums",
        className
      )}
      data-slot="progress-value"
      {...props}
    />
  )
}

export {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
}
