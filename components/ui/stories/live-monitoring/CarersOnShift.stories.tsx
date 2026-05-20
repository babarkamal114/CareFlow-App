// stories/live-monitoring/CarersOnShift.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import CarersOnShift from "@/app/(dashboard)/live-monitoring/_components/CarersOnShift";

const meta: Meta<typeof CarersOnShift> = {
  title: "Live Monitoring / CarersOnShift",
  component: CarersOnShift,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "List of carers currently on shift. Each row shows a coloured avatar, carer name, current patient, a visit-progress bar (done / total minutes in blue or amber), and an Active / Late status badge.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof CarersOnShift>;

/** Default — 5 carers (3 active, 2 late) */
export const Default: Story = {};

/** Narrow — tests truncation and wrapping at ~288 px */
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
};
