"use client"

import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import * as React from "react"

import { Button, Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from @/components/ui

function SheetDemo(): React.ReactElement {
  const [open, setOpen] = React.useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="secondary" />}>Open sheet</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Quick notes</SheetTitle>
          <SheetDescription>Add handover notes for next shift.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

const meta = {
  title: "UI/Sheet",
  component: SheetDemo,
  parameters: {
    controls: { expanded: true },
  },
} satisfies Meta<typeof SheetDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
