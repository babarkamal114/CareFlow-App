"use client"

import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import * as React from "react"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, Button } from @/components/ui

function AlertDialogDemo(): React.ReactElement {
  const [open, setOpen] = React.useState(false)
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="destructive" />}>
        Open alert
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Archive record?</AlertDialogTitle>
          <AlertDialogDescription>
            This action removes it from active dashboards.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => setOpen(false)}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const meta = {
  title: "UI/Alert Dialog",
  component: AlertDialogDemo,
  parameters: {
    controls: { expanded: true },
  },
} satisfies Meta<typeof AlertDialogDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
