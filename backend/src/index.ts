import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { json } from "express";
import authRoutes from "./routes/auth";
import tasksRoutes from "./routes/tasks";
import boardsRoutes from "./routes/boards";
import { authMiddleware } from "./middleware/auth";

dotenv.config();

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5175",
  process.env.FRONTEND_URL,
]
  .filter(Boolean)
  .flatMap((origin) => origin!.split(",").map((item) => item.trim()))
  .filter(Boolean);

app.use(json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/boards", authMiddleware, boardsRoutes);
app.use("/api/tasks", authMiddleware, tasksRoutes);

app.get("/api/health", (_, res) => res.json({ status: "ok" }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
