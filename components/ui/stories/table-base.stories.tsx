import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "ui-components"

const meta = {
  title: "UI/Table",
  component: Table,
  parameters: { controls: { expanded: true } },
  args: { variant: "data" },
  argTypes: {
    variant: { control: "select", options: ["data", "minimal"] },
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <Table {...args} className="max-w-xl">
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Dorothy Chen</TableCell>
          <TableCell>Missed</TableCell>
          <TableCell>08:30</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const Data: Story = {
  render: () => (
    <Table variant="data">
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Dorothy Chen</TableCell>
          <TableCell>Missed</TableCell>
          <TableCell>08:30</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Margaret Johnson</TableCell>
          <TableCell>Completed</TableCell>
          <TableCell>09:00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const Minimal: Story = {
  render: () => (
    <Table variant="minimal" className="max-w-xl">
      <TableHeader>
        <TableRow>
          <TableHead>Medication</TableHead>
          <TableHead>Dose</TableHead>
          <TableHead>Next</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Paracetamol</TableCell>
          <TableCell>500mg</TableCell>
          <TableCell>18:00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}
