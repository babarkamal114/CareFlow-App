"use client"

import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { AlertTriangleIcon, CircleAlertIcon } from "lucide-react"
import * as React from "react"

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Label,
  Input
} from 'ui-components'

// ---------------------------------------------------------------------------
// Playground (original)
// ---------------------------------------------------------------------------
function DialogDemo(): React.ReactElement {
  const [open, setOpen] = React.useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Open dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Visit details</DialogTitle>
          <DialogDescription>Review and confirm changes.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Confirmation Dialog (Destructive)
// ---------------------------------------------------------------------------
function ConfirmationDestructiveDemo(): React.ReactElement {
  const [open, setOpen] = React.useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="destructive" />}>
        Delete patient record
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <div className="flex items-start gap-3">
            <AlertTriangleIcon className="mt-0.5 size-5 shrink-0 text-destructive" />
            <div className="flex flex-col gap-1">
              <DialogTitle>Delete patient record?</DialogTitle>
              <DialogDescription>
                This will permanently remove Margaret Johnson's profile, visit
                history, and all care plans. This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Warning callout */}
        <div className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/8 px-3.5 py-3 text-sm">
          <CircleAlertIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
          <div>
            <p className="font-semibold text-destructive">
              14 scheduled visits will be affected
            </p>
            <p className="text-destructive/80">
              Removing this patient will unassign 14 upcoming visits over the
              next 4 weeks.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => setOpen(false)}>
            Delete patient
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Form Dialog (Large) — Add new visit
// ---------------------------------------------------------------------------
function FormDialogLargeDemo(): React.ReactElement {
  const [open, setOpen] = React.useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Add new visit</DialogTrigger>
      <DialogContent className="sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle>Add new visit</DialogTitle>
          <DialogDescription>
            Schedule a new care visit for an existing patient.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {/* Patient */}
          <div className="flex flex-col gap-1.5">
            <Label>
              Patient <span className="text-destructive">*</span>
            </Label>
            <Select defaultValue="margaret">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="margaret">Margaret Johnson</SelectItem>
                <SelectItem value="james">James Carter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Visit type */}
          <div className="flex flex-col gap-1.5">
            <Label>
              Visit type <span className="text-destructive">*</span>
            </Label>
            <Select defaultValue="personal">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal care</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="social">Social</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <Label>
              Date <span className="text-destructive">*</span>
            </Label>
            <Input type="date" defaultValue="2026-04-02" />
          </div>

          {/* Time */}
          <div className="flex flex-col gap-1.5">
            <Label>
              Time <span className="text-destructive">*</span>
            </Label>
            <Input type="time" defaultValue="08:00" />
          </div>

          {/* Assigned carer — full width */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <Label>Assigned carer</Label>
            <Select defaultValue="sarah">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sarah">
                  <span className="flex items-center gap-2">
                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      SW
                    </span>
                    <span>
                      Sarah Williams
                      <span className="ml-1.5 text-xs text-muted-foreground">
                        Available · 3.4 mi away
                      </span>
                    </span>
                  </span>
                </SelectItem>
                <SelectItem value="john">John Smith</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes — full width */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <Label>Notes for carer</Label>
            <Textarea
              placeholder="Any special instructions…"
              className="min-h-20 resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Save as draft
          </Button>
          <Button onClick={() => setOpen(false)}>Schedule visit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------
const meta = {
  title: "UI/Dialog",
  component: DialogDemo,
  parameters: {
    controls: { expanded: true },
  },
} satisfies Meta<typeof DialogDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const ConfirmationDestructive: Story = {
  name: "Confirmation Dialog (Destructive)",
  render: () => <ConfirmationDestructiveDemo />,
}

export const FormDialogLarge: Story = {
  name: "Form Dialog (Large)",
  render: () => <FormDialogLargeDemo />,
}
