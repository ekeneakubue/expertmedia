/** Serializable product shape for public UI (safe for Client Components). */

export type PublicProduct = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  subImageUrls: string[];
  priceKobo: number;
  featured: boolean;
  order: number;
};

export function formatPriceNgn(kobo: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(kobo / 100);
}

/** Trims and caps visible copy at `maxWords`, appending an ellipsis when shortened. */
export function truncateToWordCount(text: string, maxWords: number): string {
  const trimmed = text.trim();
  if (!trimmed) return '';
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return trimmed;
  return `${words.slice(0, maxWords).join(' ')}…`;
}
