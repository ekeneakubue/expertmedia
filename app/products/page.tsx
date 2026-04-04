import Link from 'next/link';
import type { Metadata } from 'next';
import { PublicNav } from '../_components/PublicNav';
import { PublicFooter } from '../_components/PublicFooter';
import { ScrollToTop } from '../_components/ScrollToTop';
import { getProductsForPublicPage } from '@/lib/products-public';
import { ProductCard } from './ProductCard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Our Products | Expert Media Solutions',
  description:
    'Browse EMS products — pricing, details, and featured offerings. Order or enquire through Expert Media Solutions.',
};

const heroPattern =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

export default async function ProductsPage() {
  const products = await getProductsForPublicPage();

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <PublicNav />

      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-red-950 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: heroPattern }}
        />
        <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-red-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-24 lg:py-28">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-red-300/95">Catalog</p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-[3.25rem]">
            Our products
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-300 sm:text-lg">
            Solutions and offerings from Expert Media Solutions — updated from our team. Featured items appear first;
            tap thumbnails when multiple images are available.
          </p>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
      </section>

      <main id="main" className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-2xl font-semibold border-l-8 border-red-500 pl-4 sm:text-3xl">Browse the catalog</h2>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 sm:text-base">
            Need a custom bundle or enterprise terms?{' '}
            <Link href="/contacts" className="font-medium text-red-600 underline-offset-2 hover:underline dark:text-red-400">
              Contact us
            </Link>{' '}
            and we&apos;ll follow up.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/60 px-8 py-16 text-center dark:border-neutral-600 dark:bg-neutral-900/40">
            <p className="text-neutral-700 dark:text-neutral-300">
              No products are published yet. Please check back soon, or reach out through our contact page.
            </p>
            <Link
              href="/contacts"
              className="mt-6 inline-block px-6 bg-red-500 rounded py-2 text-sm font-medium text-white hover:bg-red-600"
            >
              Contact us
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {products.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        )}
      </main>

      <section className="border-t border-red-400/30 bg-gradient-to-r from-red-600 to-red-500 px-6 py-14 text-center text-white sm:py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-semibold sm:text-3xl">Ready to order?</h2>
          <p className="mt-3 text-sm text-white/90 sm:text-base">
            Share what you need — quantity, timeline, and delivery — and we&apos;ll respond with next steps.
          </p>
          <Link
            href="/contacts"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-red-600 shadow-md transition-transform hover:scale-[1.02] hover:bg-neutral-50"
          >
            Get in touch
          </Link>
        </div>
      </section>

      <PublicFooter />
      <ScrollToTop />
    </div>
  );
}
