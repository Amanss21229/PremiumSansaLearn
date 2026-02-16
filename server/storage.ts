import { db } from "./db";
import { models, type Model, type InsertModel, questions, type Question, type InsertQuestion } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getModels(): Promise<Model[]>;
  getModel(id: number): Promise<Model | undefined>;
  createModel(model: InsertModel): Promise<Model>;
  getQuestions(modelId: number): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
}

export class DatabaseStorage implements IStorage {
  async getModels(): Promise<Model[]> {
    return await db.select().from(models);
  }

  async getModel(id: number): Promise<Model | undefined> {
    const [model] = await db.select().from(models).where(eq(models.id, id));
    return model;
  }

  async createModel(insertModel: InsertModel): Promise<Model> {
    const [model] = await db.insert(models).values(insertModel).returning();
    return model;
  }

  async getQuestions(modelId: number): Promise<Question[]> {
    return await db.select().from(questions).where(eq(questions.modelId, modelId));
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const [question] = await db.insert(questions).values(insertQuestion).returning();
    return question;
  }
}

export const storage = new DatabaseStorage();
