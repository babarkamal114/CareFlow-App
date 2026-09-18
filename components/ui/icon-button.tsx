"use client"

import * as React from "react"

import {
  type IconButtonVariants,
  iconButtonVariants,
} from "variants"
import { cn } from "lib"

export type IconButtonProps = React.ComponentProps<"button"> &
  IconButtonVariants & {
    "aria-label": string
  }

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        data-slot="icon-button"
        className={cn(iconButtonVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)
IconButton.displayName = "IconButton"

export { IconButton, iconButtonVariants }
