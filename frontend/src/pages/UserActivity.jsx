import { useEffect, useState } from "react";
import { getUserAuditLogs } from "../services/authService";
import { toast } from "sonner";
import Loading from "../components/Loading";
import { useAuth } from "../context/AppContext";

const UserActivity = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await getUserAuditLogs();
        setLogs(response.data.auditLogs);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">User Activity</h1>
        <p className="mt-1 text-sm text-gray-500">
          View your recent account activity
        </p>
      </div>

      {/* Activity Card */}
      <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
        {/* User info */}
        <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-600">
            {user?.fullName?.charAt(0)?.toUpperCase()}
          </div>

          <div>
            <p className="font-semibold text-gray-800">{user?.fullName}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="space-y-3 md:hidden">
          {logs?.map((log) => (
            <div
              key={log._id}
              className="rounded-lg border border-gray-100 bg-slate-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                  {log.action}
                </span>

                <span className="text-xs text-gray-500">
                  {new Date(log.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-sm text-gray-700">
                <span className="font-semibold">Resource:</span> {log.resource}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {new Date(log.createdAt).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Action
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Resource
                </th>
              </tr>
            </thead>

            <tbody>
              {logs?.map((log) => (
                <tr
                  key={log._id}
                  className="border-t border-gray-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-4 text-sm font-medium text-gray-700">
                    {log.action}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600">
                    {log.resource}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {logs?.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">
            No activity found.
          </p>
        )}
      </div>
    </main>
  );
};

export default UserActivity;
