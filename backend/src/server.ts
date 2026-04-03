import express from 'express';
// Triggering new build with corrected Render settings
import cors from 'cors';
import { routes } from './routes';
import { loadModel } from './ml/model';

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

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
