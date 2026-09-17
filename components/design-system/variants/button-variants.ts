import { tv, type VariantProps } from "tailwind-variants"

/**
 * CareFlow button scale from `careflow_components.html` §01:
 * xs 28px, sm 32px, default 40px, lg 44px, xl 52px.
 */
export const buttonVariants = tv({
  base: "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-clip-padding font-medium whitespace-nowrap outline-none select-none transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px motion-reduce:transition-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
      /** Neutral bordered (shadcn-style) */
      outline:
        "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
      /** Brand outline — `.btn-outline` in HTML */
      brandOutline:
        "border border-primary bg-transparent text-primary hover:bg-brand-50 aria-expanded:bg-brand-50",
      ghost:
        "text-muted-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
      /** Solid red — `.btn-destructive` in HTML */
      destructive:
        "bg-destructive text-white hover:bg-[#B83838] focus-visible:border-destructive focus-visible:ring-destructive/25",
      /** Soft destructive for dense UI (previous shadcn-style) */
      destructiveMuted:
        "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
      link:
        "h-auto rounded-none border-0 bg-transparent px-0 py-0 text-primary underline-offset-[3px] hover:text-brand-700 hover:underline focus-visible:rounded-sm focus-visible:ring-[3px] focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        'outline-muted': 'border border-gray-200 dark:border-gray-700 bg-transparent text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
    },
    size: {
      xs: "h-7 gap-1 rounded-md px-2.5 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
      sm: "h-8 gap-1.5 rounded-md px-3 text-[0.8125rem] has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
      default:
        "h-10 gap-1.5 px-4 text-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
      lg: "h-11 gap-1.5 px-4 text-[0.9375rem] has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
      xl: "h-[52px] gap-2 rounded-cf-lg px-6 text-base has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
      icon: "size-10 rounded-lg p-0",
      "icon-xs": "size-7 rounded-md p-0 [&_svg:not([class*='size-'])]:size-3",
      "icon-sm": "size-8 rounded-md p-0 [&_svg:not([class*='size-'])]:size-3.5",
      "icon-lg": "size-11 rounded-lg p-0",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

export type ButtonVariants = VariantProps<typeof buttonVariants>
