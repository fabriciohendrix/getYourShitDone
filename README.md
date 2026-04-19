# Prio Tasks – Monorepo Full-Stack

## Estrutura

- `/frontend`: React + Vite + TypeScript + Tailwind CSS
- `/backend`: Node.js + Express + TypeScript
- `docker-compose.yml`: PostgreSQL local
- Scripts SQL: `backend/schema.sql`, `backend/seed.sql`

## Rodando Localmente

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd <repo>
   ```
2. **Suba o banco de dados:**
   ```bash
   docker-compose up -d
   ```
3. **Configure environment variables:**
   - Copie `.env.example` para `.env` em `/backend` e `/frontend`.
   - Adjust values if necessary.
4. **Install dependencies:**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
5. **Rode as migrations e seeds:**
   ```bash
   cd backend
   npm run db:migrate
   npm run db:seed
   ```
6. **Inicie backend e frontend:**
   ```bash
   npm run dev:all
   ```
   Ou, em terminais separados:
   ```bash
   cd backend && npm run dev
   cd frontend && npm run dev
   ```

## Useful Scripts

- `npm run dev:all` – Sobe frontend + backend juntos
- `npm run db:migrate` – Executa migrations
- `npm run db:seed` – Popula banco com dados de exemplo

## Deploy Futuro

- **Supabase:** Crie projeto, configure `DATABASE_URL` no backend.
- **Vercel:** Deploy do frontend.
- **Railway/Render:** Deploy do backend.
- **Variables:**
  - Backend: `DATABASE_URL`, `JWT_SECRET`, `PORT`
  - Frontend: `VITE_API_URL`
- **Domain:** Set up a custom domain on the platforms.

## Notes

- Stateless backend (JWT, no in-memory sessions)
- Frontend usa env vars VITE\_
- Typed TypeScript code
- Validation with zod
- Toasts com react-hot-toast
- Drag-and-drop com @dnd-kit/core

---

> Questions? See code comments and example scripts.
