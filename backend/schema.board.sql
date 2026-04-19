-- Boards table
CREATE TABLE IF NOT EXISTS boards (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add board_id to tasks
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE;

-- Remove NOT NULL from user_id in tasks if needed (for future multi-user boards)
-- ALTER TABLE tasks ALTER COLUMN user_id DROP NOT NULL;

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_tasks_board_id ON tasks(board_id);
