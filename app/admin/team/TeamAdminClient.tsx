'use client';

import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';

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
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const clearPhoto = useCallback(() => {
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setError(null);
    clearPhoto();
  }, [clearPhoto]);

  function handlePhotoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
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
      closeModal();
      formEl.reset();
    } catch {
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-0 overflow-y-auto px-6 sm:px-8 py-8 pb-16">
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
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-sm backdrop-blur-sm border border-white/10">
              {members.length} members
            </span>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
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

      <section>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
          <h2 className="text-sm font-semibold text-gray-800">Homepage roster</h2>
          <p className="text-xs text-gray-500">Board and Team listings use the database when at least one member exists for that section</p>
        </div>
        {members.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-12 text-center text-sm text-gray-600">
            No members in the database yet. The homepage still shows default board and team photos until you add someone
            here.
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {members.map((member) => (
              <li
                key={member.id}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-square relative bg-neutral-100">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1280px) 50vw, 25vw"
                  />
                  <div className="absolute left-2 top-2">
                    <span className="rounded-md bg-black/65 text-white text-[10px] font-semibold uppercase tracking-wide px-2 py-1 backdrop-blur-sm">
                      {member.memberType === 'BOARD' ? 'Board' : 'Team'}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent pt-14 pb-3 px-3">
                    <p className="text-sm font-semibold text-white">{member.name}</p>
                    {member.memberRole ? (
                      <p className="text-xs text-white/85 mt-0.5 line-clamp-2">{member.memberRole}</p>
                    ) : null}
                  </div>
                </div>
                <div className="px-3 py-3 border-t border-gray-100 space-y-1">
                  <p className="text-[11px] text-gray-500">
                    Order: <span className="font-mono text-gray-700">{member.order}</span>
                  </p>
                  <p className="text-[11px] font-mono text-gray-500 truncate" title={member.imageUrl}>
                    {member.imageUrl}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} aria-hidden />
          <div className="relative bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-lg shadow-xl border border-gray-200 dark:border-neutral-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add Member</h2>
              <button type="button" onClick={closeModal} className="text-sm rounded-md border px-2 py-1">
                Close
              </button>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
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
                  onChange={handlePhotoFile}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                  >
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
                <label htmlFor="team-member-name" className="block text-xs font-medium text-gray-600 mb-1">
                  Name
                </label>
                <input
                  id="team-member-name"
                  name="name"
                  type="text"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Full name"
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="team-member-role" className="block text-xs font-medium text-gray-600 mb-1">
                  Member role
                </label>
                <input
                  id="team-member-role"
                  name="memberRole"
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="e.g. Lead Developer, Board Chair"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="team-member-type" className="block text-xs font-medium text-gray-600 mb-1">
                    Member type
                  </label>
                  <select
                    id="team-member-type"
                    name="memberType"
                    defaultValue="TEAM"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white dark:bg-neutral-900"
                  >
                    <option value="TEAM">Team</option>
                    <option value="BOARD">Board</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="team-member-order" className="block text-xs font-medium text-gray-600 mb-1">
                    Display order
                  </label>
                  <input
                    id="team-member-order"
                    name="order"
                    type="number"
                    min={0}
                    step={1}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Leave empty to append"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Lower numbers appear first within the same member type. Leave empty to add at the end of that list.
                  </p>
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
    </div>
  );
}
