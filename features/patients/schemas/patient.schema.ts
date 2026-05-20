// features/patients/schemas/patient.schema.ts
// Zod schema + DTO types for the Patients feature.
// Expanded to include all fields shown in the Figma patients page.

import { z } from "zod";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const RiskLevelSchema = z.enum(["Low", "Medium", "High"]);
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

export const PatientStatusSchema = z.enum(["Active", "On Hold", "New", "Discharged"]);
export type PatientStatus = z.infer<typeof PatientStatusSchema>;

export const CarePlanStatusSchema = z.enum([
  "Current",
  "Review Due",
  "Overdue",
  "In Setup",
  "Paused",
]);
export type CarePlanStatus = z.infer<typeof CarePlanStatusSchema>;

// ─── Patient DTO ──────────────────────────────────────────────────────────────

export const patientDtoSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  nhsNumber: z.string().nullable().optional(),

  // Figma UI fields
  initials: z.string().max(3),
  age: z.number().int().positive(),
  address: z.string(),
  risk: RiskLevelSchema,
  status: PatientStatusSchema,
  carer: z.string(),
  carePlanStatus: CarePlanStatusSchema,
  nextVisit: z.string(),
  isMissed: z.boolean().optional(),
  isHospital: z.boolean().optional(),
  isPending: z.boolean().optional(),
});

export type PatientDto = z.infer<typeof patientDtoSchema>;

// ─── Update schema (unchanged) ────────────────────────────────────────────────

export const patientUpdateSchema = z.object({
  id: z.string(),
  displayName: z.string().min(1).max(120),
});

export type PatientUpdateInput = z.infer<typeof patientUpdateSchema>;
