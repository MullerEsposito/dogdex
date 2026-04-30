import { Request, Response } from 'express';
import { getPrisma } from '../services/prisma';

const prisma = getPrisma();

export const createPoint = async (req: Request, res: Response) => {
  try {
    const { name, address, description, latitude, longitude, contactPhone } = req.body;
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Usuário não autenticado' });
    }

    const point = await prisma.adoptionPoint.create({
      data: {
        name,
        description,
        address,
        latitude,
        longitude,
        contactPhone,
        creatorId: userId
      }
    });

    return res.status(201).json({ success: true, data: point });
  } catch (error: any) {
    console.error('Erro ao criar ponto de adoção:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const listPoints = async (req: Request, res: Response) => {
  try {
    const points = await prisma.adoptionPoint.findMany({
      include: {
        dogs: {
          where: { status: 'available' }
        }
      }
    });

    return res.status(200).json({ success: true, data: points });
  } catch (error: any) {
    console.error('Erro ao listar pontos de adoção:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const addDogToPoint = async (req: Request, res: Response) => {
  try {
    const { pointId } = req.params;
    const { name, breedName, age, description, imageUri } = req.body;
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Usuário não autenticado' });
    }

    // Verifica se o ponto existe e se o usuário é o criador
    const point = await prisma.adoptionPoint.findUnique({
      where: { id: pointId as string }
    });

    if (!point) {
      return res.status(404).json({ success: false, error: 'Ponto de adoção não encontrado' });
    }

    if (point.creatorId !== userId) {
      return res.status(403).json({ success: false, error: 'Apenas o criador do ponto pode adicionar cães' });
    }

    const dog = await prisma.adoptionDog.create({
      data: {
        name,
        breedName,
        age,
        description,
        imageUri,
        adoptionPointId: pointId as string,
        creatorId: userId
      }
    });

    return res.status(201).json({ success: true, data: dog });
  } catch (error: any) {
    console.error('Erro ao adicionar cachorro:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getDogsByPoint = async (req: Request, res: Response) => {
  try {
    const { pointId } = req.params;

    const dogs = await prisma.adoptionDog.findMany({
      where: { 
        adoptionPointId: pointId as string,
        status: 'available'
      }
    });

    return res.status(200).json({ success: true, data: dogs });
  } catch (error: any) {
    console.error('Erro ao listar cachorros do ponto:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
export const updatePoint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, address, description, latitude, longitude, contactPhone } = req.body;
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Usuário não autenticado' });
    }

    const point = await prisma.adoptionPoint.findUnique({
      where: { id: id as string }
    });

    if (!point) {
      return res.status(404).json({ success: false, error: 'Ponto de adoção não encontrado' });
    }

    if (point.creatorId !== userId) {
      return res.status(403).json({ success: false, error: 'Apenas o criador pode editar o ponto' });
    }

    const updatedPoint = await prisma.adoptionPoint.update({
      where: { id: id as string },
      data: {
        name,
        address,
        description,
        latitude,
        longitude,
        contactPhone
      }
    });

    return res.status(200).json({ success: true, data: updatedPoint });
  } catch (error: any) {
    console.error('Erro ao atualizar ponto:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateDogStatus = async (req: Request, res: Response) => {
  try {
    const { dogId } = req.params;
    const { status } = req.body; // 'available' ou 'adopted'
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Usuário não autenticado' });
    }

    const dog = await prisma.adoptionDog.findUnique({
      where: { id: dogId as string }
    });

    if (!dog) {
      return res.status(404).json({ success: false, error: 'Cachorro não encontrado' });
    }

    // Apenas o criador do registro do cão pode mudar o status
    if (dog.creatorId !== userId) {
      return res.status(403).json({ success: false, error: 'Apenas o criador pode alterar o status do cão' });
    }

    const updatedDog = await prisma.adoptionDog.update({
      where: { id: dogId as string },
      data: { status }
    });

    return res.status(200).json({ success: true, data: updatedDog });
  } catch (error: any) {
    console.error('Erro ao atualizar status do cão:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteDog = async (req: Request, res: Response) => {
  try {
    const { dogId } = req.params;
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Usuário não autenticado' });
    }

    const dog = await prisma.adoptionDog.findUnique({
      where: { id: dogId as string }
    });

    if (!dog) {
      return res.status(404).json({ success: false, error: 'Cachorro não encontrado' });
    }

    // Apenas o criador do registro do cão pode excluir
    if (dog.creatorId !== userId) {
      return res.status(403).json({ success: false, error: 'Apenas o criador pode excluir este registro' });
    }

    await prisma.adoptionDog.delete({
      where: { id: dogId as string }
    });

    return res.status(200).json({ success: true, message: 'Cachorro excluído com sucesso' });
  } catch (error: any) {
    console.error('Erro ao excluir cão:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
