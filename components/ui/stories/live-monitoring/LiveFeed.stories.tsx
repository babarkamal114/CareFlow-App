// stories/live-monitoring/LiveFeed.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import LiveFeed from "@/app/(dashboard)/live-monitoring/_components/LiveFeed";

const meta: Meta<typeof LiveFeed> = {
  title: "Live Monitoring / LiveFeed",
  component: LiveFeed,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Scrollable real-time activity stream. Status icons: green check = completed, red X = missed, amber alert = late, blue play = checked-in. A new item auto-injects after 5 s to demonstrate live streaming.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof LiveFeed>;

export const Default: Story = {};

export const SidebarWidth: Story = {
  decorators: [
    (Story) => (
      <div className="w-[300px] bg-white border border-[#E4E5EA] rounded-xl p-4">
        <Story />
      </div>
    ),
  ],
};
