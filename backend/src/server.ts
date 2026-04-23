import 'dotenv/config';
import express from 'express';
// Triggering new build with corrected Render settings
import cors from 'cors';
import { routes } from './routes';
import { loadModel } from './ml/model';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logging de requisições com status code
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

app.use(routes);

// Middleware de Debug para 404
app.use((req, res, next) => {
  console.log(`[404 DEBUG] Rota não encontrada FINAL: ${req.method} ${req.url}`);
  next();
});

// Error Handler Global
app.use((err: any, req: any, res: any, next: any) => {
  console.error('❌ ERRO GLOBAL:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Erro interno do servidor'
  });
});

// Função para logar todas as rotas registradas (DEBUG) - Versão Robusta
function logRoutes(stack: any[], prefix = '') {
  if (!stack) return;
  stack.forEach((middleware: any) => {
    if (middleware.route) {
      const methods = Object.keys(middleware.route.methods).join(',').toUpperCase();
      console.log(`[ROUTE] ${methods.padEnd(7)} ${prefix}${middleware.route.path}`);
    } else if (middleware.handle && middleware.handle.stack) {
      // Tenta extrair o caminho base do roteador
      let routerPath = (middleware.regexp.source || '')
        .replace('\\/?(?=\\/|$)', '')
        .replace('^', '')
        .replace('\\/', '/');
      
      if (routerPath === '/?') routerPath = '';
      logRoutes(middleware.handle.stack, prefix + routerPath);
    }
  });
}

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await loadModel();
    
    console.log('🔍 Mapeando rotas registradas...');
    if ((app as any)._router && (app as any)._router.stack) {
      logRoutes((app as any)._router.stack);
    }

    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`Servidor rodando em porta ${PORT} 🚀`);
    });
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
}

// Inicia o servidor apenas se o arquivo for executado diretamente
if (require.main === module) {
  start();
}

export { app, start };
