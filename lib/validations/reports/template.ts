import { z } from "zod";
import type { ReportFormErrors, ReportTemplateFormData } from "types";
import { requiredText, runSchema } from "utils";

export const templateSchema = z.object({
  name: requiredText("Template name").pipe(z.string().min(3, "Use at least 3 characters").max(60, "Keep it under 60 characters")),
});
export const validateTemplate = (data: ReportTemplateFormData): ReportFormErrors => runSchema(templateSchema, data);
