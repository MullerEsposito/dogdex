import * as fs from 'fs';
import * as path from 'path';

const BACKEND_ROOT = path.resolve(__dirname, '../../');
const TEST_DB_PATH = path.resolve(BACKEND_ROOT, 'prisma/test.db');

export default async function globalTeardown() {
  // Give connections time to fully close before deleting
  await new Promise((r) => setTimeout(r, 500));

  [TEST_DB_PATH, `${TEST_DB_PATH}-wal`, `${TEST_DB_PATH}-shm`].forEach((f) => {
    try {
      if (fs.existsSync(f)) fs.unlinkSync(f);
    } catch {
      // On Windows, SQLite may still hold the file briefly — safe to ignore
    }
  });

  console.log('\n🧹 Test database cleaned up.\n');
}
