import { z } from "zod";
import type { ComplianceFormErrors, SignDocumentFormData } from "types";
import { runSchema } from "./helpers";

export const signDocumentSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Type your full name to sign")
    .refine((v) => v.split(/\s+/).filter(Boolean).length >= 2, { message: "Enter your first and last name" })
    .refine((v) => v.length <= 80, { message: "Name must be 80 characters or fewer" }),
  agreed: z.boolean().refine((v) => v === true, { message: "Confirm that you are signing this document" }),
});

export const validateSignDocument = (data: SignDocumentFormData): ComplianceFormErrors =>
  runSchema(signDocumentSchema, data);
