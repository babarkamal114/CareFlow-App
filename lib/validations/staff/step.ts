import { complianceStepSchema } from "./compliance";
import { documentsStepSchema } from "./documents";
import { employmentStepSchema } from "./employment";
import { runSchema } from "./helpers";
import { personalStepSchema } from "./personal";
import { reviewStepSchema } from "./review";
import { skillsStepSchema } from "./skills";
import { trainingStepSchema } from "./training";
import type {
  StaffFormData,
  StaffFormErrors,
  StaffFormStepId,
} from "types";

/**
 * Validates a single step of the add-staff form. Each step owns its own
 * schema, so a step never reports errors belonging to another step.
 */
export function validateStep(
  step: StaffFormStepId,
  data: StaffFormData
): StaffFormErrors {
  switch (step) {
    case "personal":
      return runSchema(personalStepSchema, data);
    case "employment":
      return runSchema(employmentStepSchema, data);
    case "compliance":
      return runSchema(complianceStepSchema, data);
    case "training":
      return runSchema(trainingStepSchema, data);
    case "skills":
      return runSchema(skillsStepSchema, data);
    case "documents":
      return runSchema(documentsStepSchema, data, "documents");
    case "review":
      return runSchema(reviewStepSchema, data, "confirmed");
  }
}
