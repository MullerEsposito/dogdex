import 'dotenv/config';

// HACK: Fix for @tensorflow/tfjs-node incompatibility with Node 20+
// it expects util.isNullOrUndefined which was removed in recent Node versions
import util from 'util';
if (!(util as any).isNullOrUndefined) {
  (util as any).isNullOrUndefined = (val: any) => val === null || val === undefined;
}

import express from 'express';
// Triggering new build with corrected Render settings
import cors from 'cors';
import { routes } from './routes';
import { loadModel } from './ml/model';

const app = express();

// Configura o Express para confiar no proxy do Render (necessário para o rate-limit)
app.set('trust proxy', 1);

// Validação rigorosa de variáveis de ambiente obrigatórias
const REQUIRED_ENVS = [
  'DATABASE_URL',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'APP_MIN_VERSION',
  'APP_STORE_URL'
];

const missingEnvs = REQUIRED_ENVS.filter(env => !process.env[env]);

if (missingEnvs.length > 0) {
  console.error('❌ ERRO CRÍTICO: Variáveis de ambiente obrigatórias ausentes:');
  missingEnvs.forEach(env => console.error(`   - ${env}`));
  console.error('\nO servidor não pode iniciar sem estas configurações. Abortando.');
  process.exit(1);
}

const allowedOrigins = [
  process.env.API_URL,                        // Backend próprio (reset password page)
  /^http:\/\/localhost(:\d+)?$/,              // Dev local (qualquer porta)
  /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/,    // Rede local (dev mobile)
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Requisições sem Origin (mobile nativo, Postman, curl) são permitidas
    if (!origin) return callback(null, true);

    // LOG para debug
    console.log(`[CORS] Request from origin: ${origin}`);

    const isAllowed = allowedOrigins.some(allowed =>
      allowed instanceof RegExp ? allowed.test(origin) : allowed === origin
    );

    // No desenvolvimento, vamos ser mais flexíveis se o IP começar com 192.168 ou 172 ou localhost
    const isDevLocal = origin.startsWith('http://localhost') || 
                      origin.startsWith('http://192.168.') || 
                      origin.startsWith('http://172.');

    if (isAllowed || isDevLocal) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Origin ${origin} blocked`);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

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
