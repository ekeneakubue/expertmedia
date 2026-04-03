import { put, del } from '@vercel/blob';
import { promises as fs } from 'fs';
import path from 'path';

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

/**
 * Production (Vercel): filesystem under `public/` is ephemeral — uploads must use Blob when token is set.
 * Local dev: writes to `public/{folder}/` and returns a site-relative URL.
 */
export async function saveUploadedFile(
  file: File,
  folder: 'hero' | 'avatars',
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

  const dir = path.join(process.cwd(), 'public', folder);
  await fs.mkdir(dir, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, safeName), buf);
  return { url: `/${folder}/${safeName}`, filename: safeName };
}

/** Remove a file from Blob (https URL) or local `public/` path (/hero/... or /avatars/...). */
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
