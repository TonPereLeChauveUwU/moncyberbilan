import type { Express } from "express";
import type { Server } from "http";

export function registerRoutes(_server: Server, app: Express) {
  // No collection API: also prevent the SPA fallback from answering legacy requests.
  app.use("/api", (_req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.status(404).json({ error: "Route inexistante." });
  });
}
