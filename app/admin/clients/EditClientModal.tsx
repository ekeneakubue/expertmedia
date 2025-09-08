'use client';

import { useEffect, useState } from 'react';

type Client = { id: string; name: string; email: string | null; industry: string | null; isActive: boolean };

type Props = {
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
  client: Client | null;
};

export default function EditClientModal({ open, onClose, onUpdated, client }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [industry, setIndustry] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (client) {
      setName(client.name || '');
      setEmail(client.email || '');
      setIndustry(client.industry || '');
      setIsActive(!!client.isActive);
    }
  }, [client]);

  if (!open || !client) return null;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (!client) { setError('Client not loaded'); setSaving(false); return; }
      const res = await fetch(`/api/clients/${client.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, industry, isActive, password: password || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: 'Server error' }));
        setError(data.message || 'Failed to update');
      } else {
        onUpdated?.();
        onClose();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-neutral-900 rounded-md p-5 w-full max-w-xl shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Edit client</h2>
          <button onClick={onClose} className="text-sm rounded-md border px-2 py-1">Close</button>
        </div>
        <form onSubmit={save} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="grid gap-1">
            <label className="text-xs">Company</label>
            <input className="border rounded px-2 py-1 text-sm" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-1 sm:col-span-2">
            <label className="text-xs">New password (optional)</label>
            <input className="border rounded px-2 py-1 text-sm" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Set or reset client password" />
          </div>
          <div className="grid gap-1">
            <label className="text-xs">Email</label>
            <input className="border rounded px-2 py-1 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-1">
            <label className="text-xs">Industry</label>
            <input className="border rounded px-2 py-1 text-sm" value={industry} onChange={(e) => setIndustry(e.target.value)} />
          </div>
          <div className="grid gap-1">
            <label className="text-xs">Status</label>
            <select className="border rounded px-2 py-1 text-sm" value={isActive ? 'active' : 'inactive'} onChange={(e) => setIsActive(e.target.value === 'active')}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="sm:col-span-2 flex items-center gap-3">
            <button disabled={saving} className="text-sm rounded-md bg-red-500 text-white px-3 py-2">{saving ? 'Saving...' : 'Save changes'}</button>
            {error && <span className="text-sm text-red-600">{error}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}


