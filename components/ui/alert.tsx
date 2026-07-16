'use client'

import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "group/alert relative flex w-full gap-3 rounded-[10px] border px-4 py-3.5 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-14",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-card-foreground",
        destructive:
          "border-destructive/30 bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90",
        success:
          "border-brand-200 bg-brand-50 text-brand-700 *:data-[slot=alert-description]:text-cf-ink-60",
        info: "border-[#BFD5F0] bg-cf-blue-50 text-[#2258A6] *:data-[slot=alert-description]:text-cf-ink-60",
        warning:
          "border-[#F2D98A] bg-cf-amber-50 text-[#916408] *:data-[slot=alert-description]:text-cf-ink-60",
        error:
          "border-[#F2B0B0] bg-cf-red-50 text-[#A82B2B] *:data-[slot=alert-description]:text-cf-ink-60",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const alertIconVariants = cva(
  "mt-px flex size-5 shrink-0 items-center justify-center rounded-full [&>svg]:size-3.5 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        success: "bg-primary text-primary-foreground",
        info: "bg-cf-blue-500 text-white",
        warning: "bg-cf-amber-500 text-white",
        error: "bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

const AlertContext = React.createContext<{ variant: NonNullable<VariantProps<typeof alertVariants>["variant"]> }>({
  variant: "default",
})

function Alert({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  const resolvedVariant = variant ?? "default"
  return (
    <AlertContext.Provider value={{ variant: resolvedVariant }}>
      <div
        data-slot="alert"
        role="alert"
        className={cn(alertVariants({ variant: resolvedVariant }), className)}
        {...props}
      />
    </AlertContext.Provider>
  )
}

function AlertIcon({
  className,
  "aria-hidden": ariaHidden = true,
  ...props
}: React.ComponentProps<"div">) {
  const { variant } = React.useContext(AlertContext)
  return (
    <div
      data-slot="alert-icon"
      aria-hidden={ariaHidden}
      className={cn(alertIconVariants({ variant }), className)}
      {...props}
    />
  )
}

/** Stacks title + description beside `AlertIcon` (HTML `.alert-content`). */
function AlertContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-content"
      className={cn("flex min-w-0 flex-1 flex-col gap-0.5", className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "min-w-0 text-[13px] font-bold tracking-tight [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "mt-0.5 text-[12.5px] leading-normal text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-3",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn(
        "absolute top-2 right-2 flex items-center gap-1 [&_button]:outline-none [&_button]:focus-visible:ring-[3px] [&_button]:focus-visible:ring-ring/50 [&_button]:focus-visible:ring-offset-2 [&_button]:focus-visible:ring-offset-background",
        className
      )}
      {...props}
    />
  )
}

export {
  Alert,
  AlertAction,
  AlertContent,
  AlertDescription,
  AlertIcon,
  alertIconVariants,
  AlertTitle,
}
