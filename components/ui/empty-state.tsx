import * as React from "react"

import { cn } from "lib"

export type EmptyStateProps = React.ComponentProps<"div"> & {
  icon?: React.ReactNode
  title: string
  description?: string
  children?: React.ReactNode
}

function EmptyState({
  className,
  icon,
  title,
  description,
  children,
  ...props
}: EmptyStateProps) {
  const titleId = React.useId()
  const descriptionId = React.useId()

  return (
    <div
      data-slot="empty-state"
      role="status"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center outline-none transition-[border-color,background-color,box-shadow] duration-200 focus-within:ring-[3px] focus-within:ring-ring/30 focus-within:ring-offset-2 focus-within:ring-offset-background",
        className
      )}
      {...props}
    >
      {icon ? (
        <div
          className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:pointer-events-none [&_svg]:size-6"
          aria-hidden
        >
          {icon}
        </div>
      ) : null}
      <h3
        id={titleId}
        className="font-heading text-cf-h5 font-bold text-foreground"
      >
        {title}
      </h3>
      {description ? (
        <p
          id={descriptionId}
          className="mt-2 max-w-[42ch] text-sm text-muted-foreground"
        >
          {description}
        </p>
      ) : null}
      {children ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {children}
        </div>
      ) : null}
    </div>
  )
}

export { EmptyState }
