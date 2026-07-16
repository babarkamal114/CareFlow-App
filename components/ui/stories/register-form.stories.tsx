import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RegisterForm } from "@/app/(auth)/register/register-form";

/**
 * RegisterForm is a pure controlled component — useRouter and signIn
 * are injected via onSubmit / onNhsClick props. No router context needed.
 */
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

/** Default — all fields empty and ready to fill in. */
export const Default: Story = {
  args: {
    onSubmit: async () => {
      await new Promise((r) => setTimeout(r, 1000));
      return { error: null };
    },
    onNhsClick: () => alert("NHS Identity clicked"),
  },
};

/** onSubmit returns a server error message shown inline. */
export const WithServerError: Story = {
  args: {
    onSubmit: async () => {
      await new Promise((r) => setTimeout(r, 600));
      return { error: "An account with this email already exists." };
    },
    onNhsClick: () => {},
  },
};

/** Loading — spinner stays visible because onSubmit never resolves. */
export const Loading: Story = {
  args: {
    onSubmit: () => new Promise(() => {}),
    onNhsClick: () => {},
  },
};
