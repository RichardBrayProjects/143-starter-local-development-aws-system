import pg from "pg";
import { getDatabaseConfig } from "../config/databaseConfig.js";

let poolPromise;

export function getPool() {
  poolPromise ||= createPool();
  return poolPromise;
}

async function createPool() {
  return new pg.Pool(await getDatabaseConfig());
}
