import Link from 'next/link';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { PublicNav } from '@/app/_components/PublicNav';
import { PublicFooter } from '@/app/_components/PublicFooter';
import { ScrollToTop } from '@/app/_components/ScrollToTop';
import { CheckoutView } from './CheckoutView';

export const metadata: Metadata = {
  title: 'Checkout | Expert Media Solutions',
  description: 'Review your order and contact Expert Media Solutions to complete your purchase.',
};

export default async function CheckoutPage() {
  const store = await cookies();
  const registeredEmail = store.get('userEmail')?.value?.trim() || undefined;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <PublicNav />

      <section className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:py-12">
          <nav className="text-sm text-neutral-500 dark:text-neutral-400" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/cart" className="font-medium text-red-600 hover:underline dark:text-red-400">
                  Cart
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-neutral-800 dark:text-neutral-200">Checkout</li>
            </ol>
          </nav>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">Checkout</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Complete your order</h1>
          <p className="mt-3 max-w-xl text-sm text-neutral-600 dark:text-neutral-400">
            Add your delivery details, then proceed to secure payment with Paystack. We&apos;ll follow up about delivery
            after payment.
          </p>
        </div>
      </section>

      <main id="main" className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <CheckoutView registeredEmail={registeredEmail} />
      </main>

      <PublicFooter />
      <ScrollToTop />
    </div>
  );
}
