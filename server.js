import express from "express";
import pg from "pg";
import serverless from "serverless-http";
import { join } from "node:path";

const app = express();
const dir = process.cwd();
const pool = new pg.Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || "starter",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

app.use(express.json());

async function db(sql, params = []) {
  await pool.query("create table if not exists todos (id bigserial primary key, text text not null, done boolean not null default false, created_at timestamptz not null default now())");
  return pool.query(sql, params);
}

app.get("/api/todos", async (_req, res) => {
  const result = await db("select id, text, done from todos order by id");
  res.json(result.rows);
});

app.post("/api/todos", async (req, res) => {
  const text = String(req.body?.text || "").trim();
  if (!text) return res.status(400).json({ error: "Todo text is required." });
  const result = await db("insert into todos (text) values ($1) returning id, text, done", [text]);
  res.status(201).json(result.rows[0]);
});

app.put("/api/todos/:id", async (req, res) => {
  const result = await db("update todos set done = $1 where id = $2 returning id, text, done", [Boolean(req.body?.done), req.params.id]);
  if (!result.rowCount) return res.status(404).json({ error: "Todo not found." });
  res.json(result.rows[0]);
});

app.delete("/api/todos/:id", async (req, res) => {
  await db("delete from todos where id = $1", [req.params.id]);
  res.json({ ok: true });
});

app.use(express.static(join(dir, "dist")));
app.get(/.*/, (_req, res) => res.sendFile(join(dir, "dist", "index.html")));

if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  app.listen(3001, () => console.log("API: http://localhost:3001"));
}

export const handler = serverless(app);
