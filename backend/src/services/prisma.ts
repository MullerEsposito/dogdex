import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

/**
 * Creates a Prisma client using the libsql adapter.
 * @param url - SQLite file URL (e.g., "file:./dev.db") or LibSQL remote URL
 */
export function createPrismaClient(url?: string) {
  const dbUrl = url || process.env.DATABASE_URL || 'file:./dev.db';
  const adapter = new PrismaLibSql({ url: dbUrl });
  return new PrismaClient({ adapter } as any);
}

/**
 * Singleton for production use. Reads DATABASE_URL from env.
 */
let _prisma: ReturnType<typeof createPrismaClient> | null = null;

export function getPrisma() {
  if (!_prisma) {
    _prisma = createPrismaClient();
  }
  return _prisma;
}
