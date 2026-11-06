import { z } from "zod";
import type { PatientEditData, PatientFormErrors } from "types";
import {
  requiredChoice,
  requiredText,
  runSchema,
} from "./helpers";
import {
  PATIENT_RISK_VALUES,
  PATIENT_STATUS_VALUES,
  dateOfBirthField,
  emailField,
  nhsNumberField,
  optionalPhoneField,
  phoneField,
} from "./patient-fields";

export const editPatientSchema = z.object({
  name: requiredText("Name"),
  dateOfBirth: dateOfBirthField,
  nhsNumber: nhsNumberField.optional(),
  email: emailField,
  phone: phoneField,
  address: requiredText("Address"),
  risk: requiredChoice(PATIENT_RISK_VALUES, "Risk level"),
  status: requiredChoice(PATIENT_STATUS_VALUES, "Status"),
  gpPhone: optionalPhoneField.optional(),
  nextOfKinPhone: optionalPhoneField.optional(),
  emergencyPhone: optionalPhoneField.optional(),
});

export function validateEditPatientForm(
  formData: Partial<PatientEditData>
): PatientFormErrors {
  // The modal keeps the form as Partial<...>; missing required values count as empty.
  return runSchema(editPatientSchema, {
    ...formData,
    name: formData.name ?? "",
    dateOfBirth: formData.dateOfBirth ?? "",
    email: formData.email ?? "",
    phone: formData.phone ?? "",
    address: formData.address ?? "",
    risk: formData.risk ?? "",
    status: formData.status ?? "",
  });
}