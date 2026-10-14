import { z } from "zod";
import {
  VISIT_TYPES,
  type ScheduleFormErrors,
  type VisitTemplateFormData,
} from "types";
import {
  requiredChoice,
  requiredNumberInRange,
  requiredText,
  runSchema,
} from "./helpers";

const MAX_TASKS = 20;

export const visitTemplateFormSchema = z.object({
  name: requiredText("Template name").max(
    80,
    "Template name must be 80 characters or fewer"
  ),
  type: requiredChoice(VISIT_TYPES, "Visit type"),
  durationMinutes: requiredNumberInRange("Duration", 15, 480, "minutes"),
  tasks: requiredText("At least one task").superRefine((value, ctx) => {
    const lines = value.split("\n").filter((line) => line.trim() !== "");
    if (lines.length > MAX_TASKS) {
      ctx.addIssue({
        code: "custom",
        message: `Add up to ${MAX_TASKS} tasks`,
      });
    }
  }),
  requiredSkills: z.array(z.string()),
});

export function validateVisitTemplateForm(
  data: VisitTemplateFormData
): ScheduleFormErrors {
  return runSchema(visitTemplateFormSchema, data);
}