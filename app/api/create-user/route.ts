import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const isProd = process.env.NODE_ENV === 'production';
    const setupKey = process.env.ADMIN_SETUP_KEY;
    if (isProd) {
      if (!setupKey || req.headers.get('x-setup-key') !== setupKey) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    }

    const body = await req.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');
    const role = (body?.role || 'ADMIN') as 'ADMIN' | 'MANAGER' | 'STAFF';
    const name = String(body?.name || 'Admin User');

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.upsert({
      where: { email },
      update: { passwordHash, role, name, status: 'ACTIVE' },
      create: { email, passwordHash, role, name, status: 'ACTIVE' },
    });

    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, role: user.role } });
  } catch (e: any) {
    console.error('create-user error', e);
    return NextResponse.json({ message: e?.message || 'Server error' }, { status: 500 });
  }
}


