export default function UsersPage() {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Users Management</h1>
        <p className="text-gray-600">List, edit, or delete platform users here.</p>
        <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Email</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Role</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {['Admin', 'Editor', 'User'].map((role, i) => (
                <tr key={i}>
                  <td className="px-4 py-3 font-medium text-gray-900">Derrick {i + 1}</td>
                  <td className="px-4 py-3 text-gray-700">Derrick{i + 1}@example.com</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded bg-orange-100 text-orange-800">
                      {role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }