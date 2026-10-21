import { z } from "zod";
import type { ComplianceFormErrors } from "types";
import { runSchema } from "./helpers";

export const auditDateRangeSchema = z
  .object({ from: z.string(), to: z.string() })
  .superRefine((data, ctx) => {
    if (data.from && data.to && new Date(data.to) < new Date(data.from)) {
      ctx.addIssue({ code: "custom", path: ["to"], message: "End date must be on or after the start date" });
    }
  });

export const validateAuditDateRange = (from: string, to: string): ComplianceFormErrors =>
  runSchema(auditDateRangeSchema, { from, to });
