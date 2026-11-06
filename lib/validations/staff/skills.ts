import { z } from "zod";
import {
  TIME_REGEX,
  UK_POSTCODE_REGEX,
  requiredText,
} from "./helpers";

const DAY_OF_WEEK_VALUES = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
] as const;

const availabilitySlotSchema = z.object({
  day: z.enum(DAY_OF_WEEK_VALUES),
  startTime: z.string(),
  endTime: z.string(),
});

export const skillsStepSchema = z
  .object({
    languages: z.array(requiredText("Language")).min(1, {
      error: "Add at least one language",
    }),
    skills: z.array(requiredText("Skill")).min(1, {
      error: "Add at least one skill",
    }),
    workAreaPostcode: z
      .string()
      .trim()
      .min(1, "Work area postcode is required")
      .regex(UK_POSTCODE_REGEX, "Enter a valid UK postcode"),
    availability: z
      .array(availabilitySlotSchema)
      .min(1, { error: "Add at least one weekly availability slot" })
      .superRefine((slots, ctx) => {
        const seenDays = new Set<string>();

        slots.forEach((slot, index) => {
          if (!slot.startTime || !slot.endTime) {
            ctx.addIssue({
              code: "custom",
              path: [index, "times"],
              message: "Set both a start and end time",
            });
          } else if (
            !TIME_REGEX.test(slot.startTime) ||
            !TIME_REGEX.test(slot.endTime)
          ) {
            ctx.addIssue({
              code: "custom",
              path: [index, "times"],
              message: "Enter times as HH:MM",
            });
          } else if (slot.endTime <= slot.startTime) {
            ctx.addIssue({
              code: "custom",
              path: [index, "times"],
              message: "End time must be after the start time",
            });
          }

          if (seenDays.has(slot.day)) {
            ctx.addIssue({
              code: "custom",
              path: [index, "day"],
              message: "You already have a slot on this day",
            });
          }
          seenDays.add(slot.day);
        });
      }),
  });
