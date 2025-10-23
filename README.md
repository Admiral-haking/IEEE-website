# Hippogriff Engineering Website

Next.js app (App Router + TypeScript) with MUI v7, react-hook-form + zod, axios/axios-hooks, and Mongoose.

## Requirements

- Node.js 18+ (recommended 18.18+ or 20+)
- npm

## Install

```bash
npm install

# Generate secure secrets and create .env.local
npm run generate-secrets

# Or manually copy and configure
cp env.example .env.local  # set MONGODB_URI and JWT_SECRET
```

## Develop

```bash
npm run dev
```

Open http://localhost:3000

## Light/Dark Mode

Uses MUI v7 `CssVarsProvider` with system default and a toggle in the header. Preference is stored under `hippogriff-color-scheme`.

## API Routes

- `GET /api/health` — service status
- `GET /api/team` — list team members
- `POST /api/team` — create a team member: `{ name, role, discipline: 'software'|'hardware'|'networking', email? }`

Set `MONGODB_URI` in `.env.local` to enable DB-backed routes.

## 🔐 Security

This project includes several security features:

- **JWT Authentication** with secure token management
- **Rate Limiting** to prevent abuse
- **Security Headers** for protection against common attacks
- **Input Validation** using Zod schemas
- **Password Hashing** with bcrypt

### Security Commands

```bash
# Generate secure secrets
npm run generate-secrets

# Run security audit
npm run security-check
```

See [SECURITY.md](./SECURITY.md) for detailed security guidelines.

"# IEEE-website" 
"# IEEE-website" 
