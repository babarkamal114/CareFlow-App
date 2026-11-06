import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RegisterForm } from "@/components/ui";

const meta = {
  title: "Auth/RegisterForm",
  component: RegisterForm,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "light",
      values: [{ name: "light", value: "#f5f5f0" }],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[420px] max-h-[720px] overflow-y-auto rounded-lg bg-white p-8 shadow-sm">
        <div className="mb-7">
          <h1 className="text-[1.75rem] font-bold tracking-tight text-zinc-900">Create your account</h1>
          <p className="mt-1 text-sm text-zinc-500">Start your free 14-day trial. No credit card required.</p>
        </div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RegisterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
