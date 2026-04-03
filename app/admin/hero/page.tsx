"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type HeroImage = {
  id: string;
  url: string;
  size: number | null;
  order: number;
  createdAt: string;
};

export default function ManageHeroPage() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [reordering, setReordering] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/hero");
      const data = await res.json().catch(() => []);
      if (!res.ok) {
        setError(typeof data.message === "string" ? data.message : "Could not load hero images");
        setImages([]);
        return;
      }
      setImages(Array.isArray(data) ? data : []);
    } catch {
      setError("Network error");
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(t);
  }, [notice]);

  async function uploadFile(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    setUploading(true);
    setError(null);
    try {
      const res = await fetch("/api/hero", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.message === "string" ? data.message : "Upload failed");
        return;
      }
      setNotice("Image added to homepage hero");
      await refresh();
    } catch {
      setError("Upload failed — check your connection");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f?.type.startsWith("image/")) void uploadFile(f);
  }

  async function onDelete(id: string) {
    if (!confirm("Remove this image from the hero slider?")) return;
    try {
      const res = await fetch(`/api/hero/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotice("Image removed");
        await refresh();
      }
    } catch {}
  }

  async function swapOrder(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= images.length) return;
    const a = images[index];
    const b = images[next];
    setReordering(a.id);
    setError(null);
    try {
      await Promise.all([
        fetch(`/api/hero/${a.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: b.order }),
        }),
        fetch(`/api/hero/${b.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: a.order }),
        }),
      ]);
      setNotice("Slide order updated");
      await refresh();
    } catch {
      setError("Could not reorder slides");
    } finally {
      setReordering(null);
    }
  }

  return (
    <div className="min-h-0 overflow-y-auto px-6 sm:px-8 py-8 pb-16">
      {/* Page header */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-neutral-900 via-neutral-800 to-red-950 text-white shadow-lg mb-8">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-red-300/90 mb-2">Homepage</p>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Manage Hero</h1>
            <p className="mt-2 text-sm text-neutral-300 max-w-xl leading-relaxed">
              Images here rotate behind the welcome message on the public site. Use high-resolution landscape photos
              for the best result.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-sm border border-white/10">
              {loading ? "…" : `${images.length} slide${images.length === 1 ? "" : "s"}`}
            </span>
            {notice && (
              <span className="rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-3 py-1.5">
                {notice}
              </span>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm px-4 py-3">{error}</div>
      )}

      {/* Upload */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">Add slide</h2>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`rounded-xl border-2 border-dashed transition-colors ${
            dragOver ? "border-red-400 bg-red-50/80" : "border-gray-300 bg-white hover:border-red-300 hover:bg-gray-50/80"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-500 text-white shadow-md shadow-red-500/25">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Drop an image here</p>
                <p className="text-sm text-gray-500 mt-1">JPG, PNG, or WebP · or choose a file</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void uploadFile(f);
                }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-600 disabled:opacity-60 transition-colors"
              >
                {uploading ? "Uploading…" : "Choose file"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section>
        <h2 className="text-sm font-semibold text-gray-800 mb-4">Current slides</h2>
        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">Loading slides…</div>
        ) : images.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-12 text-center">
            <p className="text-gray-600 font-medium">No hero images yet</p>
            <p className="text-sm text-gray-500 mt-1">Upload one above — visitors will see your defaults until you add slides.</p>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {images.map((img, index) => (
              <li
                key={img.id}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-[16/9] relative bg-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                  <div className="absolute left-3 top-3 flex items-center gap-1.5">
                    <span className="rounded-md bg-black/65 text-white text-xs font-medium px-2 py-1 backdrop-blur-sm">
                      Slide {index + 1}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between gap-3 border-t border-gray-100">
                  <div className="min-w-0 text-xs text-gray-500">
                    {img.size != null && <p>{(img.size / 1024).toFixed(1)} KB</p>}
                    <p className="truncate" title={new Date(img.createdAt).toLocaleString()}>
                      {new Date(img.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0 || reordering !== null}
                      onClick={() => swapOrder(index, -1)}
                      className="rounded-md border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                      title="Move earlier"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      disabled={index === images.length - 1 || reordering !== null}
                      onClick={() => swapOrder(index, 1)}
                      className="rounded-md border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                      title="Move later"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(img.id)}
                      className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                {reordering === img.id && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center text-sm text-gray-600">
                    Reordering…
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
