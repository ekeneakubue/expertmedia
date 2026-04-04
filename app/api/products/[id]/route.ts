import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import path from 'path';
import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { dbUnreachableResponse } from '@/lib/prisma-http';
import { deleteStoredFile, saveUploadedFile } from '@/lib/server-media';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function canManageProducts(role: string | undefined) {
  return role === 'ADMIN' || role === 'MANAGER' || role === 'STAFF';
}

function parsePriceToKobo(form: FormData, existingKobo: number): { ok: true; kobo: number } | { ok: false; res: NextResponse } {
  const raw = form.get('price');
  if (raw === null || raw === '') return { ok: true, kobo: existingKobo };
  const s = String(raw).trim();
  if (s === '') return { ok: true, kobo: existingKobo };
  const n = Number.parseFloat(s.replace(/,/g, ''));
  if (Number.isNaN(n) || n < 0) {
    return { ok: false, res: NextResponse.json({ message: 'Price must be a valid non-negative number' }, { status: 400 }) };
  }
  if (!Number.isFinite(n) || n > 1_000_000_000) {
    return { ok: false, res: NextResponse.json({ message: 'Price is too large' }, { status: 400 }) };
  }
  return { ok: true, kobo: Math.round(n * 100) };
}

async function saveOptionalProductImage(form: FormData, fieldName: string): Promise<string | 'absent'> {
  const file = form.get(fieldName);
  if (!(file instanceof File) || !file.size) return 'absent';
  if (!file.type.startsWith('image/')) {
    throw new Error(`${fieldName.replace(/^subPhoto/, 'Sub image ')} must be an image file`);
  }
  const ext = path.extname(file.name).toLowerCase() || '.jpg';
  const diskFileName = `${randomUUID()}${ext}`;
  const { url } = await saveUploadedFile(file, 'product', diskFileName);
  return url;
}

const productSelect = {
  id: true,
  name: true,
  description: true,
  imageUrl: true,
  subImageUrl1: true,
  subImageUrl2: true,
  subImageUrl3: true,
  price: true,
  featured: true,
  order: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const store = await cookies();
    const role = store.get('role')?.value;
    if (!canManageProducts(role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = await ctx.params;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    const form = await req.formData();
    const name = String(form.get('name') ?? existing.name).trim();
    const description = String(form.get('description') ?? existing.description).trim();
    const orderRaw = form.get('order');
    const file = form.get('photo');

    if (!name) {
      return NextResponse.json({ message: 'Product name is required' }, { status: 400 });
    }

    const priceParsed = parsePriceToKobo(form, existing.price);
    if (!priceParsed.ok) return priceParsed.res;

    const featured = form.get('featured') === 'true';

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
        return NextResponse.json({ message: 'Cover image must be a photo' }, { status: 400 });
      }
      const ext = path.extname(file.name).toLowerCase() || '.jpg';
      const diskFileName = `${randomUUID()}${ext}`;
      const saved = await saveUploadedFile(file, 'product', diskFileName);
      await deleteStoredFile(existing.imageUrl);
      imageUrl = saved.url;
    }

    let subImageUrl1 = existing.subImageUrl1;
    let subImageUrl2 = existing.subImageUrl2;
    let subImageUrl3 = existing.subImageUrl3;

    try {
      const s1 = await saveOptionalProductImage(form, 'subPhoto1');
      if (s1 !== 'absent') {
        await deleteStoredFile(existing.subImageUrl1);
        subImageUrl1 = s1;
      }
      const s2 = await saveOptionalProductImage(form, 'subPhoto2');
      if (s2 !== 'absent') {
        await deleteStoredFile(existing.subImageUrl2);
        subImageUrl2 = s2;
      }
      const s3 = await saveOptionalProductImage(form, 'subPhoto3');
      if (s3 !== 'absent') {
        await deleteStoredFile(existing.subImageUrl3);
        subImageUrl3 = s3;
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Invalid sub image';
      return NextResponse.json({ message: msg }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        imageUrl,
        subImageUrl1,
        subImageUrl2,
        subImageUrl3,
        price: priceParsed.kobo,
        featured,
        order,
      },
      select: productSelect,
    });

    return NextResponse.json({
      ...product,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    });
  } catch (e: unknown) {
    const dbRes = dbUnreachableResponse(e);
    if (dbRes) return dbRes;
    if (e instanceof Prisma.PrismaClientKnownRequestError && (e.code === 'P2021' || e.code === 'P2022')) {
      return NextResponse.json(
        {
          message: 'Database schema is out of date. Run npm run db:push, then try again.',
          code: 'SCHEMA_MISMATCH',
        },
        { status: 500 },
      );
    }
    console.error('PATCH /api/products/[id]', e);
    const message = e instanceof Error ? e.message : 'Could not update product';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const store = await cookies();
    const role = store.get('role')?.value;
    if (!canManageProducts(role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = await ctx.params;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    await deleteStoredFile(existing.imageUrl);
    await deleteStoredFile(existing.subImageUrl1);
    await deleteStoredFile(existing.subImageUrl2);
    await deleteStoredFile(existing.subImageUrl3);
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const dbRes = dbUnreachableResponse(e);
    if (dbRes) return dbRes;
    console.error('DELETE /api/products/[id]', e);
    const message = e instanceof Error ? e.message : 'Could not delete product';
    return NextResponse.json({ message }, { status: 500 });
  }
}
