import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load variables directly from the files to ensure we have both
const prodEnv = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '../../.env.production')));
const devEnv = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '../../.env.development')));

const prodUrl = prodEnv.DIRECT_URL;
const devUrl = devEnv.DIRECT_URL;

if (!prodUrl || !devUrl) {
  console.error("❌ Não foi possível encontrar as URLs do banco (DIRECT_URL) nos arquivos .env");
  process.exit(1);
}

import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Initialize Prod Prisma
const prodPool = new pg.Pool({ connectionString: prodUrl });
const prodAdapter = new PrismaPg(prodPool);
const prodPrisma = new PrismaClient({ adapter: prodAdapter });

// Initialize Dev Prisma
const devPool = new pg.Pool({ connectionString: devUrl });
const devAdapter = new PrismaPg(devPool);
const devPrisma = new PrismaClient({ adapter: devAdapter });

async function main() {
  console.log("🚀 Iniciando cópia de Produção para Desenvolvimento...");

  // 1. Limpar a base de Dev
  console.log("🗑️  Limpando tabelas de Desenvolvimento...");
  await devPrisma.adoptionDog.deleteMany();
  await devPrisma.dogEntry.deleteMany();
  await devPrisma.adoptionPoint.deleteMany();
  await devPrisma.user.deleteMany();

  // 2. Copiar Users
  console.log("📥 Buscando Usuários de Prod...");
  const users = await prodPrisma.user.findMany();
  if (users.length > 0) {
    console.log(`📤 Inserindo ${users.length} usuários em Dev...`);
    await devPrisma.user.createMany({ data: users });
  }

  // 3. Copiar DogEntries
  console.log("📥 Buscando Entradas de Prod...");
  const entries = await prodPrisma.dogEntry.findMany();
  if (entries.length > 0) {
    console.log(`📤 Inserindo ${entries.length} entradas em Dev...`);
    await devPrisma.dogEntry.createMany({ data: entries });
  }

  // 4. Copiar AdoptionPoints
  console.log("📥 Buscando Pontos de Adoção de Prod...");
  const points = await prodPrisma.adoptionPoint.findMany();
  if (points.length > 0) {
    console.log(`📤 Inserindo ${points.length} pontos em Dev...`);
    await devPrisma.adoptionPoint.createMany({ data: points });
  }

  // 5. Copiar AdoptionDogs
  console.log("📥 Buscando Cachorros de Adoção de Prod...");
  const dogs = await prodPrisma.adoptionDog.findMany();
  if (dogs.length > 0) {
    console.log(`📤 Inserindo ${dogs.length} cachorros de adoção em Dev...`);
    await devPrisma.adoptionDog.createMany({ data: dogs });
  }

  console.log("✅ Clonagem concluída com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante a clonagem:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prodPrisma.$disconnect();
    await devPrisma.$disconnect();
  });
