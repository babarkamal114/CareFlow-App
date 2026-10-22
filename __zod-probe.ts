import { z } from "zod";

const requiredText = (label: string) => z.string().trim().min(1, `${label} is required`);
const requiredChoice = <T extends readonly [string, ...string[]]>(values: T, label: string) =>
  z.union([z.literal(""), z.enum(values)], { error: `${label} is required` });

const roleSchema = requiredChoice(["a", "b"] as const, "Role");
type RoleInput = z.input<typeof roleSchema>;
const check: RoleInput = "";

function runSchema<T extends z.ZodType>(schema: T, data: z.input<T>) {
  return schema.safeParse(data);
}
const numSchema = z.union([z.literal(""), z.number()], { error: "Hours is required" });
type NumInput = z.input<typeof numSchema>;
const n: NumInput = "";

// superRefine paths
const arr = z.array(z.object({ times: z.string() })).min(1, "Add one").superRefine((slots, ctx) => {
  ctx.addIssue({ code: "custom", path: [0, "times"], message: "bad" });
});
const res = arr.safeParse([{ times: "x" }]);
console.log(JSON.stringify(res.error?.issues.map((i) => [i.path.join("."), i.message])));
void check; void n;
