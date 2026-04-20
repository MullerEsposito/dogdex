import request from 'supertest';
import { app } from '../server';
import { createPrismaClient } from '../services/prisma';
import * as path from 'path';

const BACKEND_ROOT = path.resolve(__dirname, '../../');
const TEST_DB_PATH = path.resolve(BACKEND_ROOT, 'prisma/test.db');
const prisma = createPrismaClient(`file:${TEST_DB_PATH}`);

// Clean up before each test to ensure isolation
beforeEach(async () => {
  await prisma.dogEntry.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

// ─────────────────────────────────────────────
// POST /auth/register
// ─────────────────────────────────────────────
describe('POST /auth/register', () => {
  it('should register a new user and return 201 with a JWT token', async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'João Testador',
      email: 'joao@test.com',
      password: 'senha1234',
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({
      email: 'joao@test.com',
      name: 'João Testador',
    });
    // Ensure password is never returned
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('should return 409 if email is already taken', async () => {
    await request(app).post('/auth/register').send({
      email: 'duplicate@test.com',
      password: 'senha1234',
    });

    const res = await request(app).post('/auth/register').send({
      email: 'duplicate@test.com',
      password: 'otherpassword',
    });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 if email or password is missing', async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'Sem Senha',
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 if password is too short (< 6 characters)', async () => {
    const res = await request(app).post('/auth/register').send({
      email: 'weak@test.com',
      password: '123',
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

// ─────────────────────────────────────────────
// POST /auth/login
// ─────────────────────────────────────────────
describe('POST /auth/login', () => {
  beforeEach(async () => {
    // Register a user to log in with
    await request(app).post('/auth/register').send({
      email: 'logintester@test.com',
      password: 'senha1234',
    });
  });

  it('should login with correct credentials and return a JWT token', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'logintester@test.com',
      password: 'senha1234',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({ email: 'logintester@test.com' });
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('should return 401 with wrong password', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'logintester@test.com',
      password: 'wrongpassword',
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 404 if user does not exist', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'ghost@test.com',
      password: 'senha1234',
    });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 if email is missing', async () => {
    const res = await request(app).post('/auth/login').send({
      password: 'senha1234',
    });

    expect(res.status).toBe(400);
  });
});

// ─────────────────────────────────────────────
// GET /auth/me (Protected Route)
// ─────────────────────────────────────────────
describe('GET /auth/me', () => {
  let token: string;

  beforeEach(async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'Profile User',
      email: 'profile@test.com',
      password: 'senha1234',
    });
    token = res.body.token;
  });

  it('should return the authenticated user data with a valid token', async () => {
    const res = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({ email: 'profile@test.com' });
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app).get('/auth/me');
    expect(res.status).toBe(401);
  });

  it('should return 401 if token is invalid or expired', async () => {
    const res = await request(app)
      .get('/auth/me')
      .set('Authorization', 'Bearer invalid.token.here');
    expect(res.status).toBe(401);
  });
});
