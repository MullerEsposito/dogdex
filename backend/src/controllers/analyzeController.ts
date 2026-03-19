import { Request, Response } from 'express';
import { analyzeService } from '../services/analyzeService';

export class AnalyzeController {
  async handle(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'Nenhuma imagem enviada' });
        return;
      }

      const result = await analyzeService.analyzeImage(req.file.path);

      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao analisar imagem' });
    }
  }
}

export const analyzeController = new AnalyzeController();
