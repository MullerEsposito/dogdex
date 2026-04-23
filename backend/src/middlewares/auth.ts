import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../services/supabase';
import { getPrisma } from '../services/prisma';

const prisma = getPrisma();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 1. Try Supabase Auth (Mobile/Frontend)
    const { data: { user }, error: sbError } = await supabase.auth.getUser(token);
    
    if (!sbError && user) {
      // Auto-provision user in local DB if not exists
      const localUser = await prisma.user.findUnique({ where: { id: user.id } });

      if (!localUser) {
        await prisma.user.create({
          data: {
            id: user.id,
            email: user.email || `${user.id}@external.auth`,
            name: user.user_metadata?.full_name || 'Supabase User',
            password: 'EXTERNAL_AUTH_NO_PASSWORD',
          }
        });
      }

      (req as any).userId = user.id;
      return next();
    }

    // 2. Fallback to Local JWT (Legacy/Tests)
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      (req as any).userId = decoded.userId;
      return next();
    } catch (jwtError) {
      return res.status(401).json({ 
        error: 'Invalid or expired token',
        details: sbError?.message || (jwtError as any).message
      });
    }
  } catch (error) {
    console.error('[AUTH] Critical error:', error);
    return res.status(500).json({ error: 'Internal server error during authentication' });
  }
};
