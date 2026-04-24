import { Request, Response } from 'express';
import { getPrisma } from '../services/prisma';

const prisma = getPrisma();

export const push = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { entries } = req.body;

    if (!entries || !Array.isArray(entries)) {
      return res.status(400).json({ error: 'Entries array is required' });
    }

    // Prepare data with userId
    const dataToInsert = entries.map((entry: any) => ({
      localId: entry.id || entry.localId, // Usa o id do frontend como localId
      breedName: entry.breedName,
      confidence: entry.confidence,
      locationAddr: entry.locationAddr,
      imageUri: entry.imageUri,
      status: entry.status || 'synced',
      timestamp: entry.timestamp ? new Date(entry.timestamp) : new Date(),
      userId: userId,
    }));

    // For safety in this test/dev phase, we create them one by one or use createMany if supported by the adapter
    // SQLite adapter supports createMany if using Prisma 5.4.0+ but since we are on Prisma 7, should be fine.
    // However, to handle potential existing localIds (avoiding duplicates if the user pushes twice), 
    // we use a loop for more granular control.
    
    let count = 0;
    for (const entry of dataToInsert) {
       // Verifica se localId já existe para este usuário para evitar duplicidade
       const existing = await prisma.dogEntry.findFirst({
         where: { localId: entry.localId, userId: userId }
       });

       if (!existing) {
         await prisma.dogEntry.create({ data: entry });
         count++;
       } else {
         // ATUALIZA o registro existente (especialmente o status)
         await prisma.dogEntry.update({
           where: { id: existing.id },
           data: { 
             status: entry.status,
             // atualiza outros campos se necessário
           }
         });
       }
    }

    res.status(201).json({ success: true, count });
  } catch (error) {
    console.error('Push sync error:', error);
    res.status(500).json({ error: 'Error during sync push' });
  }
};

export const pull = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const entries = await prisma.dogEntry.findMany({
      where: { 
        userId: userId,
        status: { not: 'deleted' } // Não retorna itens apagados
      },
      orderBy: { timestamp: 'desc' }
    });

    res.status(200).json({ success: true, entries });
  } catch (error) {
    console.error('Pull sync error:', error);
    res.status(500).json({ error: 'Error during sync pull' });
  }
};
