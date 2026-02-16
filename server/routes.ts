import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.models.list.path, async (req, res) => {
    const models = await storage.getModels();
    res.json(models);
  });

  app.get(api.models.get.path, async (req, res) => {
    const model = await storage.getModel(Number(req.params.id));
    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }
    res.json(model);
  });

  await seedDatabase();

  return httpServer;
}

export async function seedDatabase() {
  const existingModels = await storage.getModels();
  if (existingModels.length === 0) {
    const seedData = [
      {
        title: "Human Heart",
        description: "A detailed 3D model of the human heart showing ventricles and atria. Essential for Class 10 Biology.",
        category: "Biology",
        grade: "Class 10",
        type: "Organ",
        isPremium: true,
      },
      {
        title: "Periodic Table",
        description: "Interactive 3D representation of elements and their atomic structure. Key for Class 11 Chemistry.",
        category: "Chemistry",
        grade: "Class 11",
        type: "Structure",
        isPremium: false,
      },
      {
        title: "Human Kidney",
        description: "Explore the internal structure of the kidney, including the cortex and medulla. Class 11 Biology.",
        category: "Biology",
        grade: "Class 11",
        type: "Organ",
        isPremium: true,
      },
      {
        title: "Liver Structure",
        description: "Detailed view of the liver lobes and blood vessels. Class 11 Biology.",
        category: "Biology",
        grade: "Class 11",
        type: "Organ",
        isPremium: false,
      },
      {
        title: "Flower Anatomy",
        description: "Cross-section of a typical flower showing stamen, pistil, and petals. Class 9 Biology.",
        category: "Biology",
        grade: "Class 9",
        type: "Plant",
        isPremium: false,
      },
      {
        title: "Human Ovary",
        description: "Reproductive system anatomy focusing on the ovary structure. Class 12 Biology.",
        category: "Biology",
        grade: "Class 12",
        type: "Organ",
        isPremium: true,
      },
    ];

    for (const model of seedData) {
      await storage.createModel(model);
    }
    console.log("Database seeded with 3D models");
  }
}
