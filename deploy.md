# Deployment guide — Vercel + Railway + MongoDB Atlas

> This file is gitignored — keep it on your machine, don't push it.

Production layout:

| Piece     | Where          | Why                                                   |
|-----------|----------------|-------------------------------------------------------|
| Frontend  | **Vercel**     | Best-in-class static + SPA hosting, free tier         |
| Backend   | **Railway**    | Easy Dockerfile deploys, free trial / hobby plan      |
| Database  | **MongoDB Atlas** (M0 free) | Reliable managed Mongo, free 512MB cluster |

Order of operations: **Atlas → Railway → Vercel**. The frontend needs the backend URL, and the backend needs the Atlas URI.

---

## 0. Prerequisites

- A GitHub repo with this project pushed to it.
- Accounts: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), [Railway](https://railway.app), [Vercel](https://vercel.com).
- The Railway CLI is optional (`brew install railway`); the dashboard is enough.

---

## 1. MongoDB Atlas (free M0 cluster)

1. Atlas → **Build a Database** → **M0 Free** → pick the region closest to your Railway region (e.g., AWS `us-east-1`).
2. **Database Access** → Add new user:
   - Username: `smartleads`
   - Password: generate a strong one (save it — Atlas won't show it again).
   - Built-in role: `readWrite` on the `smartleads` DB (or `Atlas admin` for first-time simplicity).
3. **Network Access** → Add IP Address → **Allow access from anywhere** (`0.0.0.0/0`).
   - Railway egress IPs aren't static, so this is the pragmatic choice. For real production, use a Private Endpoint / PrivateLink.
4. **Database** → **Connect** → **Drivers** → copy the URI. It looks like:
   ```
   mongodb+srv://smartleads:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` and append the DB name **before** the query string:
   ```
   mongodb+srv://smartleads:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/smartleads?retryWrites=true&w=majority
   ```
   Save this — it's `MONGODB_URI`.

---

## 2. Backend on Railway

Railway will build directly from `server/Dockerfile`.

### 2a. Create the service

1. Railway → **New Project** → **Deploy from GitHub repo** → pick the repo.
2. When it asks for the root, set **Root Directory** = `server`.
3. Railway will detect `Dockerfile` and use it. If it doesn't:
   - Settings → **Builder** → Dockerfile → Dockerfile path: `Dockerfile`.

### 2b. Environment variables

Service → **Variables** → add the following:

| Key              | Value                                                                                |
|------------------|--------------------------------------------------------------------------------------|
| `NODE_ENV`       | `production`                                                                         |
| `PORT`           | `5000`                                                                               |
| `MONGODB_URI`    | the Atlas URI from step 1                                                            |
| `JWT_SECRET`     | output of `openssl rand -hex 32` — 64 hex chars                                      |
| `JWT_EXPIRES_IN` | `7d`                                                                                 |
| `CLIENT_ORIGIN`  | `https://<your-vercel-domain>` — you'll fill this after step 3, then redeploy        |

Tip: For now set `CLIENT_ORIGIN=*` temporarily so deploys aren't blocked while you set Vercel up. Lock it down to the real domain afterwards.

### 2c. Expose a public URL

Service → **Settings** → **Networking** → **Generate Domain**. You'll get something like `https://smart-leads-server-production.up.railway.app`. Save this — it's `<RAILWAY_API_URL>`.

### 2d. Smoke test

```bash
curl https://<RAILWAY_API_URL>/api/health
# {"success":true,"data":{"status":"ok","uptime":...}}
```

If you get `502`, check **Deploy Logs** in Railway — most commonly it's a bad `MONGODB_URI` or an Atlas IP allowlist issue.

### 2e. (Optional) Seed Atlas with the demo users

From your local machine, point the seed script at the Atlas URI:

```bash
cd server
MONGODB_URI="mongodb+srv://smartleads:...@cluster0.xxxxx.mongodb.net/smartleads?retryWrites=true&w=majority" \
JWT_SECRET="dummy-for-seed-only-min-16chars-required" \
npm run seed
```

That gives you the `admin@example.com` / `sales@example.com` accounts on prod.

---

## 3. Frontend on Vercel

### 3a. Create the project

1. Vercel → **Add New** → **Project** → import the same GitHub repo.
2. **Root Directory**: `client`.
3. **Framework Preset**: Vite (Vercel auto-detects).
4. **Build Command**: `npm run build` (default).
5. **Output Directory**: `dist` (default).

### 3b. Environment variables

Project → **Settings → Environment Variables**:

| Key             | Value                                       | Environments              |
|-----------------|---------------------------------------------|---------------------------|
| `VITE_API_URL`  | `https://<RAILWAY_API_URL>/api`             | Production, Preview, Dev  |

Vite inlines `VITE_*` env vars at build time, so changing this requires a redeploy.

### 3c. SPA routing

`react-router-dom` uses `BrowserRouter`, so deep links like `/leads` must serve `index.html`. Vercel does this automatically for Vite, but if you ever see 404s on refresh, add a `vercel.json` in `client/`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### 3d. Deploy

Click **Deploy**. After it completes, copy the production URL (e.g., `https://smart-leads.vercel.app`).

### 3e. Back to Railway — lock down CORS

Railway → backend service → **Variables**:

- Set `CLIENT_ORIGIN=https://smart-leads.vercel.app` (your Vercel domain, **no trailing slash**).
- If you have multiple, comma-separate: `https://smart-leads.vercel.app,https://smart-leads-git-main.vercel.app`.

Trigger a redeploy (Railway auto-redeploys on var changes).

---

## 4. Verify end-to-end

1. Open `https://<vercel-domain>` in an incognito window.
2. Open DevTools → Network.
3. Try to log in with `admin@example.com` / `Password123!` (if you seeded Atlas).
4. The `POST /api/auth/login` request should go to `<RAILWAY_API_URL>` and return `200`.
5. After login, `GET /api/leads?...` should return 200 with `data` and `meta`.
6. Click **Export CSV** — a file downloads. ✅

---

## 5. Continuous deployment

Both Vercel and Railway redeploy on every push to your default branch automatically.

- **Vercel**: pushes to `main` → Production. PRs → Preview deployments.
- **Railway**: pushes to `main` → Production redeploy. PRs can spin up preview environments if enabled.

---

## 6. Custom domains (optional)

### Vercel
Project → Settings → **Domains** → Add your domain → follow DNS instructions (CNAME to `cname.vercel-dns.com` for subdomains, A records for apex).

### Railway
Service → Settings → **Networking** → **Custom Domain** → add and follow the CNAME instructions.

After adding a custom frontend domain, update Railway's `CLIENT_ORIGIN` again.

---

## 7. Cost & limits

| Service        | Free tier                              | Watch out for                              |
|----------------|----------------------------------------|--------------------------------------------|
| Vercel Hobby   | Unlimited static, generous bandwidth   | No server functions needed here            |
| Railway Hobby  | $5/mo trial credit, ~500h execution    | Idle services still consume RAM hours      |
| Atlas M0       | 512MB storage, shared CPU              | No backups, single region                  |

For an internship demo, all three free tiers are more than enough.

---

## 8. Troubleshooting

**Vercel build fails with `Cannot find module '@/...'`**
- The `@/*` alias is set up in `client/tsconfig.app.json` AND `client/vite.config.ts`. Both must exist in the repo. Confirm both files are committed.

**Browser shows CORS error**
- `CLIENT_ORIGIN` on Railway must exactly match the browser's origin (scheme + host + port). No trailing slash. After editing, wait for the Railway redeploy to finish.

**`401 Unauthorized` immediately after login**
- The browser sends `Authorization: Bearer <token>`. Confirm in DevTools that the header is present.
- Check Railway logs: if you see `Invalid or expired token`, your `JWT_SECRET` was rotated between issuing and verifying — sign in again.

**`MongoNetworkError` in Railway logs**
- Atlas Network Access doesn't allow Railway's IP. Re-check that `0.0.0.0/0` is allowlisted.

**CSV export returns HTML instead of CSV**
- Almost always a CORS or 401 issue: the request was redirected/rejected and `axios` got the error page. Check the network response status and `Content-Type` header.

**Frontend hits `localhost:5000` in production**
- You forgot to set `VITE_API_URL` on Vercel, or you set it but didn't redeploy. `VITE_*` vars are inlined at build time.
