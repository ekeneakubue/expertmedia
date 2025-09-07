export default function AdminTicketsPage() {
  return (
    <div className="overflow-y-scroll px-8 py-8">
      <h1 className="text-2xl font-semibold mb-4">Tickets</h1>
      <div className="border rounded-md overflow-hidden bg-white dark:bg-neutral-900">
        <div className="p-3 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <select className="text-sm border rounded px-2 py-1 bg-transparent">
              <option>All</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
            <select className="text-sm border rounded px-2 py-1 bg-transparent">
              <option>Priority</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
          <button className="text-sm rounded-md bg-red-500 text-white px-3 py-1">New ticket</button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-neutral-800 text-left">
            <tr>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Client</th>
              <th className="px-3 py-2">Assignee</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Priority</th>
              <th className="px-3 py-2 w-0"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-3 py-2">—</td>
              <td className="px-3 py-2">—</td>
              <td className="px-3 py-2">—</td>
              <td className="px-3 py-2">Open</td>
              <td className="px-3 py-2">Medium</td>
              <td className="px-3 py-2 text-right">
                <button className="px-2 py-1 text-xs rounded border">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}


