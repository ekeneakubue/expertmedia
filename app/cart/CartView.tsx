'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/app/_components/CartProvider';
import { formatPriceNgn } from '@/lib/products-shared';

export function CartView() {
  const { items, setQty, removeItem, clear } = useCart();

  const subtotalKobo = items.reduce((s, x) => s + x.priceKobo * x.qty, 0);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/80 px-8 py-16 text-center dark:border-neutral-600 dark:bg-neutral-900/40">
        <p className="text-neutral-700 dark:text-neutral-300">Your cart is empty.</p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-lg bg-red-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ul className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white dark:divide-neutral-700 dark:border-neutral-700 dark:bg-neutral-900">
        {items.map((line) => (
          <li key={line.productId} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
            <Link
              href={`/products/${line.productId}`}
              className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg bg-neutral-100 sm:h-20 sm:w-28 dark:bg-neutral-800"
            >
              <Image src={line.imageUrl} alt="" fill className="object-cover" sizes="112px" />
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                href={`/products/${line.productId}`}
                className="font-semibold text-neutral-900 hover:text-red-600 dark:text-white dark:hover:text-red-400"
              >
                {line.name}
              </Link>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                {formatPriceNgn(line.priceKobo)} each
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:items-end">
              <div className="flex items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-600">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  className="px-3 py-2 text-lg leading-none text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  onClick={() => setQty(line.productId, line.qty - 1)}
                >
                  −
                </button>
                <span className="min-w-[2rem] text-center text-sm font-medium tabular-nums">{line.qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  className="px-3 py-2 text-lg leading-none text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  onClick={() => setQty(line.productId, line.qty + 1)}
                >
                  +
                </button>
              </div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                {formatPriceNgn(line.priceKobo * line.qty)}
              </p>
              <button
                type="button"
                onClick={() => removeItem(line.productId)}
                className="text-sm text-red-600 hover:underline dark:text-red-400"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Subtotal</p>
          <p className="text-2xl font-semibold text-neutral-900 dark:text-white">{formatPriceNgn(subtotalKobo)}</p>
          <p className="mt-1 text-xs text-neutral-500">Shipping and taxes confirmed when you contact us.</p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <Link
            href="/checkout"
            className="inline-flex justify-center rounded-lg bg-red-500 px-8 py-3 text-sm font-semibold text-white hover:bg-red-600"
          >
            Checkout
          </Link>
          <button
            type="button"
            onClick={() => clear()}
            className="text-sm text-neutral-600 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400"
          >
            Clear cart
          </button>
        </div>
      </div>
    </div>
  );
}
