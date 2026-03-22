import express from 'express';
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
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
}

start();
