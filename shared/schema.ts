import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull(),
  name: text("name"),
  company: text("company"),
  role: text("role"),
  score: integer("score").notNull(),
  level: text("level").notNull(),
  answers: text("answers").notNull(), // JSON string of answers
  createdAt: text("created_at").notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

// Quiz question types
export interface QuizQuestion {
  id: string;
  theme: string;
  themeIcon: string;
  question: string;
  options: QuizOption[];
}

export interface QuizOption {
  label: string;
  value: number; // 0-3 points
  explanation?: string;
}

export interface QuizResult {
  score: number;
  maxScore: number;
  percentage: number;
  level: "critique" | "faible" | "moyen" | "bon" | "excellent";
  themeScores: ThemeScore[];
  recommendations: string[];
}

export interface ThemeScore {
  theme: string;
  themeIcon: string;
  score: number;
  maxScore: number;
  percentage: number;
}
