# ArogyaMitra - AI-Powered Fitness & Wellness Platform

## Overview

ArogyaMitra is an AI-powered fitness and wellness platform that delivers personalized health guidance through intelligent workout planning, nutrition recommendations, and real-time wellness support via an AI coach called AROMI. Users create fitness profiles with their health data, goals, and preferences, then receive personalized 7-day workout routines, tailored meal plans, and interactive AI coaching that adapts to lifestyle changes (travel, injuries, mood, etc.).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, bundled via Vite
- **Routing**: Wouter (lightweight client-side router) with protected route wrappers
- **State Management**: TanStack React Query for server state; React Hook Form with Zod resolvers for form state
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives with Tailwind CSS
- **Styling**: Tailwind CSS with CSS custom properties for theming (light/dark mode support), custom emerald/teal color theme. Two font families: "Outfit" (display) and "Inter" (body)
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend Architecture
- **Framework**: Express.js on Node.js with TypeScript (tsx runner)
- **HTTP Server**: Node `http.createServer` wrapping Express (supports WebSocket upgrades)
- **API Pattern**: RESTful JSON API under `/api/` prefix. Route contracts defined in `shared/routes.ts` using Zod schemas for input validation and response typing
- **AI Integration**: OpenAI SDK configured to use OpenRouter (via Replit AI Integrations). Used for generating workout/meal plans and powering the AROMI chat coach
- **Chat**: Server-Sent Events (SSE) at `/api/conversations/:id/messages` for streaming AI responses
- **Build**: Custom build script using Vite for client and esbuild for server, outputting to `dist/`

### Authentication
- **Method**: Replit Auth via OpenID Connect (OIDC)
- **Session Storage**: PostgreSQL-backed sessions using `connect-pg-simple` with `express-session`
- **User Management**: Users table with upsert on login. Auth middleware via Passport.js with OpenID Client strategy
- **Key files**: `server/replit_integrations/auth/` directory contains auth setup, routes, and storage

### Data Layer
- **Database**: PostgreSQL (required, accessed via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-validation integration
- **Schema Location**: `shared/schema.ts` (main tables), `shared/models/auth.ts` (users/sessions), `shared/models/chat.ts` (conversations/messages)
- **Migrations**: Drizzle Kit with `drizzle-kit push` command for schema synchronization
- **Key Tables**:
  - `users` - User accounts (required for Replit Auth)
  - `sessions` - Session storage (required for Replit Auth)
  - `fitness_profiles` - User health data (age, weight, height, goals, dietary preferences, allergies, equipment, availability, medical history)
  - `workout_plans` - AI-generated 7-day workout plans stored as JSONB
  - `meal_plans` - AI-generated 7-day meal plans stored as JSONB
  - `conversations` - Chat conversation metadata
  - `messages` - Individual chat messages with role (user/assistant)

### Project Structure
```
client/               # Frontend React app
  src/
    components/       # Reusable UI components
      ui/             # shadcn/ui primitives
    hooks/            # Custom React hooks (use-auth, use-chat, use-plans, use-profile)
    pages/            # Route page components (Landing, Dashboard, Profile, WorkoutPlan, MealPlan, AromiChat)
    lib/              # Utilities (queryClient, auth-utils, cn helper)
server/               # Backend Express server
  replit_integrations/  # Replit-specific integrations
    auth/             # Authentication (OIDC, Passport, session)
    chat/             # Chat routes and storage
    batch/            # Batch processing utilities for AI calls
  routes.ts           # Main API route registration
  storage.ts          # Database storage layer (profiles, plans)
  db.ts               # Database connection (pg Pool + Drizzle)
shared/               # Shared between client and server
  schema.ts           # Drizzle table definitions and Zod schemas
  routes.ts           # API contract definitions (paths, methods, input/output schemas)
  models/             # Domain model definitions (auth, chat)
```

### Key Design Decisions
1. **Shared API Contract**: `shared/routes.ts` defines the full API surface with Zod schemas, enabling type-safe request/response handling on both client and server
2. **Storage Pattern**: `IStorage` interface in `server/storage.ts` abstracts database operations, making it testable and swappable
3. **AI via OpenRouter**: Uses Replit's AI Integrations service which provides OpenRouter-compatible API access, configured through environment variables `AI_INTEGRATIONS_OPENROUTER_BASE_URL` and `AI_INTEGRATIONS_OPENROUTER_API_KEY`
4. **Plan Generation**: Plans are generated server-side via AI, stored as JSONB in PostgreSQL, and served to the client as structured data

## External Dependencies

### Required Services
- **PostgreSQL Database**: Required. Connection via `DATABASE_URL` environment variable. Used for all data storage including sessions
- **Replit AI Integrations (OpenRouter)**: Required for AI features. Configured via `AI_INTEGRATIONS_OPENROUTER_BASE_URL` and `AI_INTEGRATIONS_OPENROUTER_API_KEY` environment variables. Powers plan generation and AROMI chat
- **Replit Auth (OIDC)**: Authentication provider. Uses `ISSUER_URL` (defaults to `https://replit.com/oidc`), `REPL_ID`, and `SESSION_SECRET` environment variables

### Key NPM Dependencies
- `drizzle-orm` + `drizzle-kit` - Database ORM and migration tooling
- `openai` - OpenAI SDK (used with OpenRouter base URL)
- `passport` + `openid-client` - Authentication
- `express-session` + `connect-pg-simple` - Session management
- `@tanstack/react-query` - Client-side server state management
- `react-hook-form` + `@hookform/resolvers` - Form handling
- `framer-motion` - Animations
- `recharts` - Data visualization
- `react-markdown` - Rendering AI chat responses
- `wouter` - Client-side routing
- `zod` + `drizzle-zod` - Schema validation