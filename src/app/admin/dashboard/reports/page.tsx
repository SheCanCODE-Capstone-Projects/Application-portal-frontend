// src/app/admin/dashboard/reports/page.tsx
export default function ReportsPage() {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Reports</h1>
        <p className="text-gray-600">View analytics, logs, and activity reports.</p>
        <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
          <div className="h-64 flex items-center justify-center bg-gray-100 border-2 border-dashed rounded-lg">
            <span className="text-gray-500">📊 Chart placeholder (e.g., Recharts)</span>
          </div>
        </div>
      </div>
    );
  }