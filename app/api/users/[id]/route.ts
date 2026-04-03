import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import type { Prisma } from '@prisma/client';
import path from 'path';
import { saveUploadedFile, deleteStoredFile } from '@/lib/server-media';

export const runtime = 'nodejs';

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const existing = await prisma.user.findUnique({ where: { id }, select: { imageUrl: true } });
    if (existing?.imageUrl) await deleteStoredFile(existing.imageUrl);
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const contentType = req.headers.get('content-type') || '';
    if (contentType.startsWith('multipart/form-data')) {
      const form = await req.formData();
      const name = form.get('name') as string | null;
      const email = form.get('email') as string | null;
      const role = form.get('role') as 'ADMIN' | 'MANAGER' | 'STAFF' | 'CLIENT' | null;
      const status = form.get('status') as 'ACTIVE' | 'INVITED' | 'SUSPENDED' | 'DISABLED' | null;
      const password = form.get('password') as string | null;
      const avatar = form.get('avatar');

      const data: Prisma.UserUpdateInput = {};
      if (name !== null) data.name = name;
      if (email !== null) data.email = email;
      if (role !== null) data.role = role;
      if (status !== null) data.status = status;
      if (password) data.passwordHash = await hashPassword(password);

      if (avatar instanceof File && avatar.size > 0) {
        const prev = await prisma.user.findUnique({ where: { id }, select: { imageUrl: true } });
        const originalName = avatar.name || '';
        let ext = path.extname(originalName).toLowerCase();
        if (!ext) {
          const t = avatar.type || '';
          ext = t === 'image/jpeg' ? '.jpg' : t === 'image/webp' ? '.webp' : t === 'image/png' ? '.png' : '.png';
        }
        const diskName = `${id}${ext}`;
        const { url } = await saveUploadedFile(avatar, 'avatars', diskName);
        data.imageUrl = url;
        if (prev?.imageUrl && prev.imageUrl !== url) await deleteStoredFile(prev.imageUrl);
      }

      const user = await prisma.user.update({
        where: { id },
        data,
        select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, imageUrl: true },
      });
      return NextResponse.json(user);
    }

    const body = await req.json();
    const { name, email, role, status, password } = body as {
      name?: string; email?: string; role?: 'ADMIN' | 'MANAGER' | 'STAFF' | 'CLIENT'; status?: 'ACTIVE' | 'INVITED' | 'SUSPENDED' | 'DISABLED'; password?: string;
    };
    const data: Prisma.UserUpdateInput = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (role !== undefined) data.role = role;
    if (status !== undefined) data.status = status;
    if (password) data.passwordHash = await hashPassword(password);

    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, imageUrl: true },
    });
    return NextResponse.json(user);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}


