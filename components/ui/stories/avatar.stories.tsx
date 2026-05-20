import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarStatus,
  AvatarWrap,
} from "ui-components"

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: { controls: { expanded: true } },
  args: { size: "default", shape: "square" },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "default", "lg", "xl"] },
    shape: { control: "select", options: ["square", "round"] },
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
    <div className="rounded-xl border bg-background p-6">
      <p className="mb-5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Sizes
      </p>
      <div className="flex flex-wrap items-end gap-4">
        {(["xs", "sm", "default", "lg", "xl"] as const).map((size) => (
          <Avatar key={size} size={size} shape="round">
            <AvatarFallback className="bg-primary/15 text-primary font-bold">
              EC
            </AvatarFallback>
          </Avatar>
        ))}
        {/* Square shapes */}
        <Avatar size="default" shape="round">
          <AvatarFallback className="bg-amber-100 text-amber-700 font-bold">MJ</AvatarFallback>
        </Avatar>
        <Avatar size="default" shape="round">
          <AvatarFallback className="bg-teal-100 text-teal-700 font-bold">SW</AvatarFallback>
        </Avatar>
      </div>
    </div>
  ),
}

const COLOUR_AVATARS = [
  { initials: "EC", bg: "bg-primary/15", text: "text-primary" },
  { initials: "MJ", bg: "bg-amber-100", text: "text-amber-700" },
  { initials: "SW", bg: "bg-teal-100", text: "text-teal-700" },
  { initials: "JO", bg: "bg-orange-100", text: "text-orange-700" },
  { initials: "FK", bg: "bg-pink-100", text: "text-pink-700" },
  { initials: "BK", bg: "bg-gray-800", text: "text-white" },
  { initials: "AK", bg: "bg-emerald-200", text: "text-emerald-800" },
  { initials: "RA", bg: "bg-indigo-300", text: "text-indigo-900" },
]

export const ColourVariants: Story = {
  name: "Colour Variants",
  render: () => (
    <div className="rounded-xl border bg-background p-6">
      <p className="mb-5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Colour Variants
      </p>
      <div className="flex flex-wrap gap-3">
        {COLOUR_AVATARS.map(({ initials, bg, text }) => (
          <Avatar key={initials} size="sm" shape="square">
            <AvatarFallback className={`${bg} ${text} font-bold`}>
              {initials}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
    </div>
  ),
}

export const WithStatusIndicators: Story = {
  name: "With Status Indicators",
  render: () => (
    <div className="rounded-xl border bg-background p-6">
      <p className="mb-5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        With Status Indicators
      </p>
      <div className="flex flex-wrap items-end gap-5">
        <AvatarWrap>
          <Avatar size="default" shape="round">
            <AvatarFallback className="bg-primary/15 text-primary font-bold">EC</AvatarFallback>
          </Avatar>
          <AvatarStatus tone="brand" />
        </AvatarWrap>
        <AvatarWrap>
          <Avatar size="default" shape="round">
            <AvatarFallback className="bg-amber-100 text-amber-700 font-bold">MJ</AvatarFallback>
          </Avatar>
          <AvatarStatus tone="amber" />
        </AvatarWrap>
        <AvatarWrap>
          <Avatar size="default" shape="round">
            <AvatarFallback className="bg-teal-100 text-teal-700 font-bold">SW</AvatarFallback>
          </Avatar>
          <AvatarStatus tone="muted" />
        </AvatarWrap>
        <AvatarWrap>
          <Avatar size="default" shape="round">
            <AvatarFallback className="bg-orange-100 text-orange-700 font-bold">JO</AvatarFallback>
          </Avatar>
          <AvatarStatus tone="red" />
        </AvatarWrap>
      </div>
    </div>
  ),
}

const GROUP_SMALL = [
  { id: "group-sm-EC", initials: "EC", bg: "bg-primary/15", text: "text-primary" },
  { id: "group-sm-MJ", initials: "MJ", bg: "bg-amber-100", text: "text-amber-700" },
  { id: "group-sm-SW", initials: "SW", bg: "bg-teal-100", text: "text-teal-700" },
  { id: "group-sm-FK", initials: "FK", bg: "bg-pink-100", text: "text-pink-700" },
]

const GROUP_COUNT = [
  { id: "group-ct-EC", initials: "EC", bg: "bg-primary/15", text: "text-primary" },
  { id: "group-ct-MJ", initials: "MJ", bg: "bg-amber-100", text: "text-amber-700" },
  { id: "group-ct-SW", initials: "SW", bg: "bg-teal-100", text: "text-teal-700" },
]

const GROUP_LARGE = [
  { id: "group-lg-EC", initials: "EC", bg: "bg-primary/15", text: "text-primary" },
  { id: "group-lg-MJ", initials: "MJ", bg: "bg-amber-100", text: "text-amber-700" },
  { id: "group-lg-SW", initials: "SW", bg: "bg-teal-100", text: "text-teal-700" },
  { id: "group-lg-JO", initials: "JO", bg: "bg-orange-100", text: "text-orange-700" },
]

export const AvatarGroups: Story = {
  name: "Avatar Groups",
  render: () => (
    <div className="rounded-xl border bg-background p-6">
      <p className="mb-5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Avatar Groups
      </p>
      <div className="flex flex-wrap items-center gap-8">
        {/* Small group */}
        <AvatarGroup>
          {GROUP_SMALL.map(({ id, initials, bg, text }) => (
            <Avatar key={id} size="xs" shape="round">
              <AvatarFallback className={`${bg} ${text} font-bold`}>{initials}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>

        {/* Medium group with +4 count */}
        <AvatarGroup>
          {GROUP_COUNT.map(({ id, initials, bg, text }) => (
            <Avatar key={id} size="xs" shape="round">
              <AvatarFallback className={`${bg} ${text} font-bold`}>{initials}</AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount className="size-6 text-[10px]">+4</AvatarGroupCount>
        </AvatarGroup>

        {/* Large group */}
        <AvatarGroup>
          {GROUP_LARGE.map(({ id, initials, bg, text }) => (
            <Avatar key={id} size="default" shape="round">
              <AvatarFallback className={`${bg} ${text} font-bold`}>{initials}</AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount>+12</AvatarGroupCount>
        </AvatarGroup>
      </div>
    </div>
  ),
}
