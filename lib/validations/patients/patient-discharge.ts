import { z } from "zod";
import type { DischargeFormState, PatientFormErrors } from "types";
import {
  TIME_REGEX,
  requiredChoice,
  requiredIsoDate,
  runSchema,
} from "./helpers";

export const DISCHARGE_REASON_VALUES = [
  "recovered",
  "deceased",
  "moved-out-of-area",
  "moved-to-care-home",
  "hospital-admission-permanent",
  "self-funding-withdrawn",
  "family-request",
  "other",
] as const;

export const dischargeFormSchema = z
  .object({
    reason: requiredChoice(DISCHARGE_REASON_VALUES, "Reason"),
    notes: z.string(),
    dischargeDate: requiredIsoDate("Discharge date"),
    scheduleFinalVisit: z.boolean(),
    finalVisitDate: z.string(),
    finalVisitTime: z
      .string()
      .refine((value) => value === "" || TIME_REGEX.test(value), {
        error: "Enter a valid time (HH:MM)",
      }),
    notifyGp: z.boolean(),
    notifyNextOfKin: z.boolean(),
    notifyEmergencyContact: z.boolean(),
    otherNotifications: z.string(),
  })
  .superRefine((form, ctx) => {
    if (form.scheduleFinalVisit && !form.finalVisitDate) {
      ctx.addIssue({
        code: "custom",
        path: ["finalVisitDate"],
        message: "Pick a date for the final visit, or turn scheduling off",
      });
    }
    if (form.reason === "other" && !form.notes.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["notes"],
        message: 'Add a reason since "Other" was selected',
      });
    }
  });

export function validateDischargeForm(
  form: DischargeFormState
): PatientFormErrors {
  return runSchema(dischargeFormSchema, form);
}