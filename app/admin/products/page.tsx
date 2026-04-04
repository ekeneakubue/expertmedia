import { prisma } from '@/lib/prisma';
import ProductsAdminClient, { type ProductRow } from './ProductsAdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  let rows: ProductRow[] = [];
  try {
    const list = await prisma.product.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      select: {
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
      },
    });
    rows = list.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));
  } catch {
    rows = [];
  }

  return <ProductsAdminClient initialProducts={rows} />;
}
