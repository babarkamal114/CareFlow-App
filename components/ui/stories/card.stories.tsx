import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
} from "ui-components"

const meta = {
  title: "UI/Card",
  component: Card,
  parameters: {
    controls: { expanded: true },
  },
  args: {
    variant: "default",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "elevated", "interactive", "outlined", "selected"], // ✅ added selected
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

// 🎮 Playground
export const Playground: Story = {
  args: {
    variant: "interactive",
  },

  render: (args) => (
    <Card {...args} className="max-w-sm">
      <CardHeader>
        <CardTitle>Client follow-up</CardTitle>
        <CardDescription>Next review in 2 days</CardDescription>
      </CardHeader>
      <CardContent>
        Open actions and clinical notes for this case.
      </CardContent>
      <CardFooter>
        <Button size="sm">Open</Button>
      </CardFooter>
    </Card>
  ),
}


export const Variants: Story = {
  render: () => (
    <div className="space-y-12 p-8 bg-gray-50 min-h-screen">

      {/* 🔹 Top Row (fixed spacing + size) */}
      <div className="grid grid-cols-4 gap-6">
        
        <Card variant="default" className="p-6">
          <p className="text-sm font-medium">Default card</p>
          <p className="text-xs text-gray-500 mt-1">
            Basic simple card with border and padding
          </p>
        </Card>

        <Card variant="interactive" className="p-6">
          <p className="text-sm font-medium">Hover card</p>
          <p className="text-xs text-gray-500 mt-1">
            Card with hover interaction and subtle shadow
          </p>
        </Card>

        <Card variant="elevated" className="p-6">
          <p className="text-sm font-medium">Shadow card</p>
          <p className="text-xs text-gray-500 mt-1">
            Card with persistent elevation
          </p>
        </Card>

        <Card variant="selected" className="p-6">
          <p className="text-sm font-medium">Focus state</p>
          <p className="text-xs text-gray-500 mt-1">
            Selected card with border highlight
          </p>
        </Card>

      </div>

      {/* 🔹 Bottom Row */}
      <div className="grid grid-cols-3 gap-6">

        {/* 👤 Margaret Johnson */}
        <Card variant="interactive" className="p-5 space-y-4">

          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-[#EEFBF3] flex items-center justify-center text-[#1A7F56] font-medium">
              MJ
            </div>

            <div>
              <p className="text-sm font-medium">Margaret Johnson</p>
              <p className="text-xs text-gray-500">
                78 years · Fall risk: Medium
              </p>
            </div>

            <span className="ml-auto text-xs text-green-600 font-medium">
              Active
            </span>
          </div>

          <div className="flex justify-between text-xs text-gray-600">
            <span>14 visits</span>
            <span>Tomorrow 08:00</span>
          </div>

          <button className="w-full border border-gray-200 rounded-md py-2 text-sm font-medium hover:bg-gray-50">
            View profile
          </button>

        </Card>


       <Card variant="elevated" className="max-w-sm">
          <CardContent className="space-y-3">

            {/* Top row with icon + label */}
            <div className="flex items-center gap-2">
              
              <div className="w-10 h-10 rounded-full bg-[#EEFBF3] flex items-center justify-center text-[#1A7F56] text-xs font-medium">
                ✓
              </div>

              <p className="text-sm font-medium">
                Visits today
              </p>
            </div>

            <h2 className="text-2xl font-semibold">
              127
            </h2>

            <p className="text-xs text-[#1A7F56] font-medium">
              +26.1%
            </p>

          </CardContent>
        </Card>


        {/* 👤 Robert Ahmed */}
       <Card variant="default" className="p-5 space-y-4">

          {/* 🔹 Top right status badge */}
          <div className="flex justify">
            <span className="text-[10px] font-medium px-2 py-1 rounded-md bg-[#EBF2FC] text-[#2258A6]">
              In progress
            </span>
          </div>

          {/* 🔹 Patient */}
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm font-medium">Robert Ahmed</p>
              <p className="text-xs text-gray-500">
                Medication + meal · 60 min visit
              </p>
            </div>
          </div>

          {/* 🔹 Caregiver */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EBF2FC] flex items-center justify-center text-sm font-medium text-[#3574D4]">
              PP
            </div>

            <div>
              <p className="text-sm font-medium">Priya Patel</p>
              <p className="text-xs text-gray-500">
                Started 09:00 · 42 min elapsed
              </p>
            </div>
          </div>

        </Card>
      </div>
    </div>
  ),
}