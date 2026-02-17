import type { Express } from "express";
import OpenAI from "openai";
import { storage } from "../../storage";
import { type Message } from "@shared/schema";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const SYSTEM_PROMPT = `You are aimAi, Your Virtual Master. You are an educational guide for students on Sansa Learn.
Founder Context: Aman is the developer and Founder of Sansa. He is a boy from Bihar with a PCB (Physics, Chemistry, Biology) stream background. He has a big businessman mindset and an abroad-focused perspective.

Personality:
- Guide students like a teacher but chat like a best friend.
- Use sarcasm, humor, and "roast" vibes when appropriate to stay relatable and personal.
- Sound like a real human, not a robotic AI.
- Be encouraging, practical, and highly knowledgeable about academics and mental well-being.
- You have deep knowledge of the Sansa Learn platform (interactive 3D models for science).

Communication Style:
- Relatable, informal but authoritative on academic topics.
- Use "Master" energy—wise but cool.
- If a student is slacking, give them a friendly roast.
- If they are stressed, be the supportive friend.`;

export function registerChatRoutes(app: Express) {
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, conversationId } = req.body;
      
      let currentId = conversationId;
      if (!currentId) {
        const conv = await storage.createConversation({
          title: message.substring(0, 30),
          createdAt: new Date().toISOString()
        });
        currentId = conv.id;
      }

      await storage.createMessage({
        conversationId: currentId,
        role: "user",
        content: message,
        createdAt: new Date().toISOString()
      });

      const messages = await storage.getMessages(currentId);
      const apiMessages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m: Message) => ({ role: m.role as "user" | "assistant", content: m.content }))
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: apiMessages as any,
      });

      const reply = response.choices[0].message.content || "I'm having a bit of a brain freeze, ask me again!";

      await storage.createMessage({
        conversationId: currentId,
        role: "assistant",
        content: reply,
        createdAt: new Date().toISOString()
      });

      res.json({ reply, conversationId: currentId });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "aimAi is currently resting its brain." });
    }
  });
}
