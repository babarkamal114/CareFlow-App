import { z } from "zod";
import {
  requiredChoice,
  requiredIsoDate,
  requiredNumber,
} from "./helpers";

const STAFF_ROLE_VALUES = [
  "care_assistant",
  "senior_carer",
  "care_coordinator",
  "registered_manager",
  "admin",
  "other",
] as const;

const EMPLOYMENT_TYPE_VALUES = ["employed", "bank", "agency"] as const;

const PAY_RATE_TYPE_VALUES = [
  "standard",
  "weekend",
  "sleep_in",
  "waking_night",
] as const;

const MAX_CONTRACTED_HOURS = 168;

export const employmentStepSchema = z
  .object({
    role: requiredChoice(STAFF_ROLE_VALUES, "Role"),
    employmentType: requiredChoice(EMPLOYMENT_TYPE_VALUES, "Employment type"),
    startDate: requiredIsoDate("Start date"),
    contractedHoursPerWeek: requiredNumber("Contracted hours").refine(
      (value) => value === "" || value > 0,
      "Hours must be greater than 0"
    ),
    payRatePerHour: requiredNumber("Pay rate").refine(
      (value) => value === "" || value > 0,
      "Pay rate must be greater than 0"
    ),
    payRateType: requiredChoice(PAY_RATE_TYPE_VALUES, "Pay rate type"),
    managerId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      typeof data.contractedHoursPerWeek === "number" &&
      data.contractedHoursPerWeek > MAX_CONTRACTED_HOURS
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["contractedHoursPerWeek"],
        message: `Hours cannot exceed ${MAX_CONTRACTED_HOURS} per week`,
      });
    }

    if (data.role === "registered_manager" && !data.managerId) {
      ctx.addIssue({
        code: "custom",
        path: ["managerId"],
        message: "A registered manager must have a named manager on record",
      });
    }
  });