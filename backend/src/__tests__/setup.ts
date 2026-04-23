import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

// Resolve relative to this file: backend/src/__tests__/setup.ts -> backend/
const BACKEND_ROOT = path.resolve(__dirname, '../../');
const TEST_DB_PATH = path.resolve(BACKEND_ROOT, 'prisma/test.db');

export default async function globalSetup() {
  // Ensure a clean test database
  if (fs.existsSync(TEST_DB_PATH)) fs.unlinkSync(TEST_DB_PATH);

  // Dynamically generate test.prisma from schema.prisma to avoid duplication
  const schemaPath = path.resolve(BACKEND_ROOT, 'prisma/schema.prisma');
  const testSchemaPath = path.resolve(BACKEND_ROOT, 'prisma/test.prisma');
  
  if (fs.existsSync(schemaPath)) {
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
    const testSchemaContent = schemaContent.replace(
      /provider\s*=\s*"postgresql"/g,
      'provider = "sqlite"'
    );
    fs.writeFileSync(testSchemaPath, testSchemaContent);
  }

  try {
    const testEnv = {
      ...process.env,
      DATABASE_URL: `file:${TEST_DB_PATH}`,
      NODE_ENV: 'test',
    };

    // Usamos 'db push' com o schema de teste (SQLite)
    execSync('npx prisma db push --accept-data-loss', {
      cwd: BACKEND_ROOT,
      env: testEnv,
      stdio: 'pipe',
    });

    // Gera o client para o ambiente de teste (Garante provider=sqlite)
    execSync('npx prisma generate', {
      cwd: BACKEND_ROOT,
      env: testEnv,
      stdio: 'pipe',
    });
  } catch (err: any) {
    console.error('❌ Error migrating test database:', err.stderr?.toString() || err.message);
    throw err;
  }

  console.log('\n✅ Test database migrated and ready.\n');
}
