"use client"

import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import * as React from "react"

import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Avatar, 
  AvatarFallback,
  Badge,
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent
} from 'ui-components'

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

function PatientDrawer(): React.ReactElement {
  const [open, setOpen] = React.useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button />}>Open patient details</SheetTrigger>
      <SheetContent className="w-[360px] sm:w-[400px] p-0 flex flex-col gap-0">
        {/* Header */}
        <div className="flex items-start justify-between border-b px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold">Patient details</h2>
            <p className="text-xs text-muted-foreground">Margaret Johnson · ID #4821</p>
          </div>
          <Button variant="ghost" size="icon-xs" onClick={() => setOpen(false)} aria-label="Close">
            ✕
          </Button>
        </div>

        {/* Patient header */}
        <div className="flex items-center gap-3 px-5 py-4">
          <Avatar size="lg" shape="round">
            <AvatarFallback className="bg-primary/15 text-primary text-lg font-bold">MJ</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-base">Margaret Johnson</p>
            <p className="text-xs text-muted-foreground">78 years old · Falls risk: Medium</p>
            <div className="mt-1.5 flex items-center gap-2">
              <Badge variant="softSuccess" dot>Active</Badge>
              <Badge variant="softWarning">Medium risk</Badge>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="flex-1 overflow-hidden flex flex-col">
          <div className="border-b px-5">
            <TabsList variant="line" className="h-auto gap-4 bg-transparent p-0">
              {["Overview","Visits","Care plan","Notes"].map((t) => (
                <TabsTrigger key={t} value={t.toLowerCase().replace(" ","-")} className="pb-3 pt-0 text-xs">
                  {t}
                  {t === "Visits" && (
                    <span className="ml-1 rounded-full bg-muted px-1.5 text-[10px] font-medium">127</span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="overview" className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {/* Contact */}
            <div className="rounded-lg border p-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Contact</p>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span>+44 7700 900 123</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address</span>
                  <span>7 Rose Crescent, M1</span>
                </div>
              </div>
            </div>

            {/* Next visit */}
            <div className="rounded-lg border p-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Next Visit</p>
              <p className="text-sm">
                Tomorrow 08:00 with <strong>Sarah Williams</strong>
              </p>
            </div>
          </TabsContent>

          <TabsContent value="visits" className="px-5 py-4 text-sm text-muted-foreground">
            Visit history goes here.
          </TabsContent>
          <TabsContent value="care-plan" className="px-5 py-4 text-sm text-muted-foreground">
            Care plan goes here.
          </TabsContent>
          <TabsContent value="notes" className="px-5 py-4 text-sm text-muted-foreground">
            Notes go here.
          </TabsContent>
        </Tabs>

        {/* Footer actions */}
        <div className="flex gap-2 border-t px-5 py-4">
          <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>Edit</Button>
          <Button className="flex-1" onClick={() => setOpen(false)}>Add visit</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

const meta = {
  title: "UI/Sheet",
  component: SheetDemo,
  parameters: { controls: { expanded: true } },
} satisfies Meta<typeof SheetDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const SideDrawer: Story = {
  name: "Side Drawer (Patient Details)",
  render: () => <PatientDrawer />,
}
