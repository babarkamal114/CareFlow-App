import { z } from "zod";
import type { MedFormErrors } from "types";

export const requiredText = (label: string) => z.string().trim().min(1, `${label} is required`);

export function requiredChoice<T extends readonly [string, ...string[]]>(values: T, label: string) {
  return z.union([z.literal(""), z.enum(values)]).superRefine((v, ctx) => {
    if (v === "") ctx.addIssue({ code: "custom", message: `${label} is required` });
  });
}

export const requiredIsoDate = (label: string) =>
  z.string().trim().min(1, `${label} is required`).refine((v) => !Number.isNaN(new Date(v).getTime()), {
    message: `Enter a valid ${label.toLowerCase()}`,
  });

export function zodToFormErrors(error: z.ZodError): MedFormErrors {
  const errors: MedFormErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join(".") : "form";
    if (errors[key] === undefined) errors[key] = issue.message;
  }
  return errors;
}

export function runSchema<T extends z.ZodType>(schema: T, data: z.input<T>): MedFormErrors {
  const result = schema.safeParse(data);
  return result.success ? {} : zodToFormErrors(result.error);
}
