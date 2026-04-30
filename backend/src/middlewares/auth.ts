import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../services/supabase';
import { getPrisma } from '../services/prisma';

const prisma = getPrisma();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set. Server cannot start.');
}

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
      // Sincroniza o usuário do Supabase com o nosso banco local (Prisma)
      // Buscamos primeiro por ID, depois por Email para evitar conflitos de migração de projeto
      let localUser = await prisma.user.findUnique({ where: { id: user.id } });

      if (!localUser) {
        // Se não achou pelo ID, tenta pelo e-mail (conflito comum ao trocar de projeto Supabase)
        const userByEmail = await prisma.user.findUnique({ where: { email: user.email! } });

        if (userByEmail) {
          console.log(`[AUTH] Usuário ${user.email} encontrado com ID diferente. Atualizando ID de ${userByEmail.id} para ${user.id}`);
          // Atualizamos o ID e os metadados. Nota: Atualizar PK pode ser restritivo, mas como o ID vem do Supabase, ele é o mestre.
          localUser = await prisma.user.update({
            where: { email: user.email! },
            data: {
              id: user.id,
              name: user.user_metadata?.full_name || user.user_metadata?.name || userByEmail.name,
              avatarUrl: user.user_metadata?.avatar_url || (userByEmail as any).avatarUrl,
            },
          });
        } else {
          // Usuário novo real
          localUser = await prisma.user.create({
            data: {
              id: user.id,
              email: user.email!,
              name: user.user_metadata?.full_name || user.user_metadata?.name || '',
              avatarUrl: user.user_metadata?.avatar_url,
            },
          });
        }
      } else {
        // Usuário já existe com ID correto, apenas atualiza metadados se necessário
        await prisma.user.update({
          where: { id: user.id },
          data: {
            name: user.user_metadata?.full_name || user.user_metadata?.name || localUser.name,
            avatarUrl: user.user_metadata?.avatar_url || (localUser as any).avatarUrl,
          }
        });
      }

      (req as any).userId = localUser.id;
      return next();
    } else {
      console.error('[AUTH] Supabase getUser failed:', sbError?.message);
    }

    // 2. Fallback to Local JWT (Legacy/Tests)
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      (req as any).userId = decoded.userId;
      return next();
    } catch (jwtError) {
      console.error('[AUTH] Local JWT fallback failed:', (jwtError as any).message);
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
