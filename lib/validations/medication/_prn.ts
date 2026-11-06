import { z } from "zod";
import type { MedFormErrors, PrnFollowUpFormData, PrnFormData } from "types";
import { EFFECTIVENESS_VALUES } from "./constants";
import { requiredChoice, requiredText, runSchema } from "./helpers";

export interface PrnLimits {
  minIntervalHours: number;
  maxPer24h: number;
  lastAdministeredAt: Date | null;
  countLast24h: number;
  now: Date;
}

export function buildPrnSchema(limits: PrnLimits) {
  return z
    .object({
      medicationId: requiredText("Medication"),
      reason: requiredText("Reason for giving").pipe(z.string().min(3, "Describe the reason (e.g. headache, hip pain)").max(120, "Keep the reason under 120 characters")),
      doseGiven: requiredText("Dose given").pipe(z.string().max(40, "Dose is too long")),
    })
    .superRefine((d, ctx) => {
      if (limits.countLast24h >= limits.maxPer24h) {
        ctx.addIssue({ code: "custom", path: ["form"], message: `Maximum of ${limits.maxPer24h} doses in 24 hours already given — contact the GP or coordinator` });
      } else if (limits.lastAdministeredAt) {
        const hours = (limits.now.getTime() - limits.lastAdministeredAt.getTime()) / 3600000;
        if (hours < limits.minIntervalHours) {
          const wait = Math.ceil((limits.minIntervalHours - hours) * 60);
          ctx.addIssue({ code: "custom", path: ["form"], message: `Too soon: wait another ${wait} minutes (minimum ${limits.minIntervalHours}h between doses)` });
        }
      }
    });
}

export const validatePrn = (data: PrnFormData, limits: PrnLimits): MedFormErrors => runSchema(buildPrnSchema(limits), data);

export const prnFollowUpSchema = z.object({
  effectiveness: requiredChoice(EFFECTIVENESS_VALUES, "Effectiveness"),
  note: z.string().trim().max(200, "Keep the note under 200 characters"),
});

export const validatePrnFollowUp = (data: PrnFollowUpFormData): MedFormErrors => runSchema(prnFollowUpSchema, data);
