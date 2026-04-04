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

function parsePriceToKobo(form: FormData): { ok: true; kobo: number } | { ok: false; res: NextResponse } {
  const raw = String(form.get('price') ?? '').trim();
  if (raw === '') return { ok: true, kobo: 0 };
  const n = Number.parseFloat(raw.replace(/,/g, ''));
  if (Number.isNaN(n) || n < 0) {
    return { ok: false, res: NextResponse.json({ message: 'Price must be a valid non-negative number' }, { status: 400 }) };
  }
  if (!Number.isFinite(n) || n > 1_000_000_000) {
    return { ok: false, res: NextResponse.json({ message: 'Price is too large' }, { status: 400 }) };
  }
  return { ok: true, kobo: Math.round(n * 100) };
}

async function saveOptionalProductImage(form: FormData, fieldName: string): Promise<string | null> {
  const file = form.get(fieldName);
  if (!(file instanceof File) || !file.size) return null;
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

export async function POST(req: NextRequest) {
  try {
    const store = await cookies();
    const role = store.get('role')?.value;
    if (!canManageProducts(role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const form = await req.formData();
    const name = String(form.get('name') || '').trim();
    const description = String(form.get('description') || '').trim();
    const orderRaw = form.get('order');
    const file = form.get('photo');

    if (!name) {
      return NextResponse.json({ message: 'Product name is required' }, { status: 400 });
    }
    const priceParsed = parsePriceToKobo(form);
    if (!priceParsed.ok) return priceParsed.res;

    const featured = form.get('featured') === 'true';

    if (!(file instanceof File) || !file.size) {
      return NextResponse.json({ message: 'Product image is required' }, { status: 400 });
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ message: 'Cover image must be a photo' }, { status: 400 });
    }

    let order: number;
    if (orderRaw === null || orderRaw === '') {
      const agg = await prisma.product.aggregate({ _max: { order: true } });
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
    const { url: imageUrl } = await saveUploadedFile(file, 'product', diskFileName);

    let subImageUrl1: string | null = null;
    let subImageUrl2: string | null = null;
    let subImageUrl3: string | null = null;
    try {
      subImageUrl1 = await saveOptionalProductImage(form, 'subPhoto1');
      subImageUrl2 = await saveOptionalProductImage(form, 'subPhoto2');
      subImageUrl3 = await saveOptionalProductImage(form, 'subPhoto3');
    } catch (e) {
      await deleteStoredFile(imageUrl);
      await deleteStoredFile(subImageUrl1);
      await deleteStoredFile(subImageUrl2);
      await deleteStoredFile(subImageUrl3);
      const msg = e instanceof Error ? e.message : 'Invalid sub image';
      return NextResponse.json({ message: msg }, { status: 400 });
    }

    let product;
    try {
      product = await prisma.product.create({
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
    } catch (createErr) {
      await deleteStoredFile(imageUrl);
      await deleteStoredFile(subImageUrl1);
      await deleteStoredFile(subImageUrl2);
      await deleteStoredFile(subImageUrl3);
      throw createErr;
    }

    return NextResponse.json(
      {
        ...product,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      },
      { status: 201 },
    );
  } catch (e: unknown) {
    const dbRes = dbUnreachableResponse(e);
    if (dbRes) return dbRes;
    if (e instanceof Prisma.PrismaClientKnownRequestError && (e.code === 'P2021' || e.code === 'P2022')) {
      return NextResponse.json(
        {
          message:
            'The Product table or columns are missing. Run npm run db:push against your Neon database, then try again.',
          code: 'SCHEMA_MISMATCH',
        },
        { status: 500 },
      );
    }
    console.error('POST /api/products', e);
    const message = e instanceof Error ? e.message : 'Could not create product';
    return NextResponse.json({ message }, { status: 500 });
  }
}
