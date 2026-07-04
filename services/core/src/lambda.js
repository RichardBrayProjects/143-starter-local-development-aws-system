import serverless from "serverless-http";
import { join } from "node:path";
import { migrate } from "./database/migrate.js";
import { createApp } from "./app.js";

const app = createApp({ staticDir: join(process.cwd(), "dist") });
const serverlessHandler = serverless(app);

export async function handler(event, context) {
  await migrate();
  return serverlessHandler(event, context);
}
