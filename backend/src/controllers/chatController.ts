import { Request, Response } from 'express';
import { getPrisma } from '../services/prisma';

const prisma = getPrisma();

export const createOrGetSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { adoptionPointId } = req.body;
    const userId = (req as any).userId;

    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    if (!adoptionPointId) {
      res.status(400).json({ success: false, error: 'adoptionPointId is required' });
      return;
    }

    const point = await prisma.adoptionPoint.findUnique({
      where: { id: adoptionPointId },
    });

    if (!point) {
      res.status(404).json({ success: false, error: 'Adoption point not found' });
      return;
    }

    if (point.creatorId === userId) {
      res.status(400).json({ success: false, error: 'Cannot chat with yourself' });
      return;
    }

    // Upsert session
    let session = await prisma.chatSession.findUnique({
      where: {
        adopterId_adoptionPointId: {
          adopterId: userId,
          adoptionPointId: adoptionPointId,
        },
      },
      include: {
        creator: { select: { name: true, avatarUrl: true } },
        adopter: { select: { name: true, avatarUrl: true } },
        adoptionPoint: { select: { name: true } }
      }
    });

    if (!session) {
      session = await prisma.chatSession.create({
        data: {
          adopterId: userId,
          adoptionPointId: adoptionPointId,
          creatorId: point.creatorId,
        },
        include: {
          creator: { select: { name: true, avatarUrl: true } },
          adopter: { select: { name: true, avatarUrl: true } },
          adoptionPoint: { select: { name: true } }
        }
      });
    }

    res.json({ success: true, data: session });
  } catch (error) {
    console.error('Error creating chat session:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getMySessions = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const sessions = await prisma.chatSession.findMany({
      where: {
        OR: [
          { adopterId: userId },
          { creatorId: userId },
        ],
      },
      include: {
        adopter: { select: { id: true, name: true, avatarUrl: true } },
        creator: { select: { id: true, name: true, avatarUrl: true } },
        adoptionPoint: { select: { name: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Get latest message for preview
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ success: true, data: sessions });
  } catch (error) {
    console.error('Error getting chat sessions:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getUnreadCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const count = await prisma.message.count({
      where: {
        session: {
          OR: [
            { adopterId: userId },
            { creatorId: userId },
          ],
        },
        senderId: { not: userId },
        isRead: false,
      },
    });

    res.json({ success: true, data: { count } });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const sId = sessionId as string;
    const userId = (req as any).userId;

    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const session = await prisma.chatSession.findUnique({
      where: { id: sId },
    });

    if (!session || (session.adopterId !== userId && session.creatorId !== userId)) {
      res.status(404).json({ success: false, error: 'Session not found or unauthorized' });
      return;
    }

    const messages = await prisma.message.findMany({
      where: { sessionId: sId },
      orderBy: { createdAt: 'asc' }, // Older first
    });

    // Mark as read where sender is not current user
    const unreadMessages = messages.filter(m => !m.isRead && m.senderId !== userId);
    if (unreadMessages.length > 0) {
      await prisma.message.updateMany({
        where: {
          sessionId: sId,
          senderId: { not: userId },
          isRead: false,
        },
        data: { isRead: true },
      });
    }

    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const sId = sessionId as string;
    const { content } = req.body;
    const userId = (req as any).userId;

    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    if (!content || !content.trim()) {
      res.status(400).json({ success: false, error: 'Message content cannot be empty' });
      return;
    }

    const session = await prisma.chatSession.findUnique({
      where: { id: sId },
    });

    if (!session || (session.adopterId !== userId && session.creatorId !== userId)) {
      res.status(404).json({ success: false, error: 'Session not found or unauthorized' });
      return;
    }

    const message = await prisma.message.create({
      data: {
        sessionId: sId,
        senderId: userId,
        content: content.trim(),
      },
    });

    // Update session updatedAt to bubble it up in lists
    await prisma.chatSession.update({
      where: { id: sId },
      data: { updatedAt: new Date() },
    });

    res.json({ success: true, data: message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
