import { Router } from "express";
import { pool } from "../db";
import { z } from "zod";
import { AuthRequest } from "../middleware/auth";

const router = Router();

// GET /api/tasks?board_id=ID
router.get("/", async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  const boardId = req.query.board_id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  if (!boardId) return res.status(400).json({ error: "Missing board_id" });
  const result = await pool.query(
    'SELECT * FROM tasks WHERE user_id = $1 AND board_id = $2 ORDER BY "column", position',
    [userId, boardId],
  );
  res.json(result.rows);
});

// POST /api/tasks
const createTaskSchema = z.object({
  board_id: z.number().int(),
  title: z.string().min(1),
  ticket_number: z.string().optional(),
  ticket_url: z.string().optional(),
  status: z.string().optional(),
  description: z.string().optional(),
  links: z.any().optional(),
  column: z.enum(["in_progress", "backlog"]),
  position: z.number().int(),
});

router.post("/", async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const parse = createTaskSchema.safeParse(req.body);
  if (!parse.success)
    return res.status(400).json({ error: parse.error.flatten() });
  const {
    board_id,
    title,
    ticket_number,
    ticket_url,
    status,
    description,
    links,
    column,
    position,
  } = parse.data;
  const result = await pool.query(
    'INSERT INTO tasks (user_id, board_id, title, ticket_number, ticket_url, status, description, links, "column", position) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
    [
      userId,
      board_id,
      title,
      ticket_number,
      ticket_url,
      status,
      description,
      JSON.stringify(links || []),
      column,
      position,
    ],
  );
  res.status(201).json(result.rows[0]);
});

// PUT /api/tasks/:id
const updateTaskSchema = z.object({
  board_id: z.number().int().optional(),
  title: z.string().optional(),
  ticket_number: z.string().optional(),
  ticket_url: z.string().optional(),
  status: z.string().optional(),
  description: z.string().optional(),
  links: z.any().optional(),
  column: z.enum(["in_progress", "backlog"]).optional(),
  position: z.number().int().optional(),
});

router.put("/:id", async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const { id } = req.params;
  const parse = updateTaskSchema.safeParse(req.body);
  if (!parse.success)
    return res.status(400).json({ error: parse.error.flatten() });
  const fields = Object.entries(parse.data).filter(([_, v]) => v !== undefined);
  if (fields.length === 0)
    return res.status(400).json({ error: "No fields to update" });
  const set = fields
    .map(([k], i) => `${k === "column" ? '"column"' : k} = $${i + 1}`)
    .join(", ");
  const values = fields.map(([_, v]) => v);
  values.push(id, userId);
  const result = await pool.query(
    `UPDATE tasks SET ${set}, updated_at = NOW() WHERE id = $${fields.length + 1} AND user_id = $${fields.length + 2} RETURNING *`,
    values,
  );
  if (result.rowCount === 0)
    return res.status(404).json({ error: "Task not found" });
  res.json(result.rows[0]);
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const { id } = req.params;
  // Only delete if the task belongs to the user
  const result = await pool.query(
    "DELETE FROM tasks WHERE id = $1 AND user_id = $2",
    [id, userId],
  );
  if (result.rowCount === 0)
    return res.status(404).json({ error: "Task not found" });
  res.status(204).send();
});

export default router;
