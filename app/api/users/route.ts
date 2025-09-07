import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, imageUrl: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const name = String(body?.name || '') || email;
    const rawRole = (body?.role || 'CLIENT') as string;
    const password = String(body?.password || '');
    const role = (['ADMIN', 'MANAGER', 'STAFF', 'CLIENT'].includes(rawRole) ? rawRole : 'CLIENT') as 'ADMIN' | 'MANAGER' | 'STAFF' | 'CLIENT';
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
    }
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, name, role, status: 'ACTIVE', passwordHash },
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, imageUrl: true },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}


