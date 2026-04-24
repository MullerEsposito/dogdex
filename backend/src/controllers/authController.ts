import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { getPrisma } from '../services/prisma';
import { emailService } from '../services/emailService';
import { supabase } from '../services/supabase';
import { getResetPasswordHTML } from '../templates/resetPasswordTemplate';

const prisma = getPrisma();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set. Server cannot start.');
}

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, socialProvider, isSocial } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      // Se o usuário já existe e é social, e está tentando registrar com senha
      if (existingUser.isSocial && !existingUser.password && password) {
        return res.status(409).json({ 
          error: 'Esta conta foi criada via login social. Por favor, use a opção "Esqueci minha senha" para definir uma senha de acesso.',
          code: 'SOCIAL_ACCOUNT_EXISTS'
        });
      }
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Se for registro social, não exige senha
    let hashedPassword = null;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }
      hashedPassword = await bcrypt.hash(password, 10);
    } else if (!isSocial) {
      return res.status(400).json({ error: 'Password is required for non-social registration' });
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        socialProvider: socialProvider || null,
        isSocial: !!isSocial,
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({
      token,
      user: {
        ...userWithoutPassword,
        hasPassword: !!user.password
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Se o usuário não tem senha (conta social) — fluxo diferenciado
    if (user && !user.password) {
      return res.status(403).json({ 
        error: 'Esta conta utiliza login social e não possui uma senha definida.',
        code: 'SOCIAL_ACCOUNT_MISSING_PASSWORD'
      });
    }

    // Resposta genérica para "não encontrado" e "senha incorreta" (anti-enumeração)
    if (!user || !(await bcrypt.compare(password, user.password!))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    // Invalida tokens de reset pendentes ao logar com sucesso
    if (user.resetToken) {
      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken: null, resetTokenExpires: null }
      });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({
      token,
      user: {
        ...userWithoutPassword,
        hasPassword: !!user.password
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error during login' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Por segurança, não confirmamos se o e-mail existe, mas retornamos sucesso
      return res.status(200).json({ message: 'Se este e-mail estiver cadastrado, um link de recuperação será enviado.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 900000); // 15 minutos (900.000ms)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpires: expires,
      }
    });

    await emailService.sendPasswordResetEmail(email, token);

    res.status(200).json({ message: 'Instruções de recuperação enviadas para o e-mail.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Error processing forgot password' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: { gt: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Token inválido ou expirado.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 1. Atualiza no nosso banco de dados (Prisma)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      }
    });

    // 2. Sincroniza com o Supabase Auth (Obrigatório para o login funcionar)
    try {
      const { error: supabaseError } = await supabase.auth.admin.updateUserById(user.id, {
        password: newPassword
      });

      if (supabaseError) {
        console.error('Erro ao sincronizar com Supabase Auth:', supabaseError);
      }
    } catch (e) {
      console.error('Falha crítica na comunicação com Supabase:', e);
    }

    res.status(200).json({ message: 'Senha atualizada com sucesso!' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Error resetting password' });
  }
};

export const resetPasswordPage = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send('<h1>Token Inválido</h1>');
  }

  res.send(getResetPasswordHTML(token as string));
};


export const setPassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.status(200).json({ message: 'Senha definida com sucesso!' });
  } catch (error) {
    console.error('Set password error:', error);
    res.status(500).json({ error: 'Error setting password' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({ 
      user: {
        ...userWithoutPassword,
        hasPassword: !!user.password
      } 
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Error fetching profile' });
  }
};
