'use client';

import { useEffect, useState } from 'react';

type UploadedFile = { id: string; name: string; size: number; createdAt: string };

export default function AdminAnalysisPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const res = await fetch('/api/uploads');
    if (res.ok) setFiles(await res.json());
  }

  useEffect(() => {
    refresh();
  }, []);

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
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-neutral-800 text-left">
            <tr>
              <th className="px-3 py-2">File</th>
              <th className="px-3 py-2">Size</th>
              <th className="px-3 py-2">Uploaded</th>
              <th className="px-3 py-2 w-0"></th>
            </tr>
          </thead>
          <tbody>
            {files.length === 0 ? (
              <tr><td className="px-3 py-4" colSpan={4}>No uploads yet.</td></tr>
            ) : (
              files.map(f => (
                <tr key={f.id}>
                  <td className="px-3 py-2">{f.name}</td>
                  <td className="px-3 py-2">{(f.size/1024).toFixed(1)} KB</td>
                  <td className="px-3 py-2">{new Date(f.createdAt).toLocaleString()}</td>
                  <td className="px-3 py-2 text-right">
                    <a className="px-2 py-1 text-xs rounded border" href={`/api/uploads/${f.id}`}>Download</a>
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


