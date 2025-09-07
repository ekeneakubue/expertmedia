export default function AdminProjectsPage() {
  return (
    <div className="overflow-y-scroll px-8 py-8">
      <h1 className="text-2xl font-semibold mb-4">Projects</h1>
      <div className="border rounded-md overflow-hidden bg-white dark:bg-neutral-900">
        <div className="p-3 border-b flex items-center justify-between">
          <input className="text-sm border rounded px-2 py-1 w-64 bg-transparent" placeholder="Search projects..." />
          <button className="text-sm rounded-md bg-red-500 text-white px-3 py-1">New project</button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-neutral-800 text-left">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Client</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Dates</th>
              <th className="px-3 py-2 w-0"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-3 py-2">—</td>
              <td className="px-3 py-2">—</td>
              <td className="px-3 py-2">Planning</td>
              <td className="px-3 py-2">—</td>
              <td className="px-3 py-2 text-right">
                <button className="px-2 py-1 text-xs rounded border">Open</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}


