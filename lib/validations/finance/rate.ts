import { z } from "zod";
import type { FinanceFormErrors, RateFormData } from "types";
import { requiredChoice, runSchema } from "../staff/helpers";
import { DAY_TYPE_VALUES, DURATION_VALUES, MAX_VISIT_RATE } from "./constants";

export const rateSchema = z.object({
  durationMins: z.union([z.literal(""), z.number()]).superRefine((value, ctx) => {
    if (value === "") {
      ctx.addIssue({ code: "custom", message: "Visit length is required" });
    } else if (!(DURATION_VALUES as readonly number[]).includes(value)) {
      ctx.addIssue({ code: "custom", message: "Choose 15, 30, 45 or 60 minutes" });
    }
  }),
  dayType: requiredChoice(DAY_TYPE_VALUES, "Day type"),
  rate: z.union([z.literal(""), z.number()]).superRefine((value, ctx) => {
    if (value === "") {
      ctx.addIssue({ code: "custom", message: "Rate is required" });
    } else if (!(value > 0)) {
      ctx.addIssue({ code: "custom", message: "Rate must be greater than £0" });
    } else if (value > MAX_VISIT_RATE) {
      ctx.addIssue({ code: "custom", message: `Rate cannot exceed £${MAX_VISIT_RATE} per visit` });
    }
  }),
});

export const validateRate = (data: RateFormData): FinanceFormErrors => runSchema(rateSchema, data);