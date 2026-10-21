import { z } from "zod";
import type { ComplianceFormErrors } from "types";

export const requiredText = (label: string) => z.string().trim().min(1, `${label} is required`);

export const requiredIsoDate = (label: string) =>
  z.string().trim().min(1, `${label} is required`).refine((v) => !Number.isNaN(new Date(v).getTime()), {
    message: `Enter a valid ${label.toLowerCase()}`,
  });

export function zodToFormErrors(error: z.ZodError, fallbackKey = "form"): ComplianceFormErrors {
  const errors: ComplianceFormErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join(".") : fallbackKey;
    if (errors[key] === undefined) errors[key] = issue.message;
  }
  return errors;
}

export function runSchema<TSchema extends z.ZodType>(schema: TSchema, data: z.input<TSchema>): ComplianceFormErrors {
  const result = schema.safeParse(data);
  return result.success ? {} : zodToFormErrors(result.error);
}
