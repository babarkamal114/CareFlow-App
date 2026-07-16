import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";

/**
 * The green left-panel shown on all auth pages.
 * It is a pure component — usePathname() lives in the layout, not here.
 * Content (headline, features, testimonial quote) swaps per `pathname` prop
 * with AnimatePresence cross-fade transitions.
 */
const meta = {
  title: "Auth/AuthBrandPanel",
  component: AuthBrandPanel,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    pathname: {
      control: "select",
      options: ["/login", "/register", "/forgot-password"],
      description: "Which auth route to display content for",
    },
  },
  args: {
    pathname: "/login",
  },
  decorators: [
    (Story) => (
      <div className="flex" style={{ height: "100vh", width: "420px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AuthBrandPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Login: Story = {
  args: { pathname: "/login" },
};

export const Register: Story = {
  args: { pathname: "/register" },
};

export const ForgotPassword: Story = {
  args: { pathname: "/forgot-password" },
};
