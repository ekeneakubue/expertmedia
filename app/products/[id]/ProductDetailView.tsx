'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useCart } from '@/app/_components/CartProvider';
import { formatPriceNgn, type PublicProduct } from '@/lib/products-shared';

type Props = { product: PublicProduct };

export function ProductDetailView({ product }: Props) {
  const { addItem } = useCart();
  const galleryUrls = useMemo(
    () => [product.imageUrl, ...product.subImageUrls],
    [product.imageUrl, product.subImageUrls],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [addedFlash, setAddedFlash] = useState(false);
  const activeUrl = galleryUrls[activeIndex] ?? product.imageUrl;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      priceKobo: product.priceKobo,
      imageUrl: product.imageUrl,
      qty: 1,
    });
    setAddedFlash(true);
    window.setTimeout(() => setAddedFlash(false), 2000);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 lg:items-start">
      <div>
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-neutral-200/90 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
          <Image
            src={activeUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          {product.featured ? (
            <span className="absolute right-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
              Featured
            </span>
          ) : null}
        </div>
        {galleryUrls.length > 1 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {galleryUrls.map((url, i) => (
              <button
                key={`${product.id}-detail-thumb-${i}`}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg ring-2 transition-shadow ${
                  i === activeIndex
                    ? 'ring-red-500 shadow-md'
                    : 'ring-transparent opacity-80 hover:opacity-100 hover:ring-neutral-300 dark:hover:ring-neutral-600'
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <Image src={url} alt="" fill className="object-cover" sizes="96px" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
          {product.name}
        </h1>
        <p className="mt-4 text-xl font-semibold text-red-600 dark:text-red-400">{formatPriceNgn(product.priceKobo)}</p>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
          {product.description ? (
            <p className="whitespace-pre-wrap">{product.description}</p>
          ) : (
            <p>Contact us for full specifications, availability, and delivery options.</p>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex items-center justify-center rounded-lg bg-red-500 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-600"
          >
            {addedFlash ? 'Added to cart' : 'Add to cart'}
          </button>
          <Link
            href="/cart"
            className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-8 py-3 text-sm font-semibold text-neutral-800 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-red-500/50 dark:hover:bg-neutral-800"
          >
            View cart
          </Link>
          <Link
            href="/contacts"
            className="inline-flex items-center justify-center text-sm font-medium text-red-600 underline-offset-2 hover:underline dark:text-red-400"
          >
            Enquire instead
          </Link>
        </div>
      </div>
    </div>
  );
}
