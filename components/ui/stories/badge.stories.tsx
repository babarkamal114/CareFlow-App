import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ArrowUpIcon, CheckIcon, PlusIcon } from "lucide-react"
import * as React from "react"

import { Badge } from "ui-components"

const meta = {
  title: "UI/Badge",
  component: Badge,
  parameters: { controls: { expanded: true } },
  args: { children: "Badge", variant: "default", dot: false },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default","secondary","outline",
        "solidSuccess","solidInfo","solidWarning","solidDanger","solidMuted",
        "softSuccess","softInfo","softWarning","softDanger","softMuted",
        "outlineSuccess","outlineInfo","outlineWarning","outlineDanger","outlineMuted",
      ],
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const SolidBadges: Story = {
  name: "Solid Badges",
  render: () => (
    <div className="rounded-xl border bg-background p-6">
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Solid Badges
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="solidSuccess">Success</Badge>
        <Badge variant="solidInfo">Info</Badge>
        <Badge variant="solidWarning">Warning</Badge>
        <Badge variant="solidDanger">Error</Badge>
        <Badge variant="solidMuted">Neutral</Badge>
        <Badge variant="solidSuccess" badgeSize="lg">Large badge</Badge>
        <Badge variant="solidSuccess" shape="pill">Pill shape</Badge>
      </div>
    </div>
  ),
}

export const SoftBadges: Story = {
  name: "Soft Badges (Most Common)",
  render: () => (
    <div className="rounded-xl border bg-background p-6">
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Soft Badges (Most Common)
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="softSuccess" dot>Active</Badge>
        <Badge variant="softInfo" dot>In progress</Badge>
        <Badge variant="softWarning" dot>Pending</Badge>
        <Badge variant="softDanger" dot>Failed</Badge>
        <Badge variant="softMuted" dot>Draft</Badge>
        <Badge variant="softSuccess">
          <CheckIcon className="size-3" />
          Verified
        </Badge>
        <Badge variant="softSuccess">
          <ArrowUpIcon className="size-3" />
          8.2%
        </Badge>
      </div>
    </div>
  ),
}

export const OutlineBadges: Story = {
  name: "Outline Badges",
  render: () => (
    <div className="rounded-xl border bg-background p-6">
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Outline Badges
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outlineSuccess">Success</Badge>
        <Badge variant="outlineInfo">Info</Badge>
        <Badge variant="outlineWarning">Warning</Badge>
        <Badge variant="outlineDanger">Error</Badge>
        <Badge variant="outlineMuted">Neutral</Badge>
      </div>
    </div>
  ),
}

export const Chips: Story = {
  name: "Chips (Removable Tags)",
  render: () => {
    const [tags, setTags] = React.useState([
      { id: "1", label: "Personal care", active: false },
      { id: "2", label: "Morning shift", active: false },
      { id: "3", label: "Medication", active: false },
      { id: "4", label: "Dementia support", active: true },
    ])

    function remove(id: string) {
      setTags((prev) => prev.filter((t) => t.id !== id))
    }

    return (
      <div className="rounded-xl border bg-background p-6">
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Chips (Removable Tags)
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                tag.active
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border bg-background text-foreground"
              }`}
            >
              {tag.active && <CheckIcon className="size-3" />}
              {tag.label}
              <button
                onClick={() => remove(tag.id)}
                className="ml-0.5 flex size-3.5 items-center justify-center rounded-full opacity-50 hover:opacity-100"
                aria-label={`Remove ${tag.label}`}
              >
                ×
              </button>
            </span>
          ))}
          <button className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2.5 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary">
            <PlusIcon className="size-3" />
            Add tag
          </button>
        </div>
      </div>
    )
  },
}
