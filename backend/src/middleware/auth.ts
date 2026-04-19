import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('[authMiddleware] Falha: No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('[authMiddleware] Falha: Malformed token', authHeader);
    return res.status(401).json({ error: 'Malformed token' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded as { id: string; email: string };
    next();
  } catch (err) {
    console.log('[authMiddleware] Falha: Invalid token', err instanceof Error ? err.message : err);
    return res.status(401).json({ error: 'Invalid token' });
  }
}
