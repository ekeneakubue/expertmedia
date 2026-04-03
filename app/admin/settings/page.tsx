"use client";

import { useEffect, useRef, useState } from "react";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  imageUrl?: string | null;
};

type ClientProfile = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
};

export default function AdminSettingsPage() {
  const [kind, setKind] = useState<"user" | "client" | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [emailDisplay, setEmailDisplay] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/me");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.message === "string" ? data.message : "Could not load profile");
        setKind(null);
        return;
      }
      if (data.kind === "user" && data.profile) {
        const p = data.profile as UserProfile;
        setKind("user");
        setName(p.name || "");
        setEmailDisplay(p.email || "");
        setPreview(p.imageUrl || null);
      } else if (data.kind === "client" && data.profile) {
        const p = data.profile as ClientProfile;
        setKind("client");
        setName(p.name || "");
        setEmailDisplay(p.email || "");
        setPhone(p.phone || "");
        setPreview(null);
      } else {
        setKind(null);
        setError("Unknown profile type");
      }
    } catch {
      setError("Network error");
      setKind(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(null), 4000);
    return () => clearTimeout(t);
  }, [success]);

  async function onSubmitUser(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password || passwordConfirm) {
      if (password !== passwordConfirm) {
        setError("Passwords do not match");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
    }
    setSaving(true);
    try {
      const form = new FormData();
      form.append("name", name);
      if (password) form.append("password", password);
      if (fileRef.current?.files?.[0]) form.append("avatar", fileRef.current.files[0]);

      const res = await fetch("/api/me", { method: "PATCH", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.message === "string" ? data.message : "Save failed");
        return;
      }
      setPassword("");
      setPasswordConfirm("");
      if (fileRef.current) fileRef.current.value = "";
      if (data.imageUrl) setPreview(data.imageUrl);
      setSuccess("Profile updated");
      await load();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function onSubmitClient(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.message === "string" ? data.message : "Save failed");
        return;
      }
      setSuccess("Profile updated");
      await load();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  }

  if (loading) {
    return (
      <div className="px-8 py-8">
        <p className="text-sm text-gray-600">Loading your settings…</p>
      </div>
    );
  }

  if (!kind) {
    return (
      <div className="px-8 py-8 space-y-2">
        <h1 className="text-2xl font-semibold">Settings</h1>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-y-scroll px-8 py-8 max-w-xl">
      <div>
        <h1 className="text-2xl font-semibold">Account settings</h1>
        <p className="text-sm text-gray-600 mt-1">Update your personal details. Email cannot be changed here.</p>
      </div>

      {success && (
        <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">{success}</div>
      )}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {kind === "user" && (
        <form onSubmit={onSubmitUser} className="border rounded-md bg-white dark:bg-neutral-900 p-5 space-y-5">
          <div className="flex flex-col items-center gap-2">
            <div
              className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden bg-gray-50 hover:border-red-400"
              onClick={() => fileRef.current?.click()}
            >
              {preview ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={preview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-gray-400 text-center px-2">Add photo</span>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
            <button type="button" onClick={() => fileRef.current?.click()} className="text-xs text-red-600 hover:underline">
              Change profile photo
            </button>
          </div>

          <div className="grid gap-1">
            <label className="text-xs text-gray-600">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="grid gap-1">
            <label className="text-xs text-gray-600">Email</label>
            <input value={emailDisplay} readOnly className="border rounded px-3 py-2 text-sm bg-gray-100 text-gray-600 cursor-not-allowed" />
          </div>

          <div className="grid gap-1">
            <label className="text-xs text-gray-600">New password (optional)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="border rounded px-3 py-2 text-sm"
              placeholder="Leave blank to keep current password"
              minLength={6}
            />
          </div>

          <div className="grid gap-1">
            <label className="text-xs text-gray-600">Confirm new password</label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              autoComplete="new-password"
              className="border rounded px-3 py-2 text-sm"
              placeholder="Repeat if changing password"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-red-500 text-white px-4 py-2 text-sm hover:bg-red-600 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      )}

      {kind === "client" && (
        <form onSubmit={onSubmitClient} className="border rounded-md bg-white dark:bg-neutral-900 p-5 space-y-5">
          <p className="text-xs text-gray-500">
            You are signed in as a client contact. Password is managed by your administrator.
          </p>

          <div className="grid gap-1">
            <label className="text-xs text-gray-600">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="grid gap-1">
            <label className="text-xs text-gray-600">Email</label>
            <input value={emailDisplay} readOnly className="border rounded px-3 py-2 text-sm bg-gray-100 text-gray-600 cursor-not-allowed" />
          </div>

          <div className="grid gap-1">
            <label className="text-xs text-gray-600">Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="border rounded px-3 py-2 text-sm" />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-red-500 text-white px-4 py-2 text-sm hover:bg-red-600 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      )}
    </div>
  );
}
