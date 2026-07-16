import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ForgotPasswordForm } from "@/app/(auth)/forgot-password/forgot-password-form";

const meta = {
  title: "Auth/ForgotPasswordForm",
  component: ForgotPasswordForm,
  parameters: {
    // Mounts the Next.js App Router context
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/forgot-password" },
    },
    layout: "centered",
    backgrounds: {
      default: "light",
      values: [{ name: "light", value: "#f5f5f0" }],
    },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div className="w-[420px] rounded-lg bg-white p-8 shadow-sm">
        <div className="mb-7">
          <h1 className="text-[1.75rem] font-bold tracking-tight text-zinc-900">Forgot password?</h1>
          <p className="mt-1 text-sm text-zinc-500">No worries — we&apos;ll send you reset instructions.</p>
        </div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ForgotPasswordForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default idle state — enter an email and submit to see
 * the 1s loading delay then the animated success state.
 */
export const Default: Story = {};
