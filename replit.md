# Replit.md

## Overview

**Sansa Learn** is a premium educational platform that provides interactive 3D models for Indian students in Classes 9-12. The application allows students to explore science subjects (Biology, Chemistry, Physics) through immersive 3D model viewing with features like rotation, zoom, and quiz questions. The theme is a dark mode design with gold accents, targeting a luxury/premium feel.

The app follows a full-stack TypeScript architecture with a React frontend rendering 3D models via Three.js, an Express backend serving API routes, and a PostgreSQL database managed through Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (client/)
- **Framework**: React with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router) with three main pages: Home (landing), Study360 (model library), and ModelViewer (fullscreen 3D viewer)
- **3D Rendering**: React Three Fiber (`@react-three/fiber`) with Drei helpers (`@react-three/drei`) for rendering interactive 3D models. Models can be GLB files or procedural geometries as fallbacks.
- **Styling**: Tailwind CSS with shadcn/ui component library (new-york style). Dark theme with gold accents defined via CSS variables in `client/src/index.css`. Custom fonts: Cinzel (display) and Montserrat (body).
- **State Management**: TanStack React Query for server state. No global client state manager.
- **Animations**: Framer Motion for page transitions and UI animations
- **UI Components**: Full shadcn/ui component set in `client/src/components/ui/`
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`, `@assets/` maps to `attached_assets/`

### Backend (server/)
- **Framework**: Express.js on Node with TypeScript (run via tsx)
- **HTTP Server**: Node's `http.createServer` wrapping Express
- **API Pattern**: RESTful routes defined in `server/routes.ts`, with route definitions shared via `shared/routes.ts`
- **Storage Layer**: `server/storage.ts` implements `IStorage` interface using `DatabaseStorage` class backed by Drizzle ORM. This abstraction makes it easy to swap storage implementations.
- **Dev Server**: Vite dev server middleware integrated via `server/vite.ts` for HMR during development
- **Production**: Static files served from `dist/public` via `server/static.ts`
- **Build**: Custom build script (`script/build.ts`) uses Vite for client and esbuild for server, outputting to `dist/`
- **Database seeding**: `seedDatabase()` in `server/routes.ts` auto-populates initial model data when the database is empty

### Shared Layer (shared/)
- **Schema**: `shared/schema.ts` defines Drizzle PostgreSQL tables (`models` and `questions`) with Zod validation schemas via `drizzle-zod`
- **Routes**: `shared/routes.ts` provides typed API route definitions with Zod response schemas, used by both client and server
- **Chat Models**: `shared/models/chat.ts` defines `conversations` and `messages` tables for AI chat functionality

### Database
- **Engine**: PostgreSQL (required via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-kit` for migrations
- **Tables**:
  - `models` - Educational 3D models (title, description, category, grade, type, modelUrl, isPremium)
  - `questions` - Quiz questions linked to models (question, options array, correctAnswer)
  - `conversations` - Chat conversation headers
  - `messages` - Chat messages with role-based content
- **Migration command**: `npm run db:push` (uses drizzle-kit push)

### Replit AI Integrations (server/replit_integrations/)
Pre-built integration modules for AI features:
- **Chat** (`chat/`): OpenAI-powered conversational AI with conversation persistence
- **Audio** (`audio/`): Voice recording, speech-to-text, text-to-speech with streaming SSE support
- **Image** (`image/`): Image generation using `gpt-image-1` model
- **Batch** (`batch/`): Rate-limited batch processing utility for LLM operations

These integrations use environment variables `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL`.

### Key API Endpoints
- `GET /api/models` - List all 3D models
- `GET /api/models/:id` - Get a specific model
- `GET /api/models/:id/questions` - Get quiz questions for a model
- Chat/Audio/Image endpoints registered via replit_integrations

## External Dependencies

### Required Services
- **PostgreSQL**: Primary database, connected via `DATABASE_URL` environment variable. Uses `pg` (node-postgres) driver with `connect-pg-simple` for session storage.
- **OpenAI API** (via Replit AI Integrations): Used for chat, voice, and image generation features. Requires `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL` environment variables.

### Key NPM Packages
- **three / @react-three/fiber / @react-three/drei**: 3D rendering engine
- **framer-motion**: Animation library
- **drizzle-orm / drizzle-kit / drizzle-zod**: Database ORM and schema validation
- **wouter**: Client-side routing
- **@tanstack/react-query**: Async server state management
- **shadcn/ui ecosystem**: Radix UI primitives, class-variance-authority, tailwind-merge, clsx, lucide-react icons
- **zod**: Runtime type validation for API contracts
- **express / express-session**: HTTP server framework

### Fonts (Google Fonts CDN)
- Cinzel (display/heading font)
- Montserrat (body font)
- DM Sans, Fira Code, Geist Mono, Architects Daughter (additional fonts loaded in HTML)