import { z } from "zod";
import type { FinanceFormErrors, GenerateInvoicesFormData } from "types";
import { requiredChoice, requiredIsoDate, runSchema } from "../staff/helpers";
import { FUNDING_SOURCE_VALUES, PERIOD_TYPE_VALUES } from "./constants";

export const generateInvoicesSchema = z
  .object({
    periodType: requiredChoice(PERIOD_TYPE_VALUES, "Billing period"),
    periodStart: requiredIsoDate("Start date"),
    periodEnd: requiredIsoDate("End date"),
    fundingSources: z.array(z.enum(FUNDING_SOURCE_VALUES)).min(1, "Select at least one funding source"),
    sendImmediately: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.periodStart);
    const end = new Date(data.periodEnd);
    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end < start) {
      ctx.addIssue({ code: "custom", path: ["periodEnd"], message: "End date must be on or after the start date" });
    }
  });

export const validateGenerateInvoices = (data: GenerateInvoicesFormData): FinanceFormErrors =>
  runSchema(generateInvoicesSchema, data);