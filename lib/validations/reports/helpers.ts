import { z } from "zod";
import type { ReportFormErrors } from "types";

export const requiredText = (label: string) => z.string().trim().min(1, `${label} is required`);

export function requiredChoice<T extends readonly [string, ...string[]]>(values: T, label: string) {
  return z.union([z.literal(""), z.enum(values)]).superRefine((v, ctx) => {
    if (v === "") ctx.addIssue({ code: "custom", message: `${label} is required` });
  });
}

export function zodToFormErrors(error: z.ZodError): ReportFormErrors {
  const errors: ReportFormErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join(".") : "form";
    if (errors[key] === undefined) errors[key] = issue.message;
  }
  return errors;
}

export function runSchema<T extends z.ZodType>(schema: T, data: z.input<T>): ReportFormErrors {
  const result = schema.safeParse(data);
  return result.success ? {} : zodToFormErrors(result.error);
}
