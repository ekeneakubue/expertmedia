import { prisma } from '@/lib/prisma';
import type { PublicProduct } from '@/lib/products-shared';

export type { PublicProduct };

function isEphemeralHost(): boolean {
  return !!(process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

function isUsableProductImageUrl(url: string, ephemeralHost: boolean): boolean {
  if (!url) return false;
  if (url.startsWith('https://') || url.startsWith('http://')) return true;
  if (ephemeralHost && url.startsWith('/product/')) return false;
  return url.startsWith('/');
}

type ProductRow = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  subImageUrl1: string | null;
  subImageUrl2: string | null;
  subImageUrl3: string | null;
  price: number;
  featured: boolean;
  order: number;
};

function rowToPublicProduct(r: ProductRow, ephemeralHost: boolean): PublicProduct | null {
  if (!isUsableProductImageUrl(r.imageUrl, ephemeralHost)) return null;
  const subImageUrls = [r.subImageUrl1, r.subImageUrl2, r.subImageUrl3].filter(
    (u): u is string => !!u && isUsableProductImageUrl(u, ephemeralHost),
  );
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    imageUrl: r.imageUrl,
    subImageUrls,
    priceKobo: r.price,
    featured: r.featured,
    order: r.order,
  };
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
} as const;

/** Featured products for the home page (same image rules as the public catalog). */
export async function getFeaturedProductsForHome(): Promise<PublicProduct[]> {
  const ephemeralHost = isEphemeralHost();
  try {
    const rows = await prisma.product.findMany({
      where: { featured: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      select: productSelect,
    });
    return rows
      .map((r) => rowToPublicProduct(r, ephemeralHost))
      .filter((p): p is PublicProduct => p !== null);
  } catch {
    return [];
  }
}

/** Products for the public catalog, ordered featured first, then display order. */
export async function getProductsForPublicPage(): Promise<PublicProduct[]> {
  const ephemeralHost = isEphemeralHost();
  try {
    const rows = await prisma.product.findMany({
      orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'asc' }],
      select: productSelect,
    });

    return rows
      .map((r) => rowToPublicProduct(r, ephemeralHost))
      .filter((p): p is PublicProduct => p !== null);
  } catch {
    return [];
  }
}

/** Single product for public detail; null if missing or not displayable (e.g. image rules). */
export async function getProductByIdForPublic(id: string): Promise<PublicProduct | null> {
  const ephemeralHost = isEphemeralHost();
  try {
    const r = await prisma.product.findUnique({
      where: { id },
      select: productSelect,
    });
    if (!r) return null;
    return rowToPublicProduct(r, ephemeralHost);
  } catch {
    return null;
  }
}
