import Link from 'next/link';
import type { Metadata } from 'next';
import { PublicNav } from '@/app/_components/PublicNav';
import { PublicFooter } from '@/app/_components/PublicFooter';
import { ScrollToTop } from '@/app/_components/ScrollToTop';
import { CartView } from './CartView';

export const metadata: Metadata = {
  title: 'Cart | Expert Media Solutions',
  description: 'Review items in your cart and continue to contact us to complete your order.',
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <PublicNav />

      <section className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">Cart</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Your cart</h1>
          <p className="mt-3 max-w-xl text-sm text-neutral-600 dark:text-neutral-400">
            Adjust quantities or{' '}
            <Link href="/products" className="font-medium text-red-600 hover:underline dark:text-red-400">
              keep shopping
            </Link>
            . Checkout requires a signed-in account.
          </p>
        </div>
      </section>

      <main id="main" className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <CartView />
      </main>

      <PublicFooter />
      <ScrollToTop />
    </div>
  );
}
