'use client';

import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import { HiPencilSquare, HiTrash } from 'react-icons/hi2';

export type TeamMemberRow = {
  id: string;
  name: string;
  memberRole: string;
  memberType: 'BOARD' | 'TEAM';
  imageUrl: string;
  order: number;
  createdAt: string;
};

const headerPattern =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

function sortMembers(a: TeamMemberRow, b: TeamMemberRow) {
  const g = (t: TeamMemberRow['memberType']) => (t === 'BOARD' ? 0 : 1);
  if (g(a.memberType) !== g(b.memberType)) return g(a.memberType) - g(b.memberType);
  if (a.order !== b.order) return a.order - b.order;
  return a.createdAt.localeCompare(b.createdAt);
}

type Props = { initialMembers: TeamMemberRow[] };

export default function TeamAdminClient({ initialMembers }: Props) {
  const [members, setMembers] = useState<TeamMemberRow[]>(() => [...initialMembers].sort(sortMembers));
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMemberRow | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Add modal photo state
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Edit modal photo state
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const editFileRef = useRef<HTMLInputElement>(null);

  const clearPhoto = useCallback(() => {
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  }, []);

  const clearEditPhoto = useCallback(() => {
    setEditPreview(null);
    if (editFileRef.current) editFileRef.current.value = '';
  }, []);

  const closeAdd = useCallback(() => {
    setAddOpen(false);
    setError(null);
    clearPhoto();
  }, [clearPhoto]);

  const closeEdit = useCallback(() => {
    setEditing(null);
    setError(null);
    clearEditPhoto();
  }, [clearEditPhoto]);

  function flash(msg: string) {
    setNotice(msg);
    setTimeout(() => setNotice(null), 2500);
  }

  function handlePhotoFile(e: React.ChangeEvent<HTMLInputElement>, mode: 'add' | 'edit') {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (mode === 'add') setPreview(reader.result as string);
      else setEditPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function onAddSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    setSubmitting(true);
    try {
      const res = await fetch('/api/team', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.message === 'string' ? data.message : 'Could not add member');
        return;
      }
      const row: TeamMemberRow = {
        id: data.id,
        name: data.name,
        memberRole: data.memberRole ?? '',
        memberType: data.memberType === 'BOARD' ? 'BOARD' : 'TEAM',
        imageUrl: data.imageUrl,
        order: data.order,
        createdAt: data.createdAt,
      };
      setMembers((prev) => [...prev, row].sort(sortMembers));
      flash('Member added');
      closeAdd();
      formEl.reset();
    } catch {
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  }

  async function onEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    setError(null);
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/team/${editing.id}`, { method: 'PATCH', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.message === 'string' ? data.message : 'Could not update member');
        return;
      }
      const row: TeamMemberRow = {
        id: data.id,
        name: data.name,
        memberRole: data.memberRole ?? '',
        memberType: data.memberType === 'BOARD' ? 'BOARD' : 'TEAM',
        imageUrl: data.imageUrl,
        order: data.order,
        createdAt: data.createdAt,
      };
      setMembers((prev) => prev.map((m) => (m.id === row.id ? row : m)).sort(sortMembers));
      flash('Member updated');
      closeEdit();
    } catch {
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(m: TeamMemberRow) {
    if (!confirm(`Delete "${m.name}"? This cannot be undone.`)) return;
    setError(null);
    try {
      const res = await fetch(`/api/team/${m.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(typeof data.message === 'string' ? data.message : 'Delete failed');
        return;
      }
      setMembers((prev) => prev.filter((x) => x.id !== m.id));
      flash('Member removed');
    } catch {
      setError('Network error');
    }
  }

  return (
    <div className="min-h-0 overflow-y-auto px-6 sm:px-8 py-8 pb-16">
      {/* Page header */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-neutral-900 via-neutral-800 to-red-950 text-white shadow-lg mb-8">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: headerPattern }}
        />
        <div className="relative px-6 py-8 sm:px-10 sm:py-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-red-300/90 mb-2">Homepage</p>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Our Team</h1>
            <p className="mt-2 text-sm text-neutral-300 max-w-xl leading-relaxed">
              Manage people shown in <span className="text-white/90 font-medium">Board Members</span> and{' '}
              <span className="text-white/90 font-medium">Our Team</span> on the public site.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {notice ? (
              <span className="rounded-full bg-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-100 border border-emerald-400/30">
                {notice}
              </span>
            ) : null}
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-sm backdrop-blur-sm border border-white/10">
              {members.length} members
            </span>
            <button
              type="button"
              onClick={() => { setError(null); setAddOpen(true); }}
              className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-md shadow-red-900/40 hover:bg-red-600 transition-colors"
            >
              Add Member
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {error && !addOpen && !editing ? (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm px-4 py-3">{error}</div>
      ) : null}

      {/* Table */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
          <h2 className="text-sm font-semibold text-gray-800">Homepage roster</h2>
          <p className="text-xs text-gray-500">
            Board and Team listings use the database when at least one member exists for that section
          </p>
        </div>
        {members.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-12 text-center text-sm text-gray-600">
            No members in the database yet. The homepage still shows default board and team photos until you add someone here.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-600">
                <tr>
                  <th className="px-3 py-3 w-16" scope="col">Photo</th>
                  <th className="px-3 py-3 min-w-[140px]" scope="col">Name</th>
                  <th className="px-3 py-3 hidden sm:table-cell" scope="col">Role</th>
                  <th className="px-3 py-3 whitespace-nowrap" scope="col">Type</th>
                  <th className="px-3 py-3 whitespace-nowrap" scope="col">Order</th>
                  <th className="px-3 py-3 text-right w-0" scope="col">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-3 py-2 align-middle">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-neutral-100">
                        <Image
                          src={m.imageUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                    </td>
                    <td className="px-3 py-2 align-middle font-medium text-gray-900">{m.name}</td>
                    <td className="px-3 py-2 align-middle text-gray-600 hidden sm:table-cell">
                      {m.memberRole || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-3 py-2 align-middle">
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                          m.memberType === 'BOARD'
                            ? 'bg-neutral-800 text-white'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {m.memberType === 'BOARD' ? 'Board' : 'Team'}
                      </span>
                    </td>
                    <td className="px-3 py-2 align-middle">
                      <span className="font-mono text-xs text-gray-700">{m.order}</span>
                    </td>
                    <td className="px-3 py-2 align-middle text-right">
                      <div className="inline-flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => { setEditing(m); setEditPreview(null); if (editFileRef.current) editFileRef.current.value = ''; }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Edit"
                          aria-label={`Edit ${m.name}`}
                        >
                          <HiPencilSquare className="h-4 w-4" aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(m)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                          title="Delete"
                          aria-label={`Delete ${m.name}`}
                        >
                          <HiTrash className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Add modal */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeAdd} aria-hidden />
          <div className="relative bg-white rounded-xl p-6 w-full max-w-lg shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add Member</h2>
              <button type="button" onClick={closeAdd} className="text-sm rounded-md border px-2 py-1">
                Close
              </button>
            </div>
            <form onSubmit={onAddSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm px-3 py-2">{error}</div>
              )}
              <div className="flex flex-col items-center gap-2">
                <div
                  className="relative w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden hover:border-red-400 transition-colors bg-gray-50"
                  onClick={() => fileRef.current?.click()}
                  title="Click to upload photo"
                >
                  {preview ? (
                    <Image src={preview} alt="Photo preview" fill className="object-cover" />
                  ) : (
                    <svg className="w-8 h-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  )}
                </div>
                <input
                  ref={fileRef}
                  id="team-member-photo"
                  name="photo"
                  type="file"
                  accept="image/*"
                  required
                  className="hidden"
                  onChange={(e) => handlePhotoFile(e, 'add')}
                />
                <div className="flex gap-2">
                  <button type="button" onClick={() => fileRef.current?.click()} className="text-xs text-gray-500 hover:text-red-500 transition-colors">
                    Upload photo
                  </button>
                  {preview && (
                    <button type="button" onClick={clearPhoto} className="text-xs text-red-400 hover:text-red-600 transition-colors">
                      Remove
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="add-member-name" className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                <input
                  id="add-member-name"
                  name="name"
                  type="text"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label htmlFor="add-member-role" className="block text-xs font-medium text-gray-600 mb-1">Member role</label>
                <input
                  id="add-member-role"
                  name="memberRole"
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="e.g. Lead Developer, Board Chair"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="add-member-type" className="block text-xs font-medium text-gray-600 mb-1">Member type</label>
                  <select
                    id="add-member-type"
                    name="memberType"
                    defaultValue="TEAM"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white"
                  >
                    <option value="TEAM">Team</option>
                    <option value="BOARD">Board</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="add-member-order" className="block text-xs font-medium text-gray-600 mb-1">Display order</label>
                  <input
                    id="add-member-order"
                    name="order"
                    type="number"
                    min={0}
                    step={1}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Leave empty to append"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">Lower numbers appear first. Leave empty to add at the end.</p>
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-red-500 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-60 transition-colors"
              >
                {submitting ? 'Saving…' : 'Add Member'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeEdit} aria-hidden />
          <div className="relative bg-white rounded-xl p-6 w-full max-w-lg shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Edit Member</h2>
              <button type="button" onClick={closeEdit} className="text-sm rounded-md border px-2 py-1">
                Close
              </button>
            </div>
            <form key={editing.id} onSubmit={onEditSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm px-3 py-2">{error}</div>
              )}
              <div className="flex flex-col items-center gap-2">
                <div
                  className="relative w-20 h-20 rounded-full border border-gray-200 overflow-hidden bg-neutral-100 cursor-pointer hover:ring-2 hover:ring-red-400 transition"
                  onClick={() => editFileRef.current?.click()}
                  title="Click to replace photo"
                >
                  <Image
                    src={editPreview || editing.imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized={!!editPreview}
                  />
                </div>
                <input
                  ref={editFileRef}
                  name="photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handlePhotoFile(e, 'edit')}
                />
                <div className="flex gap-2">
                  <button type="button" onClick={() => editFileRef.current?.click()} className="text-xs text-gray-500 hover:text-red-500 transition-colors">
                    Replace photo
                  </button>
                  {editPreview && (
                    <button type="button" onClick={clearEditPhoto} className="text-xs text-red-400 hover:text-red-600 transition-colors">
                      Keep original
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="edit-member-name" className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                <input
                  id="edit-member-name"
                  name="name"
                  type="text"
                  required
                  defaultValue={editing.name}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="edit-member-role" className="block text-xs font-medium text-gray-600 mb-1">Member role</label>
                <input
                  id="edit-member-role"
                  name="memberRole"
                  type="text"
                  defaultValue={editing.memberRole}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="e.g. Lead Developer, Board Chair"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-member-type" className="block text-xs font-medium text-gray-600 mb-1">Member type</label>
                  <select
                    id="edit-member-type"
                    name="memberType"
                    defaultValue={editing.memberType}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white"
                  >
                    <option value="TEAM">Team</option>
                    <option value="BOARD">Board</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="edit-member-order" className="block text-xs font-medium text-gray-600 mb-1">Display order</label>
                  <input
                    id="edit-member-order"
                    name="order"
                    type="number"
                    min={0}
                    step={1}
                    defaultValue={editing.order}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-red-500 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-60 transition-colors"
              >
                {submitting ? 'Saving…' : 'Update Member'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
