import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const models = pgTable("models", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // e.g., "Biology", "Chemistry"
  grade: text("grade").notNull(), // e.g., "Class 10"
  type: text("type").notNull(), // e.g., "organ", "molecule"
  thumbnail: text("thumbnail"),
  modelUrl: text("model_url"), // URL to 3D model file (mocked for now)
  isPremium: boolean("is_premium").default(false),
});

export const insertModelSchema = createInsertSchema(models).omit({ id: true });

export type Model = typeof models.$inferSelect;
export type InsertModel = z.infer<typeof insertModelSchema>;
