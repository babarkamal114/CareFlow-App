import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Avatar, AvatarFallback, AvatarGroup, AvatarStatus, AvatarWrap } from @/components/ui

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: {
    controls: { expanded: true },
  },
  args: {
    size: "default",
    shape: "square",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg", "xl"],
    },
    shape: {
      control: "select",
      options: ["square", "round"],
    },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>EC</AvatarFallback>
    </Avatar>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      <Avatar size="xs"><AvatarFallback>EC</AvatarFallback></Avatar>
      <Avatar size="sm"><AvatarFallback>EC</AvatarFallback></Avatar>
      <Avatar size="default"><AvatarFallback>EC</AvatarFallback></Avatar>
      <Avatar size="lg"><AvatarFallback>EC</AvatarFallback></Avatar>
      <Avatar size="xl"><AvatarFallback>EC</AvatarFallback></Avatar>
    </div>
  ),
}

export const GroupAndStatus: Story = {
  render: () => (
    <div className="space-y-3">
      <AvatarWrap>
        <Avatar shape="round"><AvatarFallback>MJ</AvatarFallback></Avatar>
        <AvatarStatus tone="blue" />
      </AvatarWrap>
      <AvatarGroup>
        <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
        <Avatar><AvatarFallback>CD</AvatarFallback></Avatar>
        <Avatar><AvatarFallback>EF</AvatarFallback></Avatar>
      </AvatarGroup>
    </div>
  ),
}
