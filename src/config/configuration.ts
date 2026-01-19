import { validateEnv, type Env } from '@/config/env.schema';

const buildMongoUri = (env: Env): string => {
  const auth =
    env.MONGO_USERNAME && env.MONGO_PASSWORD
      ? `${encodeURIComponent(env.MONGO_USERNAME)}:${encodeURIComponent(
          env.MONGO_PASSWORD
        )}@`
      : '';

  return `mongodb://${auth}${env.MONGO_HOST}:${env.MONGO_PORT}/${env.MONGO_DATABASE}`;
};

export const configuration = (): AppConfig => {
  const env = validateEnv(process.env);

  return {
    port: env.SERVER_PORT,
    crm: {
      baseUrl: env.CRM_BASE_URL,
      timeoutMs: env.CRM_TIMEOUT_MS,
      pollIntervalMs: env.CRM_POLL_INTERVAL_MS,
    },
    database: {
      uri: buildMongoUri(env),
    },
  };
};

export type AppConfig = {
  port: number;
  crm: {
    baseUrl: string;
    timeoutMs: number;
    pollIntervalMs: number;
  };
  database: {
    uri: string;
  };
};
