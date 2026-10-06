import { z } from "zod";
import type { StaffFormErrors } from "types";

export const UK_POSTCODE_REGEX = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;

export const NI_REGEX = /^[A-CEGHJ-PR-TW-Z]{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?[A-D]$/i;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const UK_PHONE_REGEX = /^[+()0-9][0-9\s()-]{7,}$/;

export const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export function requiredText(label: string) {
  return z.string().trim().min(1, `${label} is required`);
}

export function requiredChoice<TValues extends readonly [string, ...string[]]>(
  values: TValues,
  label: string
) {
  return z.union([z.literal(""), z.enum(values)]).superRefine((value, ctx) => {
    if (value === "") {
      ctx.addIssue({ code: "custom", message: `${label} is required` });
    }
  });
}

export function requiredNumber(label: string) {
  return z.union([z.literal(""), z.number()]).superRefine((value, ctx) => {
    if (value === "") {
      ctx.addIssue({ code: "custom", message: `${label} is required` });
    }
  });
}

export function requiredTrue(message: string) {
  return z.boolean().refine((value) => value === true, { error: message });
}

export function requiredIsoDate(label: string) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      error: `Enter a valid ${label.toLowerCase()}`,
    });
}

export function hasErrors(errors: StaffFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function zodToFormErrors(
  error: z.ZodError,
  fallbackKey = "form"
): StaffFormErrors {
  const errors: StaffFormErrors = {};

  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join(".") : fallbackKey;
    if (errors[key] === undefined) {
      errors[key] = issue.message;
    }
  }

  return errors;
}

export function runSchema<TSchema extends z.ZodType>(
  schema: TSchema,
  data: z.input<TSchema>,
  fallbackKey?: string
): StaffFormErrors {
  const result = schema.safeParse(data);
  return result.success ? {} : zodToFormErrors(result.error, fallbackKey);
}