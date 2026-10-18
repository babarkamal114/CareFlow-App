import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Input } from @/components/ui

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: {
    controls: { expanded: true },
  },
  args: {
    placeholder: "Type here...",
    size: "default",
    state: "default",
    disabled: false,
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
    state: {
      control: "select",
      options: ["default", "success", "error"],
    },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const States: Story = {
  render: (args) => (
    <div className="grid max-w-sm gap-3">
      <Input {...args} state="default" />
      <Input {...args} state="success" defaultValue="Valid value" />
      <Input {...args} state="error" defaultValue="Invalid value" />
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="grid max-w-sm gap-3">
      <Input {...args} size="sm" />
      <Input {...args} size="default" />
      <Input {...args} size="lg" />
    </div>
  ),
}
