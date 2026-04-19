-- Example user
INSERT INTO users (id, email, password_hash, name)
VALUES ('11111111-1111-1111-1111-111111111111', 'demo@demo.com', '$2b$10$abcdefghijklmnopqrstuv', 'Demo User')
ON CONFLICT (email) DO NOTHING;

-- Example tasks
INSERT INTO tasks (user_id, index, title, ticket_number, ticket_url, status, description, links, "column", position)
VALUES
  ('11111111-1111-1111-1111-111111111111', 1, 'Implement login', 'TCK-001', 'https://ticket/1', 'open', 'Implement login screen and API', '["https://ref1.com"]', 'backlog', 1),
  ('11111111-1111-1111-1111-111111111111', 2, 'Drag tasks', 'TCK-002', 'https://ticket/2', 'open', 'Allow drag-and-drop between columns', '["https://ref2.com"]', 'in_progress', 1)
;