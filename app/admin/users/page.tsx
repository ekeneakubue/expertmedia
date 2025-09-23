"use client";

import { useEffect, useState } from "react";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";

type User = { id: string; name: string; email: string; role: string; status: string; createdAt: string; imageUrl?: string | null };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);

  async function loadUsers() {
    setListLoading(true);
    try {
      const res = await fetch("/api/users");
      if (res.ok) setUsers(await res.json());
    } finally {
      setListLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  // addUser handled by AddUserModal; ensure no unused state vars

  return (
    <div className="space-y-6 overflow-y-scroll px-8 py-8">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      <div className="space-y-6 rounded-md overflow-hidden dark:bg-neutral-900">
        <div className="p-3 flex items-center bg-white justify-between gap-4">
          <input className="text-sm border rounded px-2 py-1 w-64 bg-transparent" placeholder="Search users..." />
          <div className="flex-1" />
          <button onClick={() => setOpen(true)} className="text-sm rounded-md bg-red-500 text-white px-3 py-2">Add user</button>
        </div>
        <table className="w-full text-sm bg-white ">
          <thead className="bg-gray-800 text-gray-50 rounded text-left">
            <tr>
              <th className="px-3 py-2">User</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 w-0"></th>
            </tr>
          </thead>
          <tbody>
            {listLoading ? (
              <tr><td className="px-3 py-4" colSpan={5}>Loading users…</td></tr>
            ) : users.length === 0 ? (
              <tr><td className="px-3 py-4" colSpan={5}>No users yet.</td></tr>
            ) : (
              users.map(u => (
                <tr key={u.id}>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      {u.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={u.imageUrl} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200" />
                      )}
                      <span>{u.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">{u.email}</td>
                  <td className="px-3 py-2">{u.role}</td>
                  <td className="px-3 py-2">{u.status}</td>
                  <td className="px-3 py-2 text-right flex space-x-2">
                    <button onClick={() => { setSelected(u); setEditOpen(true); }} className="px-2 py-1 text-xs rounded border">Edit</button>
                    <button onClick={async () => {
                      if (!confirm('Delete this user?')) return;
                      const res = await fetch(`/api/users/${u.id}`, { method: 'DELETE' });
                      if (res.ok) loadUsers();
                    }} className="px-2 py-1 text-xs rounded border border-red-500 text-red-600">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <AddUserModal open={open} onClose={() => setOpen(false)} onCreated={loadUsers} />
      <EditUserModal open={editOpen} onClose={() => setEditOpen(false)} onUpdated={loadUsers} user={selected} />
    </div>
  );
}


