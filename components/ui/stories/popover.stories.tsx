import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import {
  AlertTriangleIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  ClockIcon,
  InfoIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react"
import * as React from "react"

import {
  Button,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  Separator,
  Input,
  Label
} from 'ui-components'

const meta = {
  title: "UI/Popover",
  component: Popover,
  parameters: {
    controls: { expanded: true },
    layout: "centered",
  },
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Patient info card — rich detail popover
// ---------------------------------------------------------------------------
export const PatientInfoCard: Story = {
  name: "Patient Info Card",
  render: () => (
    <Popover>
      <PopoverTrigger
        render={
          <button className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-primary underline-offset-3 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        }
      >
        Margaret Johnson
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <PopoverHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                MJ
              </span>
              <div>
                <PopoverTitle>Margaret Johnson</PopoverTitle>
                <PopoverDescription>DOB: 14 Mar 1942 · Age 84</PopoverDescription>
              </div>
            </div>
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              Active
            </span>
          </div>
        </PopoverHeader>

        <Separator />

        <div className="grid gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPinIcon className="size-3.5 shrink-0" />
            <span>12 Oak Lane, Bristol, BS1 4JN</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <PhoneIcon className="size-3.5 shrink-0" />
            <span>+44 7700 900123</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarIcon className="size-3.5 shrink-0" />
            <span>Next visit: 2 Apr 2026 · 09:00</span>
          </div>
        </div>

        <Separator />

        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            <UserIcon />
            View profile
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <CalendarIcon />
            Schedule
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

// ---------------------------------------------------------------------------
// Quick edit form — inline editing without a full dialog
// ---------------------------------------------------------------------------
export const QuickEditForm: Story = {
  name: "Quick Edit Form",
  render: () => {
    const [open, setOpen] = React.useState(false)
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger render={<Button variant="outline" size="sm" />}>
          Edit time
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <PopoverHeader>
            <PopoverTitle>Update visit time</PopoverTitle>
            <PopoverDescription>
              Change the scheduled time for this visit.
            </PopoverDescription>
          </PopoverHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="visit-date" className="text-xs">
                Date
              </Label>
              <Input id="visit-date" type="date" defaultValue="2026-04-02" size="sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="visit-time" className="text-xs">
                Time
              </Label>
              <Input id="visit-time" type="time" defaultValue="09:00" size="sm" />
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1" onClick={() => setOpen(false)}>
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  },
}

// ---------------------------------------------------------------------------
// Status info — hover-style info popover with an icon trigger
// ---------------------------------------------------------------------------
export const StatusInfo: Story = {
  name: "Status Info",
  render: () => (
    <div className="flex items-center gap-2 text-sm">
      <span className="font-medium">Visit status</span>
      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
        Pending
      </span>
      <Popover>
        <PopoverTrigger
          render={
            <button className="flex items-center text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring rounded" />
          }
        >
          <InfoIcon className="size-3.5" />
          <span className="sr-only">Status info</span>
        </PopoverTrigger>
        <PopoverContent side="right" className="w-64">
          <PopoverHeader>
            <PopoverTitle>Pending status</PopoverTitle>
            <PopoverDescription>
              This visit is awaiting confirmation from the assigned carer.
            </PopoverDescription>
          </PopoverHeader>
          <div className="flex flex-col gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2Icon className="size-3.5 text-green-600" />
              Patient confirmed
            </div>
            <div className="flex items-center gap-1.5">
              <ClockIcon className="size-3.5 text-amber-500" />
              Awaiting carer confirmation
            </div>
            <div className="flex items-center gap-1.5">
              <AlertTriangleIcon className="size-3.5 text-muted-foreground/50" />
              Auto-confirms in 24 hrs
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Alert summary — notification-style popover
// ---------------------------------------------------------------------------
export const AlertSummary: Story = {
  name: "Alert Summary",
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        <AlertTriangleIcon className="text-amber-500" />
        3 alerts
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <PopoverHeader>
          <PopoverTitle>Active alerts</PopoverTitle>
          <PopoverDescription>
            Require attention before the next visit.
          </PopoverDescription>
        </PopoverHeader>

        <div className="flex flex-col gap-2">
          {[
            {
              icon: AlertTriangleIcon,
              color: "text-destructive",
              bg: "bg-destructive/8",
              label: "Medication review overdue",
              sub: "Due 28 Mar 2026",
            },
            {
              icon: AlertTriangleIcon,
              color: "text-amber-600",
              bg: "bg-amber-50",
              label: "Care plan expires soon",
              sub: "Expires 15 Apr 2026",
            },
            {
              icon: InfoIcon,
              color: "text-blue-600",
              bg: "bg-blue-50",
              label: "GP referral pending",
              sub: "Submitted 1 Apr 2026",
            },
          ].map(({ icon: Icon, color, bg, label, sub }) => (
            <div
              key={label}
              className={`flex items-start gap-2.5 rounded-md px-2.5 py-2 text-xs ${bg}`}
            >
              <Icon className={`mt-0.5 size-3.5 shrink-0 ${color}`} />
              <div>
                <p className={`font-medium ${color}`}>{label}</p>
                <p className="text-muted-foreground">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        <Button variant="outline" size="sm" className="w-full">
          View all alerts
          <ChevronRightIcon className="ml-auto size-3.5" />
        </Button>
      </PopoverContent>
    </Popover>
  ),
}

// ---------------------------------------------------------------------------
// Placement showcase — all four sides
// ---------------------------------------------------------------------------
export const Placements: Story = {
  name: "Placements",
  render: () => (
    <div className="grid grid-cols-2 gap-3">
      {(["top", "bottom", "left", "right"] as const).map((side) => (
        <Popover key={side}>
          <PopoverTrigger render={<Button variant="outline" className="w-full capitalize" />}>
            {side}
          </PopoverTrigger>
          <PopoverContent side={side} className="w-48">
            <PopoverHeader>
              <PopoverTitle>Opens {side}</PopoverTitle>
              <PopoverDescription>
                sideOffset controls the gap.
              </PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
}
