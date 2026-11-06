"use client"

import * as React from "react"

import { cn } from "lib"

type LabelProps = React.ComponentProps<"label"> & {
  required?: boolean
  optional?: boolean
}

function Label({
  className,
  required,
  optional,
  children,
  htmlFor,
  ...props
}: LabelProps) {
  return (
    <label
      data-slot="label"
      htmlFor={htmlFor}
      className={cn(
        "flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[13px] leading-none font-semibold text-foreground select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        htmlFor && "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
      {required ? (
        <span className="text-destructive" aria-hidden>
          *
        </span>
      ) : null}
      {optional ? (
        <span className="text-xs font-normal text-muted-foreground">
          (optional)
        </span>
      ) : null}
    </label>
  )
}

export { Label }
