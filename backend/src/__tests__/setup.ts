import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

// Resolve relative to this file: backend/src/__tests__/setup.ts -> backend/
const BACKEND_ROOT = path.resolve(__dirname, '../../');
const TEST_DB_PATH = path.resolve(BACKEND_ROOT, 'prisma/test.db');

export default async function globalSetup() {
  // Ensure a clean test database
  if (fs.existsSync(TEST_DB_PATH)) fs.unlinkSync(TEST_DB_PATH);

  // Set env so migrate deploy uses the test DB
  process.env.DATABASE_URL = `file:${TEST_DB_PATH}`;

  execSync('npx prisma migrate deploy', {
    cwd: BACKEND_ROOT,
    env: {
      ...process.env,
      DATABASE_URL: `file:${TEST_DB_PATH}`,
    },
    stdio: 'pipe',
  });

  console.log('\n✅ Test database migrated and ready.\n');
}
