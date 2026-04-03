import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const accounts = [
  { email: 'demo.admin@expertmedia.local', name: 'Demo Admin', role: 'ADMIN' },
  { email: 'demo.staff@expertmedia.local', name: 'Demo Staff', role: 'STAFF' },
];
const password = 'ExpertMediaDemo2026!';

async function main() {
  const hash = await bcrypt.hash(password, 10);
  for (const acc of accounts) {
    const u = await prisma.user.upsert({
      where: { email: acc.email },
      update: { passwordHash: hash, role: acc.role, status: 'ACTIVE', name: acc.name },
      create: { email: acc.email, passwordHash: hash, role: acc.role, status: 'ACTIVE', name: acc.name },
    });
    console.log(`✓  ${u.role.padEnd(8)} ${u.email}`);
  }
  console.log('\nDone. Password for all accounts:', password);
}

main().catch((e) => { console.error('Seed failed:', e.message); process.exit(1); })
      .finally(() => prisma.$disconnect());
