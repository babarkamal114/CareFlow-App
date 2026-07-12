import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "ui-components"

const meta = {
  title: "UI/Accordion",
  component: Accordion,
  parameters: {
    controls: { expanded: true },
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    defaultValue: ["item-1"],
  },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Care plan summary</AccordionTrigger>
        <AccordionContent>
          Last review completed. Next review due in 6 days.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Medication notes</AccordionTrigger>
        <AccordionContent>Evening medication requires supervision.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}