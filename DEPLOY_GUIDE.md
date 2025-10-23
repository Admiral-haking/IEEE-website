Quick Deploy Guide (EN/FA)

English

1) Local development
- Install: `npm ci`
- Dev server: `npm run dev` (http://localhost:3000)
- Type check: `npx tsc -p tsconfig.json --noEmit`
- Build: `npm run build` then `npm start`

2) Docker (local)
- Build: `docker build -t hippo:dev .`
- Run: `docker run --rm -p 3000:3000 hippo:dev`

3) Git + GitHub
- Initialize: `git init && git add -A && git commit -m "init"`
- Create repo on GitHub, then: `git remote add origin git@github.com:<owner>/<repo>.git`
- Push: `git push -u origin main`

4) CI/CD (GitHub Actions)
- Add repository secrets (Settings → Secrets):
  - `MONGODB_URI` (required for app)
  - `SSH_HOST`, `SSH_USER`, `SSH_KEY` (optional for server deploy)
- On push to `main`, CI will build, type‑check, build Docker image, push to GHCR.
- Optional deploy: if SSH secrets exist, CI will pull and run the container on your server.

5) Server (manual)
- Login to GHCR on server: `echo $GITHUB_TOKEN | docker login ghcr.io -u <owner> --password-stdin`
- Pull image: `docker pull ghcr.io/<owner>/<repo>:latest`
- Run: `docker run -d --name hippo -p 3000:3000 -e NODE_ENV=production -e MONGODB_URI="..." ghcr.io/<owner>/<repo>:latest`
- Or with compose: update `docker-compose.prod.yml` OWNER/REPO then `docker compose -f docker-compose.prod.yml up -d`

Persian (فارسی)

۱) توسعه محلی
- نصب: `npm ci`
- اجرا: `npm run dev` (آدرس: http://localhost:3000)
- تایپ‌چک: `npx tsc -p tsconfig.json --noEmit`
- بیلد: `npm run build` سپس `npm start`

۲) داکر (محلی)
- ساخت: `docker build -t hippo:dev .`
- اجرا: `docker run --rm -p 3000:3000 hippo:dev`

۳) گیت و گیت‌هاب
- مقداردهی اولیه: `git init && git add -A && git commit -m "init"`
- ساخت مخزن در گیت‌هاب و سپس: `git remote add origin git@github.com:<owner>/<repo>.git`
- پوش: `git push -u origin main`

۴) CI/CD (اکشن‌های گیت‌هاب)
- سکرت‌ها در تنظیمات مخزن:
  - `MONGODB_URI` (اجباری برای برنامه)
  - `SSH_HOST`، `SSH_USER`، `SSH_KEY` (اختیاری برای دیپلوی روی سرور)
- با هر پوش روی `main`، CI بیلد، تایپ‌چک، ساخت ایمیج داکر و پوش به GHCR را انجام می‌دهد.
- دیپلوی اختیاری: در صورت وجود سکرت‌های SSH، ایمیج روی سرور کشیده و اجرا می‌شود.

۵) سرور (دستی)
- ورود به GHCR روی سرور: `echo $GITHUB_TOKEN | docker login ghcr.io -u <owner> --password-stdin`
- کشیدن ایمیج: `docker pull ghcr.io/<owner>/<repo>:latest`
- اجرا: `docker run -d --name hippo -p 3000:3000 -e NODE_ENV=production -e MONGODB_URI="..." ghcr.io/<owner>/<repo>:latest`
- یا با کامپوز: فایل `docker-compose.prod.yml` را با OWNER/REPO به‌روزرسانی کنید سپس: `docker compose -f docker-compose.prod.yml up -d`

Notes
- For CDN, set `ASSET_PREFIX=https://cdn.example.com` in env; Next.js will serve assets with this prefix.
- For RTL, theme direction is auto‑synced with current locale.

