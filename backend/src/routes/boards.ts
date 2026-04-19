import { Router } from "express";
import { pool } from "../db";
import { z } from "zod";
import { AuthRequest } from "../middleware/auth";

const router = Router();

// GET /api/boards - list boards for the user
router.get("/", async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const result = await pool.query(
    "SELECT * FROM boards WHERE user_id = $1 ORDER BY created_at",
    [userId],
  );
  res.json(result.rows);
});

// POST /api/boards - create new board
const createBoardSchema = z.object({
  name: z.string().min(1),
  color: z.string().optional(),
});

router.post("/", async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const parse = createBoardSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.flatten() });
  }
  const { name, color } = parse.data;
  try {
    const result = await pool.query(
      "INSERT INTO boards (user_id, name, color) VALUES ($1, $2, $3) RETURNING *",
      [userId, name, color || null],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("[POST /api/boards] DB error:", err);
    res.status(500).json({ error: "Error creating board" });
  }
});

// DELETE /api/boards/:id - delete board and its tasks
router.delete("/:id", async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const { id } = req.params;
  const result = await pool.query(
    "DELETE FROM boards WHERE id = $1 AND user_id = $2 RETURNING *",
    [id, userId],
  );
  if (result.rowCount === 0)
    return res.status(404).json({ error: "Board not found" });
  res.status(204).send();
});

export default router;
