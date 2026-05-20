"use client"

import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Avatar, 
  AvatarFallback,
  Label,
  Textarea
} from 'ui-components'

const meta = {
  title: "UI/Select",
  component: Select,
  parameters: { controls: { expanded: true } },
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

export const SelectVariants: Story = {
  name: "Select Variants",
  render: () => (
    <div className="rounded-xl border bg-background p-6">
      <p className="mb-5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Select Variants
      </p>
      <div className="grid grid-cols-3 gap-6">
        {/* Role — basic */}
        <div className="flex flex-col gap-1.5">
          <Label>Role</Label>
          <Select defaultValue="cc">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cc">Care Coordinator</SelectItem>
              <SelectItem value="carer">Carer</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Multi-select preview (static chips) */}
        <div className="flex flex-col gap-1.5">
          <Label>Multi-select (preview)</Label>
          <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm">
            {["Morning", "Evening"].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium"
              >
                {tag}
                <button className="opacity-60 hover:opacity-100">×</button>
              </span>
            ))}
            <span className="text-muted-foreground">Add...</span>
          </div>
        </div>

        {/* Custom option with avatar */}
        <div className="flex flex-col gap-1.5">
          <Label>Custom option (with avatar)</Label>
          <Select defaultValue="ec">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ec">
                <span className="flex items-center gap-2">
                  <Avatar size="xs" shape="round">
                    <AvatarFallback className="bg-primary/20 text-primary text-[9px]">
                      EC
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex flex-col">
                    <span className="text-[13px] font-medium">Emma Clarke</span>
                    <span className="text-[11px] text-muted-foreground">
                      Care Coordinator
                    </span>
                  </span>
                </span>
              </SelectItem>
              <SelectItem value="sw">Sarah Williams</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  ),
}

export const TextareaVariants: Story = {
  name: "Textarea",
  render: () => (
    <div className="rounded-xl border bg-background p-6">
      <p className="mb-5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Textarea
      </p>
      <div className="grid grid-cols-2 gap-6">
        {/* Empty with helper */}
        <div className="flex flex-col gap-1.5">
          <Label>Visit notes</Label>
          <Textarea placeholder="Record your observations..." className="min-h-28 resize-none" />
          <p className="text-xs text-muted-foreground">Voice-to-text supported</p>
        </div>

        {/* Filled with character count */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label>Visit notes</Label>
            <span className="text-xs text-muted-foreground">142 / 500</span>
          </div>
          <Textarea
            className="min-h-28 resize-none"
            defaultValue="Mrs Johnson was in good spirits today. She ate her full breakfast and took all morning medications without issue. Noticed slight bruising on left forearm — photo attached. No concerns raised."
          />
          <p className="text-xs text-muted-foreground">Keep notes factual and objective</p>
        </div>
      </div>
    </div>
  ),
}
