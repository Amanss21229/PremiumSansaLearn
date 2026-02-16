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

  app.get(api.models.questions.list.path, async (req, res) => {
    const questions = await storage.getQuestions(Number(req.params.id));
    res.json(questions);
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
        modelUrl: "/models/human_heart.glb",
        isPremium: false,
      },
      {
        title: "Periodic Table",
        description: "Interactive 3D representation of elements and their atomic structure. Key for Class 11 Chemistry.",
        category: "Chemistry",
        grade: "Class 11",
        type: "Structure",
        modelUrl: "/models/periodic_table.glb",
        isPremium: false,
      },
      {
        title: "Human Kidney",
        description: "Explore the internal structure of the kidney, including the cortex and medulla. Class 11 Biology.",
        category: "Biology",
        grade: "Class 11",
        type: "Organ",
        modelUrl: "/models/human_kidney.glb",
        isPremium: false,
      },
      {
        title: "Human Digestive System",
        description: "Detailed anatomical model of the human digestive system, showing esophagus, stomach, and intestines.",
        category: "Biology",
        grade: "Class 10",
        type: "Organ",
        modelUrl: "/models/human_digestive_system.glb",
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
        isPremium: false,
      },
    ];

    for (const model of seedData) {
      const createdModel = await storage.createModel(model);
      
      // Seed 30 questions per model
      for (let i = 1; i <= 30; i++) {
        await storage.createQuestion({
          modelId: createdModel.id,
          question: `Sample Question ${i} for ${model.title}?`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: 0,
        });
      }
    }
    console.log("Database seeded with 3D models and quizzes");
  }
}
