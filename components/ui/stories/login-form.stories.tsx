import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LoginForm } from "@/components/ui";

const meta = {
  title: "Auth/LoginForm",
  component: LoginForm,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "light",
      values: [{ name: "light", value: "#f5f5f0" }],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[420px] rounded-lg bg-white p-8 shadow-sm">
        <div className="mb-7">
          <h1 className="text-[1.75rem] font-bold tracking-tight text-zinc-900">Welcome back</h1>
          <p className="mt-1 text-sm text-zinc-500">Sign in to your CareFlow account</p>
        </div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
