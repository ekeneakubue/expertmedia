export default function AdminLogsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Audit Logs</h1>
      <div className="border rounded-md overflow-hidden bg-white dark:bg-neutral-900">
        <div className="p-3 border-b flex items-center justify-between">
          <input className="text-sm border rounded px-2 py-1 w-64 bg-transparent" placeholder="Search logs..." />
          <select className="text-sm border rounded px-2 py-1 bg-transparent">
            <option>All actions</option>
            <option>CREATE</option>
            <option>UPDATE</option>
            <option>DELETE</option>
          </select>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-neutral-800 text-left">
            <tr>
              <th className="px-3 py-2">When</th>
              <th className="px-3 py-2">Actor</th>
              <th className="px-3 py-2">Action</th>
              <th className="px-3 py-2">Target</th>
              <th className="px-3 py-2">IP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-3 py-2">—</td>
              <td className="px-3 py-2">—</td>
              <td className="px-3 py-2">—</td>
              <td className="px-3 py-2">—</td>
              <td className="px-3 py-2">—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}


