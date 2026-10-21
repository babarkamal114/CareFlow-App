import { z } from "zod";
import {
  EMAIL_REGEX,
  UK_PHONE_REGEX,
  requiredIsoDate,
  requiredText,
} from "./helpers";

/** NHS numbers are 10 digits, usually written as "123 456 7890". */
const NHS_NUMBER_REGEX = /^\d{10}$/;

export const emailField = requiredText("Email").refine(
  (value) => EMAIL_REGEX.test(value),
  { error: "Enter a valid email address" }
);

export const phoneField = requiredText("Phone number").refine(
  (value) => UK_PHONE_REGEX.test(value),
  { error: "Enter a valid phone number" }
);

/** Optional phone: empty is fine, anything typed must look like a phone number. */
export const optionalPhoneField = z
  .string()
  .trim()
  .refine((value) => value === "" || UK_PHONE_REGEX.test(value), {
    error: "Enter a valid phone number",
  });

/** Optional NHS number: empty is fine, otherwise exactly 10 digits. */
export const nhsNumberField = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || NHS_NUMBER_REGEX.test(value.replace(/\s/g, "")),
    { error: "NHS number must be 10 digits" }
  );

export const dateOfBirthField = requiredIsoDate("Date of birth").refine(
  (value) => new Date(value).getTime() <= Date.now(),
  { error: "Date of birth cannot be in the future" }
);

export const PATIENT_RISK_VALUES = ["low", "medium", "high"] as const;
export const PATIENT_STATUS_VALUES = [
  "active",
  "on-hold",
  "new",
  "discharged",
] as const;