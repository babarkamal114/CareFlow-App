import { tv, type VariantProps } from "tailwind-variants"

/** Status / meta badges — aligned with HTML `.badge-*` palette */
export const badgeVariants = tv({
  base: "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold leading-4",
  variants: {
    tone: {
      neutral: "bg-cf-surface-muted text-cf-ink-60",
      success: "bg-brand-50 text-brand-700",
      info: "bg-cf-blue-50 text-[#2258A6]",
      warning: "bg-cf-amber-50 text-[#916408]",
      danger: "bg-cf-red-50 text-[#A82B2B]",
      'pastel-success': "bg-success/20"
    },
  },
  defaultVariants: {
    tone: "neutral",
  },
})

export type BadgeVariants = VariantProps<typeof badgeVariants>
