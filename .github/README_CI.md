GitHub Actions CI/CD

Secrets to add in your repository settings (Settings → Secrets and variables → Actions):

- SSH_HOST: server hostname or IP (optional if you don’t deploy over SSH)
- SSH_USER: SSH username (optional)
- SSH_KEY: Private key for SSH (optional)
- MONGODB_URI: MongoDB connection string for production

What it does

- Installs deps, type‑checks, lints, builds Next.js
- Builds and pushes a Docker image to GHCR at ghcr.io/<owner>/<repo>:latest
- If SSH_* secrets are present, connects and runs the container

Local testing

- Install: npm ci
- Dev server: npm run dev
- Type‑check: npx tsc -p tsconfig.json --noEmit
- Build: npm run build; Start: npm start
- Docker build: docker build -t hippo:dev .
- Docker run: docker run -p 3000:3000 hippo:dev

