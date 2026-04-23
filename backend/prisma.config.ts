import { defineConfig } from "@prisma/config";

const isTest = process.env.NODE_ENV === "test" || 
               !!process.env.JEST_WORKER_ID;

export default defineConfig({
  schema: isTest ? "prisma/test.prisma" : "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL || "file:./prisma/dev.db",
    ...(isTest ? {} : (process.env.DIRECT_URL ? { directUrl: process.env.DIRECT_URL } : {}))
  },
});
