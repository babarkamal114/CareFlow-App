import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { DownloadIcon, FilterIcon, PlusIcon, Trash2Icon, ArrowRightIcon } from "lucide-react"

import { Button } from "ui-components"

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    controls: { expanded: true },
  },
  args: {
    children: "Save changes",
    variant: "default",
    size: "default",
    loading: false,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "outline", "brandOutline", "ghost", "destructive", "destructiveMuted", "link"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg", "xl", "icon", "icon-xs", "icon-sm", "icon-lg"],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      <Button {...args} variant="default">Default</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="outline">Outline</Button>
      <Button {...args} variant="brandOutline">Brand Outline</Button>
      <Button {...args} variant="ghost">Ghost</Button>
      <Button {...args} variant="destructive">Destructive</Button>
      <Button {...args} variant="destructiveMuted">Destructive Muted</Button>
      <Button {...args} variant="link">Link</Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button {...args} size="xs">XS</Button>
      <Button {...args} size="sm">SM</Button>
      <Button {...args} size="default">Default</Button>
      <Button {...args} size="lg">LG</Button>
      <Button {...args} size="xl">XL</Button>
    </div>
  ),
}

export const States: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {/* Default — no extra props */}
      <Button {...args}>Default</Button>

      {/* Hover — force the hover pseudo-class via Storybook's data attribute trick */}
      <Button {...args} data-hover>Hover</Button>

      {/* Active */}
      <Button {...args} data-active>Active</Button>

      {/* Focused — autoFocus renders the button with a visible focus ring on mount */}
      <Button {...args} autoFocus>Focused</Button>

      {/* Disabled */}
      <Button {...args} disabled>Disabled</Button>

      {/* Loading */}
      <Button {...args} loading>Loading</Button>
    </div>
  ),
}

export const WithIcons: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button {...args} variant="default">
        <PlusIcon />
        New Visit
      </Button>

      <Button {...args} variant="secondary">
        <DownloadIcon />
        Download
      </Button>

      <Button {...args} variant="outline">
        <FilterIcon />
        Filter
        <span className="ml-1 inline-flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
          3
        </span>
      </Button>

      <Button {...args} variant="ghost">
        Next
        <ArrowRightIcon />
      </Button>

      <Button {...args} variant="destructive">
        <Trash2Icon />
        Delete
      </Button>
    </div>
  ),
}
