import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from @/components/ui

const meta = {
  title: "UI/Select",
  component: Select,
  parameters: {
    controls: { expanded: true },
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => (
    <Select defaultValue="all">
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Choose status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All statuses</SelectItem>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="scheduled">Scheduled</SelectItem>
        <SelectItem value="missed">Missed</SelectItem>
      </SelectContent>
    </Select>
  ),
}
