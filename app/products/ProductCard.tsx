'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatPriceNgn, truncateToWordCount, type PublicProduct } from '@/lib/products-shared';

type Props = { product: PublicProduct };

export function ProductCard({ product }: Props) {
  const cardDescription = product.description?.trim()
    ? truncateToWordCount(product.description, 15)
    : 'Contact us for details and availability.';

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {product.featured ? (
          <span className="absolute right-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
            Featured
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">{product.name}</h2>
        <p className="mt-2 text-sm font-semibold text-red-600 dark:text-red-400">{formatPriceNgn(product.priceKobo)}</p>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {cardDescription}
        </p>
        <Link
          href={`/products/${product.id}`}
          className="mt-4 px-6 bg-red-500 rounded py-2 text-gray-50 w-full sm:w-auto text-center text-sm font-medium transition-colors hover:bg-red-600"
        >
          Order now
        </Link>
      </div>
    </article>
  );
}
