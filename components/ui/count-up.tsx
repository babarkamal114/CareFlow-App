// components/ui/count-up.tsx
// Animates a number counting up from 0 to its target value on mount.
// Matches the "count-up stats" animation already used on the Scheduling page.

"use client"

import { useEffect, useState } from "react"
import { animate } from "framer-motion"

export interface CountUpProps {
  value: number
  duration?: number // seconds
  format?: (value: number) => string
  className?: string
}

function CountUp({ value, duration = 0.8, format, className }: CountUpProps) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(latest),
    })
    return () => controls.stop()
  }, [value, duration])

  return <span className={className}>{format ? format(display) : Math.round(display)}</span>
}

export { CountUp }
