import request from 'supertest';
import { app } from '../server';
import { createPrismaClient } from '../services/prisma';
import * as path from 'path';

const BACKEND_ROOT = path.resolve(__dirname, '../../');
const TEST_DB_PATH = path.resolve(BACKEND_ROOT, 'prisma/test.db');
let prisma: any;

describe('Cloud Synchronization Integration Tests', () => {
  let user1Token: string;
  let user2Token: string;

  beforeAll(async () => {
    prisma = createPrismaClient(`file:${TEST_DB_PATH}`);

    // Setup 2 users for isolation testing
    const res1 = await request(app).post('/auth/register').send({
      email: 'sync1@test.com',
      password: 'senha1234',
    });
    user1Token = res1.body.token;

    const res2 = await request(app).post('/auth/register').send({
      email: 'sync2@test.com',
      password: 'senha1234',
    });
    user2Token = res2.body.token;
  });

  beforeEach(async () => {
    await prisma.dogEntry.deleteMany();
  });

  afterAll(async () => {
    await prisma.dogEntry.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  // ─────────────────────────────────────────────
  // POST /sync/push
  // ─────────────────────────────────────────────
  describe('POST /sync/push', () => {
    it('should save multiple dog entries to the cloud', async () => {
      const entries = [
        {
          localId: 'loc-1',
          breedName: 'Labrador',
          confidence: 0.95,
          locationAddr: 'Rua A, 123',
          imageUri: 'https://supabase.com/dog1.jpg',
          timestamp: new Date().toISOString(),
        },
        {
          localId: 'loc-2',
          breedName: 'Poodle',
          confidence: 0.88,
          locationAddr: 'Praça Central',
          imageUri: 'https://supabase.com/dog2.jpg',
          timestamp: new Date().toISOString(),
        }
      ];

      const res = await request(app)
        .post('/sync/push')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ entries });

      expect(res.status).toBe(201);
      expect(res.body.count).toBe(2);

      // Verify in DB
      const dbEntries = await prisma.dogEntry.findMany({
        where: { user: { email: 'sync1@test.com' } }
      });
      expect(dbEntries.length).toBe(2);
      expect(dbEntries[0].breedName).toBe('Labrador');
    });

    it('should return 401 if missing token', async () => {
      const res = await request(app).post('/sync/push').send({ entries: [] });
      expect(res.status).toBe(401);
    });
  });

  // ─────────────────────────────────────────────
  // GET /sync/pull
  // ─────────────────────────────────────────────
  describe('GET /sync/pull', () => {
    beforeEach(async () => {
      // Seed some data for user 1
      const user1 = await prisma.user.findUnique({ where: { email: 'sync1@test.com' } });
      await prisma.dogEntry.create({
        data: {
          breedName: 'Golden Retriever',
          confidence: 0.99,
          locationAddr: 'Home',
          imageUri: 'image1.jpg',
          userId: user1!.id,
          localId: 'local-sync-1'
        }
      });
    });

    it('should return only the dogs belonging to the authenticated user', async () => {
      // Request as user 1
      const res1 = await request(app)
        .get('/sync/pull')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res1.status).toBe(200);
      expect(res1.body.entries.length).toBe(1);
      expect(res1.body.entries[0].breedName).toBe('Golden Retriever');

      // Request as user 2 (should be empty)
      const res2 = await request(app)
        .get('/sync/pull')
        .set('Authorization', `Bearer ${user2Token}`);

      expect(res2.status).toBe(200);
      expect(res2.body.entries.length).toBe(0);
    });
  });
});
