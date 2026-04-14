import 'dotenv/config';
import express from 'express';
// Triggering new build with corrected Render settings
import cors from 'cors';
import { routes } from './routes';
import { loadModel } from './ml/model';

const app = express();

app.use(cors());
app.use(express.json());

// Logging de requisições simples
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(routes);

// Error Handler Global - Garante que erros retornem JSON, não HTML
app.use((err: any, req: any, res: any, next: any) => {
  console.error('❌ ERRO GLOBAL:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Erro interno do servidor'
  });
});

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await loadModel();
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`Servidor rodando em porta ${PORT} 🚀`);
    });
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
}

start();
