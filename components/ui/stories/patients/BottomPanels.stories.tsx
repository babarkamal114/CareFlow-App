// components/ui/stories/patients/BottomPanels.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { RiskDistribution } from "@/features/patients/components/risk-distribution";
import { RecentAdmissions } from "@/features/patients/components/recent-admissions";
import { CarePlanStatus }   from "@/features/patients/components/care-plan-status";

const meta: Meta = {
  title: "Patients / BottomPanels",
  parameters: { layout: "padded" },
};
export default meta;

export const RiskDistributionStory: StoryObj = {
  name: "Risk Distribution",
  render: () => <div className="w-[300px]"><RiskDistribution /></div>,
};

export const RecentAdmissionsStory: StoryObj = {
  name: "Recent Admissions",
  render: () => <div className="w-[320px]"><RecentAdmissions /></div>,
};

export const CarePlanStatusStory: StoryObj = {
  name: "Care Plan Status",
  render: () => <div className="w-[320px]"><CarePlanStatus /></div>,
};

export const AllThreePanels: StoryObj = {
  name: "All Three Side-by-Side",
  render: () => (
    <div className="flex gap-4">
      <RiskDistribution /> <RecentAdmissions /> <CarePlanStatus />
    </div>
  ),
};
