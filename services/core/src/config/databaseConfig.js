import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";

export function getDatabaseConfig() {
  const config = {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || "starter",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
  };

  return applySecret(config);
}

async function applySecret(config) {
  if (!process.env.DB_SECRET_ARN) return config;

  const client = new SecretsManagerClient({});
  const result = await client.send(new GetSecretValueCommand({ SecretId: process.env.DB_SECRET_ARN }));
  const secret = JSON.parse(result.SecretString || "{}");

  return {
    ...config,
    user: secret.username || config.user,
    password: secret.password || config.password,
  };
}
