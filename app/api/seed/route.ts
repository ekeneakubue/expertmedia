import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const adminEmail = 'ekeneakubue@gmail.com';
    const userEmail = 'user@expertmedia.local';
    const adminPass = 'Ekene@1409';
    const userPass = 'User123!';

    const adminHash = await hashPassword(adminPass);
    const userHash = await hashPassword(userPass);

    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { passwordHash: adminHash, role: 'ADMIN', status: 'ACTIVE', name: 'Demo Admin' },
      create: { email: adminEmail, passwordHash: adminHash, role: 'ADMIN', status: 'ACTIVE', name: 'Demo Admin' },
    });

    await prisma.user.upsert({
      where: { email: userEmail },
      update: { passwordHash: userHash, role: 'STAFF', status: 'ACTIVE', name: 'Demo User' },
      create: { email: userEmail, passwordHash: userHash, role: 'STAFF', status: 'ACTIVE', name: 'Demo User' },
    });

    return NextResponse.json({ ok: true, admin: { email: adminEmail, password: adminPass }, user: { email: userEmail, password: userPass } });
  } catch (e) {
    console.error('Seed error', e);
    return NextResponse.json({ ok: false, message: 'Seed failed' }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}


