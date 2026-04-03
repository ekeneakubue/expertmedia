import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import {
  DEMO_ADMIN_EMAIL,
  DEMO_ADMIN_PASSWORD,
  DEMO_STAFF_EMAIL,
  DEMO_STAFF_PASSWORD,
} from '@/lib/demo-login';

export const runtime = 'nodejs';

function isSeedAllowed(req: NextRequest) {
  if (process.env.NODE_ENV !== 'production') return true;
  const secret = process.env.SEED_SECRET;
  if (!secret) return false;
  return req.headers.get('x-seed-secret') === secret;
}

export async function POST(req: NextRequest) {
  if (!isSeedAllowed(req)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  try {
    const adminHash = await hashPassword(DEMO_ADMIN_PASSWORD);
    const staffHash = await hashPassword(DEMO_STAFF_PASSWORD);

    await prisma.user.upsert({
      where: { email: DEMO_ADMIN_EMAIL },
      update: {
        passwordHash: adminHash,
        role: 'ADMIN',
        status: 'ACTIVE',
        name: 'Demo Admin',
      },
      create: {
        email: DEMO_ADMIN_EMAIL,
        passwordHash: adminHash,
        role: 'ADMIN',
        status: 'ACTIVE',
        name: 'Demo Admin',
      },
    });

    await prisma.user.upsert({
      where: { email: DEMO_STAFF_EMAIL },
      update: {
        passwordHash: staffHash,
        role: 'STAFF',
        status: 'ACTIVE',
        name: 'Demo Staff',
      },
      create: {
        email: DEMO_STAFF_EMAIL,
        passwordHash: staffHash,
        role: 'STAFF',
        status: 'ACTIVE',
        name: 'Demo Staff',
      },
    });

    return NextResponse.json({
      ok: true,
      admin: { email: DEMO_ADMIN_EMAIL },
      staff: { email: DEMO_STAFF_EMAIL },
      hint: 'Passwords match lib/demo-login.ts defaults; change them there for your deploy.',
    });
  } catch (e) {
    console.error('Seed error', e);
    return NextResponse.json({ ok: false, message: 'Seed failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
