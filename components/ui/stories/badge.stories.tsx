import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Badge } from @/components/ui

const meta = {
  title: "UI/Badge",
  component: Badge,
  parameters: {
    controls: { expanded: true },
  },
  args: {
    children: "Badge",
    variant: "default",
    dot: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "outline", "softSuccess", "softInfo", "softWarning", "softDanger"],
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      <Badge {...args} variant="default">Default</Badge>
      <Badge {...args} variant="secondary">Secondary</Badge>
      <Badge {...args} variant="outline">Outline</Badge>
      <Badge {...args} variant="softSuccess">Success</Badge>
      <Badge {...args} variant="softInfo">Info</Badge>
      <Badge {...args} variant="softWarning">Warning</Badge>
      <Badge {...args} variant="softDanger">Danger</Badge>
    </div>
  ),
}

export const WithDot: Story = {
  render: () => <Badge variant="softSuccess" dot>Live</Badge>,
}
