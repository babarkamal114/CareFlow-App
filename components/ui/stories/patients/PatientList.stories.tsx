// components/ui/stories/patients/PatientList.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { PatientList } from "@/features/patients/components/patient-list";
import { listPatients } from "@/features/patients/server/get-patient";

const allPatients = listPatients();

const meta: Meta<typeof PatientList> = {
  title: "Patients / PatientList",
  component: PatientList,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Full Patients page UI. Includes stat cards, search, filter tabs, data table with pagination, and 3 bottom panels (Risk Distribution, Recent Admissions, Care Plan Status).",
      },
    },
  },
  args: { patients: allPatients },
};
export default meta;

type Story = StoryObj<typeof PatientList>;

/** Default — all 12 mock patients */
export const Default: Story = {};

/** Empty state */
export const Empty: Story = { args: { patients: [] } };

/** Only high-risk patients */
export const HighRiskOnly: Story = {
  args: { patients: allPatients.filter((p) => p.risk === "High") },
};
