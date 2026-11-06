import { z } from "zod";
import {
  VISIT_STATUSES,
  VISIT_TYPES,
  type EditVisitFormData,
  type ScheduleFormErrors,
  type VisitFormData,
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

const MINUTES_IN_DAY = 24 * 60;

/** Shared by add + edit. `carerId` may be empty: that makes an unassigned visit. */
const visitShape = {
  patientId: requiredText("Patient"),
  carerId: z.string(),
  date: requiredIsoDate("Date"),
  startTime: requiredTime("Start time"),
  durationMinutes: requiredNumberInRange("Duration", 15, 480, "minutes"),
  type: requiredChoice(VISIT_TYPES, "Visit type"),
  templateId: z.string(),
  title: requiredText("Title").max(80, "Title must be 80 characters or fewer"),
  location: z.string().trim().max(200, "Location must be 200 characters or fewer"),
  notes: z.string().trim().max(500, "Notes must be 500 characters or fewer"),
};

type VisitShapeValue = {
  startTime: string;
  durationMinutes: number | "";
};

/** A visit has to finish on the day it starts. */
function checkFinishesBeforeMidnight(
  value: VisitShapeValue,
  ctx: z.RefinementCtx
) {
  const start = timeToMinutes(value.startTime);
  if (start === null || value.durationMinutes === "") return;

  if (start + value.durationMinutes > MINUTES_IN_DAY) {
    ctx.addIssue({
      code: "custom",
      path: ["durationMinutes"],
      message: "Visit must finish before midnight",
    });
  }
}

export const visitFormSchema = z
  .object(visitShape)
  .superRefine(checkFinishesBeforeMidnight);

export const editVisitFormSchema = z
  .object({
    ...visitShape,
    status: requiredChoice(VISIT_STATUSES, "Status"),
  })
  .superRefine(checkFinishesBeforeMidnight);

export function validateVisitForm(data: VisitFormData): ScheduleFormErrors {
  return runSchema(visitFormSchema, data);
}

export function validateEditVisitForm(
  data: EditVisitFormData
): ScheduleFormErrors {
  return runSchema(editVisitFormSchema, data);
}