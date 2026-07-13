import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Button } from "ui-components"

const meta = {
  title: "UI/Card",
  component: Card,
  parameters: {
    controls: { expanded: true },
  },
 args: {
  variant: "default",
  size: "default",   // <-- was "density"
},
argTypes: {
  variant: {
    // ...
  },
  size: {
    control: "select",
    options: ["default", "sm"],
  },
},
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    variant: "interactive"
  },

  render: (args) => (
    <Card {...args} className="max-w-sm">
      <CardHeader>
        <CardTitle>Client follow-up</CardTitle>
        <CardDescription>Next review in 2 days</CardDescription>
      </CardHeader>
      <CardContent>Open actions and clinical notes for this case.</CardContent>
      <CardFooter>
        <Button size="sm">Open</Button>
      </CardFooter>
    </Card>
  )
}

export const Variants: Story = {
  render: () => (
    <div className="grid gap-3 sm:grid-cols-2">
      {(["default", "elevated", "interactive", "outlined"] as const).map((variant) => (
        <Card key={variant} variant={variant} className="max-w-sm">
          <CardHeader>
            <CardTitle>{variant}</CardTitle>
            <CardDescription>Card variant preview</CardDescription>
          </CardHeader>
          <CardContent>Content area</CardContent>
          <CardFooter>
            <Button size="sm">Action</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  ),
}
