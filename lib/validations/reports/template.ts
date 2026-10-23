import { z } from "zod";
import type { ReportBuilderConfig, ReportFormErrors, ReportColumn, ReportTemplateFormData } from "types";
import { requiredText, runSchema } from "./helpers";

export const templateSchema = z.object({
  name: requiredText("Template name").pipe(z.string().min(3, "Use at least 3 characters").max(60, "Keep it under 60 characters")),
});
export const validateTemplate = (data: ReportTemplateFormData): ReportFormErrors => runSchema(templateSchema, data);

export function validateBuilderConfig(config: ReportBuilderConfig, columns: ReportColumn[]): ReportFormErrors {
  const errors: ReportFormErrors = {};
  if (config.fields.length === 0) errors.fields = "Pick at least one field";
  if (config.groupBy && !columns.find((c) => c.key === config.groupBy)?.groupable) errors.groupBy = "That field can't be grouped";
  if (config.from && config.to && new Date(config.to) < new Date(config.from)) errors.to = "End date must be on or after the start date";
  return errors;
}
