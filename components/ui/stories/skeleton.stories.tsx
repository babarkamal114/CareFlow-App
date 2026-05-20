"use client"

import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { CalendarIcon, PlusIcon, SearchIcon } from "lucide-react"
import { Button, Calendar } from "ui-components"
import { cn } from 'lib'
import * as React from "react"

// ---------------------------------------------------------------------------
// Skeleton primitive
// ---------------------------------------------------------------------------
function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-md bg-muted", className)} />
  )
}

const meta = {
  title: "UI/Skeleton & Empty States",
  parameters: { controls: { expanded: true } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const TABLE_SKELETON_ROWS = [
  { id: "skeleton-row-1" },
  { id: "skeleton-row-2" },
  { id: "skeleton-row-3" },
]

export const SkeletonLoaders: Story = {
  name: "Skeleton Loaders",
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {/* Card skeleton */}
      <div className="rounded-xl border bg-background">
        <div className="border-b bg-muted/30 px-4 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Card Skeleton
          </span>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </div>
      </div>

      {/* Table row skeleton */}
      <div className="rounded-xl border bg-background">
        <div className="border-b bg-muted/30 px-4 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Table Row Skeleton
          </span>
        </div>
        <div className="p-5 space-y-3">
          {TABLE_SKELETON_ROWS.map(({ id }) => (
            <div key={id} className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-36" />
                <Skeleton className="h-2.5 w-24" />
              </div>
              <Skeleton className="h-3 w-16 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}

export const EmptyStates: Story = {
  name: "Empty States",
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {/* No data */}
      <div className="rounded-xl border bg-background">
        <div className="border-b bg-muted/30 px-4 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            No Data
          </span>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 p-10 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl border bg-muted">
            <CalendarIcon className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">No visits scheduled</p>
            <p className="mt-1 text-xs text-muted-foreground max-w-[200px]">
              You don't have any visits scheduled for today. Create your first visit to get started.
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm">
              <PlusIcon className="size-3.5" /> Schedule visit
            </Button>
            <Button size="sm" variant="ghost">Learn more</Button>
          </div>
        </div>
      </div>

      {/* No results */}
      <div className="rounded-xl border bg-background">
        <div className="border-b bg-muted/30 px-4 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            No Results
          </span>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 p-10 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl border bg-muted">
            <SearchIcon className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">No patients found</p>
            <p className="mt-1 text-xs text-muted-foreground max-w-[200px]">
              No patients match your search for "margaret smith". Try adjusting your filters or search terms.
            </p>
          </div>
          <Button size="sm" variant="outline">Clear filters</Button>
        </div>
      </div>
    </div>
  ),
}

export const DatePicker: Story = {
  name: "Date Picker (Calendar)",
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 3, 17))
    const [open, setOpen] = React.useState(true)

    return (
      <div className="rounded-xl border bg-background">
        <div className="border-b bg-muted/30 px-4 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Calendar Picker
          </span>
        </div>
        <div className="flex justify-center p-8">
          <div className="rounded-xl border bg-popover shadow-md">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              defaultMonth={new Date(2026, 3)}
            />
            <div className="flex justify-end gap-2 border-t px-4 py-3">
              <Button variant="outline" size="sm" onClick={() => setDate(undefined)}>
                Cancel
              </Button>
              <Button size="sm">Apply</Button>
            </div>
          </div>
        </div>
      </div>
    )
  },
}
