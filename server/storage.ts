import { db } from "./db";
import { 
  fitnessProfiles, workoutPlans, mealPlans,
  type InsertFitnessProfile, type InsertWorkoutPlan, type InsertMealPlan,
  type FitnessProfile, type WorkoutPlan, type MealPlan
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Profile
  getProfile(userId: string): Promise<FitnessProfile | undefined>;
  createOrUpdateProfile(userId: string, profile: InsertFitnessProfile): Promise<FitnessProfile>;

  // Plans
  getLatestWorkoutPlan(userId: string): Promise<WorkoutPlan | undefined>;
  createWorkoutPlan(plan: InsertWorkoutPlan): Promise<WorkoutPlan>;
  
  getLatestMealPlan(userId: string): Promise<MealPlan | undefined>;
  createMealPlan(plan: InsertMealPlan): Promise<MealPlan>;
}

export class DatabaseStorage implements IStorage {
  async getProfile(userId: string): Promise<FitnessProfile | undefined> {
    const [profile] = await db.select().from(fitnessProfiles).where(eq(fitnessProfiles.userId, userId));
    return profile;
  }

  async createOrUpdateProfile(userId: string, profileData: InsertFitnessProfile): Promise<FitnessProfile> {
    const existing = await this.getProfile(userId);
    
    if (existing) {
      const [updated] = await db
        .update(fitnessProfiles)
        .set({ ...profileData, updatedAt: new Date() })
        .where(eq(fitnessProfiles.userId, userId))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(fitnessProfiles)
        .values({ ...profileData, userId }) // Ensure userId is set
        .returning();
      return created;
    }
  }

  async getLatestWorkoutPlan(userId: string): Promise<WorkoutPlan | undefined> {
    const [plan] = await db
      .select()
      .from(workoutPlans)
      .where(eq(workoutPlans.userId, userId))
      .orderBy(desc(workoutPlans.createdAt))
      .limit(1);
    return plan;
  }

  async createWorkoutPlan(plan: InsertWorkoutPlan): Promise<WorkoutPlan> {
    const [created] = await db.insert(workoutPlans).values(plan).returning();
    return created;
  }

  async getLatestMealPlan(userId: string): Promise<MealPlan | undefined> {
    const [plan] = await db
      .select()
      .from(mealPlans)
      .where(eq(mealPlans.userId, userId))
      .orderBy(desc(mealPlans.createdAt))
      .limit(1);
    return plan;
  }

  async createMealPlan(plan: InsertMealPlan): Promise<MealPlan> {
    const [created] = await db.insert(mealPlans).values(plan).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
