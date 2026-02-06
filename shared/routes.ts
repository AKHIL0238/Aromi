import { z } from 'zod';
import { insertFitnessProfileSchema, fitnessProfiles, workoutPlans, mealPlans, generatePlanSchema } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  })
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  profile: {
    get: {
      method: 'GET' as const,
      path: '/api/profile',
      responses: {
        200: z.custom<typeof fitnessProfiles.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    createOrUpdate: {
      method: 'POST' as const,
      path: '/api/profile',
      input: insertFitnessProfileSchema,
      responses: {
        200: z.custom<typeof fitnessProfiles.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
  },
  plans: {
    getLatestWorkout: {
      method: 'GET' as const,
      path: '/api/plans/workout/latest',
      responses: {
        200: z.custom<typeof workoutPlans.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    getLatestMeal: {
      method: 'GET' as const,
      path: '/api/plans/meal/latest',
      responses: {
        200: z.custom<typeof mealPlans.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    generate: {
      method: 'POST' as const,
      path: '/api/plans/generate',
      input: generatePlanSchema,
      responses: {
        200: z.object({
          message: z.string(),
          planId: z.number(),
          type: z.enum(["workout", "nutrition"]),
        }),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        500: errorSchemas.internal,
      },
    }
  },
};
