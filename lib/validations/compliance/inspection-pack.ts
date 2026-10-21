import { z } from "zod";
import type { ComplianceFormErrors, InspectionPackFormData } from "types";
import { runSchema } from "./helpers";

export const PACK_SECTION_VALUES = [
  "staff-files", "patient-files", "compliance-dashboard", "policies", "complaints", "quality-assurance",
] as const;

export const inspectionPackSchema = z.object({
  sections: z.array(z.enum(PACK_SECTION_VALUES)).min(1, "Choose at least one section for the pack"),
  patientScope: z.enum(["all", "selected"]),
});

export const validateInspectionPack = (data: InspectionPackFormData): ComplianceFormErrors =>
  runSchema(inspectionPackSchema, data);
