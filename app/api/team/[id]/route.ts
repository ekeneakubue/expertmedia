import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import path from 'path';
import { randomUUID } from 'crypto';
import type { TeamMemberType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { dbUnreachableResponse } from '@/lib/prisma-http';
import { deleteStoredFile, saveUploadedFile } from '@/lib/server-media';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function canManageTeam(role: string | undefined) {
  return role === 'ADMIN' || role === 'MANAGER' || role === 'STAFF';
}

function parseMemberType(raw: unknown): TeamMemberType {
  const s = String(raw || '').toUpperCase();
  return s === 'BOARD' ? 'BOARD' : 'TEAM';
}

const teamMemberSelect = {
  id: true,
  name: true,
  memberRole: true,
  memberType: true,
  imageUrl: true,
  order: true,
  createdAt: true,
} as const;

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const store = await cookies();
    const role = store.get('role')?.value;
    if (!canManageTeam(role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = await ctx.params;
    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    const form = await req.formData();
    const name = String(form.get('name') ?? existing.name).trim();
    const memberRole = String(form.get('memberRole') ?? existing.memberRole).trim();
    const memberTypeRaw = form.get('memberType');
    const memberType = memberTypeRaw !== null ? parseMemberType(memberTypeRaw) : existing.memberType;
    const orderRaw = form.get('order');
    const file = form.get('photo');

    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }

    let order = existing.order;
    if (orderRaw !== null && orderRaw !== '') {
      const n = parseInt(String(orderRaw), 10);
      if (Number.isNaN(n) || n < 0) {
        return NextResponse.json({ message: 'Display order must be a non-negative number' }, { status: 400 });
      }
      order = n;
    }

    let imageUrl = existing.imageUrl;
    if (file instanceof File && file.size > 0) {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ message: 'Photo must be an image' }, { status: 400 });
      }
      const ext = path.extname(file.name).toLowerCase() || '.jpg';
      const diskFileName = `${randomUUID()}${ext}`;
      const saved = await saveUploadedFile(file, 'team', diskFileName);
      await deleteStoredFile(existing.imageUrl);
      imageUrl = saved.url;
    }

    const member = await prisma.teamMember.update({
      where: { id },
      data: { name, memberRole, memberType, imageUrl, order },
      select: teamMemberSelect,
    });

    return NextResponse.json({ ...member, createdAt: member.createdAt.toISOString() });
  } catch (e: unknown) {
    const dbRes = dbUnreachableResponse(e);
    if (dbRes) return dbRes;
    console.error('PATCH /api/team/[id]', e);
    const message = e instanceof Error ? e.message : 'Could not update team member';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const store = await cookies();
    const role = store.get('role')?.value;
    if (!canManageTeam(role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = await ctx.params;
    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    await deleteStoredFile(existing.imageUrl);
    await prisma.teamMember.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const dbRes = dbUnreachableResponse(e);
    if (dbRes) return dbRes;
    console.error('DELETE /api/team/[id]', e);
    const message = e instanceof Error ? e.message : 'Could not delete team member';
    return NextResponse.json({ message }, { status: 500 });
  }
}
