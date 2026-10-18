import { z } from "zod";

export const reviewStepSchema = z.object({
  confirmed: z.literal(true, {
    error: "Confirm the details before creating the staff member",
  }),
});
