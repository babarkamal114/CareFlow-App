import { z } from "zod";
import type { MedFormErrors, MedicationFormData } from "types";
import { FREQUENCY_VALUES, MEDICATION_TYPE_VALUES, ROUTE_VALUES, TIME_REGEX } from "./constants";
import { requiredChoice, requiredIsoDate, requiredText, runSchema } from "./helpers";

const optionalNumber = z.union([z.literal(""), z.number()]);

export const medicationFormSchema = z
  .object({
    patientId: requiredText("Patient"),
    drugName: requiredText("Drug name").pipe(z.string().min(2, "Enter the full drug name").max(80, "Drug name is too long")),
    strength: requiredText("Dose / strength").pipe(z.string().max(40, "Dose is too long")),
    route: requiredChoice(ROUTE_VALUES, "Route"),
    type: requiredChoice(MEDICATION_TYPE_VALUES, "Type"),
    frequency: requiredChoice(FREQUENCY_VALUES, "Frequency"),
    times: z.array(z.string()),
    prescriber: requiredText("Prescriber"),
    startDate: requiredIsoDate("Start date"),
    endDate: z.string().trim(),
    indication: requiredText("Indication"),
    instructions: z.string().trim().max(200, "Keep instructions under 200 characters"),
    schedule: z.union([z.literal(""), z.literal("2"), z.literal("3")]),
    prnMinIntervalHours: optionalNumber,
    prnMaxPer24h: optionalNumber,
  })
  .superRefine((d, ctx) => {
    const add = (path: string, message: string) => ctx.addIssue({ code: "custom", path: [path], message });
    const isPrn = d.type === "prn" || d.frequency === "as-required";

    if (!isPrn) {
      if (d.times.length === 0) add("times", "Add at least one administration time");
      else if (d.times.some((t) => !TIME_REGEX.test(t))) add("times", "Enter every time as HH:MM");
      else if (new Set(d.times).size !== d.times.length) add("times", "Each time must be different");
    }
    if (d.type === "short-course") {
      if (d.endDate === "") add("endDate", "A short course needs an end date");
      else if (new Date(d.endDate) < new Date(d.startDate)) add("endDate", "End date must be on or after the start date");
    }
    if (d.type === "controlled" && d.schedule === "") add("schedule", "Choose the controlled drug schedule (2 or 3)");
    if (isPrn) {
      if (d.prnMinIntervalHours === "" || d.prnMinIntervalHours < 0) add("prnMinIntervalHours", "Set the minimum hours between doses");
      if (d.prnMaxPer24h === "" || d.prnMaxPer24h < 1) add("prnMaxPer24h", "Set the maximum doses in 24 hours");
    }
  });

export const validateMedicationForm = (data: MedicationFormData): MedFormErrors => runSchema(medicationFormSchema, data);
