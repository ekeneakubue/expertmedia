import { put, del } from '@vercel/blob';
import { promises as fs } from 'fs';
import path from 'path';

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

/** True on any serverless/read-only host (Vercel, Netlify, Lambda). */
function isReadOnlyHost(): boolean {
  return !!(
    process.env.VERCEL ||
    process.env.NETLIFY ||
    process.env.AWS_LAMBDA_FUNCTION_NAME
  );
}

/**
 * Production (Vercel): filesystem under `public/` is read-only — uploads MUST use Blob.
 * Local dev: writes to `public/{folder}/` and returns a site-relative URL.
 *
 * Requires BLOB_READ_WRITE_TOKEN env var on any serverless host.
 */
export async function saveUploadedFile(
  file: File,
  folder: 'hero' | 'avatars' | 'team' | 'product',
  diskFileName: string,
): Promise<{ url: string; filename: string }> {
  const safeName = diskFileName.replace(/[^a-zA-Z0-9._-]/g, '_');

  if (BLOB_TOKEN) {
    const key = `${folder}/${safeName}`;
    const uploaded = await put(key, file, {
      access: 'public',
      contentType: file.type || undefined,
      token: BLOB_TOKEN,
    });
    return { url: uploaded.url, filename: safeName };
  }

  if (isReadOnlyHost()) {
    throw new Error(
      'File uploads require Vercel Blob in production. ' +
      'Add BLOB_READ_WRITE_TOKEN to your environment variables, then redeploy.',
    );
  }

  // Local dev: write to public/<folder>/
  const dir = path.join(process.cwd(), 'public', folder);
  await fs.mkdir(dir, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, safeName), buf);
  return { url: `/${folder}/${safeName}`, filename: safeName };
}

/** Remove a file from Blob (https URL) or local `public/` path (/hero/..., /avatars/..., /team/...). */
export async function deleteStoredFile(url: string | null | undefined): Promise<void> {
  if (!url) return;
  if (url.startsWith('https://') && BLOB_TOKEN) {
    try {
      await del(url, { token: BLOB_TOKEN });
    } catch {
      /* ignore */
    }
    return;
  }
  if (url.startsWith('/')) {
    const rel = url.replace(/^\//, '');
    try {
      await fs.unlink(path.join(process.cwd(), 'public', rel));
    } catch {
      /* ignore */
    }
  }
}
