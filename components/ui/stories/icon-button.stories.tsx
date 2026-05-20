import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import {
  BellIcon,
  FilterIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react"

import { Button } from "ui-components"

const meta = {
  title: "UI/Icon Button",
  component: Button,
  parameters: { controls: { expanded: true }, layout: "centered" },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => (
    <Button size="icon-sm" variant="ghost" aria-label="Notifications">
      <BellIcon />
    </Button>
  ),
}

export const VariantsAndSizes: Story = {
  name: "Variants & Sizes",
  render: () => (
    <div className="rounded-xl border bg-background p-5">
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Variants &amp; Sizes
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {/* Ghost xs */}
        <Button size="icon-xs" variant="ghost" aria-label="Bell xs">
          <BellIcon />
        </Button>
        {/* Ghost sm */}
        <Button size="icon-sm" variant="ghost" aria-label="Bell sm">
          <BellIcon />
        </Button>
        {/* Ghost default */}
        <Button size="icon" variant="ghost" aria-label="Bell default">
          <BellIcon />
        </Button>

        {/* Outline */}
        <Button size="icon-sm" variant="outline" aria-label="Search">
          <SearchIcon />
        </Button>

        {/* Ghost filter */}
        <Button size="icon-sm" variant="ghost" aria-label="Filter">
          <FilterIcon />
        </Button>

        {/* Ghost more */}
        <Button size="icon-sm" variant="ghost" aria-label="More">
          <MoreHorizontalIcon />
        </Button>

        {/* Primary solid */}
        <Button size="icon-sm" variant="default" aria-label="Add">
          <PlusIcon />
        </Button>

        {/* Bell with notification badge */}
        <div className="relative">
          <Button size="icon-sm" variant="ghost" aria-label="Notifications with badge">
            <BellIcon />
          </Button>
          <span className="pointer-events-none absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white ring-2 ring-background">
            8
          </span>
        </div>
      </div>
    </div>
  ),
}

export const WithBadge: Story = {
  name: "With Notification Badge",
  render: () => (
    <div className="flex items-center gap-4">
      {[3, 12, 99].map((count) => (
        <div key={count} className="relative">
          <Button size="icon-sm" variant="ghost" aria-label={`${count} notifications`}>
            <BellIcon />
          </Button>
          <span className="pointer-events-none absolute -top-1.5 -right-1.5 flex min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold leading-4 text-white ring-2 ring-background">
            {count > 99 ? "99+" : count}
          </span>
        </div>
      ))}
    </div>
  ),
}
