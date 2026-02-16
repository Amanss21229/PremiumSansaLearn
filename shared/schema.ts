import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const models = pgTable("models", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  grade: text("grade").notNull(),
  type: text("type").notNull(),
  thumbnail: text("thumbnail"),
  modelUrl: text("model_url"),
  isPremium: boolean("is_premium").default(false),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  modelId: integer("model_id").notNull(),
  question: text("question").notNull(),
  options: text("options").array().notNull(),
  correctAnswer: integer("correct_answer").notNull(),
});

export const insertModelSchema = createInsertSchema(models).omit({ id: true });
export const insertQuestionSchema = createInsertSchema(questions).omit({ id: true });

export type Model = typeof models.$inferSelect;
export type InsertModel = z.infer<typeof insertModelSchema>;
export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
