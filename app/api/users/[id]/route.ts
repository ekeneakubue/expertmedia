import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const contentType = req.headers.get('content-type') || '';
    if (contentType.startsWith('multipart/form-data')) {
      const form = await req.formData();
      const name = form.get('name') as string | null;
      const email = form.get('email') as string | null;
      const role = form.get('role') as 'ADMIN' | 'MANAGER' | 'STAFF' | 'CLIENT' | null;
      const status = form.get('status') as 'ACTIVE' | 'INVITED' | 'SUSPENDED' | 'DISABLED' | null;
      const password = form.get('password') as string | null;
      const avatar = form.get('avatar');

      const data: any = {};
      if (name !== null) data.name = name;
      if (email !== null) data.email = email;
      if (role !== null) data.role = role;
      if (status !== null) data.status = status;
      if (password) data.passwordHash = await hashPassword(password);

      // Save avatar if provided (serve from /public/avatars for direct access)
      if (avatar instanceof File) {
        const buf = Buffer.from(await avatar.arrayBuffer());
        const publicDir = path.join(process.cwd(), 'public', 'avatars');
        await fs.mkdir(publicDir, { recursive: true });
        const originalName = (avatar as File).name || '';
        let ext = path.extname(originalName).toLowerCase();
        if (!ext) {
          const t = (avatar as File).type || '';
          ext = t === 'image/jpeg' ? '.jpg' : t === 'image/webp' ? '.webp' : t === 'image/png' ? '.png' : '.png';
        }
        const filename = `${params.id}${ext}`;
        await fs.writeFile(path.join(publicDir, filename), buf);
        data.imageUrl = `/avatars/${filename}`;
      }

      const user = await prisma.user.update({ where: { id: params.id }, data, select: { id: true, name: true, email: true, role: true, status: true, createdAt: true } });
      return NextResponse.json(user);
    }

    const body = await req.json();
    const { name, email, role, status, password } = body as {
      name?: string; email?: string; role?: 'ADMIN' | 'MANAGER' | 'STAFF' | 'CLIENT'; status?: 'ACTIVE' | 'INVITED' | 'SUSPENDED' | 'DISABLED'; password?: string;
    };
    const data: any = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (role !== undefined) data.role = role;
    if (status !== undefined) data.status = status;
    if (password) data.passwordHash = await hashPassword(password);

    const user = await prisma.user.update({ where: { id: params.id }, data, select: { id: true, name: true, email: true, role: true, status: true, createdAt: true } });
    return NextResponse.json(user);
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Server error' }, { status: 500 });
  }
}


