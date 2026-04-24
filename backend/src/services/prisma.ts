import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

/**
 * Creates a Prisma client.
 * - Testes (SQLite): usa @prisma/adapter-better-sqlite3
 * - Produção (PostgreSQL): usa @prisma/adapter-pg
 *
 * Prisma 7 exige um driver adapter — não há mais motor nativo embutido.
 */
export function createPrismaClient(url?: string) {
  const isTest = process.env.NODE_ENV === 'test' || !!process.env.JEST_WORKER_ID;
  const connectionString = url || process.env.DATABASE_URL;

  if (isTest) {
    // Importação dinâmica síncrona (ok para testes)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

    // Resolve o caminho do arquivo a partir da URL `file:...`
    let dbPath = ':memory:';
    if (connectionString && connectionString.startsWith('file:')) {
      dbPath = connectionString.replace('file:', '');
    } else if (url) {
      dbPath = url;
    }

    const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
    return new PrismaClient({ adapter });
  }

  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }

  // Produção/Desenvolvimento: PostgreSQL via adapter
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({ adapter });
}

/**
 * Singleton for production use.
 */
let _prisma: PrismaClient | null = null;

export function getPrisma() {
  if (!_prisma) {
    _prisma = createPrismaClient();
  }
  return _prisma;
}
