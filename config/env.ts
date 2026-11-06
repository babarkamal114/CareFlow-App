import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    DATABASE_URL: z.url().optional(),
    API_URL: z.url().optional(),
    NEXTAUTH_SECRET: z.string().min(1),
    AUTH_URL: z.url().optional(),
    CRON_SECRET: z.string().optional(),
    
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.url().optional(),
    NEXT_PUBLIC_API_URL: z.url().optional()
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    API_URL: process.env.API_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    AUTH_URL: process.env.AUTH_URL,
    CRON_SECRET: process.env.CRON_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL

  },
  skipValidation:
    Boolean(process.env.SKIP_ENV_VALIDATION) ||
    Boolean(process.env.CI) ||
    process.env.NODE_ENV === "test",
  emptyStringAsUndefined: true,
});
