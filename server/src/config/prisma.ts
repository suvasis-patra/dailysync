import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({ adapter });
