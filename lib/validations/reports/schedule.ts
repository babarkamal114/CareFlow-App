import { z } from "zod";
import type { ReportFormErrors, ReportScheduleFormData } from "types";
import { REPORT_EMAIL_REGEX, REPORT_FREQUENCY_VALUES, REPORT_MAX_RECIPIENTS, REPORT_TIME_REGEX } from "config";
import { parseRecipients, requiredChoice, reportRequiredText, reportRunSchema } from "app-utils/reports";

export const scheduleSchema = z
  .object({
    reportId: reportRequiredText("Report"),
    frequency: requiredChoice(REPORT_FREQUENCY_VALUES, "Frequency"),
    time: z.string().regex(REPORT_TIME_REGEX, "Enter the time as HH:MM"),
    dayOfWeek: z.union([z.literal(""), z.number()]),
    dayOfMonth: z.union([z.literal(""), z.number()]),
    recipients: z.string(),
  })
  .superRefine((d, ctx) => {
    const add = (path: string, message: string) => ctx.addIssue({ code: "custom", path: [path], message });
    if (d.frequency === "weekly" && d.dayOfWeek === "") add("dayOfWeek", "Choose the day of the week");
    if (d.frequency === "monthly" && (d.dayOfMonth === "" || d.dayOfMonth < 1 || d.dayOfMonth > 28)) add("dayOfMonth", "Choose a day between 1 and 28");
    const list = parseRecipients(d.recipients);
    if (list.length === 0) add("recipients", "Add at least one email address");
    else if (list.length > REPORT_MAX_RECIPIENTS) add("recipients", `No more than ${REPORT_MAX_RECIPIENTS} recipients`);
    else {
      const bad = list.find((e) => !REPORT_EMAIL_REGEX.test(e));
      if (bad) add("recipients", `"${bad}" is not a valid email address`);
    }
  });

export const validateSchedule = (data: ReportScheduleFormData): ReportFormErrors => reportRunSchema(scheduleSchema, data);
