import { z } from 'zod';

const envSchema = z.object({
  SERVER_PORT: z.coerce.number().min(1),

  CRM_BASE_URL: z.url().min(1),
  CRM_TIMEOUT_MS: z.coerce.number().min(1),
  CRM_POLL_INTERVAL_MS: z.coerce.number().min(1),

  MONGO_USERNAME: z.string().min(1),
  MONGO_PASSWORD: z.string().min(1),
  MONGO_DATABASE: z.string().min(1),
  MONGO_HOST: z.string().min(1),
  MONGO_PORT: z.coerce.number().min(1),
});

export const validateEnv = (env: Property): Env => {
  const parsed = envSchema.safeParse(env);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ');

    throw new Error(`Invalid environment variables: ${issues}`);
  }

  return parsed.data;
};

type Property = Record<string, string | undefined>;
export type Env = z.infer<typeof envSchema>;
