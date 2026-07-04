import { getPool } from "../pool.js";

export async function listTodos() {
  const pool = await getPool();
  const result = await pool.query("select id, text, done from todos order by id");
  return result.rows;
}

export async function createTodo(text) {
  const pool = await getPool();
  const result = await pool.query("insert into todos (text) values ($1) returning id, text, done", [text]);
  return result.rows[0];
}

export async function updateTodoDone(id, done) {
  const pool = await getPool();
  const result = await pool.query("update todos set done = $1 where id = $2 returning id, text, done", [done, id]);
  return result.rows[0] || null;
}

export async function deleteTodo(id) {
  const pool = await getPool();
  await pool.query("delete from todos where id = $1", [id]);
}
