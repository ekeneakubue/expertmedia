'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

type Props = {
  onCreated?: () => void | Promise<void>;
};

export default function AddUser({ onCreated }: Props) {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [role, setRole]       = useState<'ADMIN' | 'MANAGER' | 'STAFF' | 'CLIENT'>('STAFF');
  const [password, setPassword] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileRef               = useRef<HTMLInputElement>(null);

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
    setSuccess(null);
    try {
      const form = new FormData();
      form.append('name', name || email);
      form.append('email', email);
      form.append('role', role);
      form.append('password', password);
      if (fileRef.current?.files?.[0]) {
        form.append('avatar', fileRef.current.files[0]);
      }

      const res = await fetch('/api/users', { method: 'POST', body: form });
      const data = await res.json().catch(() => ({ message: 'Invalid response from server' }));
      if (!res.ok) {
        setError(typeof data.message === 'string' ? data.message : 'Failed to create user');
        return;
      }
      setSuccess('User created');
      setName('');
      setEmail('');
      setRole('STAFF');
      setPassword('');
      clearAvatar();
      await onCreated?.();
    } catch {
      setError('Network error — could not reach the server. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-4">
      {/* Avatar picker */}
      <div className="flex flex-col items-center gap-2">
        <div
          className="relative w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden hover:border-red-400 transition-colors bg-gray-50"
          onClick={() => fileRef.current?.click()}
          title="Click to upload avatar"
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
            Upload photo
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
          <input value={name} onChange={(e) => setName(e.target.value)} className="border rounded px-2 py-1.5 text-sm" placeholder="Jane Doe" />
        </div>
        <div className="grid gap-1">
          <label className="text-xs text-gray-600">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="border rounded px-2 py-1.5 text-sm" placeholder="jane@example.com" />
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
          <label className="text-xs text-gray-600">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={6} className="border rounded px-2 py-1.5 text-sm" placeholder="Temporary password" />
        </div>
      </div>

      <button disabled={submitting} className="w-full sm:w-auto rounded-md bg-red-500 text-white px-4 py-2 text-sm hover:bg-red-600 disabled:opacity-60">
        {submitting ? 'Adding...' : 'Add user'}
      </button>

      {(error || success) && (
        <div>
          {error   && <p className="text-sm text-red-600 whitespace-pre-wrap">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
        </div>
      )}
    </form>
  );
}
