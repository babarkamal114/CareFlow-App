import { z } from "zod";
import type { FinanceFormErrors, RecordPaymentFormData } from "types";
import { formatCurrency } from "utils";
import { requiredChoice, requiredIsoDate, requiredText, runSchema } from "../staff/helpers";
import { MAX_PAYMENT_REFERENCE_LENGTH, PAYMENT_METHOD_VALUES } from "./constants";

export function buildRecordPaymentSchema(balance: number) {
  return z.object({
    invoiceId: requiredText("Invoice"),
    amount: z.union([z.literal(""), z.number()]).superRefine((value, ctx) => {
      if (value === "") {
        ctx.addIssue({ code: "custom", message: "Amount is required" });
      } else if (!(value > 0)) {
        ctx.addIssue({ code: "custom", message: "Amount must be greater than £0" });
      } else if (value > balance + 0.001) {
        ctx.addIssue({
          code: "custom",
          message: `Amount cannot exceed the outstanding balance of ${formatCurrency(balance)}`,
        });
      }
    }),
    method: requiredChoice(PAYMENT_METHOD_VALUES, "Payment method"),
    receivedDate: requiredIsoDate("Payment date").refine(
      (value) => new Date(value).getTime() <= Date.now() + 86400000,
      { message: "Payment date cannot be in the future" },
    ),
    reference: z.string().trim().max(MAX_PAYMENT_REFERENCE_LENGTH, `Reference must be ${MAX_PAYMENT_REFERENCE_LENGTH} characters or fewer`),
  });
}

export const validateRecordPayment = (data: RecordPaymentFormData, balance: number): FinanceFormErrors =>
  runSchema(buildRecordPaymentSchema(balance), data);