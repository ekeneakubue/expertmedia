import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import type { Prisma } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const store = await cookies();
    const email = store.get('userEmail')?.value?.trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ message: 'Not signed in' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, role: true, status: true, imageUrl: true },
    });
    if (user) {
      return NextResponse.json({ kind: 'user' as const, profile: user });
    }

    const client = await prisma.client.findFirst({
      where: { email },
      select: { id: true, name: true, email: true, phone: true },
    });
    if (client) {
      return NextResponse.json({ kind: 'client' as const, profile: client });
    }

    return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const store = await cookies();
    const sessionEmail = store.get('userEmail')?.value?.trim().toLowerCase();
    if (!sessionEmail) {
      return NextResponse.json({ message: 'Not signed in' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: sessionEmail } });
    if (user) {
      const contentType = req.headers.get('content-type') || '';
      if (contentType.startsWith('multipart/form-data')) {
        const form = await req.formData();
        const name = form.get('name');
        const password = form.get('password');
        const avatar = form.get('avatar');

        const data: Prisma.UserUpdateInput = {};
        if (typeof name === 'string' && name.trim()) data.name = name.trim();
        if (typeof password === 'string' && password.length > 0) {
          if (password.length < 6) {
            return NextResponse.json({ message: 'Password must be at least 6 characters' }, { status: 400 });
          }
          data.passwordHash = await hashPassword(password);
        }

        if (avatar instanceof File && avatar.size > 0) {
          const buf = Buffer.from(await avatar.arrayBuffer());
          const publicDir = path.join(process.cwd(), 'public', 'avatars');
          await fs.mkdir(publicDir, { recursive: true });
          const originalName = avatar.name || '';
          let ext = path.extname(originalName).toLowerCase();
          if (!ext) {
            const t = avatar.type || '';
            ext = t === 'image/jpeg' ? '.jpg' : t === 'image/webp' ? '.webp' : t === 'image/png' ? '.png' : '.png';
          }
          const filename = `${user.id}${ext}`;
          await fs.writeFile(path.join(publicDir, filename), buf);
          data.imageUrl = `/avatars/${filename}`;
        }

        const updated = await prisma.user.update({
          where: { id: user.id },
          data,
          select: { id: true, name: true, email: true, role: true, status: true, imageUrl: true },
        });
        return NextResponse.json(updated);
      }

      const body = await req.json();
      const { name, password } = body as { name?: string; password?: string };
      const data: Prisma.UserUpdateInput = {};
      if (name !== undefined && String(name).trim()) data.name = String(name).trim();
      if (password !== undefined && String(password).length > 0) {
        if (String(password).length < 6) {
          return NextResponse.json({ message: 'Password must be at least 6 characters' }, { status: 400 });
        }
        data.passwordHash = await hashPassword(String(password));
      }
      if (Object.keys(data).length === 0) {
        return NextResponse.json({ message: 'No changes provided' }, { status: 400 });
      }
      const updated = await prisma.user.update({
        where: { id: user.id },
        data,
        select: { id: true, name: true, email: true, role: true, status: true, imageUrl: true },
      });
      return NextResponse.json(updated);
    }

    const client = await prisma.client.findFirst({ where: { email: sessionEmail } });
    if (client) {
      const body = await req.json().catch(() => ({}));
      const { name, phone } = body as { name?: string; phone?: string };
      const data: Prisma.ClientUpdateInput = {};
      if (name !== undefined && String(name).trim()) data.name = String(name).trim();
      if (phone !== undefined) data.phone = String(phone).trim() || null;
      if (Object.keys(data).length === 0) {
        return NextResponse.json({ message: 'No changes provided' }, { status: 400 });
      }
      const updated = await prisma.client.update({
        where: { id: client.id },
        data,
        select: { id: true, name: true, email: true, phone: true },
      });
      return NextResponse.json({ kind: 'client' as const, profile: updated });
    }

    return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
