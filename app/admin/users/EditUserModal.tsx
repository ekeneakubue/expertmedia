'use client';

import { useEffect, useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
  user: { id: string; name: string; email: string; role: string; status: string } | null;
};

export default function EditUserModal({ open, onClose, onUpdated, user }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'MANAGER' | 'STAFF'>('STAFF');
  const [status, setStatus] = useState<'ACTIVE' | 'INVITED' | 'SUSPENDED' | 'DISABLED'>('ACTIVE');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setRole(user.role as any);
      setStatus(user.status as any);
      setPassword('');
    }
  }, [user]);

  if (!open || !user) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('name', name);
      form.append('email', email);
      form.append('role', role);
      form.append('status', status);
      if (password) form.append('password', password);
      const fileInput = (e.target as HTMLFormElement).querySelector<HTMLInputElement>('input[type="file"][name="avatar"]');
      if (fileInput?.files && fileInput.files[0]) {
        form.append('avatar', fileInput.files[0]);
      }

      const res = await fetch(`/api/users/${user.id}`, { method: 'PATCH', body: form });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: 'Server error' }));
        setError(data.message || 'Failed to update user');
      } else {
        onUpdated?.();
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-neutral-900 rounded-md p-5 w-full max-w-xl shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Edit user</h2>
          <button onClick={onClose} className="text-sm rounded-md border px-2 py-1">Close</button>
        </div>
        <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="grid gap-1">
            <label className="text-xs">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="border rounded px-2 py-1 text-sm" />
          </div>
          <div className="grid gap-1">
            <label className="text-xs">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="border rounded px-2 py-1 text-sm" />
          </div>
          <div className="grid gap-1">
            <label className="text-xs">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value as any)} className="border rounded px-2 py-1 text-sm">
              <option value="STAFF">Staff</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="grid gap-1">
            <label className="text-xs">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="border rounded px-2 py-1 text-sm">
              <option value="ACTIVE">Active</option>
              <option value="INVITED">Invited</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="DISABLED">Disabled</option>
            </select>
          </div>
          <div className="grid gap-1 sm:col-span-2">
            <label className="text-xs">New password (optional)</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="border rounded px-2 py-1 text-sm" />
          </div>
          <div className="grid gap-1 sm:col-span-2">
            <label className="text-xs">Avatar</label>
            <input type="file" name="avatar" accept="image/*" className="text-sm" />
          </div>
          <div className="sm:col-span-2 flex items-center gap-3">
            <button disabled={submitting} className="text-sm rounded-md bg-red-500 text-white px-3 py-2">{submitting ? 'Saving...' : 'Save changes'}</button>
            {error && <span className="text-sm text-red-600">{error}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}


