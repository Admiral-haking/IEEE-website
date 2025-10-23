This folder contains Next.js App Router API route handlers under `app/api/*/route.ts`.
Defined routes:

- GET `/api/health` — basic status check
- GET/POST `/api/team` — list/create team members (uses Mongoose connection if `MONGODB_URI` is configured)
