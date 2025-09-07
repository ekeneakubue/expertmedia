'use client';

import { useState } from 'react';

type Props = {
  onCreated?: () => void;
};

export default function AddUser({ onCreated }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'MANAGER' | 'STAFF'>('STAFF');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name || email, email, role, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: 'Server error' }));
        setError(data.message || 'Failed to create user');
      } else {
        setSuccess('User created');
        setName('');
        setEmail('');
        setRole('STAFF');
        setPassword('');
        onCreated?.();
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
      <div className="grid gap-1">
        <label className="text-xs">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="border rounded px-2 py-1 text-sm" placeholder="Jane Doe" />
      </div>
      <div className="grid gap-1">
        <label className="text-xs">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="border rounded px-2 py-1 text-sm" placeholder="jane@example.com" />
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
        <label className="text-xs">Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={6} className="border rounded px-2 py-1 text-sm" placeholder="Temporary password" />
      </div>
      <button disabled={submitting} className="text-sm rounded-md bg-red-500 text-white px-3 py-2">
        {submitting ? 'Adding...' : 'Add user'}
      </button>
      {error && <span className="text-sm text-red-600">{error}</span>}
      {success && <span className="text-sm text-green-600">{success}</span>}
    </form>
  );
}


