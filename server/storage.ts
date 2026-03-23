import { leads, type Lead, type InsertLead } from "@shared/schema";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);

export interface IStorage {
  createLead(lead: InsertLead): Lead;
  getLeads(): Lead[];
  getLeadByEmail(email: string): Lead | undefined;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        name TEXT,
        company TEXT,
        role TEXT,
        score INTEGER NOT NULL,
        level TEXT NOT NULL,
        answers TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);
  }

  createLead(lead: InsertLead): Lead {
    return db.insert(leads).values(lead).returning().get()!;
  }

  getLeads(): Lead[] {
    return db.select().from(leads).all();
  }

  getLeadByEmail(email: string): Lead | undefined {
    const { eq } = require("drizzle-orm");
    return db.select().from(leads).where(eq(leads.email, email)).get();
  }
}

export const storage = new DatabaseStorage();
