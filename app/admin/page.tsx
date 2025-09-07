"use client";

import { useEffect, useState } from "react";

export default function AdminOverviewPage() {
  const [userCount, setUserCount] = useState<string>("—");
  const [clientCount, setClientCount] = useState<string>("—");

  useEffect(() => {
    fetch('/api/users/count').then(async (r) => {
      if (r.ok) {
        const { total } = await r.json();
        setUserCount(String(total));
      }
    }).catch(() => {});
    fetch('/api/clients/count').then(async (r) => {
      if (r.ok) {
        const { total } = await r.json();
        setClientCount(String(total));
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-6 overflow-y-scroll px-8 py-8">
        <h1 className="text-2xl font-semibold mb-4">Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Users" value={userCount} />
        <KpiCard label="Clients" value={clientCount} />
        <KpiCard label="Projects" value="—" />
        <KpiCard label="Open Tickets" value="—" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 border rounded-md p-4 bg-white dark:bg-neutral-900">
          <div className="text-sm font-medium mb-2">Recent activity</div>
          <div className="text-gray-600 text-sm">No data yet.</div>
        </div>
        <div className="border rounded-md p-4 bg-white dark:bg-neutral-900">
          <div className="text-sm font-medium mb-2">System status</div>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <li>API: OK</li>
            <li>DB: OK</li>
            <li>Jobs: OK</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border rounded-md p-4 bg-white dark:bg-neutral-900">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}


