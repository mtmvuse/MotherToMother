/**
 * ensures that we only create one DB instance when server restarts during development
 */
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __db: PrismaClient | undefined;
}

if (!global.__db) {
  global.__db = new PrismaClient();
}

const db = global.__db;

export { db };
