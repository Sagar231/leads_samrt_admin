# Local development guide

> This file is gitignored — keep it on your machine, don't push it.

End-to-end setup for running Smart Leads Dashboard locally. Two paths are documented:

1. **Recommended** — run Mongo in Docker, then run server + client with `npm run dev`. Fast hot-reload, matches the assignment's Docker requirement, no Mongo install on your machine.
2. **All-in-one Docker** — bring up Mongo + server + client via `docker-compose up`. Closer to prod, slower iteration.

---

## 0. Prerequisites

| Tool          | Version    | Install                                                |
|---------------|------------|--------------------------------------------------------|
| Node.js       | 18+ (LTS)  | https://nodejs.org  or `brew install node@20`          |
| npm           | 9+         | bundled with Node                                      |
| Docker Desktop| latest     | https://www.docker.com/products/docker-desktop         |
| Git           | any        | `brew install git`                                     |

Verify:

```bash
node -v        # v20.x
npm -v         # 10.x
docker -v
docker compose version
```

---

## 1. Clone & install

```bash
git clone <your-repo-url> smart-leads
cd smart-leads

# Backend deps
cd server && npm install && cd ..

# Frontend deps
cd client && npm install && cd ..
```

---

## 2. Environment files

Copy the examples and edit values where noted.

### `server/.env`

```bash
cp server/.env.example server/.env
```

Contents (defaults match the Docker Mongo below):

```ini
NODE_ENV=development
PORT=5000

# Mongo (matches docker-compose mongo service)
MONGODB_URI=mongodb://root:rootpass@localhost:27017/smartleads?authSource=admin

# JWT — generate your own with: openssl rand -hex 32
JWT_SECRET=replace-with-a-long-random-string-at-least-32-chars
JWT_EXPIRES_IN=7d

# CORS — Vite dev server origin
CLIENT_ORIGIN=http://localhost:5173
```

Generate a real JWT secret:

```bash
openssl rand -hex 32
```

Paste the output as `JWT_SECRET`.

### `client/.env`

```bash
cp client/.env.example client/.env
```

Contents:

```ini
VITE_API_URL=http://localhost:5000/api
```

---

## 3. Start MongoDB (Docker)

From the repo root:

```bash
docker compose up -d mongo
```

Verify it's running:

```bash
docker ps          # should show leads-mongo on 27017
docker logs leads-mongo --tail 20
```

Stop it later with `docker compose stop mongo`. Wipe data entirely (deletes the named volume):

```bash
docker compose down -v
```

---

## 4. Run the backend (dev mode)

```bash
cd server
npm run dev
```

You should see:

```
[…] [INFO] MongoDB connected
[…] [INFO] Server listening on http://localhost:5000
```

Health check (in a second terminal):

```bash
curl http://localhost:5000/api/health
# {"success":true,"data":{"status":"ok","uptime":...}}
```

---

## 5. Seed sample data (optional but recommended)

In a separate terminal, with Mongo running:

```bash
cd server
npm run seed
```

This wipes the `users` and `leads` collections and inserts:

- **Admin** — `admin@example.com` / `Password123!`
- **Sales** — `sales@example.com` / `Password123!`
- 20 sample leads

---

## 6. Run the frontend (dev mode)

In a third terminal:

```bash
cd client
npm run dev
```

Open the URL Vite prints, normally http://localhost:5173.

Log in with one of the seeded accounts above.

---

## 7. Quick smoke test

1. Log in as `admin@example.com`.
2. You should land on `/leads` with 10 rows and a "Page 1 of 2" pager.
3. Type `rahul` in the search field — the request is debounced (~400ms), then re-fires.
4. Pick **Status = Qualified** + **Source = Instagram** — the URL stays the same but the list narrows.
5. Click **Export CSV** — a `leads-<timestamp>.csv` file downloads.
6. Click **New lead** → create a lead → it appears at the top (sort defaults to `latest`).
7. Click the moon/sun icon in the navbar to toggle dark mode (preference persists).
8. Log out, log in as `sales@example.com` — note the **Delete** button no longer appears (RBAC).

---

## 8. Alternative: run everything in Docker

If you'd rather not run Node locally:

```bash
# Build images and start mongo + server + client
docker compose up --build
```

Then visit:

- Frontend: http://localhost:5173
- Backend:  http://localhost:5000/api/health

Compose reads sensible defaults for `MONGO_USER`, `MONGO_PASSWORD`, `JWT_SECRET`, etc. To override, create a `.env` at the repo root (also gitignored) — for example:

```ini
MONGO_USER=root
MONGO_PASSWORD=supersecret
JWT_SECRET=$(openssl rand -hex 32)
CLIENT_ORIGIN=http://localhost:5173
VITE_API_URL=http://localhost:5000/api
```

The compose file substitutes these into the `server` and `client` services.

---

## 9. Useful commands

### Server

```bash
cd server
npm run dev        # hot-reload via tsx
npm run typecheck  # tsc --noEmit (no output, must be clean)
npm run build      # compile to dist/
npm start          # run compiled dist/
npm run seed       # wipe + reseed dev DB
```

### Client

```bash
cd client
npm run dev        # vite dev server
npm run typecheck  # tsc -b --noEmit
npm run build      # production build to dist/
npm run preview    # serve the built dist/ locally
```

### Mongo (Docker)

```bash
docker compose up -d mongo            # start
docker compose stop mongo             # stop (keeps data)
docker compose down -v                # stop + delete volume (wipes data)
docker exec -it leads-mongo mongosh \
  -u root -p rootpass --authenticationDatabase admin smartleads
```

---

## 10. Troubleshooting

**`MongoDB connection failed`**
- Is the Mongo container running? `docker ps` should show `leads-mongo`.
- Port conflict? Check nothing else is on 27017: `lsof -i :27017`.
- Stale credentials? `docker compose down -v` and bring it back up.

**`Invalid environment variables: { JWT_SECRET: [ 'String must contain at least 16 character(s)' ] }`**
- Generate a real secret with `openssl rand -hex 32` and put it in `server/.env`.

**Frontend can't reach backend (CORS or network error)**
- Confirm `client/.env` has `VITE_API_URL=http://localhost:5000/api` (and you restarted `npm run dev` after editing).
- Confirm `server/.env` has `CLIENT_ORIGIN=http://localhost:5173`.

**Port already in use (5000 or 5173)**
- Change `PORT` in `server/.env` (and `VITE_API_URL` to match), or change `port` in `client/vite.config.ts`.

**Login returns 401 right after register**
- Check the network tab — if `/auth/me` is failing, your `JWT_SECRET` likely changed between issuing and verifying. Restart the server after editing `.env`.

**TypeScript errors after pulling new code**
- `rm -rf server/node_modules client/node_modules && npm install` in both folders.
