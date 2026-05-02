import { defineConfig } from "@prisma/config";
import dotenv from "dotenv";

const isTest = process.env.NODE_ENV === "test" || 
               !!process.env.JEST_WORKER_ID;

const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
dotenv.config({ path: envFile });

export default defineConfig({
  schema: isTest ? "prisma/test.prisma" : "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
});
