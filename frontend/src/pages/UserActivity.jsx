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
    <main className="bg-slate-100 p-6">
      <h1 className="mb-6 text-2xl font-semibold text-gray-800">Audit Logs</h1>
      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                User
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                Action
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                Date
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
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
                <td className="px-6 py-4 text-sm text-gray-700">
                  <div className="font-semibold">{user.fullName}</div>
                  <div className="underline">{user.email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {log.action}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {log.resource}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default UserActivity;
