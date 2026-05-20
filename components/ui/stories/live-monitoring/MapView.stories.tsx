// stories/live-monitoring/MapView.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import MapView from "@/app/(dashboard)/live-monitoring/_components/MapView";

const meta: Meta<typeof MapView> = {
  title: "Live Monitoring / MapView",
  component: MapView,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Interactive map grid showing colour-coded carer pins (Completed=green, In Progress=blue, Late=amber, Missed=red). Includes +/- zoom controls and a status legend. Hovering a pin shows a tooltip.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof MapView>;

/** Default full-height map as it appears embedded in the page */
export const Default: Story = {
  decorators: [
    (Story) => (
      <div style={{ height: 480 }} className="relative">
        <Story />
      </div>
    ),
  ],
};

/** Compact height — useful for testing overflow behaviour */
export const Compact: Story = {
  decorators: [
    (Story) => (
      <div style={{ height: 260 }} className="relative">
        <Story />
      </div>
    ),
  ],
};
