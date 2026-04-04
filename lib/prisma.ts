import { PrismaClient } from '@prisma/client';
import { statSync } from 'fs';
import path from 'path';

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
  prismaDevToken?: number;
};

function prismaClientMtime(): number {
  try {
    const schema = path.join(process.cwd(), 'prisma', 'schema.prisma');
    const clientJs = path.join(process.cwd(), 'node_modules', '.prisma', 'client', 'index.js');
    return Math.max(statSync(schema).mtimeMs, statSync(clientJs).mtimeMs);
  } catch {
    return 0;
  }
}

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

function getPrisma(): PrismaClient {
  if (process.env.NODE_ENV === 'production') {
    return (globalForPrisma.prisma ??= createPrismaClient());
  }

  const token = prismaClientMtime();
  if (globalForPrisma.prisma && globalForPrisma.prismaDevToken !== token) {
    void globalForPrisma.prisma.$disconnect().catch(() => {});
    globalForPrisma.prisma = undefined;
  }
  globalForPrisma.prismaDevToken = token;
  return (globalForPrisma.prisma ??= createPrismaClient());
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma();
    // Use `client` as receiver so Prisma's model getters (e.g. `product`) run with the real
    // PrismaClient as `this`. Passing the Proxy as receiver breaks delegates → undefined.
    const value = Reflect.get(client, prop, client) as unknown;
    if (typeof value === 'function') {
      return (value as (...args: unknown[]) => unknown).bind(client);
    }
    return value;
  },
}) as PrismaClient;
