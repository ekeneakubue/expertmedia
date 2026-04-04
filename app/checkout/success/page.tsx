import Link from 'next/link';
import type { Metadata } from 'next';
import { PublicNav } from '@/app/_components/PublicNav';
import { PublicFooter } from '@/app/_components/PublicFooter';
import { ScrollToTop } from '@/app/_components/ScrollToTop';
import { prisma } from '@/lib/prisma';
import { verifyPaystackTransaction } from '@/lib/paystack-verify';
import { ClearCartOnSuccess } from './ClearCartOnSuccess';

export const metadata: Metadata = {
  title: 'Payment result | Expert Media Solutions',
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ reference?: string; trxref?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const reference = (sp.reference || sp.trxref || '').trim();
  const secret = process.env.PAYSTACK_SECRET_KEY || '';

  let status: 'success' | 'failed' | 'missing' | 'unconfigured' = 'missing';
  if (!secret) {
    status = 'unconfigured';
  } else if (reference) {
    const v = await verifyPaystackTransaction(reference, secret);
    if (v.ok && v.data?.status === 'success') {
      status = 'success';
      try {
        await prisma.payment.update({ where: { reference }, data: { status: 'SUCCESS' } });
      } catch {
        // row may not exist if DB write failed at init
      }
    } else {
      status = 'failed';
      try {
        await prisma.payment.update({ where: { reference }, data: { status: 'FAILED' } });
      } catch {}
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <PublicNav />

      <main id="main" className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
        {status === 'success' ? (
          <>
            <ClearCartOnSuccess />
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white sm:text-3xl">Payment successful</h1>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">
              Thank you — your payment was received. We&apos;ll follow up about delivery using the details you provided at
              checkout.
            </p>
            {reference ? (
              <p className="mt-2 text-xs text-neutral-500">
                Reference: <span className="font-mono">{reference}</span>
              </p>
            ) : null}
          </>
        ) : null}

        {status === 'failed' ? (
          <>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white sm:text-3xl">Payment not completed</h1>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">
              We couldn&apos;t confirm a successful payment. If you were charged, contact us with your reference and we
              will help.
            </p>
            {reference ? (
              <p className="mt-2 text-xs text-neutral-500">
                Reference: <span className="font-mono">{reference}</span>
              </p>
            ) : null}
          </>
        ) : null}

        {status === 'missing' ? (
          <>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white sm:text-3xl">Payment status</h1>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">
              No transaction reference was found. If you just paid, return from Paystack or check your email for a receipt.
            </p>
          </>
        ) : null}

        {status === 'unconfigured' ? (
          <>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white sm:text-3xl">Payment status</h1>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">
              Payment verification is not available on this environment. Contact support if you need help with your order.
            </p>
          </>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="inline-flex rounded-lg bg-red-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
          >
            Continue shopping
          </Link>
          <Link
            href="/contacts"
            className="inline-flex rounded-lg border border-neutral-300 px-6 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-800"
          >
            Contact us
          </Link>
        </div>
      </main>

      <PublicFooter />
      <ScrollToTop />
    </div>
  );
}
