import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { Prisma } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';

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
    const contentType = req.headers.get('content-type') || '';
    let email = '', name = '', rawRole = 'STAFF', password = '', avatar: File | null = null;

    if (contentType.startsWith('multipart/form-data')) {
      const form = await req.formData();
      email   = String(form.get('email')    || '').trim().toLowerCase();
      name    = String(form.get('name')     || '');
      rawRole = String(form.get('role')     || 'STAFF');
      password = String(form.get('password') || '');
      const file = form.get('avatar');
      if (file instanceof File && file.size > 0) avatar = file;
    } else {
      const body = await req.json();
      email    = String(body?.email    || '').trim().toLowerCase();
      name     = String(body?.name     || '');
      rawRole  = String(body?.role     || 'STAFF');
      password = String(body?.password || '');
    }

    name = name || email;
    const role = (['ADMIN', 'MANAGER', 'STAFF', 'CLIENT'].includes(rawRole) ? rawRole : 'STAFF') as 'ADMIN' | 'MANAGER' | 'STAFF' | 'CLIENT';

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, name, role, status: 'ACTIVE', passwordHash },
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, imageUrl: true },
    });

    // Save avatar after user is created so we have the id
    if (avatar) {
      const buf = Buffer.from(await avatar.arrayBuffer());
      const publicDir = path.join(process.cwd(), 'public', 'avatars');
      await fs.mkdir(publicDir, { recursive: true });
      const ext = path.extname(avatar.name).toLowerCase() || '.png';
      const filename = `${user.id}${ext}`;
      await fs.writeFile(path.join(publicDir, filename), buf);
      await prisma.user.update({ where: { id: user.id }, data: { imageUrl: `/avatars/${filename}` } });
      (user as { imageUrl?: string | null }).imageUrl = `/avatars/${filename}`;
    }

    return NextResponse.json(user, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return NextResponse.json({ message: 'A user with this email already exists' }, { status: 409 });
    }
    const msg = e instanceof Error ? e.message : String(e);
    if (
      msg.includes('P1001') ||
      msg.includes("Can't reach database") ||
      e instanceof Prisma.PrismaClientInitializationError
    ) {
      return NextResponse.json(
        {
          message:
            'Cannot reach the database (Neon). Check DATABASE_URL, sslmode=require, and that your Neon project is active.',
          code: 'DB_UNREACHABLE',
        },
        { status: 503 },
      );
    }
    console.error('POST /api/users', e);
    return NextResponse.json({ message: msg || 'Server error' }, { status: 500 });
  }
}


