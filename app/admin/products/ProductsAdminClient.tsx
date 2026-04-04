'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { HiPencilSquare, HiTrash } from 'react-icons/hi2';

export type ProductRow = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  subImageUrl1: string | null;
  subImageUrl2: string | null;
  subImageUrl3: string | null;
  price: number;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

function formatNgn(kobo: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(kobo / 100);
}

function nairaInputFromKobo(kobo: number) {
  return (kobo / 100).toFixed(2);
}

const headerPattern =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

function sortProducts(a: ProductRow, b: ProductRow) {
  if (a.order !== b.order) return a.order - b.order;
  return a.createdAt.localeCompare(b.createdAt);
}

type Props = { initialProducts: ProductRow[] };

export default function ProductsAdminClient({ initialProducts }: Props) {
  const [products, setProducts] = useState<ProductRow[]>(() => [...initialProducts].sort(sortProducts));
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [subPreviews, setSubPreviews] = useState<[string | null, string | null, string | null]>([null, null, null]);
  const fileRef = useRef<HTMLInputElement>(null);
  const subFileRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)] as const;
  const editFileRef = useRef<HTMLInputElement>(null);
  const editSubFileRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)] as const;
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [editSubPreviews, setEditSubPreviews] = useState<[string | null, string | null, string | null]>([
    null,
    null,
    null,
  ]);

  const clearPhoto = useCallback(() => {
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  }, []);

  const clearSubPreviewsAdd = useCallback(() => {
    setSubPreviews([null, null, null]);
    subFileRefs.forEach((r) => {
      if (r.current) r.current.value = '';
    });
  }, []);

  const clearEditPhoto = useCallback(() => {
    setEditPreview(null);
    if (editFileRef.current) editFileRef.current.value = '';
  }, []);

  const clearEditSubPreviews = useCallback(() => {
    setEditSubPreviews([null, null, null]);
    editSubFileRefs.forEach((r) => {
      if (r.current) r.current.value = '';
    });
  }, []);

  const closeAdd = useCallback(() => {
    setAddOpen(false);
    setError(null);
    clearPhoto();
    clearSubPreviewsAdd();
  }, [clearPhoto, clearSubPreviewsAdd]);

  const closeEdit = useCallback(() => {
    setEditing(null);
    setError(null);
    clearEditPhoto();
    clearEditSubPreviews();
  }, [clearEditPhoto, clearEditSubPreviews]);

  useEffect(() => {
    if (editing) {
      setEditSubPreviews([null, null, null]);
      editSubFileRefs.forEach((r) => {
        if (r.current) r.current.value = '';
      });
    }
  }, [editing?.id]);

  function handlePhotoFile(e: React.ChangeEvent<HTMLInputElement>, mode: 'add' | 'edit') {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (mode === 'add') setPreview(reader.result as string);
      else setEditPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleSubPhotoAdd(index: 0 | 1 | 2, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setSubPreviews((prev) => {
        const next: [string | null, string | null, string | null] = [...prev];
        next[index] = url;
        return next;
      });
    };
    reader.readAsDataURL(file);
  }

  function handleSubPhotoEdit(index: 0 | 1 | 2, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setEditSubPreviews((prev) => {
        const next: [string | null, string | null, string | null] = [...prev];
        next[index] = url;
        return next;
      });
    };
    reader.readAsDataURL(file);
  }

  async function patchProduct(p: ProductRow, updates: { order?: number }) {
    const fd = new FormData();
    fd.append('name', p.name);
    fd.append('description', p.description);
    fd.append('order', String(updates.order ?? p.order));
    fd.append('price', nairaInputFromKobo(p.price));
    fd.append('featured', p.featured ? 'true' : 'false');
    const res = await fetch(`/api/products/${p.id}`, { method: 'PATCH', body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(typeof data.message === 'string' ? data.message : 'Update failed');
    }
    return data as ProductRow & { createdAt: string; updatedAt: string };
  }

  async function moveProduct(index: number, dir: -1 | 1) {
    const next = index + dir;
    if (next < 0 || next >= products.length) return;
    const a = products[index];
    const b = products[next];
    setReorderingId(a.id);
    setError(null);
    try {
      const u1 = await patchProduct(a, { order: b.order });
      const u2 = await patchProduct(b, { order: a.order });
      setProducts((prev) => {
        const map = new Map(prev.map((p) => [p.id, p]));
        map.set(u1.id, { ...u1, createdAt: u1.createdAt, updatedAt: u1.updatedAt });
        map.set(u2.id, { ...u2, createdAt: u2.createdAt, updatedAt: u2.updatedAt });
        return [...map.values()].sort(sortProducts);
      });
      setNotice('Order updated');
      setTimeout(() => setNotice(null), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not reorder');
    } finally {
      setReorderingId(null);
    }
  }

  async function onAddSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    setSubmitting(true);
    try {
      const res = await fetch('/api/products', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.message === 'string' ? data.message : 'Could not add product');
        return;
      }
      const row: ProductRow = {
        id: data.id,
        name: data.name,
        description: data.description ?? '',
        imageUrl: data.imageUrl,
        subImageUrl1: data.subImageUrl1 ?? null,
        subImageUrl2: data.subImageUrl2 ?? null,
        subImageUrl3: data.subImageUrl3 ?? null,
        price: typeof data.price === 'number' ? data.price : 0,
        featured: Boolean(data.featured),
        order: data.order,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
      setProducts((prev) => [...prev, row].sort(sortProducts));
      setNotice('Product saved');
      setTimeout(() => setNotice(null), 2500);
      closeAdd();
      formEl.reset();
    } catch {
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  }

  async function onEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    setError(null);
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${editing.id}`, { method: 'PATCH', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.message === 'string' ? data.message : 'Could not update product');
        return;
      }
      const row: ProductRow = {
        id: data.id,
        name: data.name,
        description: data.description ?? '',
        imageUrl: data.imageUrl,
        subImageUrl1: data.subImageUrl1 ?? null,
        subImageUrl2: data.subImageUrl2 ?? null,
        subImageUrl3: data.subImageUrl3 ?? null,
        price: typeof data.price === 'number' ? data.price : 0,
        featured: Boolean(data.featured),
        order: data.order,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
      setProducts((prev) => prev.map((p) => (p.id === row.id ? row : p)).sort(sortProducts));
      setNotice('Product updated');
      setTimeout(() => setNotice(null), 2500);
      closeEdit();
    } catch {
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(p: ProductRow) {
    if (!confirm(`Delete “${p.name}”? This cannot be undone.`)) return;
    setError(null);
    try {
      const res = await fetch(`/api/products/${p.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(typeof data.message === 'string' ? data.message : 'Delete failed');
        return;
      }
      setProducts((prev) => prev.filter((x) => x.id !== p.id));
      setNotice('Product removed');
      setTimeout(() => setNotice(null), 2500);
    } catch {
      setError('Network error');
    }
  }

  const sorted = [...products].sort(sortProducts);

  return (
    <div className="min-h-0 overflow-y-auto px-6 sm:px-8 py-8 pb-16">
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-neutral-900 via-neutral-800 to-red-950 text-white shadow-lg mb-8">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: headerPattern }} />
        <div className="relative px-6 py-8 sm:px-10 sm:py-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-red-300/90 mb-2">Catalog</p>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Manage Products</h1>
            <p className="mt-2 text-sm text-neutral-300 max-w-xl leading-relaxed">
              Add EMS product cards with name, description, and cover image. Use display order to control how they appear
              when you surface this catalog on the site.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {notice ? (
              <span className="rounded-full bg-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-100 border border-emerald-400/30">
                {notice}
              </span>
            ) : null}
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-sm backdrop-blur-sm border border-white/10">
              {products.length} products
            </span>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setAddOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-md shadow-red-900/40 hover:bg-red-600 transition-colors"
            >
              Add product
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {error && !addOpen && !editing ? (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm px-4 py-3">{error}</div>
      ) : null}

      <section>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Product catalog</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Run <code className="rounded bg-gray-100 dark:bg-neutral-800 px-1">npm run db:push</code> after pulling if
            the Product table is new.
          </p>
        </div>
        {sorted.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 dark:border-neutral-600 bg-gray-50/50 dark:bg-neutral-900/40 p-12 text-center text-sm text-gray-600 dark:text-gray-400">
            No products yet. Add your first item to build the catalog.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-400">
                <tr>
                  <th className="px-3 py-3 w-20" scope="col">
                    Cover
                  </th>
                  <th className="px-3 py-3 min-w-[140px]" scope="col">
                    Name
                  </th>
                  <th className="px-3 py-3 hidden md:table-cell max-w-[200px]" scope="col">
                    Description
                  </th>
                  <th className="px-3 py-3 whitespace-nowrap" scope="col">
                    Price
                  </th>
                  <th className="px-3 py-3 whitespace-nowrap" scope="col">
                    Featured
                  </th>
                  <th className="px-3 py-3 whitespace-nowrap text-center" scope="col">
                    Sub
                  </th>
                  <th className="px-3 py-3 whitespace-nowrap" scope="col">
                    Order
                  </th>
                  <th className="px-3 py-3 text-right w-0" scope="col">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                {sorted.map((p, index) => (
                  <tr
                    key={p.id}
                    className="hover:bg-gray-50/80 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="px-3 py-2 align-middle">
                      <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-800">
                        <Image
                          src={p.imageUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    </td>
                    <td className="px-3 py-2 align-middle font-medium text-gray-900 dark:text-white">{p.name}</td>
                    <td className="px-3 py-2 align-middle text-gray-600 dark:text-gray-400 hidden md:table-cell">
                      <span className="line-clamp-2 max-w-[220px]" title={p.description || undefined}>
                        {p.description || '—'}
                      </span>
                    </td>
                    <td className="px-3 py-2 align-middle whitespace-nowrap font-medium text-red-700 dark:text-red-400">
                      {formatNgn(p.price)}
                    </td>
                    <td className="px-3 py-2 align-middle">
                      {p.featured ? (
                        <span className="inline-flex rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                          Yes
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 align-middle text-center tabular-nums text-gray-700 dark:text-gray-300">
                      {[p.subImageUrl1, p.subImageUrl2, p.subImageUrl3].filter(Boolean).length}/3
                    </td>
                    <td className="px-3 py-2 align-middle">
                      <span className="font-mono text-xs text-gray-700 dark:text-gray-300">{p.order}</span>
                      {reorderingId === p.id ? (
                        <span className="ml-2 text-xs text-red-500">…</span>
                      ) : null}
                    </td>
                    <td className="px-3 py-2 align-middle text-right">
                      <div className="inline-flex flex-wrap items-center justify-end gap-1">
                        <button
                          type="button"
                          disabled={reorderingId !== null || index === 0}
                          onClick={() => moveProduct(index, -1)}
                          className="rounded border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 dark:border-neutral-600 dark:bg-neutral-900 dark:text-gray-200 dark:hover:bg-neutral-800"
                          aria-label="Move up"
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={reorderingId !== null || index === sorted.length - 1}
                          onClick={() => moveProduct(index, 1)}
                          className="rounded border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 dark:border-neutral-600 dark:bg-neutral-900 dark:text-gray-200 dark:hover:bg-neutral-800"
                          aria-label="Move down"
                          title="Move down"
                        >
                          ↓
                        </button>
                        <span
                          className="mx-0.5 hidden h-6 w-px shrink-0 bg-gray-200 sm:inline-block dark:bg-neutral-600"
                          aria-hidden
                        />
                        <div className="inline-flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditing(p);
                              setEditPreview(null);
                              if (editFileRef.current) editFileRef.current.value = '';
                            }}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-neutral-600 dark:bg-neutral-900 dark:text-gray-200 dark:hover:border-red-800 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                            title="Edit"
                            aria-label={`Edit ${p.name}`}
                          >
                            <HiPencilSquare className="h-4 w-4" aria-hidden />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(p)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/60"
                            title="Delete"
                            aria-label={`Delete ${p.name}`}
                          >
                            <HiTrash className="h-4 w-4" aria-hidden />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeAdd} aria-hidden />
          <div className="relative bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-2xl shadow-xl border border-gray-200 dark:border-neutral-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add product</h2>
              <button type="button" onClick={closeAdd} className="text-sm rounded-md border px-2 py-1">
                Close
              </button>
            </div>
            <form onSubmit={onAddSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm px-3 py-2">{error}</div>
              )}
              <div className="flex flex-col items-center gap-2">
                <div
                  className="relative w-full max-w-[200px] aspect-video rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden hover:border-red-400 transition-colors bg-gray-50 dark:bg-neutral-800"
                  onClick={() => fileRef.current?.click()}
                  role="presentation"
                >
                  {preview ? (
                    <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
                  ) : (
                    <span className="text-xs text-gray-500 px-2 text-center">Click to upload cover image</span>
                  )}
                </div>
                <input
                  ref={fileRef}
                  name="photo"
                  type="file"
                  accept="image/*"
                  required
                  className="hidden"
                  onChange={(e) => handlePhotoFile(e, 'add')}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="text-xs text-gray-500 hover:text-red-500"
                  >
                    Choose image
                  </button>
                  {preview ? (
                    <button type="button" onClick={clearPhoto} className="text-xs text-red-400 hover:text-red-600">
                      Remove
                    </button>
                  ) : null}
                </div>
              </div>
              <div>
                <p className="block text-xs font-medium text-gray-600 dark:text-neutral-300 mb-2">
                  Sub product images (optional)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {([0, 1, 2] as const).map((i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div
                        className="relative w-full aspect-video rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-600 flex items-center justify-center cursor-pointer overflow-hidden bg-gray-50 dark:bg-neutral-800 hover:border-red-400"
                        onClick={() => subFileRefs[i].current?.click()}
                        role="presentation"
                      >
                        {subPreviews[i] ? (
                          <Image src={subPreviews[i]!} alt="" fill className="object-cover" unoptimized />
                        ) : (
                          <span className="text-[10px] text-gray-500 px-1 text-center">Sub {i + 1}</span>
                        )}
                      </div>
                      <input
                        ref={subFileRefs[i]}
                        name={`subPhoto${i + 1}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleSubPhotoAdd(i, e)}
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => subFileRefs[i].current?.click()}
                          className="text-[11px] text-gray-500 hover:text-red-500"
                        >
                          Choose
                        </button>
                        {subPreviews[i] ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSubPreviews((prev) => {
                                const next: [string | null, string | null, string | null] = [...prev];
                                next[i] = null;
                                return next;
                              });
                              if (subFileRefs[i].current) subFileRefs[i].current.value = '';
                            }}
                            className="text-[11px] text-red-400"
                          >
                            Clear
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="product-name" className="block text-xs font-medium text-gray-600 mb-1">
                  Product name
                </label>
                <input
                  id="product-name"
                  name="name"
                  type="text"
                  required
                  className="w-full rounded-md border border-gray-300 dark:border-neutral-600 px-3 py-2 text-sm bg-white dark:bg-neutral-900"
                  placeholder="e.g. RobEMS"
                />
              </div>
              <div>
                <label htmlFor="product-desc" className="block text-xs font-medium text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  id="product-desc"
                  name="description"
                  rows={4}
                  className="w-full rounded-md border border-gray-300 dark:border-neutral-600 px-3 py-2 text-sm bg-white dark:bg-neutral-900 resize-y"
                  placeholder="Short summary for cards and listings"
                />
              </div>
              <div>
                <label htmlFor="product-price" className="block text-xs font-medium text-gray-600 dark:text-neutral-300 mb-1">
                  Price (₦)
                </label>
                <input
                  id="product-price"
                  name="price"
                  type="number"
                  min={0}
                  step="0.01"
                  className="w-full rounded-md border border-gray-300 dark:border-neutral-600 px-3 py-2 text-sm bg-white dark:bg-neutral-900"
                  placeholder="0.00"
                />
                <p className="mt-1 text-[11px] text-gray-500">Stored in kobo internally; use naira with decimals if needed.</p>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-gray-50/80 dark:bg-neutral-800/50 px-3 py-3">
                <div className="flex h-5 shrink-0 items-center pt-0.5">
                  <input
                    id="product-featured"
                    type="checkbox"
                    name="featured"
                    value="true"
                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 dark:border-neutral-600 dark:bg-neutral-900"
                  />
                </div>
                <label htmlFor="product-featured" className="min-w-0 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Featured product</span>
                  <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
                    Mark for featured spots on the storefront when you use this flag in the site.
                  </span>
                </label>
                <input type="hidden" name="featured" value="false" />
              </div>
              <div>
                <label htmlFor="product-order" className="block text-xs font-medium text-gray-600 mb-1">
                  Display order
                </label>
                <input
                  id="product-order"
                  name="order"
                  type="number"
                  min={0}
                  step={1}
                  className="w-full rounded-md border border-gray-300 dark:border-neutral-600 px-3 py-2 text-sm bg-white dark:bg-neutral-900"
                  placeholder="Leave empty to append"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-red-500 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-60"
              >
                {submitting ? 'Saving…' : 'Save product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeEdit} aria-hidden />
          <div className="relative bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-2xl shadow-xl border border-gray-200 dark:border-neutral-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Edit product</h2>
              <button type="button" onClick={closeEdit} className="text-sm rounded-md border px-2 py-1">
                Close
              </button>
            </div>
            <form key={editing.id} onSubmit={onEditSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm px-3 py-2">{error}</div>
              )}
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-full max-w-[200px] aspect-video rounded-lg border border-gray-200 overflow-hidden bg-neutral-100">
                  <Image
                    src={editPreview || editing.imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized={!!editPreview}
                  />
                </div>
                <input
                  ref={editFileRef}
                  name="photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handlePhotoFile(e, 'edit')}
                />
                <button
                  type="button"
                  onClick={() => editFileRef.current?.click()}
                  className="text-xs text-gray-500 hover:text-red-500"
                >
                  Replace image (optional)
                </button>
                {editPreview ? (
                  <button type="button" onClick={clearEditPhoto} className="text-xs text-red-400">
                    Keep original image
                  </button>
                ) : null}
              </div>
              <div>
                <label htmlFor="edit-product-name" className="block text-xs font-medium text-gray-600 mb-1">
                  Product name
                </label>
                <input
                  id="edit-product-name"
                  name="name"
                  type="text"
                  required
                  defaultValue={editing.name}
                  className="w-full rounded-md border border-gray-300 dark:border-neutral-600 px-3 py-2 text-sm bg-white dark:bg-neutral-900"
                />
              </div>
              <div>
                <label htmlFor="edit-product-desc" className="block text-xs font-medium text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  id="edit-product-desc"
                  name="description"
                  rows={4}
                  defaultValue={editing.description}
                  className="w-full rounded-md border border-gray-300 dark:border-neutral-600 px-3 py-2 text-sm bg-white dark:bg-neutral-900 resize-y"
                />
              </div>
              <div>
                <label htmlFor="edit-product-price" className="block text-xs font-medium text-gray-600 dark:text-neutral-300 mb-1">
                  Price (₦)
                </label>
                <input
                  id="edit-product-price"
                  name="price"
                  type="number"
                  min={0}
                  step="0.01"
                  defaultValue={nairaInputFromKobo(editing.price)}
                  className="w-full rounded-md border border-gray-300 dark:border-neutral-600 px-3 py-2 text-sm bg-white dark:bg-neutral-900"
                />
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-gray-50/80 dark:bg-neutral-800/50 px-3 py-3">
                <div className="flex h-5 shrink-0 items-center pt-0.5">
                  <input
                    id="edit-product-featured"
                    type="checkbox"
                    name="featured"
                    value="true"
                    defaultChecked={editing.featured}
                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 dark:border-neutral-600 dark:bg-neutral-900"
                  />
                </div>
                <label htmlFor="edit-product-featured" className="min-w-0 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Featured product</span>
                  <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
                    Mark for featured spots on the storefront when you use this flag in the site.
                  </span>
                </label>
                <input type="hidden" name="featured" value="false" />
              </div>
              <div>
                <p className="block text-xs font-medium text-gray-600 dark:text-neutral-300 mb-2">Sub product images</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {([0, 1, 2] as const).map((i) => {
                    const existingUrls = [editing.subImageUrl1, editing.subImageUrl2, editing.subImageUrl3] as const;
                    const show = editSubPreviews[i] || existingUrls[i];
                    return (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className="relative w-full aspect-video rounded-lg border border-gray-200 dark:border-neutral-600 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                          {show ? (
                            <Image
                              src={editSubPreviews[i] || existingUrls[i] || ''}
                              alt=""
                              fill
                              className="object-cover"
                              unoptimized={!!editSubPreviews[i]}
                            />
                          ) : (
                            <div className="flex h-full min-h-[4.5rem] items-center justify-center text-[10px] text-gray-500">
                              No image
                            </div>
                          )}
                        </div>
                        <input
                          ref={editSubFileRefs[i]}
                          name={`subPhoto${i + 1}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleSubPhotoEdit(i, e)}
                        />
                        <div className="flex flex-wrap justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => editSubFileRefs[i].current?.click()}
                            className="text-[11px] text-gray-500 hover:text-red-500"
                          >
                            Replace
                          </button>
                          {editSubPreviews[i] ? (
                            <button
                              type="button"
                              onClick={() => {
                                setEditSubPreviews((prev) => {
                                  const next: [string | null, string | null, string | null] = [...prev];
                                  next[i] = null;
                                  return next;
                                });
                                if (editSubFileRefs[i].current) editSubFileRefs[i].current.value = '';
                              }}
                              className="text-[11px] text-red-400"
                            >
                              Keep current file
                            </button>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <label htmlFor="edit-product-order" className="block text-xs font-medium text-gray-600 mb-1">
                  Display order
                </label>
                <input
                  id="edit-product-order"
                  name="order"
                  type="number"
                  min={0}
                  step={1}
                  defaultValue={editing.order}
                  className="w-full rounded-md border border-gray-300 dark:border-neutral-600 px-3 py-2 text-sm bg-white dark:bg-neutral-900"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-red-500 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-60"
              >
                {submitting ? 'Saving…' : 'Update product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
