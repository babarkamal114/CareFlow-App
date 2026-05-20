import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { MoreHorizontalIcon } from "lucide-react"

import {
  Button,
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "ui-components"

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  parameters: { controls: { expanded: true }, layout: "centered" },
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

export const TooltipShowcase: Story = {
  name: "Tooltips",
  render: () => (
    <div className="rounded-xl border bg-background p-6">
      <p className="mb-5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Tooltips
      </p>
      <TooltipProvider>
        <div className="flex flex-wrap items-center gap-3">
          <Tooltip>
            <TooltipTrigger render={<Button size="sm" />}>Save changes</TooltipTrigger>
            <TooltipContent>Save changes</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger render={<Button size="sm" variant="secondary" />}>
              Visit details · 32 min
            </TooltipTrigger>
            <TooltipContent>Visit details · 32 min</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <span className="inline-flex cursor-default items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground" />
              }
            >
              On time
            </TooltipTrigger>
            <TooltipContent>On time</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  ),
}

export const PopoverKeyboardShortcut: Story = {
  name: "Popover — Keyboard Shortcut",
  render: () => (
    <div className="rounded-xl border bg-background p-6">
      <p className="mb-5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Popover
      </p>
      <Popover defaultOpen>
        <PopoverTrigger render={<Button variant="outline" />}>
          Show shortcut tip
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <PopoverHeader>
            <PopoverTitle>Keyboard shortcut</PopoverTitle>
            <PopoverDescription>
              Press{" "}
              <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[11px] font-mono">
                ⌘K
              </kbd>{" "}
              to open the command menu from anywhere.
            </PopoverDescription>
          </PopoverHeader>
          <Button size="sm" className="w-full">
            Got it
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  ),
}
