import { z } from "zod";
import {
  RECURRING_FREQUENCIES,
  SCHEDULE_DAYS,
  VISIT_TYPES,
  type RecurringVisitFormData,
  type ScheduleFormErrors,
} from "types";
import {
  requiredChoice,
  requiredIsoDate,
  requiredNumberInRange,
  requiredText,
  requiredTime,
  runSchema,
  timeToMinutes,
} from "./helpers";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MAX_RANGE_DAYS = 366;

export const recurringVisitFormSchema = z
  .object({
    patientId: requiredText("Patient"),
    carerId: z.string(),
    templateId: z.string(),
    type: requiredChoice(VISIT_TYPES, "Visit type"),
    startDate: requiredIsoDate("Start date"),
    endDate: requiredIsoDate("End date"),
    startTime: requiredTime("Start time"),
    durationMinutes: requiredNumberInRange("Duration", 15, 480, "minutes"),
    frequency: requiredChoice(RECURRING_FREQUENCIES, "Frequency"),
    days: z.array(z.enum(SCHEDULE_DAYS)),
  })
  .superRefine((value, ctx) => {
    const start = new Date(value.startDate).getTime();
    const end = new Date(value.endDate).getTime();

    if (!Number.isNaN(start) && !Number.isNaN(end)) {
      if (end < start) {
        ctx.addIssue({
          code: "custom",
          path: ["endDate"],
          message: "End date must be on or after the start date",
        });
      } else if ((end - start) / MS_PER_DAY > MAX_RANGE_DAYS) {
        ctx.addIssue({
          code: "custom",
          path: ["endDate"],
          message: "Recurring visits can run for up to 12 months",
        });
      }
    }

    // Daily visits ignore the day picker; weekly and fortnightly need one.
    if (
      (value.frequency === "weekly" || value.frequency === "fortnightly") &&
      value.days.length === 0
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["days"],
        message: "Choose at least one day",
      });
    }

    const startMinutes = timeToMinutes(value.startTime);
    if (
      startMinutes !== null &&
      value.durationMinutes !== "" &&
      startMinutes + value.durationMinutes > 24 * 60
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["durationMinutes"],
        message: "Visit must finish before midnight",
      });
    }
  });

export function validateRecurringVisitForm(
  data: RecurringVisitFormData
): ScheduleFormErrors {
  return runSchema(recurringVisitFormSchema, data);
}