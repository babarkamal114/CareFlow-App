import { Input as InputPrimitive } from "@base-ui/react/input"
import * as React from "react"
import type { VariantProps } from "tailwind-variants"

import { inputVariants } from "variants"
import { cn } from "lib"

type InputProps = Omit<React.ComponentProps<typeof InputPrimitive>, "size"> &
  VariantProps<typeof inputVariants> & {
    state?: VariantProps<typeof inputVariants>["state"]
  }

function Input({ className, type, size, state, ...props }: InputProps) {
  const invalid =
    props["aria-invalid"] === true || props["aria-invalid"] === "true"
  const resolvedState = state ?? (invalid ? "error" : "default")

  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(inputVariants({ size, state: resolvedState }), className)}
      {...props}
    />
  )
}

export { Input, inputVariants }
export type { InputProps }
