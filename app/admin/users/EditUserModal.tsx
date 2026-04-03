'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type Props = {
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
  user: { id: string; name: string; email: string; role: string; status: string; imageUrl?: string | null } | null;
};

export default function EditUserModal({ open, onClose, onUpdated, user }: Props) {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [role, setRole]       = useState<'ADMIN' | 'MANAGER' | 'STAFF' | 'CLIENT'>('STAFF');
  const [status, setStatus]   = useState<'ACTIVE' | 'INVITED' | 'SUSPENDED' | 'DISABLED'>('ACTIVE');
  const [password, setPassword] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const fileRef               = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setRole(user.role as 'ADMIN' | 'MANAGER' | 'STAFF' | 'CLIENT');
      setStatus(user.status as 'ACTIVE' | 'INVITED' | 'SUSPENDED' | 'DISABLED');
      setPassword('');
      setPreview(user.imageUrl || null);
      if (fileRef.current) fileRef.current.value = '';
    }
  }, [user]);

  if (!open || !user) return null;

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function clearAvatar() {
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (!user) { setError('User not loaded'); return; }
      const form = new FormData();
      form.append('name', name);
      form.append('email', email);
      form.append('role', role);
      form.append('status', status);
      if (password) form.append('password', password);
      if (fileRef.current?.files?.[0]) form.append('avatar', fileRef.current.files[0]);

      const res = await fetch(`/api/users/${user.id}`, { method: 'PATCH', body: form });
      const data = await res.json().catch(() => ({ message: 'Server error' }));
      if (!res.ok) {
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Edit user</h2>
          <button onClick={onClose} className="text-sm rounded-md border px-2 py-1">Close</button>
        </div>

        <form onSubmit={submit} className="grid grid-cols-1 gap-4">
          {/* Avatar picker */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="relative w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden hover:border-red-400 transition-colors bg-gray-50"
              onClick={() => fileRef.current?.click()}
              title="Click to change avatar"
            >
              {preview ? (
                <Image src={preview} alt="Avatar preview" fill className="object-cover" />
              ) : (
                <svg className="w-8 h-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              )}
            </div>
            <input ref={fileRef} type="file" name="avatar" accept="image/*" className="hidden" onChange={handleFile} />
            <div className="flex gap-2">
              <button type="button" onClick={() => fileRef.current?.click()} className="text-xs text-gray-500 hover:text-red-500 transition-colors">
                Change photo
              </button>
              {preview && (
                <button type="button" onClick={clearAvatar} className="text-xs text-red-400 hover:text-red-600 transition-colors">
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Fields grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="grid gap-1">
              <label className="text-xs text-gray-600">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="border rounded px-2 py-1.5 text-sm" />
            </div>
            <div className="grid gap-1">
              <label className="text-xs text-gray-600">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="border rounded px-2 py-1.5 text-sm" />
            </div>
            <div className="grid gap-1">
              <label className="text-xs text-gray-600">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value as 'ADMIN' | 'MANAGER' | 'STAFF' | 'CLIENT')} className="border rounded px-2 py-1.5 text-sm">
                <option value="STAFF">Staff</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
                <option value="CLIENT">Client</option>
              </select>
            </div>
            <div className="grid gap-1">
              <label className="text-xs text-gray-600">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'INVITED' | 'SUSPENDED' | 'DISABLED')} className="border rounded px-2 py-1.5 text-sm">
                <option value="ACTIVE">Active</option>
                <option value="INVITED">Invited</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="DISABLED">Disabled</option>
              </select>
            </div>
            <div className="grid gap-1 sm:col-span-2">
              <label className="text-xs text-gray-600">New password (optional)</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="border rounded px-2 py-1.5 text-sm" placeholder="Leave blank to keep current" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button disabled={submitting} className="rounded-md bg-red-500 text-white px-4 py-2 text-sm hover:bg-red-600 disabled:opacity-60">
              {submitting ? 'Saving...' : 'Save changes'}
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
