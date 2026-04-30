# getYourShitDone – Monorepo Full-Stack

## Structure

- `/frontend`: React + Vite + TypeScript + Tailwind CSS
- `/backend`: Node.js + Express + TypeScript
- `docker-compose.yml`: Local PostgreSQL
- SQL scripts: `backend/schema.sql`, `backend/seed.sql`

## Running Locally

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd <repo>
   ```
2. **Start the database:**
   ```bash
   docker-compose up -d
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` in `/backend` and `/frontend`.
   - Adjust values if necessary.
4. **Install dependencies:**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
5. **Run migrations and seed data:**
   ```bash
   cd backend
   npm run db:migrate
   npm run db:seed
   ```
6. **Start backend and frontend:**
   ```bash
   npm run dev:all
   ```
   Or, in separate terminals:
   ```bash
   cd backend && npm run dev
   cd frontend && npm run dev
   ```

## Useful Scripts

- `npm run dev:all` – Starts frontend + backend together
- `npm run db:migrate` – Runs migrations
- `npm run db:seed` – Seeds the database with sample data

## Production Infra

| Layer    | Service  |
| -------- | -------- |
| Frontend | Vercel   |
| Backend  | Render   |
| Database | Supabase |

---

> Questions? See code comments and example scripts 😁
> Made with love for hateful tasks ❤️
