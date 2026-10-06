import { z } from "zod";
import { requiredTrue } from "./helpers";

export const reviewStepSchema = z.object({
  confirmed: requiredTrue("Confirm the details before creating the staff member"),
});
