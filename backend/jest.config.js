const path = require('path');

// ─── Configuração de Ambiente de Teste ────────────────────────
// Estes devem ser definidos ANTES dos workers do Jest iniciarem,
// para que `dotenv/config` no server.ts NÃO os sobrescreva
// (dotenv não sobrescreve variáveis já existentes).
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = `file:${path.resolve(__dirname, 'prisma/test.db')}`;

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/', 'setup.ts', 'teardown.ts'],
  moduleNameMapper: {
    '^@dogdex/shared$': '<rootDir>/../shared/src/index.ts',
  },
  globalSetup: './src/__tests__/setup.ts',
  globalTeardown: './src/__tests__/teardown.ts',
};
