import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LoginForm } from "@/app/(auth)/login/login-form";

/**
 * LoginForm is a pure controlled component — useRouter and signIn
 * are injected via onSubmit / onNhsClick props.
 * No Next.js router context needed here at all.
 */
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

/** Idle — fill in email/password and click Sign in to see the loading spinner. */
export const Default: Story = {
  args: {
    onSubmit: async () => {
      await new Promise((r) => setTimeout(r, 800));
      return { error: null };
    },
    onNhsClick: () => alert("NHS Identity clicked"),
  },
};

/** onSubmit returns an error — the red inline error banner animates in. */
export const WithSignInError: Story = {
  args: {
    onSubmit: async () => {
      await new Promise((r) => setTimeout(r, 600));
      return { error: "CredentialsSignin" };
    },
    onNhsClick: () => {},
  },
};

/** Loading state — onSubmit never resolves so the spinner stays visible. */
export const Loading: Story = {
  args: {
    onSubmit: () => new Promise(() => {}), // never resolves
    onNhsClick: () => {},
  },
};
