import { Router } from "express";
import * as todoService from "../services/todoService.js";

export const todoRoutes = Router();

todoRoutes.get("/todos", async (_req, res, next) => {
  try {
    res.json(await todoService.listTodos());
  } catch (error) {
    next(error);
  }
});

todoRoutes.post("/todos", async (req, res, next) => {
  try {
    res.status(201).json(await todoService.createTodo(req.body));
  } catch (error) {
    next(error);
  }
});

todoRoutes.put("/todos/:id", async (req, res, next) => {
  try {
    res.json(await todoService.updateTodoDone(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
});

todoRoutes.delete("/todos/:id", async (req, res, next) => {
  try {
    res.json(await todoService.deleteTodo(req.params.id));
  } catch (error) {
    next(error);
  }
});
