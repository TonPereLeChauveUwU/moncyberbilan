import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema } from "@shared/schema";

export function registerRoutes(server: Server, app: Express) {
  // Submit quiz results and capture lead
  app.post("/api/leads", (req, res) => {
    try {
      const parsed = insertLeadSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid data", details: parsed.error.issues });
      }
      const lead = storage.createLead(parsed.data);
      res.status(201).json(lead);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get all leads (admin)
  app.get("/api/leads", (_req, res) => {
    try {
      const allLeads = storage.getLeads();
      res.json(allLeads);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
