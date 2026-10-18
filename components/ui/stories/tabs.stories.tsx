import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Tabs, TabsContent, TabsList, TabsTrigger } from @/components/ui

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  parameters: {
    controls: { expanded: true },
  },
  args: {
    defaultValue: "one",
  },
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

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="one" className="max-w-md">
      <TabsList>
        <TabsTrigger value="one">Overview</TabsTrigger>
        <TabsTrigger value="two">Details</TabsTrigger>
      </TabsList>
      <TabsContent value="one">Overview content</TabsContent>
      <TabsContent value="two">Details content</TabsContent>
    </Tabs>
  ),
}

export const LineVariant: Story = {
  render: () => (
    <Tabs defaultValue="one" className="max-w-md">
      <TabsList variant="line">
        <TabsTrigger value="one">Overview</TabsTrigger>
        <TabsTrigger value="two">Details</TabsTrigger>
      </TabsList>
      <TabsContent value="one">Overview content</TabsContent>
      <TabsContent value="two">Details content</TabsContent>
    </Tabs>
  ),
}
