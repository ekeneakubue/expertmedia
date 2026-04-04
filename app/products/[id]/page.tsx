import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PublicNav } from '@/app/_components/PublicNav';
import { PublicFooter } from '@/app/_components/PublicFooter';
import { ScrollToTop } from '@/app/_components/ScrollToTop';
import { getProductByIdForPublic } from '@/lib/products-public';
import { ProductDetailView } from './ProductDetailView';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const p = await getProductByIdForPublic(id);
  if (!p) {
    return { title: 'Product | Expert Media Solutions' };
  }
  const desc = p.description?.trim() || `Buy ${p.name} from Expert Media Solutions.`;
  return {
    title: `${p.name} | Expert Media Solutions`,
    description: desc.length > 160 ? `${desc.slice(0, 157)}…` : desc,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductByIdForPublic(id);
  if (!product) notFound();

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <PublicNav />

      <section className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto max-w-6xl px-6 py-8 sm:py-10">
          <nav className="text-sm text-neutral-500 dark:text-neutral-400" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/products" className="font-medium text-red-600 hover:underline dark:text-red-400">
                  Products
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-neutral-800 dark:text-neutral-200">{product.name}</li>
            </ol>
          </nav>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
            Product detail
          </p>
        </div>
      </section>

      <main id="main" className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <ProductDetailView product={product} />
      </main>

      <PublicFooter />
      <ScrollToTop />
    </div>
  );
}
