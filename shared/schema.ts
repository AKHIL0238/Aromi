import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export * from "./models/auth";
export * from "./models/chat";

// === TABLE DEFINITIONS ===

export const fitnessProfiles = pgTable("fitness_profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  age: integer("age").notNull(),
  gender: text("gender").notNull(), // 'male', 'female', 'other'
  height: integer("height").notNull(), // in cm
  weight: integer("weight").notNull(), // in kg
  goals: text("goals").notNull(), // 'weight_loss', 'muscle_gain', 'maintenance', 'endurance'
  activityLevel: text("activity_level").notNull(), // 'sedentary', 'light', 'moderate', 'active', 'very_active'
  dietaryPreferences: text("dietary_preferences"), // 'vegetarian', 'vegan', 'keto', etc.
  allergies: text("allergies"), // Comma separated
  equipment: text("equipment"), // 'home', 'gym', 'none'
  availability: integer("availability").notNull(), // minutes per day
  medicalHistory: text("medical_history"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const workoutPlans = pgTable("workout_plans", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  planData: jsonb("plan_data").notNull(), // The 7-day plan structure
  startDate: timestamp("start_date").defaultNow(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const mealPlans = pgTable("meal_plans", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  planData: jsonb("plan_data").notNull(), // The 7-day meal plan
  startDate: timestamp("start_date").defaultNow(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===

export const insertFitnessProfileSchema = createInsertSchema(fitnessProfiles).omit({ 
  id: true, 
  userId: true,
  updatedAt: true 
});

export const insertWorkoutPlanSchema = createInsertSchema(workoutPlans).omit({ 
  id: true, 
  createdAt: true 
});

export const insertMealPlanSchema = createInsertSchema(mealPlans).omit({ 
  id: true, 
  createdAt: true 
});

// === TYPES ===

export type FitnessProfile = typeof fitnessProfiles.$inferSelect;
export type InsertFitnessProfile = z.infer<typeof insertFitnessProfileSchema>;

export type WorkoutPlan = typeof workoutPlans.$inferSelect;
export type InsertWorkoutPlan = z.infer<typeof insertWorkoutPlanSchema>;

export type MealPlan = typeof mealPlans.$inferSelect;
export type InsertMealPlan = z.infer<typeof insertMealPlanSchema>;

// === API CONTRACT TYPES ===

export type CreateProfileRequest = InsertFitnessProfile;
export type UpdateProfileRequest = Partial<InsertFitnessProfile>;

// For AI generation
export const generatePlanSchema = z.object({
  type: z.enum(["workout", "nutrition"]),
});

export type GeneratePlanRequest = z.infer<typeof generatePlanSchema>;
