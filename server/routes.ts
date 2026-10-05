import type { Express } from "express";
import type { Server } from "http";
import reportHandler from "./report-handler";

export function registerRoutes(_server: Server, app: Express) {
  app.all("/api/leads", reportHandler);
}
