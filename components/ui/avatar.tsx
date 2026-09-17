"use client"

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"
import * as React from "react"

import { cn } from "lib"

type AvatarSize = "xs" | "sm" | "default" | "lg" | "xl"
type AvatarShape = "square" | "round"

function avatarDimensionClass(size: AvatarSize) {
  switch (size) {
    case "xs":
      return "size-6 text-[9px]"
    case "sm":
      return "size-8 text-[11px]"
    case "default":
      return "size-10 text-[13px]"
    case "lg":
      return "size-14 text-lg"
    case "xl":
      return "size-20 text-[26px]"
    default:
      return "size-10 text-[13px]"
  }
}

function avatarRadiusClass(size: AvatarSize, shape: AvatarShape) {
  if (shape === "round") {
    return "rounded-full after:rounded-full"
  }
  switch (size) {
    case "xs":
      return "rounded-md after:rounded-md"
    case "sm":
      return "rounded-lg after:rounded-lg"
    case "default":
      return "rounded-[10px] after:rounded-[10px]"
    case "lg":
      return "rounded-xl after:rounded-xl"
    case "xl":
      return "rounded-2xl after:rounded-2xl"
    default:
      return "rounded-[10px] after:rounded-[10px]"
  }
}

function Avatar({
  className,
  size = "default",
  shape = "square",
  ...props
}: AvatarPrimitive.Root.Props & {
  size?: AvatarSize
  /** HTML default: rounded rect; use `round` for `.avatar-round`. */
  shape?: AvatarShape
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      data-shape={shape}
      className={cn(
        "group/avatar relative flex shrink-0 select-none overflow-hidden font-bold after:pointer-events-none after:absolute after:inset-0 after:border after:border-border after:mix-blend-darken dark:after:mix-blend-lighten",
        avatarDimensionClass(size),
        avatarRadiusClass(size, shape),
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center bg-muted text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background select-none",
        "group-data-[size=xs]/avatar:size-2 group-data-[size=xs]/avatar:[&>svg]:hidden",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        "group-data-[size=xl]/avatar:size-3.5 group-data-[size=xl]/avatar:[&>svg]:size-2.5",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=xs]/avatar-group:size-6 group-has-data-[size=xs]/avatar-group:text-[10px] group-has-data-[size=sm]/avatar-group:size-8 group-has-data-[size=sm]/avatar-group:text-xs group-has-data-[size=lg]/avatar-group:size-14 group-has-data-[size=lg]/avatar-group:text-base group-has-data-[size=xl]/avatar-group:size-20 group-has-data-[size=xl]/avatar-group:text-lg [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3 group-has-data-[size=xs]/avatar-group:[&>svg]:size-2.5",
        className
      )}
      {...props}
    />
  )
}

/** HTML `.avatar-wrap` — positions `AvatarStatus` relative to an avatar. */
function AvatarWrap({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-wrap"
      className={cn("relative inline-flex align-middle", className)}
      {...props}
    />
  )
}

const avatarStatusTone = {
  brand: "bg-primary",
  blue: "bg-cf-blue-500",
  amber: "bg-cf-amber-500",
  red: "bg-destructive",
  muted: "bg-muted-foreground/50",
} as const

/** HTML `.avatar-status` — presence / state dot. */
function AvatarStatus({
  className,
  tone = "brand",
  ...props
}: React.ComponentProps<"span"> & {
  tone?: keyof typeof avatarStatusTone
}) {
  return (
    <span
      data-slot="avatar-status"
      className={cn(
        "pointer-events-none absolute -right-0.5 -bottom-0.5 z-10 size-3 rounded-full border-2 border-background",
        avatarStatusTone[tone],
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  AvatarStatus,
  AvatarWrap,
}
