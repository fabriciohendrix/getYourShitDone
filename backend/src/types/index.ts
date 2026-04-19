export type User = {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: string;
  user_id: string;
  index: number;
  title: string;
  ticket_number: string;
  ticket_url: string;
  status: string;
  description: string;
  links: any;
  column: 'in_progress' | 'backlog';
  position: number;
  created_at: string;
  updated_at: string;
};
