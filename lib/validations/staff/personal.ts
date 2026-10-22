import { z } from "zod";
import {
  EMAIL_REGEX,
  UK_PHONE_REGEX,
  UK_POSTCODE_REGEX,
  requiredIsoDate,
  requiredText,
} from "./helpers";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const MIN_STAFF_AGE = 16;
const MAX_STAFF_AGE = 75;

const addressSchema = z.object({
  line1: requiredText("Address line 1"),
  line2: z.string().optional(),
  city: requiredText("City"),
  postcode: z
    .string()
    .trim()
    .min(1, "Postcode is required")
    .regex(UK_POSTCODE_REGEX, "Enter a valid UK postcode"),
});

const emergencyContactSchema = z.object({
  name: requiredText("Emergency contact name"),
  relationship: requiredText("Relationship"),
  phone: z
    .string()
    .trim()
    .min(1, "Emergency contact phone is required")
    .regex(UK_PHONE_REGEX, "Enter a valid phone number"),
});

export const personalStepSchema = z
  .object({
    firstName: requiredText("First name"),
    lastName: requiredText("Last name"),
    dateOfBirth: requiredIsoDate("Date of birth"),
    nationalInsuranceNumber: z
      .string()
      .trim()
      .min(1, "National Insurance number is required"),
      // .regex(NI_REGEX, "Enter a valid NI number, e.g. AB123456C"),
    phone: z
      .string()
      .trim()
      .min(1, "Phone number is required")
      .regex(UK_PHONE_REGEX, "Enter a valid phone number"),
    email: z
      .string()
      .trim()
      .min(1, "Email address is required")
      .regex(EMAIL_REGEX, "Enter a valid email address"),
    address: addressSchema,
    emergencyContact: emergencyContactSchema,
  })
  .superRefine((data, ctx) => {
    const dob = new Date(data.dateOfBirth);
    const age = (Date.now() - dob.getTime()) / (365.25 * MS_PER_DAY);

    if (dob.getTime() > Date.now()) {
      ctx.addIssue({
        code: "custom",
        path: ["dateOfBirth"],
        message: "Date of birth cannot be in the future",
      });
      return;
    }

    if (age < MIN_STAFF_AGE) {
      ctx.addIssue({
        code: "custom",
        path: ["dateOfBirth"],
        message: `Staff must be at least ${MIN_STAFF_AGE} years old`,
      });
    } else if (age > MAX_STAFF_AGE) {
      ctx.addIssue({
        code: "custom",
        path: ["dateOfBirth"],
        message: "Check the date of birth is correct",
      });
    }
  });