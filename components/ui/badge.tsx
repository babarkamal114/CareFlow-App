import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "lib";

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-md whitespace-nowrap font-semibold outline-none transition-[color,background-color,border-color,box-shadow] duration-150 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-primary px-2 py-0.5 text-xs text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "border border-transparent bg-secondary px-2 py-0.5 text-xs text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "border border-transparent bg-destructive/10 px-2 py-0.5 text-xs text-destructive dark:bg-destructive/20 [a]:hover:bg-destructive/20",
        outline:
          "border border-border px-2 py-0.5 text-xs text-foreground [a]:hover:bg-muted",
        ghost: "border border-transparent px-2 py-0.5 text-xs hover:bg-muted",
        link: "border-0 bg-transparent px-2 py-0.5 text-xs text-primary underline-offset-4 hover:underline",
        solidSuccess:
          "rounded-md border-0 bg-primary px-2.5 py-0.5 text-[11.5px] leading-4 text-primary-foreground",
        solidInfo:
          "rounded-md border-0 bg-cf-blue-500 px-2.5 py-0.5 text-[11.5px] leading-4 text-white",
        solidWarning:
          "rounded-md border-0 bg-cf-amber-500 px-2.5 py-0.5 text-[11.5px] leading-4 text-white",
        solidDanger:
          "rounded-md border-0 bg-destructive px-2.5 py-0.5 text-[11.5px] leading-4 text-destructive-foreground",
        solidMuted:
          "rounded-md border-0 bg-cf-ink-80 px-2.5 py-0.5 text-[11.5px] leading-4 text-white",
        softSuccess:
          "rounded-md border-0 bg-brand-50 px-2.5 py-0.5 text-[11.5px] leading-4 text-brand-700",
        softInfo:
          "rounded-md border-0 bg-cf-blue-50 px-2.5 py-0.5 text-[11.5px] leading-4 text-[#2258A6]",
        softWarning:
          "rounded-md border-0 bg-cf-amber-50 px-2.5 py-0.5 text-[11.5px] leading-4 text-[#916408]",
        softDanger:
          "rounded-md border-0 bg-cf-red-50 px-2.5 py-0.5 text-[11.5px] leading-4 text-[#A82B2B]",
        softMuted:
          "rounded-md border-0 bg-cf-surface-muted px-2.5 py-0.5 text-[11.5px] leading-4 text-cf-ink-60",
        outlineSuccess:
          "rounded-md border border-brand-200 bg-transparent px-2.5 py-0.5 text-[11.5px] leading-4 text-brand-700",
        outlineInfo:
          "rounded-md border border-[#BFD5F0] bg-transparent px-2.5 py-0.5 text-[11.5px] leading-4 text-[#2258A6]",
        outlineWarning:
          "rounded-md border border-[#F2D98A] bg-transparent px-2.5 py-0.5 text-[11.5px] leading-4 text-[#916408]",
        outlineDanger:
          "rounded-md border border-[#F2B0B0] bg-transparent px-2.5 py-0.5 text-[11.5px] leading-4 text-[#A82B2B]",
        outlineMuted:
          "rounded-md border border-border bg-transparent px-2.5 py-0.5 text-[11.5px] leading-4 text-cf-ink-60",
        "pastel-success": "bg-green-300/20 text-green-600 dark:text-green-400",
        "pastel-warning":
          "bg-yellow-300/10 text-yellow-600 dark:text-yellow-400",
        "pastel-info": "bg-blue-300/10 text-blue-600 dark:text-blue-400",
        "pastel-danger": "bg-red-300/10 text-red-600 dark:text-red-400",
        "pastel-purple":
          "bg-purple-300/10 text-purple-600 dark:text-purple-400",
        "pastel-pink": "bg-pink-300/10 text-pink-600 dark:text-pink-400",
        "pastel-indigo":
          "bg-indigo-300/10 text-indigo-600 dark:text-indigo-400",
        "pastel-teal": "bg-teal-300/10 text-teal-600 dark:text-teal-400",
        "pastel-orange":
          "bg-orange-300/10 text-orange-600 dark:text-orange-400",
        "pastel-cyan": "bg-cyan-300/10 text-cyan-600 dark:text-cyan-400",
        "pastel-lime": "bg-lime-300/10 text-lime-600 dark:text-lime-400",
        "pastel-amber": "bg-amber-300/10 text-amber-600 dark:text-amber-400",
        "pastel-emerald":
          "bg-emerald-300/10 text-emerald-600 dark:text-emerald-400",
        "pastel-rose": "bg-rose-300/10 text-rose-600 dark:text-rose-400",
        "pastel-neutral": "bg-gray-300/10 text-gray-600 dark:text-gray-400",
        "pastel-slate": "bg-slate-300/10 text-slate-600 dark:text-slate-400",
        "pastel-stone": "bg-stone-300/10 text-stone-600 dark:text-stone-400",
        "pastel-zinc": "bg-zinc-300/10 text-cf-ink-60 dark:text-zinc-400",
      },
      badgeSize: {
        default: "",
        sm: 'text-[10px] px-1',
        md: 'text-[13px] px-2  flex items-center gap-1',
        lg: " px-4 py-1 text-[15px] ",
        icon: 'p-2'
      },
      shape: {
        rounded: "rounded ",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      badgeSize: "default",
      shape: "rounded",
    },
  },
);

type BadgeProps = useRender.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    /** Leading status dot (HTML `.badge-dot`) */
    dot?: boolean;
  };

function Badge({
  className,
  variant = "default",
  badgeSize,
  shape,
  dot,
  render,
  children,
  ...props
}: BadgeProps) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant, badgeSize, shape }), className),
        children: (
          <>
            {dot ? (
              <span
                className="size-[5px] shrink-0 rounded-full bg-current opacity-90"
                aria-hidden
              />
            ) : null}
            {children}
          </>
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
export type { BadgeProps };
