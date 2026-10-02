import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from @/components/ui

const meta = {
  title: "UI/Dropdown Menu",
  component: DropdownMenu,
  parameters: {
    controls: { expanded: true },
  },
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Actions
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
        <DropdownMenuItem>Mark complete</DropdownMenuItem>
        <DropdownMenuItem>Reschedule</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Cancel visit</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
