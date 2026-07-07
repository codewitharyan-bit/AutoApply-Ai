# AutoApply-Ai

AI-powered job automation platform that imports, analyzes, and matches job listings to your profile using intelligent scoring. Features auto-apply capabilities, career analysis, resume parsing, and a modern SaaS dashboard.

## Features

- **Smart Job Matching** — AI-powered scoring that matches job listings to your resume and preferences
- **Auto-Apply Pipeline** — Configurable automated application submission workflow
- **Career Analysis** — Insightful career trajectory analysis with skill gap detection
- **Resume Parsing** — Extract structured data from uploaded resumes with AI
- **Job Import** — Pull listings via JSearch API (RapidAPI) with bulk import worker
- **AI Explanations** — Gemini-powered match explanations for every recommendation
- **SaaS Dashboard** — Modern UI with Clerk auth, Supabase backend, Tailwind CSS

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS 4, Framer Motion |
| Auth | Clerk (React + Express backends) |
| Backend / API | Node.js, Express 5 |
| Database | Supabase (PostgreSQL) |
| AI | Google Gemini 2.0 |
| Jobs API | JSearch via RapidAPI |
| Resume Parsing | pdf-parse + Gemini extraction |
| Workers | Node.js background worker (job import) |

## Architecture

```
client/          → React SPA (Vite)
server/          → Express REST API
server/workers/  → Background job import worker
migrations/      → PostgreSQL schema migrations
```

Key data flow: Client → Clerk (auth) → Express API → Supabase (storage) → Gemini (AI scoring/explanations).

## Prerequisites

- Node.js 18+
- A Supabase project
- A Clerk application (publishable + secret keys)
- A RapidAPI account with JSearch API subscription
- A Google Gemini API key

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/codewitharyan-bit/AutoApply-Ai.git
cd AutoApply-Ai
```

### 2. Server setup

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173

CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
SUPABASE_JWKS_URL=
DATABASE_URL=

RAPIDAPI_KEY=
RAPIDAPI_HOST=jsearch.p.rapidapi.com

GEMINI_API_KEY=
```

Run database migrations against your Supabase project using the files in `server/migrations/`.

### 3. Client setup

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=
```

## Running the project

### Development

```bash
# Terminal 1 — Server
cd server
npm run dev

# Terminal 2 — Client
cd client
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:5000

### Production build

```bash
cd client
npm run build
npm run preview
```

## API Overview

| Route | Module |
|-------|--------|
| `/api/jobs` | Job listing import, query, and management |
| `/api/applications` | Application CRUD and auto-apply |
| `/api/resumes` | Resume upload, parsing, and management |
| `/api/profile` | User and structured profile management |
| `/api/dashboard` | Aggregated dashboard stats and charts |
| `/api/recommendations` | AI job recommendations with match scoring |
| `/api/career-analysis` | Career trajectory and skill gap analysis |
| `/api/webhooks` | Clerk and external webhook handlers |

## Environment Variables Reference

### Server (`server/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | API server port (default: 5000) |
| `CLIENT_URL` | Allowed CORS origin |
| `CLERK_PUBLISHABLE_KEY` | Clerk frontend API key |
| `CLERK_SECRET_KEY` | Clerk backend secret key |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook signing secret |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key |
| `SUPABASE_SECRET_KEY` | Supabase service role key |
| `SUPABASE_JWKS_URL` | Supabase JWKS endpoint for JWT verification |
| `DATABASE_URL` | Full PostgreSQL connection string |
| `RAPIDAPI_KEY` | RapidAPI key for JSearch |
| `RAPIDAPI_HOST` | JSearch API host |
| `GEMINI_API_KEY` | Google Gemini API key |

### Client (`client/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (must match server key) |

## License

MIT
