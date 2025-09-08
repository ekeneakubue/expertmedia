'use client';

import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);

  useEffect(() => {
    try {
      const e = document.cookie.split('; ').find((c) => c.startsWith('userEmail='));
      setEmail(e ? decodeURIComponent(e.split('=')[1]) : '');
    } catch {}
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      if (!email) { setMessage('No user email cookie'); return; }
      const resUsers = await fetch('/api/users');
      type LiteUser = { id: string; email: string; name?: string };
      const users: LiteUser[] = resUsers.ok ? await resUsers.json() : [];
      const me = users.find((u) => u.email === email);
      if (!me) { setMessage('User not found'); return; }
      const form = new FormData();
      form.append('name', name);
      if (avatar) form.append('avatar', avatar);
      const res = await fetch(`/api/users/${me.id}`, { method: 'PATCH', body: form });
      if (res.ok) setMessage('Saved'); else setMessage('Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 overflow-y-scroll px-8 py-8">
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>
      <form onSubmit={save} className="border rounded-md p-4 bg-white dark:bg-neutral-900 max-w-xl grid gap-3">
        <div className="grid gap-1">
          <label className="text-sm">Email</label>
          <input value={email} readOnly className="border rounded px-3 py-2 bg-gray-50" />
        </div>
        <div className="grid gap-1">
          <label className="text-sm">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="border rounded px-3 py-2" placeholder="Your name" />
        </div>
        <div className="grid gap-1">
          <label className="text-sm">Avatar</label>
          <input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0] ?? null)} className="text-sm" />
        </div>
        <button disabled={saving} className="rounded-md bg-red-500 hover:bg-red-600 text-white px-4 py-2 w-fit">{saving ? 'Saving...' : 'Save'}</button>
        {message && <div className="text-sm">{message}</div>}
      </form>
    </div>
  );
}


