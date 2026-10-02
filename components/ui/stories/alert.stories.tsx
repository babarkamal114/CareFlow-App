import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { CheckIcon, InfoIcon, TriangleAlertIcon, XIcon } from "lucide-react"

import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from @/components/ui

const meta = {
  title: "UI/Alert",
  component: Alert,
  parameters: {
    controls: { expanded: true },
  },
  args: {
    variant: "info",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["success", "info", "warning", "error"],
    },
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <Alert {...args}>
      <AlertIcon><InfoIcon /></AlertIcon>
      <AlertContent>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>This alert is fully controllable from args.</AlertDescription>
      </AlertContent>
    </Alert>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="grid max-w-xl gap-2">
      <Alert variant="success">
        <AlertIcon><CheckIcon /></AlertIcon>
        <AlertContent>
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Everything looks good.</AlertDescription>
        </AlertContent>
      </Alert>
      <Alert variant="info">
        <AlertIcon><InfoIcon /></AlertIcon>
        <AlertContent>
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>This is informational.</AlertDescription>
        </AlertContent>
      </Alert>
      <Alert variant="warning">
        <AlertIcon><TriangleAlertIcon /></AlertIcon>
        <AlertContent>
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>Please review this item.</AlertDescription>
        </AlertContent>
      </Alert>
      <Alert variant="error">
        <AlertIcon><XIcon /></AlertIcon>
        <AlertContent>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Something failed.</AlertDescription>
        </AlertContent>
      </Alert>
    </div>
  ),
}
