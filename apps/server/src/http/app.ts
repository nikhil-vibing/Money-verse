import { Hono } from "hono";

export function createHttpApp(): Hono {
  const app = new Hono();

  app.get("/health", (c) => c.json({ ok: true }));

  app.get("/version", (c) =>
    c.json({ name: "money-verse-server", version: "0.1.0" }),
  );

  return app;
}
