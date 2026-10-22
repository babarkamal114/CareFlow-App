import { z } from "zod";

const STAFF_DOCUMENT_TYPE_VALUES = [
  "contract",
  "passport",
  "dbs_certificate",
  "training_cert",
  "other",
] as const;

const staffDocumentSchema = z.object({
  type: z.enum(STAFF_DOCUMENT_TYPE_VALUES),
  url: z.string(),
  uploadedAt: z.string(),
});

export const documentsStepSchema = z.object({
  documents: z
    .array(staffDocumentSchema)
    .refine((documents) => documents.some((doc) => doc.type === "contract"), {
      error: "Upload the signed contract to continue",
    }),
});
