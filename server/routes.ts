import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { registerChatRoutes } from "./replit_integrations/chat";
import OpenAI from "openai";

// OpenRouter client for plan generation
const openrouter = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENROUTER_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENROUTER_API_KEY,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // 1. Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);
  
  // 2. Setup Chat
  registerChatRoutes(app);

  // 3. App Routes

  // Profile Routes
  app.get(api.profile.get.path, isAuthenticated, async (req, res) => {
    // @ts-ignore - req.user is populated by passport/replit auth
    const userId = req.user.claims.sub;
    const profile = await storage.getProfile(userId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  });

  app.post(api.profile.createOrUpdate.path, isAuthenticated, async (req, res) => {
    try {
      // @ts-ignore
      const userId = req.user.claims.sub;
      const input = api.profile.createOrUpdate.input.parse(req.body);
      const profile = await storage.createOrUpdateProfile(userId, input);
      res.json(profile);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Plan Routes
  app.get(api.plans.getLatestWorkout.path, isAuthenticated, async (req, res) => {
    // @ts-ignore
    const userId = req.user.claims.sub;
    const plan = await storage.getLatestWorkoutPlan(userId);
    if (!plan) {
      return res.status(404).json({ message: "No active workout plan found" });
    }
    res.json(plan);
  });

  app.get(api.plans.getLatestMeal.path, isAuthenticated, async (req, res) => {
    // @ts-ignore
    const userId = req.user.claims.sub;
    const plan = await storage.getLatestMealPlan(userId);
    if (!plan) {
      return res.status(404).json({ message: "No active meal plan found" });
    }
    res.json(plan);
  });

  app.post(api.plans.generate.path, isAuthenticated, async (req, res) => {
    try {
      // @ts-ignore
      const userId = req.user.claims.sub;
      const { type } = api.plans.generate.input.parse(req.body);

      // Get profile for context
      const profile = await storage.getProfile(userId);
      if (!profile) {
        return res.status(400).json({ message: "Please complete your profile first" });
      }

      // Generate with AI
      const systemPrompt = `You are an expert fitness and nutrition coach. Generate a 7-day ${type} plan based on the user's profile.
      Profile: Age ${profile.age}, ${profile.gender}, ${profile.height}cm, ${profile.weight}kg.
      Goals: ${profile.goals}. Activity Level: ${profile.activityLevel}.
      Dietary Preferences: ${profile.dietaryPreferences || 'None'}. Allergies: ${profile.allergies || 'None'}.
      Equipment: ${profile.equipment || 'None'}. Availability: ${profile.availability} minutes/day.
      
      Respond ONLY with valid JSON matching this structure:
      {
        "days": [
          {
            "day": 1,
            "title": "Day Title",
            "description": "Overview of the day",
            "items": [ // For workout: exercises. For meal: meals.
              { "name": "Item Name", "details": "Reps/Sets or Ingredients/Calories" }
            ]
          }
        ]
      }`;

      const response = await openrouter.chat.completions.create({
        model: "meta-llama/llama-3.3-70b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Generate the plan." }
        ],
        response_format: { type: "json_object" }
      });

      const planContent = response.choices[0].message?.content;
      if (!planContent) {
        throw new Error("Failed to generate plan");
      }

      const planData = JSON.parse(planContent);

      let savedPlan;
      if (type === "workout") {
        savedPlan = await storage.createWorkoutPlan({
          userId,
          planData,
          isActive: true
        });
      } else {
        savedPlan = await storage.createMealPlan({
          userId,
          planData,
          isActive: true
        });
      }

      res.json({
        message: "Plan generated successfully",
        planId: savedPlan.id,
        type
      });

    } catch (err) {
      console.error("Plan generation error:", err);
      res.status(500).json({ message: "Failed to generate plan" });
    }
  });

  return httpServer;
}
