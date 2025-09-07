"use client";

import { useEffect, useState } from "react";
import EditClientModal from "./EditClientModal";

type Client = { id: string; name: string; email: string | null; industry: string | null; isActive: boolean; createdAt: string };

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<Client | null>(null);

  async function loadClients() {
    setListLoading(true);
    try {
      const res = await fetch('/api/clients');
      if (res.ok) setClients(await res.json());
    } finally {
      setListLoading(false);
    }
  }

  useEffect(() => { loadClients(); }, []);

  return (
    <div className="overflow-y-scroll px-8 py-8">
      <h1 className="text-2xl font-semibold mb-4">Clients</h1>
      <div className="space-y-6 rounded-md overflow-hidden  dark:bg-neutral-900">
        <div className="p-3 rounded bg-white flex items-center justify-between">
          <input className="text-sm border rounded px-2 py-1 w-64 bg-transparent" placeholder="Search clients..." />
          <button className="text-sm rounded-md bg-red-500 text-white px-3 py-1">Add client</button>
        </div>
        <table className="w-full text-sm bg-white rounded">
          <thead className="bg-gray-800 text-gray-50 rounded text-left">
            <tr>
              <th className="px-3 py-2">Company</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Industry</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 w-0"></th>
            </tr>
          </thead>
          <tbody>
            {listLoading ? (
              <tr><td className="px-3 py-4" colSpan={5}>Loading clients…</td></tr>
            ) : clients.length === 0 ? (
              <tr><td className="px-3 py-4" colSpan={5}>No clients yet.</td></tr>
            ) : (
              clients.map(c => (
                <tr key={c.id}>
                  <td className="px-3 py-2">{c.name}</td>
                  <td className="px-3 py-2">{c.email || '—'}</td>
                  <td className="px-3 py-2">{c.industry || '—'}</td>
                  <td className="px-3 py-2">{c.isActive ? 'Active' : 'Inactive'}</td>
                  <td className="px-3 py-2 text-right flex space-x-2">
                    <button onClick={() => { setSelected(c); setEditOpen(true); }} className="px-2 py-1 text-xs rounded border">Edit</button>
                    <button onClick={async () => { if (!confirm('Delete this client?')) return; const res = await fetch(`/api/clients/${c.id}`, { method: 'DELETE' }); if (res.ok) loadClients(); }} className="px-2 py-1 text-xs rounded border border-red-500 text-red-600">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <EditClientModal open={editOpen} onClose={() => setEditOpen(false)} onUpdated={loadClients} client={selected} />
    </div>
  );
}


