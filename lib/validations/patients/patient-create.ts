import { z } from "zod";
import type { PatientFormData, PatientFormErrors, PatientStepKey } from "types";
import { requiredText, runSchema } from "./helpers";
import {
  dateOfBirthField,
  emailField,
  nhsNumberField,
  optionalPhoneField,
  phoneField,
} from "./patient-fields";

const personalStepSchema = z.object({
  name: requiredText("Patient name"),
  dateOfBirth: dateOfBirthField,
  nhsNumber: nhsNumberField,
  email: emailField,
  phone: phoneField,
  address: requiredText("Address"),
  gpPhone: optionalPhoneField,
  nextOfKinPhone: optionalPhoneField,
  emergencyPhone: optionalPhoneField,
});

const contactsStepSchema = z.object({
  contacts: z
    .array(z.unknown())
    .min(1, "Add at least one key contact before continuing"),
});

const carersStepSchema = z.object({
  selectedCarers: z
    .array(z.string())
    .min(1, "Select at least one carer before continuing"),
});

export const PATIENT_STEP_SCHEMAS: Partial<Record<PatientStepKey, z.ZodType>> = {
  personal: personalStepSchema,
  contacts: contactsStepSchema,
  carers: carersStepSchema,
};

/** Validates one wizard step. Returns {} when the step is valid. */
export function validatePatientStep(
  step: PatientStepKey | undefined,
  formData: PatientFormData
): PatientFormErrors {
  const schema = step ? PATIENT_STEP_SCHEMAS[step] : undefined;
  return schema ? runSchema(schema, formData) : {};
}

/** Validates every step, used on the final submit as a safety net. */
export function validateAllPatientSteps(
  formData: PatientFormData
): PatientFormErrors {
  return Object.values(PATIENT_STEP_SCHEMAS).reduce<PatientFormErrors>(
    (errors, schema) => ({ ...runSchema(schema, formData), ...errors }),
    {}
  );
}