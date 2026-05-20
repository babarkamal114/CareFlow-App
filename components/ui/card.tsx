import * as React from "react"

import {
  type CardVariants,
  cardVariants,
} from "variants"
import { cn } from "lib"

export type CardProps = React.ComponentProps<"div"> &
  Omit<CardVariants, "density"> & {
    size?: "default" | "sm"
    /**
     * When `variant="interactive"` and `onClick` is set, the card is keyboard-activatable
     * (`Enter` / `Space`) and exposes `role="button"`.
     */
    disabled?: boolean
  }

function Card({
  className,
  size = "default",
  variant = "default",
  disabled = false,
  onClick,
  onKeyDown,
  tabIndex,
  role,
  ...props
}: CardProps) {
  const isPressable =
    variant === "interactive" &&
    typeof onClick === "function" &&
    !disabled

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e)
      if (e.defaultPrevented || !isPressable) return
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        onClick(
          e as unknown as React.MouseEvent<HTMLDivElement>
        )
      }
    },
    [isPressable, onClick, onKeyDown]
  )

  const resolvedTabIndex = disabled
    ? -1
    : isPressable
      ? (tabIndex ?? 0)
      : tabIndex

  const resolvedRole = isPressable ? (role ?? "button") : role

  return (
    <div
      data-slot="card"
      data-size={size}
      data-variant={variant}
      data-disabled={disabled ? "" : undefined}
      aria-disabled={disabled ? true : undefined}
      className={cn(
        "transition-all duration-200",
        cardVariants({ variant, density: size }),
        disabled && "pointer-events-none opacity-60",
        className
      )}
      onClick={disabled ? undefined : onClick}
      onKeyDown={isPressable ? handleKeyDown : onKeyDown}
      tabIndex={resolvedTabIndex}
      role={resolvedRole}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4 group-data-[size=sm]/card:px-3", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/card:p-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cardVariants,
}
export type { CardVariants }
