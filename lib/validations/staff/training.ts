import { z } from "zod";
import { requiredText } from "./helpers";

const TRAINING_STATUS_VALUES = [
  "completed",
  "booked",
  "not_started",
  "expired",
] as const;

const qualificationSchema = z.object({
  name: requiredText("Qualification name"),
  awardedDate: requiredText("Awarded date"),
});

const trainingRecordSchema = z
  .object({
    module: requiredText("Module"),
    status: z.enum(TRAINING_STATUS_VALUES).refine(
      (value) => value !== "expired",
      "Expired training must be rebooked before this step can continue"
    ),
    completedDate: z.string().optional(),
  })
  .superRefine((record, ctx) => {
    if (record.status === "completed" && !record.completedDate) {
      ctx.addIssue({
        code: "custom",
        path: ["completedDate"],
        message: "Completed date is required",
      });
    }
  });

export const trainingStepSchema = z.object({
  qualifications: z.array(qualificationSchema).min(1, {
    error: "Add at least one qualification to continue",
  }),
  mandatoryTraining: z.array(trainingRecordSchema),
});
