import { z } from "zod";
import type { ScheduleFormErrors } from "types";

/** 24h time, HH:mm */
export const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export function requiredText(label: string) {
  return z.string().trim().min(1, `${label} is required`);
}

export function requiredTime(label: string) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .regex(TIME_REGEX, `Enter a valid ${label.toLowerCase()} (HH:mm)`);
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

/** Whole number within [min, max]. An empty field counts as missing. */
export function requiredNumberInRange(
  label: string,
  min: number,
  max: number,
  unit = ""
) {
  const suffix = unit ? ` ${unit}` : "";
  return z.union([z.literal(""), z.number()]).superRefine((value, ctx) => {
    if (value === "") {
      ctx.addIssue({ code: "custom", message: `${label} is required` });
      return;
    }
    if (!Number.isInteger(value) || value < min || value > max) {
      ctx.addIssue({
        code: "custom",
        message: `${label} must be between ${min} and ${max}${suffix}`,
      });
    }
  });
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

/** Minutes since midnight for a valid HH:mm string, otherwise null. */
export function timeToMinutes(time: string): number | null {
  if (!TIME_REGEX.test(time)) return null;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function hasErrors(errors: ScheduleFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function zodToFormErrors(
  error: z.ZodError,
  fallbackKey = "form"
): ScheduleFormErrors {
  const errors: ScheduleFormErrors = {};

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
): ScheduleFormErrors {
  const result = schema.safeParse(data);
  return result.success ? {} : zodToFormErrors(result.error, fallbackKey);
}