import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import path from 'path';
import { randomUUID } from 'crypto';
import type { TeamMemberType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { saveUploadedFile } from '@/lib/server-media';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function canManageTeam(role: string | undefined) {
  return role === 'ADMIN' || role === 'MANAGER' || role === 'STAFF';
}

function parseMemberType(raw: unknown): TeamMemberType {
  const s = String(raw || '').toUpperCase();
  return s === 'BOARD' ? 'BOARD' : 'TEAM';
}

export async function POST(req: NextRequest) {
  try {
    const store = await cookies();
    const role = store.get('role')?.value;
    if (!canManageTeam(role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const form = await req.formData();
    const name = String(form.get('name') || '').trim();
    const memberRole = String(form.get('memberRole') || '').trim();
    const memberType = parseMemberType(form.get('memberType'));
    const orderRaw = form.get('order');
    const file = form.get('photo');

    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }
    if (!(file instanceof File) || !file.size) {
      return NextResponse.json({ message: 'Photo is required' }, { status: 400 });
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ message: 'Photo must be an image' }, { status: 400 });
    }

    let order: number;
    if (orderRaw === null || orderRaw === '') {
      const agg = await prisma.teamMember.aggregate({
        where: { memberType },
        _max: { order: true },
      });
      order = (agg._max.order ?? -1) + 1;
    } else {
      const n = parseInt(String(orderRaw), 10);
      if (Number.isNaN(n) || n < 0) {
        return NextResponse.json({ message: 'Display order must be a non-negative number' }, { status: 400 });
      }
      order = n;
    }

    const ext = path.extname(file.name).toLowerCase() || '.jpg';
    const diskFileName = `${randomUUID()}${ext}`;
    const { url: imageUrl } = await saveUploadedFile(file, 'team', diskFileName);

    const member = await prisma.teamMember.create({
      data: { name, memberRole, memberType, imageUrl, order },
      select: {
        id: true,
        name: true,
        memberRole: true,
        memberType: true,
        imageUrl: true,
        order: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { ...member, createdAt: member.createdAt.toISOString() },
      { status: 201 },
    );
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Could not add team member';
    return NextResponse.json({ message }, { status: 500 });
  }
}
