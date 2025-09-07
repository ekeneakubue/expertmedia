'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const { redirectTo } = await res.json();
        window.location.href = redirectTo;
      } else {
        const { message } = await res.json();
        setError(message || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 bg-gradient-to-b from-red-50 to-red-100">
      <form onSubmit={onSubmit} className="w-full max-w-md border rounded-md bg-white p-6 space-y-4">
        <Link href='/' className="flex items-center justify-center mb-2">
          <img src="/images/logo.png" alt="Expert Media Solutions" className="h-12" />
        </Link>
        <h1 className="text-xl font-semibold text-center">Sign in</h1>
        <div className="grid gap-1">
          <label className="text-sm">Email</label>
          <input className="border rounded px-3 py-2" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-1">
          <label className="text-sm">Password</label>
          <div className="relative">
            <input
              className="border rounded px-3 py-2 w-full pr-20"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-2 hover:bg-gray-100"
            >
              {showPassword ? (
                // Eye off icon
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.02-2.93 2.98-5.26 5.37-6.69" />
                  <path d="M1 1l22 22" />
                  <path d="M10.58 10.58a2 2 0 1 0 2.83 2.83" />
                  <path d="M9.88 4.12A10.94 10.94 0 0 1 12 4c5 0 9.27 3.11 11 8-.46 1.33-1.12 2.54-1.94 3.59" />
                </svg>
              ) : (
                // Eye icon
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button disabled={loading} className="w-full rounded-md bg-red-500 hover:bg-red-600 text-white px-4 py-2">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <a href="/signup" className="block text-center w-full rounded-md border hover:bg-gray-50 px-4 py-2 text-sm">
          Create an account
        </a>
      </form>
    </main>
  );
}


