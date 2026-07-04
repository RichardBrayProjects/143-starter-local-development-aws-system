import express from "express";
import { join } from "node:path";
import { todoRoutes } from "./routes/todoRoutes.js";

export function createApp({ staticDir } = {}) {
  const app = express();

  app.use(express.json());
  app.use("/api", todoRoutes);

  if (staticDir) {
    app.use(express.static(staticDir));
    app.get(/.*/, (_req, res) => res.sendFile(join(staticDir, "index.html")));
  }

  app.use((error, _req, res, _next) => {
    res.status(error.statusCode || 500).json({ error: error.message || "Internal server error." });
  });

  return app;
}
