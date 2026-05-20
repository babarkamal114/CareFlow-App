import { cva, type VariantProps } from "class-variance-authority"

/** CareFlow `Card` — aligned with `careflow_components.html` `.card*` */
export const cardVariants = cva(
  "group/card flex flex-col gap-4 overflow-hidden text-sm text-card-foreground outline-none has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
  {
   variants: {
  variant: {
      default:
        "rounded-xl border border-gray-200 bg-white shadow-sm",

      elevated:
        "rounded-xl border border-gray-200 bg-white shadow-md",

      interactive:
        "cursor-pointer rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-[1px]",

      selected:
        "rounded-xl border border-green-600 bg-white ring-2 ring-green-600/20 shadow-sm",
    },
      density: {
        default: "gap-4 py-4 has-data-[slot=card-footer]:pb-0",
        sm: "gap-3 py-3 has-data-[slot=card-footer]:pb-0",
      },
    },
    defaultVariants: {
      variant: "default",
      density: "default",
    },
  }
)

export type CardVariants = VariantProps<typeof cardVariants>
