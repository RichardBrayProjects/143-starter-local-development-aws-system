import * as todoRepository from "../database/repositories/todoRepository.js";

export function listTodos() {
  return todoRepository.listTodos();
}

export function createTodo(input) {
  const text = String(input?.text || "").trim();
  if (!text) {
    const error = new Error("Todo text is required.");
    error.statusCode = 400;
    throw error;
  }
  return todoRepository.createTodo(text);
}

export async function updateTodoDone(id, input) {
  const todo = await todoRepository.updateTodoDone(id, Boolean(input?.done));
  if (!todo) {
    const error = new Error("Todo not found.");
    error.statusCode = 404;
    throw error;
  }
  return todo;
}

export async function deleteTodo(id) {
  await todoRepository.deleteTodo(id);
  return { ok: true };
}
