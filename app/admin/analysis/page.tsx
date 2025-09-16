'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

type UploadedFile = { id: string; name: string; size: number; createdAt: string; paid?: boolean; clientName?: string };

export default function AdminAnalysisPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [filesLoading, setFilesLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [paidFileIds, setPaidFileIds] = useState<Record<string, boolean>>({});
  const [role, setRole] = useState<string | null>(null);

  async function refresh(tab?: 'paid' | 'unpaid') {
    setFilesLoading(true);
    try {
      const qp = tab && role === 'ADMIN' ? `?tab=${tab}` : '';
      const res = await fetch(`/api/uploads${qp}`);
      if (res.ok) setFiles(await res.json());
    } finally {
      setFilesLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // We intentionally call once on mount; refresh does not depend on changing values here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetch('/api/me').then(async (r) => {
      if (r.ok) {
        const { role } = await r.json();
        setRole(role ?? null);
      }
    }).catch(() => {});
  }, []);

  // Re-fetch when role becomes available (after login) and on focus/visibility changes
  useEffect(() => {
    if (!role) return;
    refresh();
    const onFocus = () => refresh();
    const onVisibility = () => { if (document.visibilityState === 'visible') refresh(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [role]);

  useEffect(() => {
    const paid = searchParams.get('paid');
    const fileId = searchParams.get('fileId');
    if (paid && fileId) {
      setPaidFileIds((p) => ({ ...p, [fileId]: true }));
      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete('paid');
      url.searchParams.delete('fileId');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

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
      const res = await fetch('/api/uploads', { method: 'POST', body: fd });
      if (!res.ok) {
        const t = await res.text();
        setError(t || 'Upload failed');
      } else {
        form.reset();
        await refresh();
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setUploading(false);
    }
  }

  async function onProcess(id: string) {
    setProcessingId(id);
    try {
      router.push(`/admin/analysis/checkout/${id}`);
    } finally {
      setProcessingId(null);
    }
  }

  async function onDelete(id: string) {
    if (!confirm('Delete this file?')) return;
    try {
      const res = await fetch(`/api/uploads/${id}`, { method: 'DELETE' });
      if (res.ok) await refresh();
    } catch {}
  }

  return (
    <div className="space-y-6 overflow-y-scroll px-8 py-8">
      <h1 className="text-2xl font-semibold">Questionnaire Uploads <span className="text-sm text-gray-500">(pdf or word documents)</span></h1>

      <form onSubmit={onUpload} className="border justify-center rounded-md p-4 bg-white dark:bg-neutral-900 flex flex-wrap items-center gap-3">
        <div className="relative bg-red-100">
          <input
            id="analysis-file"
            type="file"
            name="file"
            accept=".pdf,.doc,.docx,.xlsx,.xls,.csv,.txt"
            required
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              setSelectedFileName(f ? f.name : '');
            }}
          />
          <label
            htmlFor="analysis-file"
            className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
          >
            Choose file
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

      <div className="border rounded-md overflow-hidden bg-white dark:bg-neutral-900">
        {role === 'ADMIN' && (
          <div className="flex items-center gap-3 px-3 py-2 border-b text-xs">
            <button onClick={() => refresh('paid')} className="rounded border px-2 py-1">Paid</button>
            <button onClick={() => refresh('unpaid')} className="rounded border px-2 py-1">Unpaid</button>
          </div>
        )}
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-neutral-800 text-left">
            <tr>
              <th className="px-3 py-2">File</th>
              <th className="px-3 py-2">Size</th>
              <th className="px-3 py-2">Client</th>
              <th className="px-3 py-2">Uploaded</th>
              <th className="px-3 py-2 w-0">Action</th>
            </tr>
          </thead>
          <tbody>
            {filesLoading ? (
              <tr>
                <td className="px-3 py-4" colSpan={5}>
                  Fetching files...
                  <svg
                    className="inline-block ml-2 h-4 w-4 animate-spin text-gray-500 align-[-2px]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                </td>
              </tr>
            ) : files.length === 0 ? (
              <tr><td className="px-3 py-4" colSpan={5}>No upload yet.</td></tr>
            ) : (
              files.map(f => (
                <tr key={f.id}>
                  <td className="px-3 py-2">{f.name}</td>
                  <td className="px-3 py-2">{(f.size/1024).toFixed(1)} KB</td>
                  <td className="px-3 py-2">{f.clientName || '—'}</td>
                  <td className="px-3 py-2">{new Date(f.createdAt).toLocaleString()}</td>
                  <td className="px-3 py-2 text-right space-x-2 flex">
                    {paidFileIds[f.id] || f.paid ? (
                      <span className="px-2 py-1 text-xs rounded border bg-green-600 text-white">Paid</span>
                    ) : role === 'CLIENT' ? (
                      <button
                        onClick={() => onProcess(f.id)}
                        disabled={processingId === f.id}
                        className="px-2 py-1 text-xs rounded border bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                      >
                        {processingId === f.id ? 'Processing...' : 'Process'}
                      </button>
                    ) : null}
                    {role && role !== 'CLIENT' && (
                      <>
                        <a className="px-2 py-1 text-xs rounded border" href={`/api/uploads/${f.id}`}>Download</a>
                        <button onClick={() => onDelete(f.id)} className="px-2 py-1 text-xs rounded border text-red-600">Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
