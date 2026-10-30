import { z } from "zod";
import type { MedFormErrors, RecordDoseFormData } from "types";
import { ADMINISTRATION_STATUS_VALUES, REASON_CODE_VALUES } from "./constants";
import { requiredChoice, runSchema } from "./helpers";

export interface AdministrationRules {
  recorder: string;
  requiresWitness: boolean; // controlled drugs
  requiresDoseGiven: boolean; // variable-dose medication (warfarin, insulin)
  expectedBarcode: string;
}

const NEEDS_REASON = ["refused", "omitted", "not-available"];

export function buildAdministrationSchema(rules: AdministrationRules) {
  return z
    .object({
      status: requiredChoice(ADMINISTRATION_STATUS_VALUES, "Outcome"),
      reasonCode: z.union([z.literal(""), z.enum(REASON_CODE_VALUES)]),
      note: z.string().trim().max(200, "Keep the note under 200 characters"),
      doseGiven: z.string().trim().max(40, "Dose is too long"),
      witness: z.string().trim().max(60, "Name is too long"),
      barcode: z.string().trim(),
    })
    .superRefine((d, ctx) => {
      const add = (path: string, message: string) => ctx.addIssue({ code: "custom", path: [path], message });
      if (NEEDS_REASON.includes(d.status) && d.reasonCode === "") add("reasonCode", "Choose a reason code");
      if (d.reasonCode === "other" && d.note === "") add("note", "Add a short note for 'Other'");
      if (d.status === "administered" && rules.requiresDoseGiven && d.doseGiven === "") add("doseGiven", "Record the dose given");
      if (d.status === "administered" && rules.requiresWitness) {
        if (d.witness === "") add("witness", "A second witness is required for controlled drugs");
        else if (d.witness.toLowerCase() === rules.recorder.toLowerCase()) add("witness", "The witness must be a different person");
      }
      if (d.barcode !== "" && d.barcode !== rules.expectedBarcode) add("barcode", "Barcode does not match this medication — check the packaging");
    });
}

export const validateAdministration = (data: RecordDoseFormData, rules: AdministrationRules): MedFormErrors =>
  runSchema(buildAdministrationSchema(rules), data);
