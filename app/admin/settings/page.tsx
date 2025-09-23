"use client";

import { useEffect, useState } from "react";

type HeroImage = { url: string; size?: number; uploadedAt?: string };

export default function AdminSettingsPage() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch('/api/hero');
      if (res.ok) setImages(await res.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function onUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector<HTMLInputElement>('input[type="file"]');
    if (!input || !input.files || input.files.length === 0) return;
    const fd = new FormData();
    fd.append('file', input.files[0]);
    setUploading(true);
    setError(null);
    try {
      const res = await fetch('/api/hero', { method: 'POST', body: fd });
      if (!res.ok) {
        const t = await res.text();
        setError(t || 'Upload failed');
      } else {
        form.reset();
        setSelectedFileName('');
        await refresh();
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setUploading(false);
    }
  }

  async function onDelete(url: string) {
    if (!confirm('Delete this image?')) return;
    try {
      const res = await fetch(`/api/hero/[id]?url=${encodeURIComponent(url)}`, { method: 'DELETE' });
      if (res.ok) await refresh();
    } catch {}
  }

  return (
    <div className="space-y-6 overflow-y-scroll px-8 py-8">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <div className="border rounded-md overflow-hidden bg-white dark:bg-neutral-900">
        <div className="p-4 border-b">
          <div className="text-base font-medium">Hero background images</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Upload JPG/PNG; these appear in the homepage slider background.</div>
        </div>
        <div className="p-4 grid gap-4">
          <form onSubmit={onUpload} className="border rounded-md p-4 bg-white dark:bg-neutral-900 flex flex-wrap items-center gap-3">
            <div className="relative">
              <input
                id="hero-file"
                type="file"
                name="file"
                accept="image/*"
                required
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  setSelectedFileName(f ? f.name : '');
                }}
              />
              <label
                htmlFor="hero-file"
                className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
              >
                Choose image
              </label>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-300 min-w-[130px] truncate">
              {selectedFileName || 'No file chosen'}
            </span>
            <button disabled={uploading} className="text-sm rounded-md bg-red-500 text-white px-3 py-2">
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            {error && <span className="text-sm text-red-600">{error}</span>}
          </form>

          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-neutral-800 text-left">
                <tr>
                  <th className="px-3 py-2">Image</th>
                  <th className="px-3 py-2">Size</th>
                  <th className="px-3 py-2">Uploaded</th>
                  <th className="px-3 py-2 w-0">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-3 py-4" colSpan={4}>Fetching images…</td>
                  </tr>
                ) : images.length === 0 ? (
                  <tr><td className="px-3 py-4" colSpan={4}>No images yet.</td></tr>
                ) : (
                  images.map(img => (
                    <tr key={img.url}>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-3">
                          <img src={img.url} alt="Hero" className="w-24 h-14 object-cover rounded border" />
                          <div className="truncate max-w-[300px]" title={img.url}>{img.url}</div>
                        </div>
                      </td>
                      <td className="px-3 py-2">{img.size ? (img.size/1024).toFixed(1) + ' KB' : '—'}</td>
                      <td className="px-3 py-2">{img.uploadedAt ? new Date(img.uploadedAt).toLocaleString() : '—'}</td>
                      <td className="px-3 py-2 text-right">
                        <button onClick={() => onDelete(img.url)} className="px-2 py-1 text-xs rounded border text-red-600">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
