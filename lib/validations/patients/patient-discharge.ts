import { z } from "zod";
import type { DischargeFormState, PatientFormErrors, DischargeContacts } from "types";
import { DISCHARGE_REASON_VALUES, DISCHARGE_NOTIFY_OPTIONS } from "utils";
import {
  TIME_REGEX,
  requiredChoice,
  requiredIsoDate,
  runSchema,
} from "./helpers";

export const dischargeFormSchema = z
  .object({
    reason: requiredChoice(DISCHARGE_REASON_VALUES, "Reason"),
    notes: z.string(),
    dischargeDate: requiredIsoDate("Discharge date"),
    scheduleFinalVisit: z.boolean(),
    finalVisitDate: z.string(),
    finalVisitTime: z.string(),
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
    if (form.scheduleFinalVisit && form.finalVisitTime && !TIME_REGEX.test(form.finalVisitTime)) {
      ctx.addIssue({
        code: "custom",
        path: ["finalVisitTime"],
        message: "Enter a valid time (HH:MM)",
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
  form: DischargeFormState,
  contacts: DischargeContacts
): PatientFormErrors {
  const errors: PatientFormErrors = { ...runSchema(dischargeFormSchema, form) };

  for (const option of DISCHARGE_NOTIFY_OPTIONS) {
    const contactName = contacts[option.contact];
    if (contactName && !form[option.field]) {
      errors[option.field] = `Notify ${option.label.toLowerCase()} (${contactName}) as well`;
    }
  }

  return errors;
}