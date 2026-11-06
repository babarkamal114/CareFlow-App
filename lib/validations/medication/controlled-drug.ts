import { z } from "zod";
import type { ControlledEntryFormData, MedFormErrors } from "types";
import { CONTROLLED_ENTRY_KIND_VALUES } from "./constants";
import { requiredChoice, runSchema } from "./helpers";

export interface ControlledRules {
  recorder: string;
  expectedBalance: number;
}

export function buildControlledEntrySchema(rules: ControlledRules) {
  return z
    .object({
      kind: requiredChoice(CONTROLLED_ENTRY_KIND_VALUES, "Entry type"),
      quantity: z.union([z.literal(""), z.number()]),
      witness: z.string().trim().min(1, "A second witness is required").max(60, "Name is too long"),
      note: z.string().trim().max(200, "Keep the note under 200 characters"),
      adjustBalance: z.boolean(),
    })
    .superRefine((d, ctx) => {
      const add = (path: string, message: string) => ctx.addIssue({ code: "custom", path: [path], message });
      if (d.witness && d.witness.toLowerCase() === rules.recorder.toLowerCase()) add("witness", "The witness must be a different person");
      if (d.quantity === "" || !Number.isInteger(d.quantity) || d.quantity < 0) {
        add("quantity", d.kind === "stock-check" ? "Enter the counted quantity (whole number)" : "Enter a whole number quantity");
        return;
      }
      if ((d.kind === "receipt" || d.kind === "disposal") && d.quantity < 1) add("quantity", "Quantity must be at least 1");
      if (d.kind === "disposal" && d.quantity > rules.expectedBalance) add("quantity", `Only ${rules.expectedBalance} in stock`);
      if (d.kind === "stock-check" && d.quantity !== rules.expectedBalance && d.note === "") {
        add("note", `Counted ${d.quantity} but the recorded balance is ${rules.expectedBalance} — explain the discrepancy`);
      }
    });
}

export const validateControlledEntry = (data: ControlledEntryFormData, rules: ControlledRules): MedFormErrors =>
  runSchema(buildControlledEntrySchema(rules), data);
