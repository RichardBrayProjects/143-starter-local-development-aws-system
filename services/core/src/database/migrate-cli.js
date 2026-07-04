import { migrate } from "./migrate.js";
import { getPool } from "./pool.js";

try {
  await migrate();
  console.log("Database migrations complete.");
} finally {
  const pool = await getPool();
  await pool.end();
}
