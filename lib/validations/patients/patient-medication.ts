import { z } from "zod";
import type {
  MedicationDraft,
  PatientFormErrors,
  PatientMedication,
} from "types";
import {
  requiredChoice,
  requiredText,
  runSchema,
} from "./helpers";

export const MEDICATION_TYPE_VALUES = [
  "regular",
  "prn",
  "controlled",
  "short-course",
  "variable-dose",
] as const;

const sameText = (a: string, b: string) =>
  a.trim().toLowerCase() === b.trim().toLowerCase();

export function buildMedicationDraftSchema(existing: PatientMedication[]) {
  return z
    .object({
      name: requiredText("Name"),
      dosage: requiredText("Dosage"),
      frequency: requiredText("Frequency"),
      timing: requiredText("Timing"),
      route: z.string(),
      prescriber: z.string(),
      startDate: z
        .string()
        .refine((value) => value === "" || !Number.isNaN(new Date(value).getTime()), {
          error: "Enter a valid start date",
        }),
      indication: z.string(),
      instructions: z.string(),
      medicationType: requiredChoice(MEDICATION_TYPE_VALUES, "Medication type"),
    })
    .superRefine((draft, ctx) => {
      if (!draft.name.trim() || !draft.dosage.trim()) return;
      const duplicate = existing.some(
        (med) => sameText(med.name, draft.name) && sameText(med.dosage, draft.dosage)
      );
      if (duplicate) {
        ctx.addIssue({
          code: "custom",
          path: ["name"],
          message: "Already on the list with this dosage",
        });
      }
    });
}

export function validateMedicationDraft(
  draft: MedicationDraft,
  existing: PatientMedication[]
): PatientFormErrors {
  return runSchema(buildMedicationDraftSchema(existing), draft);
}