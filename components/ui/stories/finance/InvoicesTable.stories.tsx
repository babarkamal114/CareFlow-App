// components/ui/stories/finance/InvoicesTable.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import InvoicesTable, {
  type Invoice,
} from "@/app/(dashboard)/finance/_components/InvoicesTable"

const meta: Meta<typeof InvoicesTable> = {
  title: "Finance / InvoicesTable",
  component: InvoicesTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Invoices list with All/Paid/Pending/Overdue filter tabs. The 'Billed to' column shows the patient for Private-pay invoices, or the funding body (council/NHS) for LA/CHC invoices.",
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof InvoicesTable>

const SAMPLE_INVOICES: Invoice[] = [
  { id: "1", clientName: "Margaret Johnson", invoiceNumber: "INV-1042", amount: 620, dueDate: "12 Apr", status: "Paid", payerType: "Private" },
  { id: "2", clientName: "Dorothy Chen", invoiceNumber: "INV-1039", amount: 980, dueDate: "2 Apr", status: "Overdue", payerType: "LA", payerName: "Southampton City Council" },
  { id: "3", clientName: "Robert Ahmed", invoiceNumber: "INV-1044", amount: 410, dueDate: "16 Apr", status: "Pending", payerType: "Private" },
  { id: "4", clientName: "Arthur Wilson", invoiceNumber: "INV-1030", amount: 1150, dueDate: "3 Apr", status: "Paid", payerType: "CHC", payerName: "NHS Hampshire ICB" },
]

/** Default — mixed statuses and payer types */
export const Default: Story = {
  args: {
    invoices: SAMPLE_INVOICES,
  },
}

/** Empty — no invoices yet for the period */
export const Empty: Story = {
  args: {
    invoices: [],
  },
}

/** All overdue — worst-case state for visual QA */
export const AllOverdue: Story = {
  args: {
    invoices: SAMPLE_INVOICES.map((inv) => ({ ...inv, status: "Overdue" as const })),
  },
}

/** All LA/council-funded — for testing the "Billed to" column with long council names */
export const AllLAFunded: Story = {
  args: {
    invoices: SAMPLE_INVOICES.map((inv) => ({
      ...inv,
      payerType: "LA" as const,
      payerName: "Southampton City Council",
    })),
  },
}
