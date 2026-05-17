# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack and TypeScript end-to-end.

## Stack

**Frontend**
- React 18 + TypeScript
- Vite
- TailwindCSS
- React Router
- Axios
- React Hook Form + Zod

**Backend**
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT (jsonwebtoken) + bcrypt
- Zod for request validation
- json2csv for CSV export

**Infra**
- Docker + docker-compose (Mongo, server, client)

## Features

- JWT auth (register, login, protected routes) with bcrypt password hashing
- Role-based access control: `admin` and `sales`
- Lead CRUD (name, email, status, source, createdAt)
- Advanced filtering: status, source, search by name/email, sort latest/oldest — all composable
- Backend pagination (10 per page) with metadata
- Debounced search on the frontend
- CSV export of the current filtered view
- Centralized error handling and request validation
- Loading, empty, and error states across the UI
- Responsive design with dark mode

## Project structure

```
.
├── client/                 # React + Vite + TS frontend
├── server/                 # Express + TS backend
├── docker-compose.yml      # Mongo + server + client
└── README.md
```

## Getting started

See setup instructions in your local docs or run:

```bash
# Backend
cd server && npm install && npm run dev

# Frontend (in another terminal)
cd client && npm install && npm run dev
```

You'll need a `.env` file in both `server/` and `client/` — see `.env.example` in each folder.

## API documentation

Base URL: `/api`

### Auth
| Method | Endpoint           | Auth      | Body                                |
|--------|--------------------|-----------|-------------------------------------|
| POST   | `/auth/register`   | Public    | `{ name, email, password, role? }`  |
| POST   | `/auth/login`      | Public    | `{ email, password }`               |
| GET    | `/auth/me`         | Bearer    | —                                   |

### Leads
| Method | Endpoint              | Auth          | Notes                                            |
|--------|-----------------------|---------------|--------------------------------------------------|
| GET    | `/leads`              | Bearer        | Query: `status`, `source`, `search`, `sort`, `page`, `limit` |
| GET    | `/leads/export`       | Bearer        | Same query params; returns `text/csv`            |
| GET    | `/leads/:id`          | Bearer        | —                                                |
| POST   | `/leads`              | Bearer        | `{ name, email, status, source }`                |
| PATCH  | `/leads/:id`          | Bearer        | Partial body                                     |
| DELETE | `/leads/:id`          | Bearer, admin | Sales users cannot delete                        |

### Response envelope
```json
{ "success": true, "data": ..., "meta": { "page": 1, "limit": 10, "total": 42, "pages": 5 } }
```

Errors:
```json
{ "success": false, "error": { "message": "...", "code": "..." } }
```

## License

MIT
