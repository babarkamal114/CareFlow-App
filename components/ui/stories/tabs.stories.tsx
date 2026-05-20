import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "ui-components"

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  parameters: { controls: { expanded: true } },
  args: { defaultValue: "one" },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <Tabs {...args} className="max-w-md">
      <TabsList>
        <TabsTrigger value="one">Overview</TabsTrigger>
        <TabsTrigger value="two">Details</TabsTrigger>
        <TabsTrigger value="three">History</TabsTrigger>
      </TabsList>
      <TabsContent value="one">Overview content</TabsContent>
      <TabsContent value="two">Details content</TabsContent>
      <TabsContent value="three">History content</TabsContent>
    </Tabs>
  ),
}

export const UnderlineTabs: Story = {
  name: "Underline Tabs",
  render: () => (
    <div className="rounded-xl border bg-background p-6">
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Underline Tabs
      </p>
      <Tabs defaultValue="overview">
        <TabsList variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="visits">
            Visits
            <span className="ml-1.5 rounded-full bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
              127
            </span>
          </TabsTrigger>
          <TabsTrigger value="care-plan">Care plan</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="pt-4 text-sm text-muted-foreground">
          Overview content
        </TabsContent>
        <TabsContent value="visits" className="pt-4 text-sm text-muted-foreground">
          Visits list
        </TabsContent>
        <TabsContent value="care-plan" className="pt-4 text-sm text-muted-foreground">
          Care plan
        </TabsContent>
        <TabsContent value="medications" className="pt-4 text-sm text-muted-foreground">
          Medications
        </TabsContent>
        <TabsContent value="notes" className="pt-4 text-sm text-muted-foreground">
          Notes
        </TabsContent>
        <TabsContent value="documents" className="pt-4 text-sm text-muted-foreground">
          Documents
        </TabsContent>
      </Tabs>
    </div>
  ),
}

export const PillTabs: Story = {
  name: "Pill Tabs",
  render: () => (
    <div className="rounded-xl border bg-background p-6">
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Pill Tabs
      </p>
      <Tabs defaultValue="daily">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="pt-4 text-sm text-muted-foreground">Daily view</TabsContent>
        <TabsContent value="weekly" className="pt-4 text-sm text-muted-foreground">Weekly view</TabsContent>
        <TabsContent value="monthly" className="pt-4 text-sm text-muted-foreground">Monthly view</TabsContent>
        <TabsContent value="yearly" className="pt-4 text-sm text-muted-foreground">Yearly view</TabsContent>
      </Tabs>
    </div>
  ),
}

export const SegmentedControl: Story = {
  name: "Segmented Control",
  render: () => (
    <div className="rounded-xl border bg-background p-6">
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Segmented Control
      </p>
      <Tabs defaultValue="grid">
        <TabsList>
          <TabsTrigger value="grid">Grid</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
        </TabsList>
        <TabsContent value="grid" className="pt-4 text-sm text-muted-foreground">Grid layout</TabsContent>
        <TabsContent value="list" className="pt-4 text-sm text-muted-foreground">List layout</TabsContent>
        <TabsContent value="map" className="pt-4 text-sm text-muted-foreground">Map layout</TabsContent>
      </Tabs>
    </div>
  ),
}
