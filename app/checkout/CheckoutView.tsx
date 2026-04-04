'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/app/_components/CartProvider';
import { formatPriceNgn } from '@/lib/products-shared';

type Props = {
  /** From signed-in session (httpOnly cookie), when customer logged in via EMS. */
  registeredEmail?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CheckoutView({ registeredEmail }: Props) {
  const { items } = useCart();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotalKobo = items.reduce((s, x) => s + x.priceKobo * x.qty, 0);
  const payEmail = (registeredEmail?.trim() || guestEmail.trim()).toLowerCase();

  const deliveryOk = deliveryAddress.trim().length > 0;
  const phoneOk = phone.trim().length > 0;
  const emailOk = EMAIL_RE.test(payEmail);
  const amountOk = subtotalKobo >= 100;
  const canProceed = deliveryOk && phoneOk && emailOk && amountOk;

  const handleProceedToPayment = () => {
    if (!canProceed || loading) return;
    setLoading(true);
    setError(null);
    void (async () => {
      try {
        const res = await fetch('/api/payments/paystack/initialize-product-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: payEmail,
            amountKobo: subtotalKobo,
            phone: phone.trim(),
            deliveryAddress: deliveryAddress.trim(),
            lineItems: items.map((i) => ({
              productId: i.productId,
              name: i.name,
              qty: i.qty,
              priceKobo: i.priceKobo,
            })),
          }),
        });
        const payload = (await res.json().catch(() => ({}))) as {
          message?: string;
          authorizationUrl?: string;
          authorization_url?: string;
        };
        const payUrl = payload.authorizationUrl || payload.authorization_url;
        if (!res.ok || !payUrl) {
          setError(payload.message || 'Could not start Paystack payment');
          setLoading(false);
          return;
        }
        window.location.assign(payUrl);
      } catch {
        setError('Network error — try again');
        setLoading(false);
      }
    })();
  };

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/80 px-8 py-16 text-center dark:border-neutral-600 dark:bg-neutral-900/40">
        <p className="text-neutral-700 dark:text-neutral-300">Your cart is empty — add products before checkout.</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/products"
            className="inline-block rounded-lg bg-red-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
          >
            Browse products
          </Link>
          <Link
            href="/cart"
            className="inline-block rounded-lg border border-neutral-300 px-6 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-800"
          >
            View cart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900 sm:p-8">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Order summary</h2>
        <ul className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-700">
          {items.map((line) => (
            <li key={line.productId} className="flex gap-4 py-4 first:pt-0">
              <Link
                href={`/products/${line.productId}`}
                className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800"
              >
                <Image src={line.imageUrl} alt="" fill className="object-cover" sizes="80px" />
              </Link>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-neutral-900 dark:text-white">{line.name}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Qty {line.qty} · {formatPriceNgn(line.priceKobo)} each
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-neutral-900 dark:text-white">
                {formatPriceNgn(line.priceKobo * line.qty)}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-col gap-2 border-t border-neutral-200 pt-6 dark:border-neutral-700 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Subtotal</p>
            <p className="text-2xl font-semibold text-neutral-900 dark:text-white">{formatPriceNgn(subtotalKobo)}</p>
          </div>
          <p className="text-xs text-neutral-500 sm:max-w-xs sm:text-right">
            You will complete payment securely on Paystack. Final totals may be adjusted if we confirm shipping separately.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900 sm:p-8">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Delivery details</h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Fields marked <span className="text-red-600 dark:text-red-400">*</span> are required. Paystack needs a valid email
          for the receipt.
        </p>

        {registeredEmail ? (
          <div className="mt-4 rounded-xl border border-emerald-200/80 bg-emerald-50/80 px-4 py-3 text-sm dark:border-emerald-900/50 dark:bg-emerald-950/40">
            <p className="font-medium text-emerald-900 dark:text-emerald-100">Account email</p>
            <p className="mt-1 break-all text-emerald-800 dark:text-emerald-200">{registeredEmail}</p>
            <p className="mt-2 text-xs text-emerald-700/90 dark:text-emerald-300/90">
              Used for your Paystack payment and receipt.
            </p>
          </div>
        ) : (
          <div className="mt-4">
            <label htmlFor="checkout-guest-email" className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
              Email <span className="text-red-600 dark:text-red-400">*</span>
            </label>
            <input
              id="checkout-guest-email"
              type="email"
              autoComplete="email"
              required
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 shadow-sm outline-none ring-red-500/0 transition-[box-shadow] focus:border-red-400 focus:ring-2 focus:ring-red-500/20 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100"
            />
          </div>
        )}

        <div className="mt-4">
          <label htmlFor="checkout-phone" className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Phone number <span className="text-red-600 dark:text-red-400">*</span>
          </label>
          <input
            id="checkout-phone"
            type="tel"
            autoComplete="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+234 …"
            className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 shadow-sm outline-none ring-red-500/0 transition-[box-shadow] focus:border-red-400 focus:ring-2 focus:ring-red-500/20 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="checkout-address" className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Delivery address <span className="text-red-600 dark:text-red-400">*</span>
          </label>
          <textarea
            id="checkout-address"
            required
            rows={4}
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Street, city, state, landmarks…"
            className="mt-1.5 w-full resize-y rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 shadow-sm outline-none ring-red-500/0 transition-[box-shadow] focus:border-red-400 focus:ring-2 focus:ring-red-500/20 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100"
          />
        </div>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          disabled={!canProceed || loading}
          onClick={handleProceedToPayment}
          aria-label="Pay with Paystack"
          className="inline-flex flex-col items-center justify-center rounded-lg bg-red-500 px-8 py-3 text-center text-sm font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-600 dark:disabled:bg-neutral-700 dark:disabled:text-neutral-400 sm:min-w-[220px]"
        >
          <span>{loading ? 'Opening Paystack…' : 'Pay with Paystack'}</span>
          {!loading ? (
            <span className="mt-0.5 text-[11px] font-normal text-white/90">Secure checkout — card, bank, USSD</span>
          ) : null}
        </button>
        {!canProceed ? (
          <p className="text-xs text-neutral-500 sm:max-w-md">
            {!amountOk
              ? 'Cart total must be at least ₦1.00 to pay online.'
              : 'Enter a valid email, phone, and delivery address to continue.'}
          </p>
        ) : null}
        <Link
          href="/cart"
          className="inline-flex justify-center text-sm font-medium text-red-600 underline-offset-2 hover:underline dark:text-red-400 sm:ml-auto"
        >
          ← Back to cart
        </Link>
      </div>
    </div>
  );
}
