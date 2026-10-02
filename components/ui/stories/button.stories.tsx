import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Button } from @/components/ui

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
