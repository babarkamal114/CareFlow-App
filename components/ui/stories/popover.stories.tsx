import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Button, Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from @/components/ui

const meta = {
  title: "UI/Popover",
  component: Popover,
  parameters: {
    controls: { expanded: true },
  },
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="secondary" />}>
        Open popover
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Patient summary</PopoverTitle>
          <PopoverDescription>Recent alerts and notes.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
}
