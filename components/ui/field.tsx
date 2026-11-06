import * as React from "react"
import { cn } from "lib"

function Field({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field"
      className={cn(
        "flex min-w-[240px] max-w-full flex-col gap-1.5",
        className
      )}
      {...props}
    />
  )
}

type FieldDescriptionProps = React.ComponentProps<"p"> & {
  tone?: "default" | "error" | "success"
}

/** Helper line — HTML `.helper` / `.helper-error` / `.helper-success`. */
function FieldDescription({
  className,
  tone = "default",
  ...props
}: FieldDescriptionProps) {
  return (
    <p
      data-slot="field-description"
      data-tone={tone}
      className={cn(
        "flex items-center gap-1 text-xs leading-normal text-muted-foreground",
        tone === "error" && "text-destructive",
        tone === "success" && "text-primary",
        className
      )}
      {...props}
    />
  )
}

export { Field, FieldDescription }
