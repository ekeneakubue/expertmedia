import { prisma } from '@/lib/prisma';

const FALLBACK_HERO_URLS = [
  '/images/gallery/stc1.jpg',
  '/images/gallery/stc2.jpg',
  '/images/gallery/stc3.jpg',
];

/**
 * Hero files saved under `public/hero/` only exist on the machine that uploaded them.
 * On serverless hosts (Vercel, Netlify, etc.) those paths 404 unless files are in git.
 * Blob URLs (https://) work everywhere.
 */
function isEphemeralHost(): boolean {
  return !!(process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

function isUsableHeroUrl(url: string, ephemeralHost: boolean): boolean {
  if (!url) return false;
  if (url.startsWith('https://') || url.startsWith('http://')) return true;
  if (ephemeralHost && url.startsWith('/hero/')) return false;
  return url.startsWith('/');
}

export async function getHeroImageUrlsForHome(): Promise<string[]> {
  const ephemeralHost = isEphemeralHost();
  try {
    const rows = await prisma.heroImage.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      select: { url: true },
    });

    if (ephemeralHost && rows.some((r) => r.url.startsWith('/hero/'))) {
      console.warn(
        '[hero] Database has /hero/… URLs; disk files are not on this host. Set BLOB_READ_WRITE_TOKEN in env, redeploy, and re-upload in Admin → Manage Hero.',
      );
    }

    const urls = rows.map((r) => r.url).filter((u) => isUsableHeroUrl(u, ephemeralHost));
    return urls.length > 0 ? urls : FALLBACK_HERO_URLS;
  } catch {
    return FALLBACK_HERO_URLS;
  }
}
