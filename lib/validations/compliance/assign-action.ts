import { z } from "zod";
import type { AssignActionFormData, ComplianceFormErrors } from "types";
import { requiredIsoDate, requiredText, runSchema } from "./helpers";

export const assignActionSchema = z.object({
  label: requiredText("Action").pipe(z.string().min(3, "Describe the action in a few words").max(140, "Keep it under 140 characters")),
  owner: requiredText("Owner"),
  dueDate: requiredIsoDate("Due date"),
});

export const validateAssignAction = (data: AssignActionFormData): ComplianceFormErrors =>
  runSchema(assignActionSchema, data);
