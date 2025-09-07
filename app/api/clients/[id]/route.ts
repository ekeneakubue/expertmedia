import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.client.delete({ where: { id: params.id } });
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
      const avatar = form.get('avatar');

      const existing = await prisma.client.findUnique({ where: { id: params.id } });
      if (!existing) return NextResponse.json({ message: 'Client not found' }, { status: 404 });

      const data: any = {};
      if (name !== null) data.name = name;

      // Save avatar and upsert linked user with CLIENT role
      if (avatar instanceof File && existing.email) {
        const buf = Buffer.from(await avatar.arrayBuffer());
        const publicDir = path.join(process.cwd(), 'public', 'avatars');
        await fs.mkdir(publicDir, { recursive: true });
        const original = (avatar as File).name || '';
        let ext = path.extname(original).toLowerCase();
        if (!ext) {
          const t = (avatar as File).type || '';
          ext = t === 'image/jpeg' ? '.jpg' : t === 'image/webp' ? '.webp' : t === 'image/png' ? '.png' : '.png';
        }
        const filename = `${params.id}${ext}`;
        await fs.writeFile(path.join(publicDir, filename), buf);
        const imageUrl = `/avatars/${filename}`;
        await prisma.user.upsert({
          where: { email: existing.email.toLowerCase() },
          update: { imageUrl, role: 'CLIENT', status: 'ACTIVE', name: name ?? existing.name },
          create: { email: existing.email.toLowerCase(), imageUrl, role: 'CLIENT', status: 'ACTIVE', name: name ?? existing.name, passwordHash: await hashPassword('changeme123') },
        });
      }

      const client = await prisma.client.update({ where: { id: params.id }, data, select: { id: true, name: true, email: true, industry: true, isActive: true, createdAt: true } });
      return NextResponse.json(client);
    }

    const body = await req.json();
    const data: any = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.email !== undefined) data.email = body.email || null;
    if (body.phone !== undefined) data.phone = body.phone || null;
    if (body.industry !== undefined) data.industry = body.industry || null;
    if (body.notes !== undefined) data.notes = body.notes || null;
    if (body.isActive !== undefined) data.isActive = !!body.isActive;

    const client = await prisma.client.update({
      where: { id: params.id },
      data,
      select: { id: true, name: true, email: true, industry: true, isActive: true, createdAt: true },
    });
    // If password provided and client has an email, upsert a User with CLIENT role
    if (body.password && client.email) {
      const passwordHash = await hashPassword(String(body.password));
      await prisma.user.upsert({
        where: { email: client.email.toLowerCase() },
        update: { passwordHash, role: 'CLIENT', status: 'ACTIVE', name: client.name },
        create: { email: client.email.toLowerCase(), passwordHash, role: 'CLIENT', status: 'ACTIVE', name: client.name },
      });
    }
    return NextResponse.json(client);
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Server error' }, { status: 500 });
  }
}


