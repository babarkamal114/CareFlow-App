import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { MoreHorizontalIcon } from "lucide-react"

import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from @/components/ui

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  parameters: {
    controls: { expanded: true },
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="ghost" size="icon-sm" />}>
          <MoreHorizontalIcon />
        </TooltipTrigger>
        <TooltipContent>More options</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}
